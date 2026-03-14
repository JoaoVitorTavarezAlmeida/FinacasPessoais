import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.email("Informe um email valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const signInSchema = z.object({
  email: z.email("Informe um email valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});
