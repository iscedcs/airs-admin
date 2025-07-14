"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRevenueCodeDisplayName } from "@/lib/utils"
import { DownloadIcon } from "lucide-react"

interface RevenueReportCardProps {
  revenueAmount: number | null
  reportType: RevenueReportType
  filters: Record<string, any> // Contains all filters used for the report
}

export function RevenueReportCard({ revenueAmount, reportType, filters }: RevenueReportCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN", // Assuming NGN currency for revenue
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getReportTitle = () => {
    const revenueCodeLabel = getRevenueCodeDisplayName(filters.revenueCode)

    switch (reportType) {
      case "total":
        return `Total Revenue for ${revenueCodeLabel}`
      case "custom":
        return `Custom Revenue for ${revenueCodeLabel} (${filters.startDate} to ${filters.endDate})`
      case "daily":
        return `Daily Revenue for ${revenueCodeLabel} (${filters.date})`
      case "weekly":
        return `Weekly Revenue for ${revenueCodeLabel} (Week of ${filters.week})`
      case "monthly":
        return `Monthly Revenue for ${revenueCodeLabel} (Month of ${filters.month})`
      case "yearly":
        return `Yearly Revenue for ${revenueCodeLabel} (Year of ${filters.year})`
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
      "Revenue Code Name",
      "Start Date",
      "End Date",
      "Date",
      "Week",
      "Month",
      "Year",
      "Revenue Amount",
    ]
    const revenueCodeLabel = getRevenueCodeDisplayName(filters.revenueCode)

    const row = [
      reportType,
      filters.revenueCode || "",
      revenueCodeLabel,
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
          <div className="text-4xl font-bold text-primary">{formatCurrency(revenueAmount)}</div>
        ) : (
          <div className="text-lg text-muted-foreground">No data available for selected filters.</div>
        )}
        <CardDescription className="mt-2">
          {revenueAmount !== null && `This is the ${reportType} revenue.`}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
