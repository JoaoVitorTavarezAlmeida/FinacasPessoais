import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres."),
  description: z
    .string()
    .trim()
    .min(8, "Descreva a categoria com pelo menos 8 caracteres."),
  limit: z
    .string()
    .trim()
    .min(1, "Informe um limite inicial para a categoria."),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Selecione uma cor valida."),
});

export type CreateCategorySchemaInput = z.infer<typeof createCategorySchema>;
