import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeamWorkspaceClient } from "./_components/TeamWorkspaceClient";

export default async function Page() {
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

  return (
    <TeamWorkspaceClient ownerName={ownerName} resortName={resortName} />
  );
}
