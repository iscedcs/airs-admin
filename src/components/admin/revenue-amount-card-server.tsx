import { getTotalRevenue } from "@/lib/controller/revenues.controller";
import RevenueAmountCard from "./revenue-amount-card";
import { RevenueCardProps } from "@/lib/types/revenue";

export default async function RevenueAmountCardServer(props: RevenueCardProps) {
  const total =
    typeof props.total === "number"
      ? props.total
      : await getTotalRevenue(
          props.type,
          props.revenueType,
          props.startDate,
          props.endDate,
          {
            revalidate: 60,
            tag: `revenue:${props.revenueType}:${props.type}`,
          }
        );

  return <RevenueAmountCard {...props} total={total} />;
}
