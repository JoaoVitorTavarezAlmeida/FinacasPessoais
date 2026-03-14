"use client";

import { useActionState, useState } from "react";

import {
  initialAuthFormState,
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
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInAction,
    initialAuthFormState,
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialAuthFormState,
  );
  const isSignUp = mode === "sign-up";
  const state = isSignUp ? signUpState : signInState;

  return (
    <section className="mx-auto w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
        Fatec Financas
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {isSignUp ? "Crie sua conta" : "Entre na sua conta"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSignUp
          ? "Comece a registrar entradas, saidas e categorias reais."
          : "Acesse sua dashboard financeira e acompanhe o fluxo do mes."}
      </p>

      <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            !isSignUp ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
          }`}
          onClick={() => setMode("sign-in")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            isSignUp ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
          }`}
          onClick={() => setMode("sign-up")}
          type="button"
        >
          Criar conta
        </button>
      </div>

      <form
        action={isSignUp ? signUpFormAction : signInFormAction}
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
            <FieldError errors={state.errors.name} />
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
          <FieldError errors={state.errors.email} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Senha</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            name="password"
            placeholder="No minimo 8 caracteres"
            type="password"
          />
          <FieldError errors={state.errors.password} />
        </label>

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
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
          disabled={isSignUp ? signUpPending : signInPending}
          type="submit"
        >
          {isSignUp
            ? signUpPending
              ? "Criando conta..."
              : "Criar conta"
            : signInPending
              ? "Entrando..."
              : "Entrar"}
        </button>
      </form>
    </section>
  );
}
