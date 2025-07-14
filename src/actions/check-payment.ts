"use server"

import { API } from "@/lib/consts"

interface PaymentData {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  paymentReference: string
  customerName: string
  paymentDate: string
  tcode: string
  revenueName: string
  revenueCode: string
  amount: string
}

interface TransactionData {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  transaction_reference: string
  in_reference: string
  out_reference: string | null
  description: string
  paymentType: string
  paymentDate: string
  transaction_type: string
  transaction_category: string
  sender: {
    bank_code: string
    bank_name: string
    account_name: string
    account_number: string
  }
  recipient: any
  amount: string
  currency: string
  revenue_amount: string
  tracker_amount: string
  wallet_charges: string
  gateway_fee_in: string
  gateway_fee_out: string
  wallet_before: string
  wallet_after: string
  status: string
  meta: any
}

interface BackendResponse {
  status: boolean
  path: string
  status_code: number
  data: {
    success: boolean
    message: string
    payment: PaymentData
    transaction: TransactionData
  }
}

// Interface for the frontend (keeping the same structure for compatibility)
interface PaymentStatus {
  tcode: string
  amount: string
  paymentReference: string
  revenueName: string
  paymentDate: string
  customerName: string
  revenueCode: string
  // Additional fields from your backend
  paymentType?: string
  transactionCategory?: string
  transactionStatus?: string
  currency?: string
}

export async function checkPaymentStatus(
  _prevState: { data?: PaymentStatus; error?: string } | null,
  formData: FormData,
): Promise<{ data?: PaymentStatus; error?: string }> {
  const reference = String(formData.get("reference") || "").trim()

  if (!reference) {
    return { error: "Payment reference is required" }
  }

  try {
    const response = await fetch(`${API}/api/v1/payment-notifications/check-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Add any authentication headers if required
        // "Authorization": `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify({
        reference: reference,
      }),
      cache: "no-store",
    })
    console.log({response})
    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Payment reference not found. Please check your reference and try again." }
      }
      if (response.status === 400) {
        return { error: "Invalid payment reference format. Please check and try again." }
      }
      if (response.status === 401) {
        return { error: "Authentication failed. Please try again." }
      }
      if (response.status >= 500) {
        return { error: "Server error. Please try again later." }
      }

      return { error: "Unable to check payment status. Please try again later." }
    }

    const responseData: BackendResponse = await response.json()
    // Check if the backend response indicates success
    if (!responseData.status || !responseData.data.success) {
      return { error: responseData.data.message || "Payment verification failed" }
    }

    const { payment, transaction } = responseData.data

    // Transform the backend data to match the frontend interface
    const transformedData: PaymentStatus = {
      tcode: payment.tcode,
      amount: payment.amount,
      paymentReference: payment.paymentReference,
      revenueName: payment.revenueName,
      paymentDate: payment.paymentDate,
      customerName: payment.customerName,
      revenueCode: payment.revenueCode,
      // Additional fields from your backend
      paymentType: transaction.paymentType,
      transactionCategory: transaction.transaction_category,
      transactionStatus: transaction.status,
      currency: transaction.currency,
    }
    return { data: transformedData }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Network error. Please check your internet connection and try again." }
    }

    if (error instanceof SyntaxError) {
      return { error: "Invalid response from server. Please try again." }
    }

    return { error: "An unexpected error occurred. Please try again." }
  }
}
