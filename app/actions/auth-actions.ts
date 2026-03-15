"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset-email";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, deleteUserSession } from "@/lib/auth/session";
import { generateSecureToken, hashSecureToken } from "@/lib/auth/secure-token";
import { getAppBaseUrl, hasEmailDeliveryConfig } from "@/lib/env";
import {
  requestPasswordResetSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";
import type {
  AuthFormState,
  PasswordResetRequestFormState,
  ResetPasswordFormState,
} from "@/types/dashboard";

const INVALID_AUTH_MESSAGE = "Email ou senha invalidos.";
const PASSWORD_RESET_DURATION_IN_MINUTES = 30;

async function delayFailedAuth() {
  await new Promise((resolve) => {
    setTimeout(resolve, 350);
  });
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    confirmPassword: formData.get("confirmPassword"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os dados do cadastro.",
      success: false,
    };
  }

  const db = getDb();
  const existingUser = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    await delayFailedAuth();
    return {
      errors: { email: ["Esse email nao esta disponivel."] },
      success: false,
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  await createUserSession(user.id);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/transactions");
  revalidatePath("/categories");
  revalidatePath("/goals");

  return {
    errors: {},
    message: "Conta criada com sucesso.",
    success: true,
  };
}

export async function signInAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os dados de acesso.",
      success: false,
    };
  }

  const db = getDb();
  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user?.passwordHash) {
    await delayFailedAuth();
    return {
      errors: { email: [INVALID_AUTH_MESSAGE] },
      success: false,
    };
  }

  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    await delayFailedAuth();
    return {
      errors: { password: [INVALID_AUTH_MESSAGE] },
      success: false,
    };
  }

  await createUserSession(user.id);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/transactions");
  revalidatePath("/categories");
  revalidatePath("/goals");

  return {
    errors: {},
    message: "Login realizado com sucesso.",
    success: true,
  };
}

export async function signOutAction() {
  await deleteUserSession();
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/transactions");
  revalidatePath("/categories");
  revalidatePath("/goals");
  revalidatePath("/auth");
  redirect("/auth");
}

export async function requestPasswordResetAction(
  _previousState: PasswordResetRequestFormState,
  formData: FormData,
): Promise<PasswordResetRequestFormState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Informe um email valido para continuar.",
      success: false,
    };
  }

  const db = getDb();
  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!hasEmailDeliveryConfig()) {
    return {
      errors: {},
      message:
        "O envio de email ainda nao esta configurado. Defina RESEND_API_KEY, EMAIL_FROM e APP_BASE_URL.",
      success: false,
    };
  }

  if (user?.passwordHash) {
    const rawToken = generateSecureToken();
    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_DURATION_IN_MINUTES * 60 * 1000,
    );

    await db.passwordResetToken.deleteMany({
      where: {
        OR: [
          { userId: user.id },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });

    await db.passwordResetToken.create({
      data: {
        token: hashSecureToken(rawToken),
        expiresAt,
        userId: user.id,
      },
    });

    const resetUrl = `${getAppBaseUrl()}/auth/reset-password?token=${rawToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (error) {
      console.error("password-reset-email-error", error);
      return {
        errors: {},
        message: "Nao foi possivel enviar o email de redefinicao agora.",
        success: false,
      };
    }

    return {
      errors: {},
      message:
        "Se existir uma conta com esse email, as instrucoes de redefinicao foram enviadas.",
      success: true,
    };
  }

  await delayFailedAuth();
  return {
    errors: {},
    message:
      "Se existir uma conta com esse email, as instrucoes de redefinicao foram preparadas.",
    success: true,
  };
}

export async function resetPasswordAction(
  _previousState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os dados da nova senha.",
      success: false,
    };
  }

  const db = getDb();
  const hashedToken = hashSecureToken(parsed.data.token);
  const resetRecord = await db.passwordResetToken.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  if (
    !resetRecord ||
    resetRecord.usedAt ||
    resetRecord.expiresAt < new Date() ||
    !resetRecord.user.passwordHash
  ) {
    await delayFailedAuth();
    return {
      errors: { token: ["O link de redefinicao e invalido ou expirou."] },
      message: "Solicite um novo link de redefinicao.",
      success: false,
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction([
    db.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
    db.passwordResetToken.deleteMany({
      where: {
        userId: resetRecord.userId,
        id: { not: resetRecord.id },
      },
    }),
    db.session.deleteMany({
      where: { userId: resetRecord.userId },
    }),
  ]);

  revalidatePath("/auth");

  return {
    errors: {},
    message: "Senha redefinida com sucesso. Faça login novamente.",
    success: true,
  };
}
