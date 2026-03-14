"use client";

import { useActionState } from "react";

import { initialCategoryFormState } from "@/app/form-states";
import {
  createCategoryAction,
} from "@/app/actions/category-actions";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-200">{errors[0]}</p>;
}

export function CategoryForm() {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialCategoryFormState,
  );
  const formState = state ?? initialCategoryFormState;

  return (
    <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,118,110,0.96))] p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-white/60">
        Nova categoria
      </p>
      <h3 className="mt-2 text-xl font-semibold">Criar categoria</h3>
      <p className="mt-2 text-sm leading-6 text-white/72">
        Estruture suas próximas integrações com backend usando um formulário já
        preparado para cadastro.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-white/80">Nome</span>
          <input
            name="name"
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
            placeholder="Ex.: Saúde"
            type="text"
          />
          <FieldError errors={formState.errors?.name} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-white/80">Descrição</span>
          <textarea
            name="description"
            className="mt-2 min-h-28 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
            placeholder="Descreva o objetivo dessa categoria"
          />
          <FieldError errors={formState.errors?.description} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Limite</span>
            <input
              name="limit"
              className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
              placeholder="R$ 0,00"
              type="text"
            />
            <FieldError errors={formState.errors?.limit} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Cor</span>
            <input
              name="color"
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-white/8 px-3"
              defaultValue="#0f766e"
              type="color"
            />
            <FieldError errors={formState.errors?.color} />
          </label>
        </div>

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
          {isPending ? "Salvando..." : "Salvar categoria"}
        </button>
      </form>
    </section>
  );
}
