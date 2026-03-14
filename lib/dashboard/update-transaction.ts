import { mockDashboardService } from "@/services/dashboard";
import type { UpdateTransactionInput } from "@/types/dashboard";

export async function updateTransaction(
  input: UpdateTransactionInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.updateTransaction(input, userId);
}
