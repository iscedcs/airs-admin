'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ChartContainer, ChartTooltip } from "../chart"

interface TransactionData {
  date: string
  amount: number
}

interface TransactionHistoryChartProps {
  frequency: 'all' | 'yearly' | 'monthly' | 'weekly' | 'daily'
  data: TransactionData[]
}

export function TransactionHistoryChart({ frequency, data }: TransactionHistoryChartProps) {
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    switch (frequency) {
      case 'all':
        return date.getFullYear().toString()
      case 'yearly':
        return date.toLocaleDateString('en-US', { month: 'short' })
      case 'monthly':
        return `Week ${Math.ceil(date.getDate() / 7)}`
      case 'weekly':
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      case 'daily':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false })
    }
  }

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString)
    switch (frequency) {
      case 'all':
        return date.getFullYear().toString()
      case 'yearly':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      case 'weekly':
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      case 'daily':
        return date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{frequency.charAt(0).toUpperCase() + frequency.slice(1)} Transaction History</CardTitle>
        <CardDescription>Transaction amounts over time</CardDescription>
      </CardHeader>
      <CardContent className="grid">
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                tickFormatter={(value) => `${formatCurrency(value)}`}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip active
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="bg-secondary grid p-2">
                        <p className="label">{formatCurrency(Number(payload[0].value))}</p>
                        <p className="intro">{formatTooltipDate(payload[0].payload.date)}</p>
                      </Card>
                    )
                  }
                  return null
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
