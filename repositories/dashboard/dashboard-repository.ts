import type {
  CreateCategoryInput,
  CreateTransactionInput,
  DashboardData,
  UpdateTransactionInput,
} from "@/types/dashboard";

export type DashboardRepository = {
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
