import type {
  AuthFormState,
  CategoryFormState,
  GoalFormState,
  TransactionFormState,
} from "@/types/dashboard";

export const initialCategoryFormState: CategoryFormState = {
  errors: {},
  success: false,
};

export const initialTransactionFormState: TransactionFormState = {
  errors: {},
  success: false,
};

export const initialAuthFormState: AuthFormState = {
  errors: {},
  success: false,
};

export const initialGoalFormState: GoalFormState = {
  errors: {},
  success: false,
};
