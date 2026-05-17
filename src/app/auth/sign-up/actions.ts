"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAppRedirectPath } from "@/lib/auth-redirect";
import { db } from "@/lib/db";
import type { SignUpFormState } from "@/app/auth/sign-up/state";

const signUpSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
    email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long.")
      .refine((value) => /[A-Z]/.test(value), "Password must include at least 1 uppercase letter.")
      .refine((value) => /[0-9]/.test(value), "Password must include at least 1 number."),
    role: z.enum(["admin", "tenant", "customer"]).default("customer"),
    plan: z.enum(["free_trial", "starter", "growth", "enterprise"]).optional(),
    billing: z.enum(["monthly", "yearly"]).optional(),
  })
  .transform((value) => ({
    ...value,
    name: `${value.firstName} ${value.lastName}`.trim(),
  }));

export async function registerUserAction(
  _previousState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const payload = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    plan: formData.get("plan"),
    billing: formData.get("billing"),
  });

  if (!payload.success) {
    return {
      error: payload.error.issues[0]?.message ?? "Please review your details and try again.",
    };
  }

  const { firstName, lastName, name, email, password, role, plan, billing } = payload.data;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    await db.appUser.create({
      data: {
        authUserId: result.user.id,
        email,
        firstName,
        lastName,
        displayName: name,
        role: role.toUpperCase() as "TENANT" | "CUSTOMER",
        tenantProfile:
          role === "tenant"
            ? {
                create: {
                  onboardingStatus: "PENDING",
                  subscriptionPlan:
                    plan === "free_trial"
                      ? "FREE_TRIAL"
                      : plan === "growth"
                        ? "GROWTH"
                        : plan === "enterprise"
                          ? "ENTERPRISE"
                          : "STARTER",
                  billingCycle: billing === "yearly" ? "YEARLY" : "MONTHLY",
                },
              }
            : undefined,
        customerProfile:
          role === "customer"
            ? {
                create: {},
              }
            : undefined,
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return { error: error.message };
    }

    return {
      error: "We couldn't create your account right now. Please try again.",
    };
  }

  if (role === "tenant") {
    const query = new URLSearchParams();

    if (plan) {
      query.set("plan", plan);
    }

    if (billing) {
      query.set("billing", billing);
    }

    redirect(`/auth/onboarding${query.toString() ? `?${query.toString()}` : ""}`);
  }

  redirect(
    getAppRedirectPath({
      role: role.toUpperCase() as "TENANT" | "CUSTOMER",
      tenantOnboardingStatus: null,
    }),
  );
}
