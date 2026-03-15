import type {
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  DashboardData,
  DashboardQueryOptions,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
} from "@/types/dashboard";

export type DashboardRepository = {
  getDashboardData(
    userId: string,
    options?: DashboardQueryOptions,
  ): Promise<DashboardData>;
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
