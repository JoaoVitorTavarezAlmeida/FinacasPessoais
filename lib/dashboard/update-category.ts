import { mockDashboardService } from "@/services/dashboard";
import type { UpdateCategoryInput } from "@/types/dashboard";

export async function updateCategory(
  input: UpdateCategoryInput,
  userId: string,
): Promise<void> {
  return mockDashboardService.updateCategory(input, userId);
}
