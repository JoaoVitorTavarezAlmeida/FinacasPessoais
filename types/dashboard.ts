export type SummaryTone = "success" | "danger" | "neutral" | "accent";

export type SummaryCardData = {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: SummaryTone;
};

export type HistoryPoint = {
  date: string;
  day: string;
  amount: number;
};

export type HistorySeries = {
  id: string;
  label: string;
  color: string;
  isPrimary?: boolean;
  points: HistoryPoint[];
};

export type HistoryPreset = "current_month" | "last_30_days" | "custom";

export type HistoryPeriod = {
  preset: HistoryPreset;
  startDate: string;
  endDate: string;
  label: string;
};

export type TransactionType = "income" | "expense";
export type TransactionScope = "balance" | "goal";

export type Transaction = {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  date: string;
  occurredAt?: string;
  amount: string;
  goalId?: string;
  goalName?: string;
  scope: TransactionScope;
  type: TransactionType;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  amount: string;
  color: string;
};

export type Goal = {
  id: string;
  name: string;
  target: string;
  current: string;
  progress: number;
  deadline?: string;
};

export type DashboardData = {
  summaryCards: SummaryCardData[];
  history: HistoryPoint[];
  historyPeriod: HistoryPeriod;
  historySeries: HistorySeries[];
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
};

export type DashboardQueryOptions = {
  historyEndDate?: string;
  historyPreset?: HistoryPreset;
  historyStartDate?: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

export type CreateCategoryInput = {
  name: string;
  description: string;
  limit: string;
  color: string;
};

export type UpdateCategoryInput = CreateCategoryInput & {
  id: string;
};

export type CreateTransactionInput = {
  title: string;
  amount: string;
  scope: TransactionScope;
  type: TransactionType;
  categoryId?: string;
  goalId?: string;
  occurredAt: string;
};

export type UpdateTransactionInput = CreateTransactionInput & {
  id: string;
};

export type CreateGoalInput = {
  name: string;
  target: string;
  current: string;
  deadline: string;
};

export type UpdateGoalInput = CreateGoalInput & {
  id: string;
};

export type CategoryFormErrors = Partial<
  Record<keyof UpdateCategoryInput, string[]>
>;

export type CategoryFormState = {
  errors: CategoryFormErrors;
  message?: string;
  success: boolean;
};

export type TransactionFormErrors = Partial<
  Record<keyof UpdateTransactionInput, string[]>
>;

export type TransactionFormState = {
  errors: TransactionFormErrors;
  message?: string;
  success: boolean;
};

export type GoalFormErrors = Partial<Record<keyof UpdateGoalInput, string[]>>;

export type GoalFormState = {
  errors: GoalFormErrors;
  message?: string;
  success: boolean;
};

export type AuthMode = "sign-in" | "sign-up";

export type AuthInput = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthInput, string[]>>;

export type AuthFormState = {
  errors: AuthFormErrors;
  message?: string;
  success: boolean;
};

export type PasswordResetRequestInput = {
  email: string;
};

export type PasswordResetRequestFormErrors = Partial<
  Record<keyof PasswordResetRequestInput, string[]>
>;

export type PasswordResetRequestFormState = {
  errors: PasswordResetRequestFormErrors;
  message?: string;
  success: boolean;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormErrors = Partial<
  Record<keyof ResetPasswordInput, string[]>
>;

export type ResetPasswordFormState = {
  errors: ResetPasswordFormErrors;
  message?: string;
  success: boolean;
};
