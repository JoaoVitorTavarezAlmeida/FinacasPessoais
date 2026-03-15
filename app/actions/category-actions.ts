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

function revalidateCategoryViews() {
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/categories");
  revalidatePath("/transactions");
}

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

  try {
    await createCategory(parsed.data, currentUser.id);
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a categoria.",
      success: false,
    };
  }
  revalidateCategoryViews();

  return {
    errors: {},
    message: "Categoria criada com sucesso.",
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

  try {
    await updateCategory(parsed.data, currentUser.id);
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar a categoria.",
      success: false,
    };
  }
  revalidateCategoryViews();

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

  try {
    await deleteCategory(id, currentUser.id);
  } catch {
    return;
  }
  revalidateCategoryViews();
}
