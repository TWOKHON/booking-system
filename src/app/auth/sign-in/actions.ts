"use server";

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
});

export async function loginUserAction(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const payload = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!payload.success) {
    return {
      error: payload.error.issues[0]?.message ?? "Please review your details and try again.",
    };
  }

  const { email, password } = payload.data;

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

    redirect(
      getAppRedirectPath({
        role: appUser.role,
        tenantOnboardingStatus: appUser.tenantProfile?.onboardingStatus ?? null,
      }),
    );
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
      error: "We couldn't sign you in right now. Please try again.",
    };
  }
}
