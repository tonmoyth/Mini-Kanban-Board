export default function BoardsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex h-32 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
