import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().trim().min(2, "Informe um titulo com pelo menos 2 caracteres."),
  amount: z.string().trim().min(1, "Informe um valor para a transacao."),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().trim().min(1, "Selecione uma categoria."),
  occurredAt: z.string().trim().min(1, "Informe a data da transacao."),
});

export const updateTransactionSchema = createTransactionSchema.extend({
  id: z.string().trim().min(1, "Transacao invalida."),
});
