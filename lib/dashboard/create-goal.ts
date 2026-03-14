import { mockDashboardService } from "@/services/dashboard";
import type { CreateGoalInput } from "@/types/dashboard";

export async function createGoal(
  input: CreateGoalInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.createGoal(input, userId);
}
