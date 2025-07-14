"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadIcon } from "lucide-react"

interface RevenueDisplayProps {
  revenueAmount: number | null
  reportType: RevenueReportType
  filters: Record<string, any> // Contains all filters used for the report
}

export function RevenueDisplay({ revenueAmount, reportType, filters }: RevenueDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN", // Assuming NGN currency for revenue
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getReportTitle = () => {
    switch (reportType) {
      case "total":
        return "Total Revenue"
      case "custom":
        return `Custom Revenue (${filters.startDate} to ${filters.endDate})`
      case "daily":
        return `Daily Revenue (${filters.date})`
      case "weekly":
        return `Weekly Revenue (Week of ${filters.week})`
      case "monthly":
        return `Monthly Revenue (Month of ${filters.month})`
      case "yearly":
        return `Yearly Revenue (Year of ${filters.year})`
      default:
        return "Revenue Report"
    }
  }

  const handleDownloadReport = () => {
    if (revenueAmount === null) {
      alert("No data to download.")
      return
    }

    const headers = [
      "Report Type",
      "Revenue Code",
      "Start Date",
      "End Date",
      "Date",
      "Week",
      "Month",
      "Year",
      "Revenue Amount",
    ]
    const row = [
      reportType,
      filters.revenueCode || "",
      filters.startDate || "",
      filters.endDate || "",
      filters.date || "",
      filters.week || "",
      filters.month || "",
      filters.year || "",
      revenueAmount.toFixed(2),
    ]

    const csvContent = `${headers.join(",")}\n${row.join(",")}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${reportType}-revenue-report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{getReportTitle()}</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={revenueAmount === null}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </CardHeader>
      <CardContent>
        {revenueAmount !== null ? (
          <div className="text-2xl font-bold">{formatCurrency(revenueAmount)}</div>
        ) : (
          <div className="text-lg text-muted-foreground">No data available for selected filters.</div>
        )}
        <CardDescription className="mt-2">
          {revenueAmount !== null && `Revenue for ${filters.revenueCode || "selected code"}`}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
