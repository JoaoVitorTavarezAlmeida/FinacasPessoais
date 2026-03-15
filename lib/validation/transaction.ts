import { z } from "zod";

function parseMoneyInput(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function isValidDateInput(value: string) {
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

const optionalSelectField = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return value;
}, z.string().trim().optional());

export const createTransactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um titulo com pelo menos 2 caracteres.")
    .max(120, "Use no maximo 120 caracteres."),
  amount: z
    .string()
    .trim()
    .min(1, "Informe um valor para a transacao.")
    .refine((value) => Number.isFinite(parseMoneyInput(value)), "Informe um valor valido.")
    .refine((value) => parseMoneyInput(value) > 0, "O valor deve ser maior que zero."),
  scope: z.enum(["balance", "goal"]),
  type: z.enum(["income", "expense"]),
  categoryId: optionalSelectField,
  goalId: optionalSelectField,
  occurredAt: z
    .string()
    .trim()
    .min(1, "Informe a data da transacao.")
    .refine(isValidDateInput, "Informe uma data valida."),
}).superRefine((data, context) => {
  if (data.scope === "balance" && !data.categoryId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione uma categoria.",
      path: ["categoryId"],
    });
  }

  if (data.scope === "goal" && !data.goalId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione uma meta.",
      path: ["goalId"],
    });
  }
});

export const updateTransactionSchema = createTransactionSchema.extend({
  id: z.string().trim().min(1, "Transacao invalida."),
});
