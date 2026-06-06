import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PayrollWorkspaceView } from "./_components/PayrollWorkspaceView";

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
              id: true,
              resortName: true,
              businessName: true,
              fullAddress: true,
              phoneNumber: true,
              assets: {
                where: {
                  name: {
                    contains: "logo",
                    mode: "insensitive",
                  },
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  url: true,
                },
              },
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
  const tenantLogoUrl = currentUser?.tenantProfile?.assets[0]?.url ?? null;
  const tenantAddress = currentUser?.tenantProfile?.fullAddress?.trim() || null;
  const tenantPhone = currentUser?.tenantProfile?.phoneNumber?.trim() || null;

  return (
    <PayrollWorkspaceView
      ownerName={ownerName}
      resortName={resortName}
      tenantLogoUrl={tenantLogoUrl}
      tenantAddress={tenantAddress}
      tenantPhone={tenantPhone}
    />
  );
}
