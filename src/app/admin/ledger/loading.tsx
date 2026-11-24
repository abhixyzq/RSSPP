export default function LedgerLoading() {
  return (
    <div className="w-full font-sans pb-20 relative z-10 animate-pulse">
      <div className="max-w-4xl mx-auto mb-6 space-y-2">
        <div className="h-7 w-56 bg-gray-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-72 bg-gray-100 dark:bg-slate-800/60 rounded"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-gray-100 dark:bg-slate-800/60 rounded-xl"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800/60 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-gray-100 dark:bg-slate-800/60 rounded-xl"></div>
        </div>

        <div className="h-12 w-full bg-[#0B2E59]/30 dark:bg-blue-600/30 rounded-xl mt-6"></div>
      </div>
    </div>
  )
}
