import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PettyCashWorkspaceView } from "./_components/PettyCashWorkspaceView";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user?.id
    ? await db.appUser.findUnique({
        where: { authUserId: session.user.id },
        include: {
          tenantProfile: {
            select: {
              resortName: true,
              businessName: true,
            },
          },
        },
      })
    : null;

  const ownerName =
    currentUser?.displayName?.trim() ||
    session?.user.name?.trim() ||
    "Resort Owner";
  const resortName =
    currentUser?.tenantProfile?.resortName?.trim() ||
    currentUser?.tenantProfile?.businessName?.trim() ||
    "your resort";

  return <PettyCashWorkspaceView ownerName={ownerName} resortName={resortName} />;
}
