import { mockDashboardService } from "@/services/dashboard";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return mockDashboardService.getDashboardData();
}
