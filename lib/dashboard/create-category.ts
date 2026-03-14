import { mockDashboardService } from "@/services/dashboard";
import type { CreateCategoryInput } from "@/types/dashboard";

export async function createCategory(
  input: CreateCategoryInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.createCategory(input, userId);
}
