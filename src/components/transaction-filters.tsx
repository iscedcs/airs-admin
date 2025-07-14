"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const paymentTypes: PaymentType[] = ["CVOF", "FAREFLEX", "DEVICE"]

export function TransactionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [paymentType, setPaymentType] = useState<PaymentType>(
    (searchParams.get("paymentType") as PaymentType) || "CVOF",
  )
  const [vehicleId, setVehicleId] = useState(searchParams.get("vehicleId") || "")

  // Update state when searchParams change (e.g., from pagination)
  useEffect(() => {
    setPaymentType((searchParams.get("paymentType") as PaymentType) || "CVOF")
    setVehicleId(searchParams.get("vehicleId") || "")
  }, [searchParams])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete("page") // Reset page when filters change
      return params.toString()
    },
    [searchParams],
  )

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (paymentType) {
      newSearchParams.set("paymentType", paymentType)
    }
    if (vehicleId) {
      newSearchParams.set("vehicleId", vehicleId)
    } else {
      newSearchParams.delete("vehicleId")
    }
    newSearchParams.delete("page") // Reset page when filters change
    router.push(`/transactions?${newSearchParams.toString()}`)
  }

  const handleClearFilters = () => {
    setPaymentType("CVOF")
    setVehicleId("")
    router.push("/transactions")
  }

  return (
    <div className="grid gap-4 p-4 border rounded-lg md:grid-cols-3 lg:grid-cols-4 bg-background">
      <div className="space-y-2">
        <Label htmlFor="paymentType">Payment Type</Label>
        {/* @ts-expect-error: Garri error */}
        <Select value={paymentType} onValueChange={setPaymentType}>
          <SelectTrigger id="paymentType">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehicleId">Vehicle ID</Label>
        <Input
          id="vehicleId"
          placeholder="Enter vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
        />
      </div>
      <div className="flex items-end gap-2 md:col-span-1">
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
