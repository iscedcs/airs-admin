export type RevenueRange = "ALL" | "YEAR" | "MONTH" | "WEEK" | "DAY" | "CUSTOM";

export type RevenueTotalsShape = {
  totalRevenue?: number;
  yearlyRevenue?: number;
  monthlyRevenue?: number;
  weeklyRevenue?: number;
  dailyRevenue?: number;
};

export type RevenueType = "CVOF" | "ISCE" | "FAREFLEX";

export type RevenueCardProps = {
  title: string;
  desc?: string;
  type: RevenueRange;
  revenueType: RevenueType;
  link?: string;
  total?: number;
  startDate?: string;
  endDate?: string;
};
