import type { CreateCategoryInput, DashboardData } from "@/types/dashboard";

export type DashboardRepository = {
  getDashboardData(): Promise<DashboardData>;
  createCategory(input: CreateCategoryInput): Promise<void>;
};
