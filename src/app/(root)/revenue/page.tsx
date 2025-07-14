import { Suspense } from "react"
import { getRevenue } from "@/actions/revenue"
import { RevenueFilters } from "@/components/revenue-filters"
import { RevenueReportCard } from "@/components/revenue-report-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign } from "lucide-react"
import { getRevenueCodeDisplayName } from "@/lib/utils"

interface RevenuePageProps {
  searchParams: {
    revenueCode?: string
    reportType?: RevenueReportType
    startDate?: string
    endDate?: string
    date?: string
    week?: string
    month?: string
    year?: string
  }
}

const defaultRevenueCodes = [
  { label: "CVOF_REVENUE_CODE", code: "29001001-12040682" },
  { label: "FAREFLEX_REVENUE_CODE", code: "20008001-12040411" },
  { label: "DEVICE_REVENUE_CODE", code: "20008001-12040632" },
]

export default async function RevenuePage({ searchParams }: RevenuePageProps) {
  const currentFilters: RevenueFilters = {
    revenueCode: searchParams.revenueCode,
    reportType: searchParams.reportType || "total", // Default to 'total'
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    date: searchParams.date,
    week: searchParams.week,
    month: searchParams.month,
    year: searchParams.year,
  }

  // Fetch default view revenues based on current filters
  const defaultRevenuesPromises = defaultRevenueCodes.map((item) =>
    getRevenue({
      revenueCode: item.code,
      reportType: currentFilters.reportType,
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
      date: currentFilters.date,
      week: currentFilters.week,
      month: currentFilters.month,
      year: currentFilters.year,
    }),
  )
  const defaultRevenues = await Promise.all(defaultRevenuesPromises)

  let mainRevenueAmount: number | null = null

  // Fetch revenue for the main report based on searchParams
  const apiResponse = await getRevenue(currentFilters)

  if (apiResponse?.data) {
    switch (currentFilters.reportType) {
      case "total":
        mainRevenueAmount = (apiResponse as any).data.totalRevenue ?? null
        break
      case "custom":
        mainRevenueAmount = (apiResponse as any).data.customRevenue ?? null
        break
      case "daily":
        mainRevenueAmount = (apiResponse as any).data.dailyRevenue ?? null
        break
      case "weekly":
        mainRevenueAmount = (apiResponse as any).data.weeklyRevenue ?? null
        break
      case "monthly":
        mainRevenueAmount = (apiResponse as any).data.monthlyRevenue ?? null
        break
      case "yearly":
        mainRevenueAmount = (apiResponse as any).data.yearlyRevenue ?? null
        break
      default:
        mainRevenueAmount = null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN", // Assuming NGN currency for revenue
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold">Revenue Reports</h1>

      {/* Prominent Current Revenue Display (Infographic) */}
      <Card className="mb-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-300">
            Current Filtered Revenue
          </CardTitle>
          <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          {mainRevenueAmount !== null ? (
            <div className="text-5xl font-extrabold text-green-800 dark:text-green-100">
              {formatCurrency(mainRevenueAmount)}
            </div>
          ) : (
            <div className="text-xl text-green-600 dark:text-green-400">No data for current selection.</div>
          )}
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Based on selected revenue code and report type.
          </p>
        </CardContent>
      </Card>

      {/* Dynamic Overview Section */}
      <section className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold">Overview by Type ({currentFilters.reportType} Revenue)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<DefaultRevenueCardSkeleton />}>
            {defaultRevenues.map((res, index) => {
              const revenueValue =
                currentFilters.reportType === "total"
                  ? (res as any)?.data?.totalRevenue
                  : currentFilters.reportType === "custom"
                    ? (res as any)?.data?.customRevenue
                    : currentFilters.reportType === "daily"
                      ? (res as any)?.data?.dailyRevenue
                      : currentFilters.reportType === "weekly"
                        ? (res as any)?.data?.weeklyRevenue
                        : currentFilters.reportType === "monthly"
                          ? (res as any)?.data?.monthlyRevenue
                          : currentFilters.reportType === "yearly"
                            ? (res as any)?.data?.yearlyRevenue
                            : null

              return (
                <Card key={defaultRevenueCodes[index].code}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {getRevenueCodeDisplayName(defaultRevenueCodes[index].code)}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {revenueValue !== undefined && revenueValue !== null ? formatCurrency(revenueValue) : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">{currentFilters.reportType} revenue for this code</p>
                  </CardContent>
                </Card>
              )
            })}
          </Suspense>
        </div>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueFilters />
        </CardContent>
      </Card>

      <Suspense fallback={<RevenueDisplaySkeleton />}>
        <RevenueReportCard
          revenueAmount={mainRevenueAmount}
          reportType={currentFilters.reportType as RevenueReportType}
          filters={currentFilters}
        />
      </Suspense>
    </main>
  )
}

function DefaultRevenueCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-3 w-[150px]" />
      </CardContent>
    </Card>
  )
}

function RevenueDisplaySkeleton() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-[150px]" />
        </CardTitle>
        <Skeleton className="h-9 w-[150px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardContent>
    </Card>
  )
}
