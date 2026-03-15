import { z } from "zod";

const normalizedEmail = z.string().trim().toLowerCase().email("Informe um email valido.").max(320, "Email invalido.");

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80, "Nome muito longo."),
  email: normalizedEmail,
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
  confirmPassword: z
    .string()
    .min(8, "Confirme a senha.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
}).superRefine((data, context) => {
  if (data.password !== data.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas precisam ser iguais.",
      path: ["confirmPassword"],
    });
  }
});

export const signInSchema = z.object({
  email: normalizedEmail,
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
});

export const requestPasswordResetSchema = z.object({
  email: normalizedEmail,
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(40, "Token invalido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
  confirmPassword: z
    .string()
    .min(8, "Confirme a senha.")
    .max(72, "A senha deve ter no maximo 72 caracteres."),
}).superRefine((data, context) => {
  if (data.password !== data.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas precisam ser iguais.",
      path: ["confirmPassword"],
    });
  }
});
