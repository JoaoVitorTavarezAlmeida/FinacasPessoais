"use server";

import { revalidatePath } from "next/cache";

import { deleteTransaction } from "@/lib/dashboard/delete-transaction";
import { createTransaction } from "@/lib/dashboard/create-transaction";
import { updateTransaction } from "@/lib/dashboard/update-transaction";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/lib/validation/transaction";
import type { TransactionFormState } from "@/types/dashboard";

function revalidateTransactionViews() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

export async function createTransactionAction(
  _previousState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = createTransactionSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    occurredAt: formData.get("occurredAt"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos da transacao.",
      success: false,
    };
  }

  await createTransaction(parsed.data, currentUser.id);
  revalidateTransactionViews();

  return {
    errors: {},
    message: "Transacao registrada com sucesso.",
    success: true,
  };
}

export async function updateTransactionAction(
  _previousState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      errors: {},
      message: "Sua sessao expirou. Entre novamente.",
      success: false,
    };
  }

  const parsed = updateTransactionSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    occurredAt: formData.get("occurredAt"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos da transacao.",
      success: false,
    };
  }

  await updateTransaction(parsed.data, currentUser.id);
  revalidateTransactionViews();

  return {
    errors: {},
    message: "Transacao atualizada com sucesso.",
    success: true,
  };
}

export async function deleteTransactionAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await deleteTransaction(id, currentUser.id);
  revalidateTransactionViews();
}
