export default function CustomerPassbookLoading() {
  return (
    <div className="w-full font-sans pb-20 relative z-10 animate-pulse">
      {/* Customer Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-full shrink-0"></div>
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-32 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-16 w-36 bg-gray-100 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-16 w-36 bg-gray-100 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>

      {/* Passbook / Statement Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-6 w-40 bg-gray-200 dark:bg-slate-800 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800/60 last:border-0"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
