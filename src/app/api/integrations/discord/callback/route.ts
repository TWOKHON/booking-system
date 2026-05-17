import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type DiscordTokenResponse = {
  webhook?: {
    id?: string;
    token?: string;
    url?: string;
  };
};

function getAppUrl() {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

function buildTenantDiscordRedirect(status: string) {
  const url = new URL("/tenant/integrations/discord", getAppUrl());
  url.searchParams.set("discordConnect", status);
  return url;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const oauthError = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("discord_oauth_state")?.value;
  const payloadCookie = cookieStore.get("discord_oauth_payload")?.value;

  const clearCookies = () => {
    cookieStore.delete("discord_oauth_state");
    cookieStore.delete("discord_oauth_payload");
  };

  if (oauthError) {
    clearCookies();
    return NextResponse.redirect(buildTenantDiscordRedirect("access_denied"));
  }

  if (!state || !storedState || state !== storedState || !payloadCookie) {
    clearCookies();
    return NextResponse.redirect(buildTenantDiscordRedirect("invalid_state"));
  }

  if (!code || !process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    clearCookies();
    return NextResponse.redirect(buildTenantDiscordRedirect("missing_config"));
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    clearCookies();
    return NextResponse.redirect(new URL("/auth/sign-in", getAppUrl()));
  }

  const appUser = await db.appUser.findUnique({
    where: {
      authUserId: session.user.id,
    },
    include: {
      tenantProfile: true,
    },
  });

  if (!appUser?.tenantProfile) {
    clearCookies();
    return NextResponse.redirect(new URL("/tenant/dashboard", getAppUrl()));
  }

  const payload = JSON.parse(payloadCookie) as {
    tenantProfileId: string;
    channelLabel: string;
    eventScope: "BOOKINGS" | "OPERATIONS" | "FINANCE" | "OWNER_ALERTS" | "CUSTOM";
    note: string | null;
  };

  if (payload.tenantProfileId !== appUser.tenantProfile.id) {
    clearCookies();
    return NextResponse.redirect(buildTenantDiscordRedirect("invalid_state"));
  }

  const callbackUrl = new URL("/api/integrations/discord/callback", getAppUrl());
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl.toString(),
    }),
  });

  if (!tokenResponse.ok) {
    clearCookies();
    return NextResponse.redirect(
      buildTenantDiscordRedirect("token_exchange_failed"),
    );
  }

  const tokenJson = (await tokenResponse.json()) as DiscordTokenResponse;
  const webhookUrl =
    tokenJson.webhook?.url ||
    (tokenJson.webhook?.id && tokenJson.webhook?.token
      ? `https://discord.com/api/webhooks/${tokenJson.webhook.id}/${tokenJson.webhook.token}`
      : null);

  if (!webhookUrl) {
    clearCookies();
    return NextResponse.redirect(
      buildTenantDiscordRedirect("token_exchange_failed"),
    );
  }

  try {
    await db.tenantDiscordChannel.create({
      data: {
        tenantProfileId: appUser.tenantProfile.id,
        channelLabel: payload.channelLabel,
        eventScope: payload.eventScope,
        webhookUrl,
        note: payload.note,
        isActive: true,
      },
    });
  } catch {
    clearCookies();
    return NextResponse.redirect(buildTenantDiscordRedirect("create_failed"));
  }

  clearCookies();
  return NextResponse.redirect(buildTenantDiscordRedirect("success"));
}
