import { mockDashboardService } from "@/services/dashboard";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  return mockDashboardService.getDashboardData(userId);
}
