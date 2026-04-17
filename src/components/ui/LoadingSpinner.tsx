export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F9F9]">
      <div className="w-10 h-10 border-4 border-[#008B8B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
