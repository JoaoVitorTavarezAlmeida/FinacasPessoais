import { Prisma } from "@prisma/client";

import { getDb } from "@/lib/db";
import { getAppUserId } from "@/lib/env";
import type { DashboardRepository } from "@/repositories/dashboard/dashboard-repository";
import type {
  Category,
  CreateCategoryInput,
  DashboardData,
  HistoryPoint,
  SummaryCardData,
  Transaction,
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
  async getDashboardData(): Promise<DashboardData> {
    const db = getDb();
    const userId = getAppUserId();
    const now = new Date();
    const last30DaysStart = new Date(now);
    last30DaysStart.setDate(now.getDate() - 29);
    last30DaysStart.setHours(0, 0, 0, 0);

    const previous30DaysStart = new Date(last30DaysStart);
    previous30DaysStart.setDate(last30DaysStart.getDate() - 30);

    const [categoriesRaw, latestTransactions, monthTransactions, previousTransactions, goals] =
      await Promise.all([
        db.category.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        db.transaction.findMany({
          where: { userId },
          include: { category: true },
          orderBy: { occurredAt: "desc" },
          take: 5,
        }),
        db.transaction.findMany({
          where: {
            userId,
            occurredAt: {
              gte: last30DaysStart,
            },
          },
          orderBy: { occurredAt: "asc" },
        }),
        db.transaction.findMany({
          where: {
            userId,
            occurredAt: {
              gte: previous30DaysStart,
              lt: last30DaysStart,
            },
          },
        }),
        db.goal.findMany({
          where: { userId },
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

    const transactions: Transaction[] = latestTransactions.map((transaction) => {
      const signedAmount =
        transaction.type === "INCOME"
          ? formatSignedCurrency(Number(transaction.amount))
          : formatSignedCurrency(-Number(transaction.amount));

      return {
        id: transaction.id,
        title: transaction.title,
        category: transaction.category?.name ?? "Sem categoria",
        date: formatTransactionDate(transaction.occurredAt),
        amount: signedAmount,
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

    const goalsProgress = goals.length
      ? goals.reduce((total, goal) => {
          const target = Number(goal.target);
          const current = Number(goal.current);
          return total + (target > 0 ? (current / target) * 100 : 0);
        }, 0) / goals.length
      : 0;

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
    };
  },

  async createCategory(input: CreateCategoryInput): Promise<void> {
    const db = getDb();
    const userId = getAppUserId();

    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: "Usuario Inicial",
        email: `${userId}@local.test`,
      },
    });

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
};
