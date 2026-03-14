import { mockDashboardService } from "@/services/dashboard";
import type { CreateCategoryInput } from "@/types/dashboard";

export async function createCategory(input: CreateCategoryInput): Promise<void> {
  return mockDashboardService.createCategory(input);
}
