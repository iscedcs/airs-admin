'use client'

import { formatCurrency } from "@/lib/utils"
import { FrequencySwitch } from "./frequency-switch"
import { DateSelector } from "./date-selector"
import { TransactionHistoryChart } from "./charts/transactions-history-chart"


interface HistoryDisplayProps {
  frequency: 'all' | 'yearly' | 'monthly' | 'weekly' | 'daily'
  date: Date
  paymentTotals: number
  transactionData: { date: string; amount: number }[]
}

export default function HistoryDisplay({ frequency, date, paymentTotals, transactionData }: HistoryDisplayProps) {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <FrequencySwitch currentFrequency={frequency} />
      <DateSelector frequency={frequency} />
      <p className="text-xl">
        Total Payments: {formatCurrency(paymentTotals)}
      </p>
      <TransactionHistoryChart frequency={frequency} data={transactionData} />
    </div>
  )
}

