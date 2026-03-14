import {
  mockDashboardRepository,
  prismaDashboardRepository,
} from "@/repositories/dashboard";
import { hasDatabaseUrl } from "@/lib/env";
import type {
  CreateCategoryInput,
  CreateTransactionInput,
  DashboardData,
  UpdateTransactionInput,
} from "@/types/dashboard";

export type DashboardService = {
  getDashboardData(userId: string): Promise<DashboardData>;
  createCategory(input: CreateCategoryInput, userId: string): Promise<void>;
  createTransaction(
    input: CreateTransactionInput,
    userId: string,
  ): Promise<void>;
  updateTransaction(
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<void>;
  deleteTransaction(id: string, userId: string): Promise<void>;
};

const dashboardRepository = hasDatabaseUrl()
  ? prismaDashboardRepository
  : mockDashboardRepository;

export const mockDashboardService: DashboardService = {
  async getDashboardData(userId) {
    return dashboardRepository.getDashboardData(userId);
  },

  async createCategory(input, userId) {
    return dashboardRepository.createCategory(input, userId);
  },

  async createTransaction(input, userId) {
    return dashboardRepository.createTransaction(input, userId);
  },

  async updateTransaction(input, userId) {
    return dashboardRepository.updateTransaction(input, userId);
  },

  async deleteTransaction(id, userId) {
    return dashboardRepository.deleteTransaction(id, userId);
  },
};
