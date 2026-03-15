import { mockDashboardService } from "@/services/dashboard";
import type { DashboardData, DashboardQueryOptions } from "@/types/dashboard";

export async function getDashboardData(
  userId: string,
  options?: DashboardQueryOptions,
): Promise<DashboardData> {
  return mockDashboardService.getDashboardData(userId, options);
}
