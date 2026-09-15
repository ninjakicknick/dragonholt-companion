export default function StatCard({ icon, label, children }) {
  return (
    <div className="bg-[#f8f4e6] p-4 rounded-lg shadow border border-[#d2c2a5] flex-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold text-[#5c4a3d] text-lg">{label}</span>
      </div>
      {children}
    </div>
  );
}
