import { mockDashboardService } from "@/services/dashboard";

export async function deleteTransaction(
  id: string,
  userId: string,
): Promise<void> {
  return mockDashboardService.deleteTransaction(id, userId);
}
