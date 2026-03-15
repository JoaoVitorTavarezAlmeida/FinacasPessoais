import { z } from "zod";

const normalizedEmail = z.string().trim().toLowerCase().email("Informe um email valido.").max(320, "Email invalido.");

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80, "Nome muito longo."),
  email: normalizedEmail,
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
});

export const signInSchema = z.object({
  email: normalizedEmail,
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
});
