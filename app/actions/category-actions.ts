"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { deleteCategory } from "@/lib/dashboard/delete-category";
import { createCategory } from "@/lib/dashboard/create-category";
import { updateCategory } from "@/lib/dashboard/update-category";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validation/category";
import type { CategoryFormState } from "@/types/dashboard";

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    limit: formData.get("limit"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos destacados antes de salvar.",
      success: false,
    };
  }

  await createCategory(parsed.data, currentUser.id);
  revalidatePath("/dashboard");

  return {
    errors: {},
    message: "Categoria validada e pronta para persistencia no backend.",
    success: true,
  };
}

export async function updateCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = updateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    limit: formData.get("limit"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos da categoria.",
      success: false,
    };
  }

  await updateCategory(parsed.data, currentUser.id);
  revalidatePath("/dashboard");

  return {
    errors: {},
    message: "Categoria atualizada com sucesso.",
    success: true,
  };
}

export async function deleteCategoryAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await deleteCategory(id, currentUser.id);
  revalidatePath("/dashboard");
}
