interface NotificationCardType {
  title: string;
  value: string;
}

export default function NotificationCard({
  title,
  value,
}: NotificationCardType) {
  return (
    <div className=" rounded-lg p-[10px] bg-secondary">
      <p className=" text-[13px] text-primary-800">{title}</p>
      <p className=" text-[30px]">{value}</p>
      <p></p>
    </div>
  );
}
