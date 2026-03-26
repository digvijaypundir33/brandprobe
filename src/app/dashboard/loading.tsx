export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#5B5BD5]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#5B5BD5] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
}
