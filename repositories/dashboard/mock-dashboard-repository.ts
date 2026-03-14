import { dashboardMockData } from "@/data/dashboard";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type {
  CreateCategoryInput,
  CreateTransactionInput,
  DashboardData,
  UpdateTransactionInput,
} from "@/types/dashboard";

function cloneDashboardData(data: DashboardData): DashboardData {
  return {
    summaryCards: data.summaryCards.map((item) => ({ ...item })),
    history: data.history.map((item) => ({ ...item })),
    transactions: data.transactions.map((item) => ({ ...item })),
    categories: data.categories.map((item) => ({ ...item })),
  };
}

export const mockDashboardRepository: DashboardRepository = {
  async getDashboardData(userId: string) {
    void userId;
    return cloneDashboardData(dashboardMockData);
  },

  async createCategory(input: CreateCategoryInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async createTransaction(input: CreateTransactionInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async updateTransaction(input: UpdateTransactionInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async deleteTransaction(id: string, userId: string) {
    void id;
    void userId;
    return Promise.resolve();
  },
};
