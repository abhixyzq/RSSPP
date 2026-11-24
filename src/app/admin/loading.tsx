export default function AdminDashboardLoading() {
  return (
    <div className="w-full font-sans relative z-10 pb-20 max-w-7xl mx-auto animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-white/70 dark:bg-slate-900/70 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gray-200 dark:bg-slate-800 rounded-lg shrink-0"></div>
          <div className="space-y-2">
            <div className="h-6 w-44 bg-gray-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-4 w-32 bg-gray-100 dark:bg-slate-800/60 rounded-md"></div>
          </div>
        </div>
        <div className="h-10 w-48 bg-gray-100 dark:bg-slate-800/60 rounded-lg"></div>
      </div>

      {/* Title */}
      <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2">
        <div className="h-5 w-44 bg-gray-200 dark:bg-slate-800 rounded"></div>
      </div>

      {/* 3 Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between h-40"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800/80 rounded-lg"></div>
            </div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-3 w-36 bg-gray-100 dark:bg-slate-800/50 rounded"></div>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Quick Actions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Quick Actions Skeleton */}
        <div className="lg:col-span-1 space-y-3">
          <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-lg shrink-0"></div>
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-20 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
                </div>
              </div>
              <div className="w-4 h-4 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>

        {/* Recent Transactions Skeleton */}
        <div className="lg:col-span-2">
          <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2 flex justify-between items-end">
            <div className="h-5 w-44 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-20 bg-gray-100 dark:bg-slate-800 rounded"></div>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-slate-800/60 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-3 w-20 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
