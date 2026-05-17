import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DiscordWorkspaceClient } from "./_components/DiscordWorkspaceClient";

type DiscordConnectState =
  | "idle"
  | "success"
  | "access_denied"
  | "invalid_state"
  | "missing_config"
  | "invalid_request"
  | "create_failed"
  | "token_exchange_failed";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    discordConnect?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const appUser = await db.appUser.findUnique({
    where: { authUserId: session.user.id },
    include: {
      tenantProfile: true,
    },
  });

  if (!appUser?.tenantProfile) {
    redirect("/tenant/dashboard");
  }

  const tenantProfile = appUser.tenantProfile;
  const ownerName =
    appUser.displayName || `${appUser.firstName} ${appUser.lastName}`.trim();
  const resortName =
    tenantProfile.resortName?.trim() ||
    tenantProfile.businessName?.trim() ||
    "your resort";
  const params = await searchParams;
  const connectState = (params.discordConnect ??
    "idle") as DiscordConnectState;
  const canStartDiscordOAuth = Boolean(
    process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET,
  );

  return (
    <DiscordWorkspaceClient
      ownerName={ownerName}
      resortName={resortName}
      connectState={connectState}
      canStartDiscordOAuth={canStartDiscordOAuth}
    />
  );
}
