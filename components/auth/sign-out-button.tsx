"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/app/actions/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 sm:h-11 sm:w-auto sm:rounded-2xl sm:px-4"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction} className="w-full sm:w-auto">
      <SubmitButton />
    </form>
  );
}
