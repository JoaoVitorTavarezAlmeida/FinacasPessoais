type PaginationControlsProps = {
  basePath: string;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
};

function buildPageHref({
  basePath,
  page,
  searchParams,
}: {
  basePath: string;
  page: number;
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function PaginationControls({
  basePath,
  currentPage,
  totalItems,
  totalPages,
  pageSize,
  searchParams,
}: PaginationControlsProps) {
  if (totalItems <= pageSize) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const previousHref = buildPageHref({
    basePath,
    page: currentPage - 1,
    searchParams,
  });
  const nextHref = buildPageHref({
    basePath,
    page: currentPage + 1,
    searchParams,
  });

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700">
          Mostrando {start} - {end} de {totalItems}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
          Página {currentPage} de {totalPages}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <a
          aria-disabled={currentPage === 1}
          className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition ${
            currentPage === 1
              ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          href={previousHref}
        >
          Anterior
        </a>
        <a
          aria-disabled={currentPage === totalPages}
          className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition ${
            currentPage === totalPages
              ? "pointer-events-none border border-slate-200 bg-slate-100 text-slate-400"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
          href={nextHref}
        >
          Próxima
        </a>
      </div>
    </div>
  );
}
