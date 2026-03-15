import { z } from "zod";

function parseMoneyInput(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function isValidDateInput(value: string) {
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export const createGoalSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome para a meta.").max(100, "Use no maximo 100 caracteres."),
  target: z
    .string()
    .trim()
    .min(1, "Informe o valor alvo.")
    .refine((value) => Number.isFinite(parseMoneyInput(value)), "Informe um valor alvo valido.")
    .refine((value) => parseMoneyInput(value) > 0, "O alvo deve ser maior que zero."),
  current: z
    .string()
    .trim()
    .min(1, "Informe o valor atual.")
    .refine((value) => Number.isFinite(parseMoneyInput(value)), "Informe um valor atual valido.")
    .refine((value) => parseMoneyInput(value) >= 0, "O valor atual nao pode ser negativo."),
  deadline: z
    .string()
    .trim()
    .min(1, "Informe uma data limite.")
    .refine(isValidDateInput, "Informe uma data valida."),
}).superRefine((data, context) => {
  if (parseMoneyInput(data.current) > parseMoneyInput(data.target)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "O valor atual nao pode ser maior que o alvo.",
      path: ["current"],
    });
  }
});

export const updateGoalSchema = createGoalSchema.extend({
  id: z.string().trim().min(1, "Meta invalida."),
});
