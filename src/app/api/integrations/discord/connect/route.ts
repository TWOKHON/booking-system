import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const connectQuerySchema = z.object({
  channelLabel: z.string().trim().min(1).max(120),
  eventScope: z.enum([
    "BOOKINGS",
    "OPERATIONS",
    "FINANCE",
    "OWNER_ALERTS",
    "CUSTOM",
  ]),
  note: z.string().trim().max(240).optional(),
});

export async function GET(request: Request) {
  const appUrl =
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const baseRedirectUrl = new URL("/tenant/integrations/discord", appUrl);

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/sign-in", appUrl));
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
    return NextResponse.redirect(new URL("/tenant/dashboard", appUrl));
  }

  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    baseRedirectUrl.searchParams.set("discordConnect", "missing_config");
    return NextResponse.redirect(baseRedirectUrl);
  }

  const validation = connectQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  if (!validation.success) {
    baseRedirectUrl.searchParams.set("discordConnect", "invalid_request");
    return NextResponse.redirect(baseRedirectUrl);
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("discord_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  cookieStore.set(
    "discord_oauth_payload",
    JSON.stringify({
      tenantProfileId: appUser.tenantProfile.id,
      channelLabel: validation.data.channelLabel,
      eventScope: validation.data.eventScope,
      note: validation.data.note?.trim() || null,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    },
  );

  const callbackUrl = new URL("/api/integrations/discord/callback", appUrl);
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "webhook.incoming");
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl);
}
