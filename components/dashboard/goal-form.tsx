"use client";

import { useActionState } from "react";

import { createGoalAction } from "@/app/actions/goal-actions";
import { initialGoalFormState } from "@/app/form-states";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-200">{errors[0]}</p>;
}

export function GoalForm() {
  const [state, formAction, isPending] = useActionState(
    createGoalAction,
    initialGoalFormState,
  );
  const formState = state ?? initialGoalFormState;

  return (
    <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(8,47,73,0.98),rgba(15,118,110,0.96))] p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-white/60">
        Nova meta
      </p>
      <h3 className="mt-2 text-xl font-semibold">Planejar objetivo</h3>
      <p className="mt-2 text-sm leading-6 text-white/72">
        Defina o alvo e acompanhe o progresso real na dashboard.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-white/80">Nome</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white"
            name="name"
            placeholder="Ex.: Reserva para viagem"
            type="text"
          />
          <FieldError errors={formState.errors.name} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Alvo</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white"
              name="target"
              placeholder="R$ 0,00"
              type="text"
            />
            <FieldError errors={formState.errors.target} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Atual</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white"
              name="current"
              placeholder="R$ 0,00"
              type="text"
            />
            <FieldError errors={formState.errors.current} />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-white/80">Prazo</span>
          <input
            className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-sm text-white"
            defaultValue={new Date().toISOString().slice(0, 10)}
            name="deadline"
            type="date"
          />
          <FieldError errors={formState.errors.deadline} />
        </label>

        {formState.message ? (
          <p
            className={`text-sm ${
              formState.success ? "text-emerald-100" : "text-rose-100"
            }`}
          >
            {formState.message}
          </p>
        ) : null}

        <button
          className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Salvando..." : "Salvar meta"}
        </button>
      </form>
    </section>
  );
}
