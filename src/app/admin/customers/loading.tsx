export default function CustomersLoading() {
  return (
    <div className="w-full font-sans relative z-10 pb-20 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-80 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="h-10 w-full md:w-64 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-slate-800 rounded-xl shrink-0"></div>
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white dark:bg-[#0B1120] shadow-md border border-gray-300 dark:border-slate-600 rounded-md overflow-hidden">
        {/* Bank Header Bar Skeleton */}
        <div className="bg-[#0B2E59] dark:bg-slate-800 p-6 border-b-4 border-[#0099CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 dark:bg-slate-700 rounded-full shrink-0"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-white/20 dark:bg-slate-700 rounded"></div>
              <div className="h-3 w-64 bg-white/10 dark:bg-slate-700/60 rounded"></div>
            </div>
          </div>
          <div className="h-10 w-full sm:w-[320px] bg-white/10 dark:bg-slate-700/50 rounded-md"></div>
        </div>

        {/* Status Strip Skeleton */}
        <div className="bg-gray-100 dark:bg-slate-700/50 p-3 border-b border-gray-300 dark:border-slate-600 flex justify-between items-center px-6">
          <div className="h-4 w-40 bg-gray-300 dark:bg-slate-600 rounded"></div>
          <div className="h-4 w-28 bg-gray-300 dark:bg-slate-600 rounded"></div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 border-b border-gray-100 dark:border-slate-800/80 last:border-0"
            >
              <div className="flex items-center gap-4 w-1/3">
                <div className="h-4 w-8 bg-gray-200 dark:bg-slate-800 rounded"></div>
                <div className="space-y-1 w-full">
                  <div className="h-4 w-36 bg-gray-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-24 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="h-6 w-20 bg-green-100/50 dark:bg-green-900/30 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-100 dark:bg-slate-800/60 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Pagination Bar Skeleton */}
        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-600 flex justify-between items-center">
          <div className="h-4 w-48 bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-slate-800 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
