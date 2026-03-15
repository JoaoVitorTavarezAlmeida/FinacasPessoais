"use client";

import { useActionState } from "react";

import {
  deleteGoalAction,
  updateGoalAction,
} from "@/app/actions/goal-actions";
import { initialGoalFormState } from "@/app/form-states";
import { ActionToast } from "@/components/feedback/action-toast";
import type { Goal } from "@/types/dashboard";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-600">{errors[0]}</p>;
}

export function GoalListItem({ goal }: { goal: Goal }) {
  const [state, formAction, isPending] = useActionState(
    updateGoalAction,
    initialGoalFormState,
  );
  const formState = state ?? initialGoalFormState;
  const deadlineLabel = goal.deadline
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
      }).format(new Date(goal.deadline))
    : null;

  return (
    <article className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
      <ActionToast message={formState.message} success={formState.success} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{goal.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {goal.current} de {goal.target}
            {deadlineLabel ? ` • ${deadlineLabel}` : ""}
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-teal-600"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        <details>
          <summary className="cursor-pointer list-none rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
            Editar
          </summary>
          <div className="mt-3 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <form action={formAction} className="space-y-3">
              <input name="id" type="hidden" value={goal.id} />

              <label className="block">
                <span className="text-xs font-medium text-slate-600">Nome</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                  defaultValue={goal.name}
                  name="name"
                  type="text"
                />
                <FieldError errors={formState.errors.name} />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">
                    Alvo
                  </span>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    defaultValue={goal.target}
                    name="target"
                    type="text"
                  />
                  <FieldError errors={formState.errors.target} />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-600">
                    Atual
                  </span>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    defaultValue={goal.current}
                    name="current"
                    type="text"
                  />
                  <FieldError errors={formState.errors.current} />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-600">
                  Prazo
                </span>
                <input
                  className="mt-1 h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                  defaultValue={goal.deadline ?? ""}
                  name="deadline"
                  type="date"
                />
                <FieldError errors={formState.errors.deadline} />
              </label>

              {formState.message ? (
                <p
                  className={`text-xs ${
                    formState.success ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formState.message}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <button
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Salvando..." : "Salvar"}
                </button>
                <button
                  className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600"
                  formAction={deleteGoalAction}
                  type="submit"
                >
                  Excluir
                </button>
              </div>
            </form>
          </div>
        </details>
      </div>
    </article>
  );
}
