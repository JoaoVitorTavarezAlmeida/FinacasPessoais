import {
  mockDashboardRepository,
  prismaDashboardRepository,
} from "@/repositories/dashboard";
import { hasDatabaseUrl } from "@/lib/env";
import type {
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  DashboardData,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
} from "@/types/dashboard";

export type DashboardService = {
  getDashboardData(userId: string): Promise<DashboardData>;
  createCategory(input: CreateCategoryInput, userId: string): Promise<void>;
  updateCategory(input: UpdateCategoryInput, userId: string): Promise<void>;
  deleteCategory(id: string, userId: string): Promise<void>;
  createTransaction(
    input: CreateTransactionInput,
    userId: string,
  ): Promise<void>;
  updateTransaction(
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<void>;
  deleteTransaction(id: string, userId: string): Promise<void>;
  createGoal(input: CreateGoalInput, userId: string): Promise<void>;
  updateGoal(input: UpdateGoalInput, userId: string): Promise<void>;
  deleteGoal(id: string, userId: string): Promise<void>;
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

  async updateCategory(input, userId) {
    return dashboardRepository.updateCategory(input, userId);
  },

  async deleteCategory(id, userId) {
    return dashboardRepository.deleteCategory(id, userId);
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

  async createGoal(input, userId) {
    return dashboardRepository.createGoal(input, userId);
  },

  async updateGoal(input, userId) {
    return dashboardRepository.updateGoal(input, userId);
  },

  async deleteGoal(id, userId) {
    return dashboardRepository.deleteGoal(id, userId);
  },
};
