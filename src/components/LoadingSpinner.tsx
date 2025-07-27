export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
      <h2 className="text-2xl font-semibold text-white">Analyzing...</h2>
    </div>
  );
}
