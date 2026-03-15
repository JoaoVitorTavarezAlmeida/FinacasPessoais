import { Prisma } from "@prisma/client";

import { getDb } from "@/lib/db";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type {
  Category,
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  DashboardData,
  DashboardQueryOptions,
  Goal,
  HistoryPoint,
  HistoryPeriod,
  HistorySeries,
  SummaryCardData,
  Transaction,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
} from "@/types/dashboard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number) {
  const amount = formatCurrency(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${amount}`;
}

function formatChange(current: number, previous: number, positiveLabel: string) {
  if (previous === 0) {
    return positiveLabel;
  }

  const delta = ((current - previous) / previous) * 100;
  const prefix = delta >= 0 ? "+" : "";
  return `${prefix}${delta.toFixed(1).replace(".", ",")}% vs. período anterior`;
}

function formatTransactionDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseCurrencyInput(input: string) {
  const normalized = input.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

function applyGoalMovement({
  current,
  amount,
  type,
  reverse = false,
}: {
  current: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  reverse?: boolean;
}) {
  const delta = type === "INCOME" ? amount : -amount;
  const nextValue = reverse ? current - delta : current + delta;

  if (nextValue < 0) {
    throw new Error("A movimentacao deixaria a meta com saldo negativo.");
  }

  return nextValue;
}

async function updateGoalCurrent({
  amount,
  db,
  goalId,
  reverse = false,
  type,
  userId,
}: {
  amount: number;
  db: Prisma.TransactionClient | ReturnType<typeof getDb>;
  goalId: string;
  reverse?: boolean;
  type: "INCOME" | "EXPENSE";
  userId: string;
}) {
  const goal = await db.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    throw new Error("A meta selecionada nao foi encontrada.");
  }

  const nextCurrent = applyGoalMovement({
    amount,
    current: Number(goal.current),
    reverse,
    type,
  });

  await db.goal.update({
    where: { id: goal.id },
    data: {
      current: new Prisma.Decimal(nextCurrent),
    },
  });
}

function buildHistoryPoints(
  totalsByDay: Map<string, number>,
  startDate: Date,
  endDate: Date,
): HistoryPoint[] {
  let runningBalance = 0;
  const points: HistoryPoint[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const key = cursor.toISOString().slice(0, 10);
    runningBalance += totalsByDay.get(key) ?? 0;
    points.push({
      date: key,
      day: cursor.toLocaleString("pt-BR", { day: "2-digit" }),
      amount: runningBalance,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function buildCategoryHistorySeries({
  categories,
  endDate,
  startDate,
  transactions,
}: {
  categories: Array<{ id: string; name: string; color: string }>;
  endDate: Date;
  startDate: Date;
  transactions: Array<{
    amount: Prisma.Decimal;
    categoryId: string | null;
    type: "INCOME" | "EXPENSE";
  } & { occurredAt: Date }>;
}): HistorySeries[] {
  const totalsByCategory = new Map<string, Map<string, number>>();

  for (const transaction of transactions) {
    if (!transaction.categoryId) {
      continue;
    }

    const categoryMap =
      totalsByCategory.get(transaction.categoryId) ?? new Map<string, number>();
    const key = transaction.occurredAt.toISOString().slice(0, 10);
    const signal = transaction.type === "INCOME" ? 1 : -1;
    const current = categoryMap.get(key) ?? 0;
    categoryMap.set(key, current + Number(transaction.amount) * signal);
    totalsByCategory.set(transaction.categoryId, categoryMap);
  }

  return categories
    .filter((category) => totalsByCategory.has(category.id))
    .map((category) => ({
      id: category.id,
      label: category.name,
      color: category.color,
      points: buildHistoryPoints(
        totalsByCategory.get(category.id) ?? new Map<string, number>(),
        startDate,
        endDate,
      ),
    }));
}

function parseDateInput(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatPeriodLabel(startDate: Date, endDate: Date, preset: HistoryPeriod["preset"]) {
  if (preset === "current_month") {
    return "Mês atual";
  }

  if (preset === "last_30_days") {
    return "Últimos 30 dias";
  }

  return `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`;
}

function resolveHistoryPeriod(
  options: DashboardQueryOptions | undefined,
  referenceDate: Date,
): HistoryPeriod {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const preset = options?.historyPreset ?? "current_month";
  const customStart = parseDateInput(options?.historyStartDate);
  const customEnd = parseDateInput(options?.historyEndDate);

  let startDate = new Date(today);
  let endDate = new Date(today);
  let normalizedPreset: HistoryPeriod["preset"] = preset;

  if (preset === "custom" && customStart && customEnd) {
    startDate = customStart <= customEnd ? customStart : customEnd;
    endDate = customEnd >= customStart ? customEnd : customStart;
  } else if (preset === "last_30_days") {
    startDate.setDate(today.getDate() - 29);
  } else {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    normalizedPreset = "current_month";
  }

  return {
    preset: normalizedPreset,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    label: formatPeriodLabel(startDate, endDate, normalizedPreset),
  };
}

function buildSummaryCards({
  incomeTotal,
  expenseTotal,
  previousIncomeTotal,
  previousExpenseTotal,
  goalsProgress,
}: {
  incomeTotal: number;
  expenseTotal: number;
  previousIncomeTotal: number;
  previousExpenseTotal: number;
  goalsProgress: number;
}): SummaryCardData[] {
  const balance = incomeTotal - expenseTotal;

  return [
    {
      id: "income",
      label: "Entradas",
      value: formatCurrency(incomeTotal),
      change: formatChange(incomeTotal, previousIncomeTotal, "Primeiro período com entradas registradas"),
      tone: "success",
    },
    {
      id: "expense",
      label: "Saídas",
      value: formatCurrency(expenseTotal),
      change: formatChange(expenseTotal, previousExpenseTotal, "Sem saídas no período anterior"),
      tone: "danger",
    },
    {
      id: "balance",
      label: "Saldo",
      value: formatCurrency(balance),
      change: balance >= 0 ? "Saldo positivo no período" : "Saldo negativo no período",
      tone: "neutral",
    },
    {
      id: "goals",
      label: "Metas",
      value: `${Math.round(goalsProgress)}%`,
      change: "Progresso médio das metas cadastradas",
      tone: "accent",
    },
  ];
}

export const prismaDashboardRepository: DashboardRepository = {
  async getDashboardData(
    userId: string,
    options?: DashboardQueryOptions,
  ): Promise<DashboardData> {
    const db = getDb();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const historyPeriod = resolveHistoryPeriod(options, now);
    const historyStartDate = new Date(`${historyPeriod.startDate}T00:00:00`);
    const historyEndDate = new Date(`${historyPeriod.endDate}T23:59:59.999`);
    const currentWindowStart = new Date(historyStartDate);
    const currentWindowEnd = new Date(historyEndDate);
    const windowDays =
      Math.max(
        1,
        Math.round(
          (currentWindowEnd.getTime() - currentWindowStart.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1,
      );

    const previousWindowEnd = new Date(currentWindowStart);
    previousWindowEnd.setMilliseconds(previousWindowEnd.getMilliseconds() - 1);
    const previousWindowStart = new Date(currentWindowStart);
    previousWindowStart.setDate(currentWindowStart.getDate() - windowDays);

    const [categoriesRaw, allTransactionsRaw, periodTransactions, previousTransactions, goalsRaw] =
      await Promise.all([
        db.category.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        db.transaction.findMany({
          where: { userId },
          include: { category: true, goal: true },
          orderBy: { occurredAt: "desc" },
        }),
        db.transaction.findMany({
          where: {
            userId,
            scope: "BALANCE",
            occurredAt: {
              gte: currentWindowStart,
              lte: currentWindowEnd,
            },
          },
          orderBy: { occurredAt: "asc" },
        }),
        db.transaction.findMany({
          where: {
            userId,
            scope: "BALANCE",
            occurredAt: {
              gte: previousWindowStart,
              lte: previousWindowEnd,
            },
          },
        }),
        db.goal.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const categories: Category[] = categoriesRaw.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      amount: category.monthlyLimit
        ? formatCurrency(Number(category.monthlyLimit))
        : "Sem limite",
      color: category.color,
    }));

    const transactions: Transaction[] = allTransactionsRaw.map((transaction) => {
      const signedAmount =
        transaction.type === "INCOME"
          ? formatSignedCurrency(Number(transaction.amount))
          : formatSignedCurrency(-Number(transaction.amount));

      return {
        id: transaction.id,
        title: transaction.title,
        category:
          transaction.scope === "GOAL"
            ? `Meta · ${transaction.goal?.name ?? "Sem meta"}`
            : transaction.category?.name ?? "Sem categoria",
        categoryId: transaction.categoryId ?? undefined,
        date: formatTransactionDate(transaction.occurredAt),
        occurredAt: transaction.occurredAt.toISOString().slice(0, 10),
        amount: signedAmount,
        goalId: transaction.goalId ?? undefined,
        goalName: transaction.goal?.name ?? undefined,
        scope: transaction.scope === "GOAL" ? "goal" : "balance",
        type: transaction.type === "INCOME" ? "income" : "expense",
      };
    });

    const totalsByDay = periodTransactions.reduce((accumulator, transaction) => {
      const key = transaction.occurredAt.toISOString().slice(0, 10);
      const current = accumulator.get(key) ?? 0;
      const signal = transaction.type === "INCOME" ? 1 : -1;
      accumulator.set(key, current + Number(transaction.amount) * signal);
      return accumulator;
    }, new Map<string, number>());
    const history = buildHistoryPoints(
      totalsByDay,
      historyStartDate,
      new Date(`${historyPeriod.endDate}T00:00:00`),
    );
    const historySeries: HistorySeries[] = [
      {
        id: "balance",
        label: "Saldo principal",
        color: "#0f766e",
        isPrimary: true,
        points: history,
      },
      ...buildCategoryHistorySeries({
        categories: categoriesRaw.map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
        })),
        endDate: new Date(`${historyPeriod.endDate}T00:00:00`),
        startDate: historyStartDate,
        transactions: periodTransactions,
      }),
    ];

    const incomeTotal = periodTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expenseTotal = periodTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const previousIncomeTotal = previousTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const previousExpenseTotal = previousTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const goalsProgress = goalsRaw.length
      ? goalsRaw.reduce((total, goal) => {
          const target = Number(goal.target);
          const current = Number(goal.current);
          return total + (target > 0 ? (current / target) * 100 : 0);
        }, 0) / goalsRaw.length
      : 0;

    const goals: Goal[] = goalsRaw.map((goal) => {
      const target = Number(goal.target);
      const current = Number(goal.current);
      const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

      return {
        id: goal.id,
        name: goal.name,
        target: formatCurrency(target),
        current: formatCurrency(current),
        progress,
        deadline: goal.deadline
          ? goal.deadline.toISOString().slice(0, 10)
          : undefined,
      };
    });

    return {
      summaryCards: buildSummaryCards({
        incomeTotal,
        expenseTotal,
        previousIncomeTotal,
        previousExpenseTotal,
        goalsProgress,
      }),
      history,
      historyPeriod,
      historySeries,
      transactions,
      categories,
      goals,
    };
  },

  async createCategory(input: CreateCategoryInput, userId: string): Promise<void> {
    const db = getDb();

    await db.category.create({
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        monthlyLimit: new Prisma.Decimal(parseCurrencyInput(input.limit)),
        userId,
      },
    });
  },

  async updateCategory(input: UpdateCategoryInput, userId: string): Promise<void> {
    const db = getDb();

    await db.category.updateMany({
      where: {
        id: input.id,
        userId,
      },
      data: {
        name: input.name,
        description: input.description,
        color: input.color,
        monthlyLimit: new Prisma.Decimal(parseCurrencyInput(input.limit)),
      },
    });
  },

  async deleteCategory(id: string, userId: string): Promise<void> {
    const db = getDb();

    await db.category.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },

  async createTransaction(
    input: CreateTransactionInput,
    userId: string,
  ): Promise<void> {
    const db = getDb();
    const amount = parseCurrencyInput(input.amount);

    await db.$transaction(async (transactionDb) => {
      if (input.scope === "goal" && input.goalId) {
        await updateGoalCurrent({
          amount,
          db: transactionDb,
          goalId: input.goalId,
          type: input.type === "income" ? "INCOME" : "EXPENSE",
          userId,
        });
      }

      await transactionDb.transaction.create({
        data: {
          title: input.title,
          amount: new Prisma.Decimal(amount),
          scope: input.scope === "goal" ? "GOAL" : "BALANCE",
          type: input.type === "income" ? "INCOME" : "EXPENSE",
          categoryId: input.scope === "balance" ? input.categoryId : null,
          goalId: input.scope === "goal" ? input.goalId : null,
          occurredAt: new Date(input.occurredAt),
          userId,
        },
      });
    });
  },

  async updateTransaction(
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<void> {
    const db = getDb();
    await db.$transaction(async (transactionDb) => {
      const existingTransaction = await transactionDb.transaction.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existingTransaction) {
        throw new Error("A movimentacao selecionada nao foi encontrada.");
      }

      if (existingTransaction.scope === "GOAL" && existingTransaction.goalId) {
        await updateGoalCurrent({
          amount: Number(existingTransaction.amount),
          db: transactionDb,
          goalId: existingTransaction.goalId,
          reverse: true,
          type: existingTransaction.type,
          userId,
        });
      }

      if (input.scope === "goal" && input.goalId) {
        await updateGoalCurrent({
          amount: parseCurrencyInput(input.amount),
          db: transactionDb,
          goalId: input.goalId,
          type: input.type === "income" ? "INCOME" : "EXPENSE",
          userId,
        });
      }

      await transactionDb.transaction.update({
        where: {
          id: existingTransaction.id,
        },
        data: {
          title: input.title,
          amount: new Prisma.Decimal(parseCurrencyInput(input.amount)),
          scope: input.scope === "goal" ? "GOAL" : "BALANCE",
          type: input.type === "income" ? "INCOME" : "EXPENSE",
          categoryId: input.scope === "balance" ? input.categoryId : null,
          goalId: input.scope === "goal" ? input.goalId : null,
          occurredAt: new Date(input.occurredAt),
        },
      });
    });
  },

  async deleteTransaction(id: string, userId: string): Promise<void> {
    const db = getDb();
    await db.$transaction(async (transactionDb) => {
      const existingTransaction = await transactionDb.transaction.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingTransaction) {
        return;
      }

      if (existingTransaction.scope === "GOAL" && existingTransaction.goalId) {
        await updateGoalCurrent({
          amount: Number(existingTransaction.amount),
          db: transactionDb,
          goalId: existingTransaction.goalId,
          reverse: true,
          type: existingTransaction.type,
          userId,
        });
      }

      await transactionDb.transaction.delete({
        where: {
          id: existingTransaction.id,
        },
      });
    });
  },

  async createGoal(input: CreateGoalInput, userId: string): Promise<void> {
    const db = getDb();

    await db.goal.create({
      data: {
        name: input.name,
        target: new Prisma.Decimal(parseCurrencyInput(input.target)),
        current: new Prisma.Decimal(parseCurrencyInput(input.current)),
        deadline: input.deadline ? new Date(input.deadline) : null,
        userId,
      },
    });
  },

  async updateGoal(input: UpdateGoalInput, userId: string): Promise<void> {
    const db = getDb();

    await db.goal.updateMany({
      where: {
        id: input.id,
        userId,
      },
      data: {
        name: input.name,
        target: new Prisma.Decimal(parseCurrencyInput(input.target)),
        current: new Prisma.Decimal(parseCurrencyInput(input.current)),
        deadline: input.deadline ? new Date(input.deadline) : null,
      },
    });
  },

  async deleteGoal(id: string, userId: string): Promise<void> {
    const db = getDb();

    await db.goal.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },
};
