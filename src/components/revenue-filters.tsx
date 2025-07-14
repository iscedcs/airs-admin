"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Updated revenueCodes with exact labels
const revenueCodes = [
  { label: "CVOF_REVENUE_CODE", value: "29001001-12040682" },
  { label: "FAREFLEX_REVENUE_CODE", value: "20008001-12040411" },
  { label: "ISCE_REVENUE_CODE", value: "20008001-12040632" },
  // Add more revenue codes as needed
]

export function RevenueFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Helper to get a default date (e.g., today) if not in search params
  const getInitialDate = (paramName: string) => {
    const param = searchParams.get(paramName)
    return param ? new Date(param) : new Date() // Default to today if not in URL
  }

  const [revenueCode, setRevenueCode] = useState(searchParams.get("revenueCode") || revenueCodes[0].value)
  const [reportType, setReportType] = useState<RevenueReportType>(
    (searchParams.get("reportType") as RevenueReportType) || "total",
  )
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
  )
  const [date, setDate] = useState<Date | undefined>(getInitialDate("date"))
  const [week, setWeek] = useState<Date | undefined>(getInitialDate("week"))
  const [month, setMonth] = useState<Date | undefined>(getInitialDate("month"))
  const [year, setYear] = useState<Date | undefined>(getInitialDate("year"))

  // Sync local state with URL when the URL actually changes
  useEffect(() => {
    const paramString = searchParams.toString() // stable primitive
    // revenue code
    const urlRevenueCode = searchParams.get("revenueCode") || revenueCodes[0].value
    setRevenueCode((prev) => (prev !== urlRevenueCode ? urlRevenueCode : prev))

    // report type
    const urlReportType = (searchParams.get("reportType") as RevenueReportType) || "total"
    setReportType((prev) => (prev !== urlReportType ? urlReportType : prev))

    // range dates (only update if present - avoids infinite loop)
    const urlStart = searchParams.get("startDate")
    if (urlStart) {
      const d = new Date(urlStart)
      setStartDate((prev) => (prev?.getTime() !== d.getTime() ? d : prev))
    }

    const urlEnd = searchParams.get("endDate")
    if (urlEnd) {
      const d = new Date(urlEnd)
      setEndDate((prev) => (prev?.getTime() !== d.getTime() ? d : prev))
    }

    const syncDateField = (param: string, setter: (d: Date) => void, prev: Date | undefined) => {
      const v = searchParams.get(param)
      if (v) {
        const d = new Date(v)
        if (!prev || prev.getTime() !== d.getTime()) setter(d)
      }
    }

    syncDateField("date", setDate, date)
    syncDateField("week", setWeek, week)
    syncDateField("month", setMonth, month)
    syncDateField("year", setYear, year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]) // <-- single stable dependency

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams()
    newSearchParams.set("revenueCode", revenueCode)
    newSearchParams.set("reportType", reportType)

    switch (reportType) {
      case "custom":
        if (startDate) newSearchParams.set("startDate", format(startDate, "yyyy-MM-dd"))
        if (endDate) newSearchParams.set("endDate", format(endDate, "yyyy-MM-dd"))
        break
      case "daily":
        if (date) newSearchParams.set("date", format(date, "yyyy-MM-dd"))
        break
      case "weekly":
        if (week) newSearchParams.set("week", format(week, "yyyy-MM-dd")) // API expects YYYY-MM-DD for week
        break
      case "monthly":
        if (month) newSearchParams.set("month", format(month, "yyyy-MM-dd")) // API expects YYYY-MM-DD for month
        break
      case "yearly":
        if (year) newSearchParams.set("year", format(year, "yyyy-MM-dd")) // API expects YYYY-MM-DD for year
        break
    }
    router.push(`/revenue?${newSearchParams.toString()}`)
  }

  const handleClearFilters = () => {
    setRevenueCode(revenueCodes[0].value)
    setReportType("total")
    setStartDate(undefined)
    setEndDate(undefined)
    setDate(new Date()) // Reset to today
    setWeek(new Date()) // Reset to today
    setMonth(new Date()) // Reset to today
    setYear(new Date()) // Reset to today
    router.push("/revenue")
  }

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-background">
      <div className="space-y-2">
        <Label htmlFor="revenueCode">Revenue Code</Label>
        <Select value={revenueCode} onValueChange={setRevenueCode}>
          <SelectTrigger id="revenueCode">
            <SelectValue placeholder="Select revenue code" />
          </SelectTrigger>
          <SelectContent>
            {revenueCodes.map((code) => (
              <SelectItem key={code.value} value={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Report Type</Label>
        <RadioGroup
          value={reportType}
          onValueChange={(value: RevenueReportType) => setReportType(value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="total" id="total" />
            <Label htmlFor="total">Total</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Custom Range</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly">Yearly</Label>
          </div>
        </RadioGroup>
      </div>

      {reportType === "custom" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {reportType === "daily" && (
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {(reportType === "weekly" || reportType === "monthly" || reportType === "yearly") && (
        <div className="space-y-2">
          <Label htmlFor="periodDate">
            {reportType === "weekly" && "Week"}
            {reportType === "monthly" && "Month"}
            {reportType === "yearly" && "Year"}
            {" Date"}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !week && !month && !year && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {reportType === "weekly" && (week ? format(week, "PPP") : <span>Pick a date in the week</span>)}
                {reportType === "monthly" && (month ? format(month, "PPP") : <span>Pick a date in the month</span>)}
                {reportType === "yearly" && (year ? format(year, "PPP") : <span>Pick a date in the year</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={reportType === "weekly" ? week : reportType === "monthly" ? month : year}
                onSelect={reportType === "weekly" ? setWeek : reportType === "monthly" ? setMonth : setYear}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearFilters} className="w-full bg-transparent">
          Clear
        </Button>
      </div>
    </div>
  )
}
