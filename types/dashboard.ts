export type SummaryTone = "success" | "danger" | "neutral" | "accent";

export type SummaryCardData = {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: SummaryTone;
};

export type HistoryPoint = {
  day: string;
  amount: number;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: TransactionType;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  amount: string;
  color: string;
};

export type DashboardData = {
  summaryCards: SummaryCardData[];
  history: HistoryPoint[];
  transactions: Transaction[];
  categories: Category[];
};

export type CreateCategoryInput = {
  name: string;
  description: string;
  limit: string;
  color: string;
};

export type CategoryFormErrors = Partial<
  Record<keyof CreateCategoryInput, string[]>
>;

export type CategoryFormState = {
  errors: CategoryFormErrors;
  message?: string;
  success: boolean;
};
