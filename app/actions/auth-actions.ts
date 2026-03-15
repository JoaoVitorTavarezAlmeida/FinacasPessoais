"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, deleteUserSession } from "@/lib/auth/session";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import type { AuthFormState } from "@/types/dashboard";

const INVALID_AUTH_MESSAGE = "Email ou senha invalidos.";

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
