import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export function slugifyPreviewHost(resortName: string) {
  const slug = resortName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);

  return slug ? `${slug}.resortcloud.app` : "tenant.resortcloud.app";
}

export type TenantBuilderContext = {
  siteId: string;
  ownerName: string;
  resortName: string;
  propertyType: string | null;
  previewUrl: string;
  publishStatus: "Live" | "Draft";
  roomCount: number;
  serviceCount: number;
  heroImageUrl: string | null;
  heroImageLabel: string | null;
  roomNames: string[];
  serviceNames: string[];
};

export async function getTenantBuilderContext(): Promise<TenantBuilderContext> {
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
    appUser.displayName || `${appUser.firstName} ${appUser.lastName}`.trim() || "Workspace owner";
  const resortName =
    tenantProfile.resortName?.trim() ||
    tenantProfile.businessName?.trim() ||
    "your resort";

  const [rooms, services, heroImage] = await Promise.all([
    db.tenantRoom.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ createdAt: "asc" }],
      select: {
        roomName: true,
      },
      take: 6,
    }),
    db.tenantService.findMany({
      where: {
        tenantProfileId: tenantProfile.id,
        isActive: true,
      },
      orderBy: [{ createdAt: "asc" }],
      select: {
        serviceName: true,
      },
      take: 6,
    }),
    db.tenantRoomImage.findFirst({
      where: {
        room: {
          tenantProfileId: tenantProfile.id,
          isActive: true,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        imageUrl: true,
        caption: true,
        room: {
          select: {
            roomName: true,
          },
        },
      },
    }),
  ]);

  return {
    siteId: tenantProfile.id,
    ownerName,
    resortName,
    propertyType: tenantProfile.propertyType,
    previewUrl: slugifyPreviewHost(resortName),
    publishStatus: tenantProfile.website?.trim() ? "Live" : "Draft",
    roomCount: rooms.length,
    serviceCount: services.length,
    heroImageUrl: heroImage?.imageUrl ?? null,
    heroImageLabel: heroImage?.caption || heroImage?.room.roomName || null,
    roomNames: rooms.map((room) => room.roomName),
    serviceNames: services.map((service) => service.serviceName),
  };
}
