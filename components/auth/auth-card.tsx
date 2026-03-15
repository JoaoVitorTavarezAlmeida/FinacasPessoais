"use client";

import { useActionState, useState } from "react";

import {
  initialAuthFormState,
  initialPasswordResetRequestFormState,
} from "@/app/form-states";
import { ActionToast } from "@/components/feedback/action-toast";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
} from "@/app/actions/auth-actions";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-600">{errors[0]}</p>;
}

export function AuthCard() {
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "forgot-password">(
    "sign-in",
  );
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInAction,
    initialAuthFormState,
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialAuthFormState,
  );
  const [resetRequestState, resetRequestAction, resetRequestPending] =
    useActionState(
      requestPasswordResetAction,
      initialPasswordResetRequestFormState,
    );
  const isSignUp = mode === "sign-up";
  const isForgotPassword = mode === "forgot-password";
  const state = isSignUp
    ? signUpState
    : isForgotPassword
      ? resetRequestState
      : signInState;
  const emailErrors = isSignUp
    ? signUpState.errors.email
    : isForgotPassword
      ? resetRequestState.errors.email
      : signInState.errors.email;
  const passwordErrors = isSignUp
    ? signUpState.errors.password
    : signInState.errors.password;

  return (
    <section className="mx-auto w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
      <ActionToast message={state.message} success={state.success} />

      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
        Fatec Financas
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {isSignUp
          ? "Crie sua conta"
          : isForgotPassword
            ? "Recuperar acesso"
            : "Entre na sua conta"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSignUp
          ? "Comece a registrar entradas, saidas e categorias reais."
          : isForgotPassword
            ? "Informe seu email para gerar um link de redefinicao de senha."
            : "Acesse sua dashboard financeira e acompanhe o fluxo do mes."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
        <button
          className={`min-w-0 rounded-xl px-3 py-2 text-center text-sm font-medium leading-tight ${
            mode === "sign-in"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500"
          }`}
          onClick={() => setMode("sign-in")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={`min-w-0 rounded-xl px-3 py-2 text-center text-sm font-medium leading-tight ${
            mode === "sign-up"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500"
          }`}
          onClick={() => setMode("sign-up")}
          type="button"
        >
          Criar conta
        </button>
      </div>

      <form
        action={
          isSignUp
            ? signUpFormAction
            : isForgotPassword
              ? resetRequestAction
              : signInFormAction
        }
        className="mt-6 space-y-4"
      >
        {isSignUp ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nome</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              name="name"
              placeholder="Seu nome"
              type="text"
            />
            <FieldError errors={signUpState.errors.name} />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            name="email"
            placeholder="voce@email.com"
            type="email"
          />
          <FieldError errors={emailErrors} />
        </label>

        {!isForgotPassword ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              name="password"
              placeholder="No minimo 8 caracteres"
              type="password"
            />
            <FieldError errors={passwordErrors} />
          </label>
        ) : null}

        {isSignUp ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Confirmar senha
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              name="confirmPassword"
              placeholder="Repita a senha"
              type="password"
            />
            <FieldError errors={signUpState.errors.confirmPassword} />
          </label>
        ) : null}

        {state.message ? (
          <p
            className={`text-sm ${
              state.success ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
          disabled={
            isSignUp
              ? signUpPending
              : isForgotPassword
                ? resetRequestPending
                : signInPending
          }
          type="submit"
        >
          {isSignUp
            ? signUpPending
              ? "Criando conta..."
              : "Criar conta"
            : isForgotPassword
              ? resetRequestPending
                ? "Gerando link..."
                : "Gerar link de redefinicao"
              : signInPending
                ? "Entrando..."
                : "Entrar"}
        </button>
      </form>

      <div className="mt-4 flex justify-center">
        {isForgotPassword ? (
          <button
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
            onClick={() => setMode("sign-in")}
            type="button"
          >
            Voltar para login
          </button>
        ) : (
          <button
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
            onClick={() => setMode("forgot-password")}
            type="button"
          >
            Esqueci minha senha
          </button>
        )}
      </div>
    </section>
  );
}
