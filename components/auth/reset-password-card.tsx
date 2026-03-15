"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resetPasswordAction } from "@/app/actions/auth-actions";
import { initialResetPasswordFormState } from "@/app/form-states";
import { ActionToast } from "@/components/feedback/action-toast";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-600">{errors[0]}</p>;
}

export function ResetPasswordCard({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialResetPasswordFormState,
  );
  const formState = state ?? initialResetPasswordFormState;

  return (
    <section className="mx-auto w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
      <ActionToast message={formState.message} success={formState.success} />

      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
        Redefinir senha
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Defina uma nova senha
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Use uma senha forte e diferente da anterior. Ao concluir, as sessões
        antigas serão encerradas.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input name="token" type="hidden" value={token} />

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Nova senha</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            name="password"
            placeholder="No minimo 8 caracteres"
            type="password"
          />
          <FieldError errors={formState.errors.password} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Confirmar nova senha
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            name="confirmPassword"
            placeholder="Repita a nova senha"
            type="password"
          />
          <FieldError errors={formState.errors.confirmPassword} />
          <FieldError errors={formState.errors.token} />
        </label>

        {formState.success ? (
          <Link
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-800"
            href="/auth"
          >
            Ir para login
          </Link>
        ) : (
          <button
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
            disabled={pending}
            type="submit"
          >
            {pending ? "Redefinindo..." : "Redefinir senha"}
          </button>
        )}
      </form>
    </section>
  );
}
