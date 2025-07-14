"use server"

import { options } from "@/app/api/auth/options";
import { API } from "@/lib/consts"
import { getServerSession } from "next-auth";


export async function getTransactions(filters: TransactionFilters): Promise<ApiResponse | null> {
  const session = await getServerSession(options);
  if (!filters.paymentType) {
    filters.paymentType = "CVOF"
  }

  const params = new URLSearchParams()
  if (filters.paymentType) {
    params.append("paymentType", filters.paymentType)
  }
  if (filters.vehicleId) {
    params.append("vehicleId", filters.vehicleId)
  }
  params.append("page", (filters.page || 1).toString())
  params.append("limit", (filters.limit || 10).toString())

  const url = `${API}/api/v1/transaction/by-type?${params.toString()}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 9000) // 9-second timeout

  try {
    const response = await fetch(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      signal: controller.signal, // Attach the AbortController signal
      next: { revalidate: 60 }, // Revalidate data after 60 seconds
    })

    clearTimeout(timeoutId) // Clear the timeout if fetch completes

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Failed to fetch transactions:", response.status, errorData)
      return null
    }

    const data: ApiResponse = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId) // Clear the timeout even if an error occurs
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("Fetch request timed out after 9 seconds.")
    } else {
      console.error("Error fetching transactions:", error)
    }
    return null
  }
}
