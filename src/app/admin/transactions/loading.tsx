export default function TransactionsLoading() {
  return (
    <div className="w-full font-sans relative z-10 pb-20 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-white/40 dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-white/40 dark:border-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-2xl shrink-0"></div>
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 w-60 bg-gray-100 dark:bg-slate-700/60 rounded"></div>
          </div>
        </div>
        <div className="h-10 w-44 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="h-6 w-40 bg-gray-200 dark:bg-slate-800 rounded mb-4"></div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800/80 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="space-y-1">
                <div className="h-4 w-36 bg-gray-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-24 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-28 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
