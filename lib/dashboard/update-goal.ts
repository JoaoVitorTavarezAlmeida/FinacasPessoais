import { mockDashboardService } from "@/services/dashboard";
import type { UpdateGoalInput } from "@/types/dashboard";

export async function updateGoal(
  input: UpdateGoalInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.updateGoal(input, userId);
}
