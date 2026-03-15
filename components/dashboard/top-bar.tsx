import { BellIcon, SearchIcon } from "@/components/dashboard/icons";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function TopBar({
  searchAction = "/transactions",
  searchDefaultValue = "",
  searchHiddenFields,
  searchPlaceholder = "Buscar transação, categoria ou meta",
  userName,
  userEmail,
  eyebrow = "Painel financeiro",
  title = "Controle completo das suas finanças",
  description,
}: {
  searchAction?: string;
  searchDefaultValue?: string;
  searchHiddenFields?: Record<string, string | undefined>;
  searchPlaceholder?: string;
  userName?: string;
  userEmail?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/65 bg-white/78 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-3 lg:min-w-[420px]">
        <form
          action={searchAction}
          className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
        >
          {searchHiddenFields
            ? Object.entries(searchHiddenFields).map(([key, value]) =>
                value ? (
                  <input key={key} name={key} type="hidden" value={value} />
                ) : null,
              )
            : null}
          <input name="page" type="hidden" value="1" />

          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 sm:min-w-[320px]">
            <SearchIcon className="h-5 w-5 shrink-0" />
            <input
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              defaultValue={searchDefaultValue}
              name="q"
              placeholder={searchPlaceholder}
              type="search"
            />
          </label>

          <button
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-2xl bg-slate-950 px-4 text-center text-sm font-semibold text-white sm:shrink-0"
            type="submit"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            aria-label="Notificações"
            className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 sm:flex"
            type="button"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-3 rounded-2xl bg-slate-950 px-3 py-3 text-white sm:min-w-[280px] sm:flex-row sm:items-center sm:justify-between sm:py-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
                {(userName ?? "VA")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 pr-1">
                <p className="text-sm font-medium">
                  {userName ?? "Modo demonstracao"}
                </p>
                <p className="truncate text-xs text-white/60">
                  {userEmail ?? "Planejamento mensal"}
                </p>
              </div>
            </div>

            {userName ? (
              <div className="w-full sm:w-auto sm:shrink-0">
                <SignOutButton />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
