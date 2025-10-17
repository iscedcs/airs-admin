// components/revenue/RevenueAmountCard.tsx
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { RevenueCardProps } from "@/lib/types/revenue";

export default function RevenueAmountCard({
  title,
  desc,
  type,
  revenueType,
  link,
  total = 0,
}: RevenueCardProps) {
  const content = (
    <div className="relative flex h-24 w-full flex-col justify-between overflow-clip rounded-2xl bg-secondary p-3 shadow-md">
      <div>
        <div className="line-clamp-1 text-sm text-primary">{title}</div>
        <div className="text-2xl">{formatCurrency(total)}</div>
      </div>
      <div className="flex flex-col items-end justify-end">
        <div className="text-sm text-muted-foreground">
          {desc ?? "previous 30 days"}
        </div>
      </div>
    </div>
  );

  if (!link) {
    return <div aria-label={`${title} total`}>{content}</div>;
  }

  return (
    <Link href={link} aria-label={`Open ${title} ${revenueType} details`}>
      {content}
    </Link>
  );
}
