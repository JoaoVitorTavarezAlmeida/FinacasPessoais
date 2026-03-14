import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome para a meta."),
  target: z.string().trim().min(1, "Informe o valor alvo."),
  current: z.string().trim().min(1, "Informe o valor atual."),
  deadline: z.string().trim().min(1, "Informe uma data limite."),
});

export const updateGoalSchema = createGoalSchema.extend({
  id: z.string().trim().min(1, "Meta invalida."),
});
