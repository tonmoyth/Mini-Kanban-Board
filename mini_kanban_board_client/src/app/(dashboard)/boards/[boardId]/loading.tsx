export default function BoardLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="flex flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
        <div className="flex h-full items-start gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-slate-100/80 p-3">
              <div className="mb-3 h-5 w-24 animate-pulse rounded bg-slate-200" />
              <div className="flex flex-col gap-2">
                {[1, 2].map((j) => (
                  <div key={j} className="h-20 animate-pulse rounded-lg bg-white shadow-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
