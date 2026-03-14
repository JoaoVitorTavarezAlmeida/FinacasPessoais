import {
  mockDashboardRepository,
  prismaDashboardRepository,
} from "@/repositories/dashboard";
import { hasDatabaseUrl } from "@/lib/env";
import type { CreateCategoryInput, DashboardData } from "@/types/dashboard";

export type DashboardService = {
  getDashboardData(): Promise<DashboardData>;
  createCategory(input: CreateCategoryInput): Promise<void>;
};

const dashboardRepository = hasDatabaseUrl()
  ? prismaDashboardRepository
  : mockDashboardRepository;

export const mockDashboardService: DashboardService = {
  async getDashboardData() {
    return dashboardRepository.getDashboardData();
  },

  async createCategory(input) {
    return dashboardRepository.createCategory(input);
  },
};
