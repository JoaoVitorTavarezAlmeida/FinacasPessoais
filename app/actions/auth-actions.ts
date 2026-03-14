"use server";

import { revalidatePath } from "next/cache";

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, deleteUserSession } from "@/lib/auth/session";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import type { AuthFormState } from "@/types/dashboard";

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
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
    return {
      errors: { email: ["Ja existe uma conta com esse email."] },
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
    return {
      errors: { email: ["Conta nao encontrada."] },
      success: false,
    };
  }

  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return {
      errors: { password: ["Senha invalida."] },
      success: false,
    };
  }

  await createUserSession(user.id);
  revalidatePath("/");

  return {
    errors: {},
    message: "Login realizado com sucesso.",
    success: true,
  };
}

export async function signOutAction() {
  await deleteUserSession();
  revalidatePath("/");
}
