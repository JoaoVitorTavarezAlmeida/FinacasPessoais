import { mockDashboardService } from "@/services/dashboard";
import type { CreateTransactionInput } from "@/types/dashboard";

export async function createTransaction(
  input: CreateTransactionInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.createTransaction(input, userId);
}
