export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-300 border-t-blue-600 dark:border-blue-700 dark:border-t-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading results...</p>
      </div>
    </div>
  );
}
