"use server";

import { revalidatePath } from "next/cache";

import { createCategory } from "@/lib/dashboard/create-category";
import { createCategorySchema } from "@/lib/validation/category";
import type { CategoryFormState } from "@/types/dashboard";

export const initialCategoryFormState: CategoryFormState = {
  errors: {},
  success: false,
};

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
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

  await createCategory(parsed.data);
  revalidatePath("/");

  return {
    errors: {},
    message: "Categoria validada e pronta para persistencia no backend.",
    success: true,
  };
}
