import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type PackagePriority = "High" | "Medium" | "Low";
type PackageReadiness = "Ready" | "Watch" | "Needs setup";

function requireTenantProfile(ctx: {
  currentUser: {
    role: "ADMIN" | "TENANT" | "CUSTOMER";
    tenantProfile: { id: string } | null;
  } | null;
}) {
  if (!ctx.currentUser || ctx.currentUser.role !== "TENANT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only tenant users can access packages.",
    });
  }

  if (!ctx.currentUser.tenantProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tenant profile not found.",
    });
  }

  return ctx.currentUser.tenantProfile;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const packagesRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const tenantProfile = requireTenantProfile(ctx);

    const [profile, rooms, services, automations, notifications] =
      await Promise.all([
        ctx.db.tenantProfile.findUnique({
          where: { id: tenantProfile.id },
        }),
        ctx.db.tenantRoom.findMany({
          where: {
            tenantProfileId: tenantProfile.id,
            isActive: true,
          },
          orderBy: [{ updatedAt: "desc" }, { roomName: "asc" }],
        }),
        ctx.db.tenantService.findMany({
          where: {
            tenantProfileId: tenantProfile.id,
            isActive: true,
          },
          orderBy: [{ basePrice: "desc" }, { updatedAt: "desc" }],
        }),
        ctx.db.tenantAutomationWorkflow.findMany({
          where: { tenantProfileId: tenantProfile.id },
          orderBy: { updatedAt: "desc" },
        }),
        ctx.db.tenantNotificationPreference.findMany({
          where: { tenantProfileId: tenantProfile.id, enabled: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant profile not found.",
      });
    }

    const roomCount = rooms.length;
    const serviceCount = services.length;
    const activeAutomations = automations.filter(
      (workflow) => workflow.status === "ACTIVE",
    ).length;
    const notificationCoverage = notifications.length;
    const highestRoomRate = rooms.reduce(
      (max, room) => Math.max(max, room.baseNightlyRate),
      0,
    );
    const totalServiceValue = services.reduce(
      (sum, service) => sum + service.basePrice,
      0,
    );

    const categoryGroups = new Map<
      string,
      {
        services: typeof services;
      }
    >();

    for (const service of services) {
      const current = categoryGroups.get(service.category) ?? { services: [] };
      current.services.push(service);
      categoryGroups.set(service.category, current);
    }

    const packageRows = Array.from(categoryGroups.entries()).map(
      ([category, group], index) => {
        const serviceValue = group.services.reduce(
          (sum, service) => sum + service.basePrice,
          0,
        );
        const averageServiceValue = Math.round(serviceValue / group.services.length);
        const packageValue = averageServiceValue + Math.round(highestRoomRate * 0.18);
        const bundleStrength = clamp(
          group.services.length * 3 + activeAutomations * 2 + notificationCoverage,
          2,
          28,
        );
        const readiness: PackageReadiness =
          group.services.length >= 2 && roomCount >= 1
            ? "Ready"
            : group.services.length === 1
              ? "Watch"
              : "Needs setup";
        const priority: PackagePriority =
          group.services.length >= 2 && packageValue >= 2500
            ? "High"
            : group.services.length >= 1
              ? "Medium"
              : "Low";

        const candidateLabel =
          category.toLowerCase().includes("transport")
            ? "Arrival convenience package"
            : category.toLowerCase().includes("food") ||
                category.toLowerCase().includes("dining")
              ? "Dining upgrade bundle"
              : category.toLowerCase().includes("spa")
                ? "Wellness stay package"
                : `${category} experience package`;

        const triggerWindow =
          activeAutomations >= 1
            ? "Post-booking and pre-arrival"
            : "Manual follow-up needed";

        return {
          id: `${category.toLowerCase().replace(/\s+/g, "-")}-${index}`,
          category,
          candidateLabel,
          serviceCount: group.services.length,
          packageValue,
          bundleStrength,
          readiness,
          priority,
          triggerWindow,
          packageAngle:
            readiness === "Ready"
              ? `Bundle ${category.toLowerCase()} offers with your stronger room value to raise guest spend.`
              : `Grow the ${category.toLowerCase()} offer depth before packaging it more aggressively.`,
          actionLabel: "Open services",
          actionHref: "/tenant/settings/services",
          updatedAt: group.services[0]?.updatedAt ?? profile.updatedAt,
        };
      },
    );

    const topServices = services.slice(0, 5).map((service) => ({
      serviceName:
        service.serviceName.length > 16
          ? `${service.serviceName.slice(0, 16)}…`
          : service.serviceName,
      price: service.basePrice,
    }));

    const categoryMix = Array.from(categoryGroups.entries()).map(
      ([category, group]) => ({
        category,
        services: group.services.length,
        avgValue: Math.round(
          group.services.reduce((sum, service) => sum + service.basePrice, 0) /
            group.services.length,
        ),
      }),
    );

    return {
      summary: {
        serviceCount,
        packageRows: packageRows.length,
        totalServiceValue,
        readyBundles: packageRows.filter((row) => row.readiness === "Ready")
          .length,
        highPriorityBundles: packageRows.filter((row) => row.priority === "High")
          .length,
        highestRoomRate,
      },
      topServices,
      categoryMix,
      rows: packageRows,
    };
  }),
});
