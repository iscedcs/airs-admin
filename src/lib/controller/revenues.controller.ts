import { format, subMonths } from "date-fns";
import { API, REVENUE_TYPES, URLS } from "../consts";
import { getSSession } from "../get-data";
import { z } from "zod";
import { RevenueRange, RevenueType } from "../types/revenue";

async function getAuthHeaders() {
  const session = await getSSession();
  return {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token ?? ""}`,
  };
}

const RevenueApiSchema = z.object({
  status: z.boolean().optional(),
  data: z
    .object({
      totalRevenue: z.number().optional(),
      yearlyRevenue: z.number().optional(),
      monthlyRevenue: z.number().optional(),
      weeklyRevenue: z.number().optional(),
      dailyRevenue: z.number().optional(),
    })
    .optional(),
});

function pathForRange(range: RevenueRange) {
  const m: Record<RevenueRange, string> = {
    ALL: URLS.revenue.total,
    YEAR: URLS.revenue.year,
    MONTH: URLS.revenue.month,
    WEEK: URLS.revenue.week,
    DAY: URLS.revenue.day,
    CUSTOM: URLS.revenue.custom,
  };
  return m[range];
}

export const getRevenueStats = async (
  start?: string,
  end?: string,
  type?: "DAILY_FEES" | "ALL" | "TRACKER_FEES"
) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);

  const url = `${API}${
    type === "ALL"
      ? URLS.transactions["net-total"]
      : type === "DAILY_FEES"
      ? URLS.transactions["total-revenue"]
      : URLS.transactions["total-tracker"]
  }?startDate=${start ?? format(oneMonthAgo, "yyyy-MM-dd")}&endDate=${
    end ?? format(today, "yyyy-MM-dd")
  }`;
  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();
  if (!res.ok) return undefined;

  const total: number = result.data;
  return total;
};

export const getDashboardTotalRevenue = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const session = await getSSession();
    const headers = {
      "Content-Type": "application/json",
      "api-secret": process.env.API_SECRET || "",
      Authorization: `Bearer ${session.access_token}`,
    };
    const url = `${API}${URLS.transactions["total-revenue"]}?startDate=${startDate}&endDate=${endDate}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const result = await res.json();
    if (!result.status) {
      console.error(`HTTP error! Status: ${res.status}`);
      return undefined;
    }
    return result.data;
  } catch (error: any) {
    // Handle other errors (e.g., network issues, JSON parsing errors)
    console.error("An error occurred:", error.message);
    return undefined;
  }
};

export const getDashboardTotalTracker = async (
  startDate: string,
  endDate: string
) => {
  try {
    const session = await getSSession();
    const headers = {
      "Content-Type": "application/json",
      "api-secret": process.env.API_SECRET || "",
      Authorization: `Bearer ${session.access_token}`,
    };
    const url = `${API}${URLS.transactions["total-tracker"]}?startDate=${startDate}&endDate=${endDate}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const result = await res.json();

    if (!result.status) {
      console.error(`HTTP error! Status: ${res.status}`);
      return undefined;
    }

    return result.data;
  } catch (error: any) {
    // Handle other errors (e.g., network issues, JSON parsing errors)
    console.error("An error occurred:", error.message);
    return undefined;
  }
};

// export const getTotalRevenue = async (
//   type: "ALL" | "YEAR" | "MONTH" | "WEEK" | "DAY" | "CUSTOM",
//   startDate?: string,
//   endDate?: string
// ): Promise<number> => {
//   try {
//     const session = await getSSession();
//     const headers = {
//       "Content-Type": "application/json",
//       "api-secret": process.env.API_SECRET || "",
//       Authorization: `Bearer ${session.access_token}`,
//     };

//     //@ts-ignore
//     let url = `${API}${URLS.revenue[type.toLowerCase()]}`;

//     if (type === "CUSTOM" && startDate && endDate) {
//       url += `?startDate=${encodeURIComponent(
//         startDate
//       )}&endDate=${encodeURIComponent(endDate)}`;
//     }

//     const res = await fetch(url, { headers, cache: "no-store" });
//     const result = await res.json();

//     let data = 0;
//     if (result.data) {
//       switch (type) {
//         case "ALL":
//           data = result.data.totalRevenue;
//           break;
//         case "YEAR":
//           data = result.data.yearlyRevenue;
//           break;
//         case "MONTH":
//           data = result.data.monthlyRevenue;
//           break;
//         case "WEEK":
//           data = result.data.weeklyRevenue;
//           break;
//         case "DAY":
//           data = result.data.dailyRevenue;
//           break;
//         default:
//           data = Number(result.data) || 0;
//       }
//     }

//     if (!result.status) {
//       return 0;
//     }

//     return data;
//   } catch (error: any) {
//     return 0;
//   }
// };

export async function getTotalRevenue(
  type: RevenueRange,
  revenueType: RevenueType,
  startDate?: string,
  endDate?: string,
  opts?: { revalidate?: number; tag?: string }
): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const path = pathForRange(type);
    const url = new URL(`${API}${path}`);

    // Always include revenue_code
    url.searchParams.set("revenue_code", REVENUE_TYPES[revenueType]);

    if (type === "CUSTOM" && startDate && endDate) {
      url.searchParams.set("startDate", startDate);
      url.searchParams.set("endDate", endDate);
    }

    const res = await fetch(url.toString(), {
      headers,
      next: {
        revalidate: opts?.revalidate ?? 600, // 10 minutes in seconds
        tags: [opts?.tag ?? `revenue:${revenueType}:${type}`],
      },
    });

    if (!res.ok) return 0;

    const json = await res.json();
    const parsed = RevenueApiSchema.safeParse(json);
    if (!parsed.success || !parsed.data.data) return 0;

    const d = parsed.data.data;

    switch (type) {
      case "ALL":
        return d.totalRevenue ?? 0;
      case "YEAR":
        return d.yearlyRevenue ?? 0;
      case "MONTH":
        return d.monthlyRevenue ?? 0;
      case "WEEK":
        return d.weeklyRevenue ?? 0;
      case "DAY":
        return d.dailyRevenue ?? 0;
      default:
        return Number(Object.values(d)[0]) || 0;
    }
  } catch {
    return 0;
  }
}
