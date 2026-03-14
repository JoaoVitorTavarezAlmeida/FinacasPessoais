"use client";

import { useActionState } from "react";

import { initialCategoryFormState } from "@/app/form-states";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/actions/category-actions";
import type { Category } from "@/types/dashboard";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-600">{errors[0]}</p>;
}

export function CategoryListItem({ category }: { category: Category }) {
  const [state, formAction, isPending] = useActionState(
    updateCategoryAction,
    initialCategoryFormState,
  );
  const formState = state ?? initialCategoryFormState;

  return (
    <article className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1 h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {category.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {category.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">
            {category.amount}
          </span>
          <details>
            <summary className="cursor-pointer list-none rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
              Editar
            </summary>
            <div className="mt-3 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <form action={formAction} className="space-y-3">
                <input name="id" type="hidden" value={category.id} />

                <label className="block">
                  <span className="text-xs font-medium text-slate-600">
                    Nome
                  </span>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    defaultValue={category.name}
                    name="name"
                    type="text"
                  />
                  <FieldError errors={formState.errors.name} />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-600">
                    Descricao
                  </span>
                  <textarea
                    className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    defaultValue={category.description}
                    name="description"
                  />
                  <FieldError errors={formState.errors.description} />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Limite
                    </span>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                      defaultValue={category.amount}
                      name="limit"
                      type="text"
                    />
                    <FieldError errors={formState.errors.limit} />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Cor
                    </span>
                    <input
                      className="mt-1 h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-2"
                      defaultValue={category.color}
                      name="color"
                      type="color"
                    />
                    <FieldError errors={formState.errors.color} />
                  </label>
                </div>

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
                    formAction={deleteCategoryAction}
                    type="submit"
                  >
                    Excluir
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}
