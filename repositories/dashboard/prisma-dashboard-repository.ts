import { Prisma } from "@prisma/client";

import { getDb } from "@/lib/db";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type {
  Category,
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  DashboardData,
  Goal,
  HistoryPoint,
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
  referenceDate: Date,
): HistoryPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      day: date.toLocaleString("pt-BR", { day: "2-digit" }),
      amount: totalsByDay.get(key) ?? 0,
    };
  });
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
  async getDashboardData(userId: string): Promise<DashboardData> {
    const db = getDb();
    const now = new Date();
    const last30DaysStart = new Date(now);
    last30DaysStart.setDate(now.getDate() - 29);
    last30DaysStart.setHours(0, 0, 0, 0);

    const previous30DaysStart = new Date(last30DaysStart);
    previous30DaysStart.setDate(last30DaysStart.getDate() - 30);

    const [categoriesRaw, allTransactionsRaw, monthTransactions, previousTransactions, goalsRaw] =
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
              gte: last30DaysStart,
            },
          },
          orderBy: { occurredAt: "asc" },
        }),
        db.transaction.findMany({
          where: {
            userId,
            scope: "BALANCE",
            occurredAt: {
              gte: previous30DaysStart,
              lt: last30DaysStart,
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

    const totalsByDay = monthTransactions.reduce((accumulator, transaction) => {
      const key = transaction.occurredAt.toISOString().slice(0, 10);
      const current = accumulator.get(key) ?? 0;
      const signal = transaction.type === "INCOME" ? 1 : -1;
      accumulator.set(key, current + Number(transaction.amount) * signal);
      return accumulator;
    }, new Map<string, number>());

    const incomeTotal = monthTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expenseTotal = monthTransactions
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
      history: buildHistoryPoints(totalsByDay, now),
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
