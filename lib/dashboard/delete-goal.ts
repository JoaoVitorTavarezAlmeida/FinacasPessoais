import { mockDashboardService } from "@/services/dashboard";

export async function deleteGoal(id: string, userId: string): Promise<void> {
  return mockDashboardService.deleteGoal(id, userId);
}
