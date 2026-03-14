"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createCategory } from "@/lib/dashboard/create-category";
import { createCategorySchema } from "@/lib/validation/category";
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
  revalidatePath("/");

  return {
    errors: {},
    message: "Categoria validada e pronta para persistencia no backend.",
    success: true,
  };
}
