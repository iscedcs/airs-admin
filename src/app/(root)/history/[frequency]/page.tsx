import { getChatData } from "@/actions/payment-notification";
// import { AllTransactionChart, DailyTransactionChart, MonthlyTransactionChart, WeeklyTransactionChart, YearlyTransactionChart } from "@/components/ui/charts/transaction-chart";
import HistoryDisplay from "@/components/ui/history-display";
import { months } from "@/lib/consts";
// import { format, getWeekOfMonth } from "date-fns";
import { notFound } from "next/navigation";

type IFrequency = "all" | "yearly" | "monthly" | "weekly" | "daily";

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { frequency: "all" },
    { frequency: "daily" },
    { frequency: "weekly" },
    { frequency: "monthly" },
    { frequency: "yearly" },
  ];
}

export default async function FrequencyPage({
  params,
  searchParams,
}: {
  params: { frequency: "all" | "yearly" | "monthly" | "weekly" | "daily" };
  searchParams: {
    y?: string;
    m?: string;
    w?: string;
    d?: string;
    revenue?: string;
  };
}) {
  const { frequency } = params;
  const { y, m, w, d, revenue } = searchParams;

  if (!["all", "yearly", "monthly", "weekly", "daily"].includes(frequency)) {
    notFound();
  }

  const validRevenueTypes = ["CVOF", "ISCE", "FAREFLEX"] as const;
  const revenueType = validRevenueTypes.includes(revenue as any)
    ? (revenue as "CVOF" | "ISCE" | "FAREFLEX")
    : "CVOF";

  const currentDate = new Date();
  const year = parseInt(y || currentDate.getFullYear().toString());
  const month = m ? months.indexOf(m.toLowerCase()) : currentDate.getMonth();
  const weekNum = w
    ? parseInt(w.replace("week", ""))
    : Math.ceil(currentDate.getDate() / 7);
  const dayOfMonth = parseInt(d || currentDate.getDate().toString());

  let date = new Date(year, month, 1);

  if (frequency === "weekly") {
    date.setDate((weekNum - 1) * 7 + 1);
  } else if (frequency === "daily") {
    date.setDate(dayOfMonth);
  }

  const { total, chartData } = await getChatData(frequency, date, revenueType);
  return (
    <HistoryDisplay
      frequency={frequency}
      date={date}
      paymentTotals={total}
      transactionData={chartData}
    />
  );
}
