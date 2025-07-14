"use server"

import { options } from "@/app/api/auth/options";
import { API } from "@/lib/consts"
import { getServerSession } from "next-auth";

const fetchRevenue = async (
  endpoint: string,
  params: URLSearchParams,
  revenueCode: string | undefined,
): Promise<any | null> => {
  const session = await getServerSession(options);

  // Guard: revenue_code is required for all revenue endpoints
  if (!revenueCode) {
    console.warn(`Revenue API call to ${endpoint} skipped: revenue_code is missing.`)
    return null
  }
  params.append("revenue_code", revenueCode)

  const url = `${API}/api/v1/revenue/${endpoint}?${params.toString()}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 9000) // 9-second timeout

  try {
    const response = await fetch(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Revalidate data after 60 seconds
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`Failed to fetch revenue from ${endpoint}:`, response.status, errorData)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`Fetch request to ${endpoint} timed out after 9 seconds.`)
    } else {
      console.error(`Error fetching revenue from ${endpoint}:`, error)
    }
    return null
  }
}

export async function getRevenue(filters: RevenueFilters): Promise<any | null> {
  const params = new URLSearchParams()
  const { revenueCode, reportType, startDate, endDate, date, week, month, year } = filters

  let endpoint = ""
  switch (reportType) {
    case "total":
      endpoint = "total"
      break
    case "custom":
      endpoint = "customRevenue"
      if (!startDate || !endDate) {
        console.warn("Custom revenue requires startDate and endDate.")
        return null
      }
      params.append("startDate", startDate)
      params.append("endDate", endDate)
      break
    case "daily":
      endpoint = "daily"
      if (!date) {
        console.warn("Daily revenue requires a date.")
        return null
      }
      params.append("date", date)
      break
    case "weekly":
      endpoint = "weekly"
      if (!week) {
        console.warn("Weekly revenue requires a week date.")
        return null
      }
      params.append("week", week)
      break
    case "monthly":
      endpoint = "monthly"
      if (!month) {
        console.warn("Monthly revenue requires a month date.")
        return null
      }
      params.append("month", month)
      break
    case "yearly":
      endpoint = "yearly"
      if (!year) {
        console.warn("Yearly revenue requires a year date.")
        return null
      }
      params.append("year", year)
      break
    default:
      console.warn("Invalid or missing reportType for revenue.")
      return null
  }

  // Default successful empty response if required parameters are missing
  const defaultEmptyResponse = {
    status: true,
    path: "",
    status_code: 200,
    data: {
      totalRevenue: 0, // Default for total
      customRevenue: 0, // Default for custom
      dailyRevenue: 0, // Default for daily
      weeklyRevenue: 0, // Default for weekly
      monthlyRevenue: 0, // Default for monthly
      yearlyRevenue: 0, // Default for yearly
    },
  }

  if (!revenueCode) {
    return defaultEmptyResponse
  }

  // Call the generic fetcher with the appropriate return type
  const response = await fetchRevenue(endpoint, params, revenueCode)
  return response || defaultEmptyResponse
}
