import { dashboardMockData } from "@/data/dashboard";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type { CreateCategoryInput, DashboardData } from "@/types/dashboard";

function cloneDashboardData(data: DashboardData): DashboardData {
  return {
    summaryCards: data.summaryCards.map((item) => ({ ...item })),
    history: data.history.map((item) => ({ ...item })),
    transactions: data.transactions.map((item) => ({ ...item })),
    categories: data.categories.map((item) => ({ ...item })),
  };
}

export const mockDashboardRepository: DashboardRepository = {
  async getDashboardData() {
    return cloneDashboardData(dashboardMockData);
  },

  async createCategory(input: CreateCategoryInput) {
    void input;
    return Promise.resolve();
  },
};
