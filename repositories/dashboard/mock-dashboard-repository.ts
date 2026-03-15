import { dashboardMockData } from "@/data/dashboard";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type {
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  DashboardData,
  DashboardQueryOptions,
  HistoryPeriod,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
} from "@/types/dashboard";

function cloneDashboardData(data: DashboardData): DashboardData {
  return {
    summaryCards: data.summaryCards.map((item) => ({ ...item })),
    history: data.history.map((item) => ({ ...item })),
    historyPeriod: { ...data.historyPeriod },
    historySeries: data.historySeries.map((series) => ({
      ...series,
      points: series.points.map((point) => ({ ...point })),
    })),
    transactions: data.transactions.map((item) => ({ ...item })),
    categories: data.categories.map((item) => ({ ...item })),
    goals: data.goals.map((item) => ({ ...item })),
  };
}

function resolveHistoryPeriod(options?: DashboardQueryOptions): HistoryPeriod {
  const preset = options?.historyPreset ?? "current_month";
  const startDate =
    options?.historyStartDate ?? dashboardMockData.historyPeriod.startDate;
  const endDate = options?.historyEndDate ?? dashboardMockData.historyPeriod.endDate;

  return {
    preset,
    startDate,
    endDate,
    label:
      preset === "last_30_days"
        ? "Últimos 30 dias"
        : preset === "custom"
          ? `${new Date(`${startDate}T00:00:00`).toLocaleDateString("pt-BR")} - ${new Date(
              `${endDate}T00:00:00`,
            ).toLocaleDateString("pt-BR")}`
          : "Mês atual",
  };
}

export const mockDashboardRepository: DashboardRepository = {
  async getDashboardData(userId: string, options?: DashboardQueryOptions) {
    void userId;
    const cloned = cloneDashboardData(dashboardMockData);
    const historyPeriod = resolveHistoryPeriod(options);

    cloned.historyPeriod = historyPeriod;
    cloned.history = cloned.history.filter(
      (point) =>
        point.date >= historyPeriod.startDate && point.date <= historyPeriod.endDate,
    );
    cloned.historySeries = cloned.historySeries.map((series) => ({
      ...series,
      points: series.points.filter(
        (point) =>
          point.date >= historyPeriod.startDate && point.date <= historyPeriod.endDate,
      ),
    }));

    return cloned;
  },

  async createCategory(input: CreateCategoryInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async updateCategory(input: UpdateCategoryInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async deleteCategory(id: string, userId: string) {
    void id;
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

  async createGoal(input: CreateGoalInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async updateGoal(input: UpdateGoalInput, userId: string) {
    void input;
    void userId;
    return Promise.resolve();
  },

  async deleteGoal(id: string, userId: string) {
    void id;
    void userId;
    return Promise.resolve();
  },
};
