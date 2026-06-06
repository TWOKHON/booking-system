import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GuestRequestsWorkspaceView } from "./_components/GuestRequestsWorkspaceView";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user?.id
    ? await db.appUser.findUnique({
        where: { authUserId: session.user.id },
        include: {
          tenantProfile: true,
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

  return (
    <GuestRequestsWorkspaceView
      ownerName={ownerName}
      resortName={resortName}
    />
  );
};

export default Page;
