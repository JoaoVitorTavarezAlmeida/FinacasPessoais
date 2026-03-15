import { z } from "zod";

function parseMoneyInput(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Use no maximo 80 caracteres."),
  description: z
    .string()
    .trim()
    .min(8, "Descreva a categoria com pelo menos 8 caracteres.")
    .max(240, "Use no maximo 240 caracteres."),
  limit: z
    .string()
    .trim()
    .min(1, "Informe um limite inicial para a categoria.")
    .refine((value) => Number.isFinite(parseMoneyInput(value)), "Informe um limite valido.")
    .refine((value) => parseMoneyInput(value) >= 0, "O limite nao pode ser negativo."),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Selecione uma cor valida."),
});

export type CreateCategorySchemaInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().trim().min(1, "Categoria invalida."),
});
