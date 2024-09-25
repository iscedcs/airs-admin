

export default function DashboardCard({ title, amount, desc }: IDashboardCard) {
  return (
    <div className="h-24 rounded-2xl shadow-md w-full bg-secondary p-3 flex flex-col justify-between relative overflow-clip">
      <div className="">
        <div className="text-primary text-sm line-clamp-1">{title}</div>
        <div className="text-2xl">₦{amount.toLocaleString()}</div>
      </div>
      <div className="flex flex-col justify-end items-end">
        <div className="text-sm text-gray-800">
          {desc || "previous 30 days"}
        </div>
      </div>
      {/* <Meteors number={10} /> */}
    </div>
  );
}
