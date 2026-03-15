import { z } from "zod";

const optionalSelectField = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return value;
}, z.string().trim().optional());

export const createTransactionSchema = z.object({
  title: z.string().trim().min(2, "Informe um titulo com pelo menos 2 caracteres."),
  amount: z.string().trim().min(1, "Informe um valor para a transacao."),
  scope: z.enum(["balance", "goal"]),
  type: z.enum(["income", "expense"]),
  categoryId: optionalSelectField,
  goalId: optionalSelectField,
  occurredAt: z.string().trim().min(1, "Informe a data da transacao."),
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
