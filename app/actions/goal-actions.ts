"use server";

import { revalidatePath } from "next/cache";

import { createGoal } from "@/lib/dashboard/create-goal";
import { deleteGoal } from "@/lib/dashboard/delete-goal";
import { updateGoal } from "@/lib/dashboard/update-goal";
import { getCurrentUser } from "@/lib/auth/session";
import { createGoalSchema, updateGoalSchema } from "@/lib/validation/goal";
import type { GoalFormState } from "@/types/dashboard";

export async function createGoalAction(
  _previousState: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = createGoalSchema.safeParse({
    name: formData.get("name"),
    target: formData.get("target"),
    current: formData.get("current"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos da meta.",
      success: false,
    };
  }

  await createGoal(parsed.data, currentUser.id);
  revalidatePath("/dashboard");

  return {
    errors: {},
    message: "Meta criada com sucesso.",
    success: true,
  };
}

export async function updateGoalAction(
  _previousState: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = updateGoalSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    target: formData.get("target"),
    current: formData.get("current"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos da meta.",
      success: false,
    };
  }

  await updateGoal(parsed.data, currentUser.id);
  revalidatePath("/dashboard");

  return {
    errors: {},
    message: "Meta atualizada com sucesso.",
    success: true,
  };
}

export async function deleteGoalAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await deleteGoal(id, currentUser.id);
  revalidatePath("/dashboard");
}
