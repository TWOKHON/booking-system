"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAppRedirectPath } from "@/lib/auth-redirect";
import { db } from "@/lib/db";
import type { SignInFormState } from "@/app/auth/sign-in/state";

const signInSchema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long."),
  plan: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["starter", "growth", "enterprise"]).optional(),
  ),
  billing: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["monthly", "yearly"]).optional(),
  ),
  checkout: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["polar"]).optional(),
  ),
});

export async function loginUserAction(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const payload = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    plan: formData.get("plan"),
    billing: formData.get("billing"),
    checkout: formData.get("checkout"),
  });

  if (!payload.success) {
    return {
      error: payload.error.issues[0]?.message ?? "Please review your details and try again.",
    };
  }

  const { email, password, plan, billing, checkout } = payload.data;

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    const appUser = await db.appUser.findUnique({
      where: {
        authUserId: result.user.id,
      },
      include: {
        tenantProfile: true,
      },
    });

    if (!appUser) {
      return {
        error: "Your account exists, but the workspace profile is missing. Please contact support.",
      };
    }

    const shouldResumeCheckout =
      appUser.role === "TENANT" &&
      checkout === "polar" &&
      plan &&
      appUser.tenantProfile?.subscriptionStatus !== "ACTIVE";

    if (shouldResumeCheckout) {
      const checkoutQuery = new URLSearchParams({
        plan,
        billing: billing ?? "monthly",
      });

      redirect(`/api/polar/checkout-plan?${checkoutQuery.toString()}`);
    }

    redirect(
      getAppRedirectPath({
        role: appUser.role,
        tenantOnboardingStatus: appUser.tenantProfile?.onboardingStatus ?? null,
      }),
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return { error: error.message };
    }

    return {
      error: "We couldn't sign you in right now. Please try again.",
    };
  }
}
