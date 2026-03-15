import { mockDashboardService } from "@/services/dashboard";

export async function deleteCategory(
  id: string,
  userId: string,
): Promise<void> {
  return mockDashboardService.deleteCategory(id, userId);
}
