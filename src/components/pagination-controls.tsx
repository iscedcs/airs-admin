"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationControlsProps {
  meta: PaginationMeta
}

export function PaginationControls({ meta }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = meta.page
  const totalPages = meta.totalPages
  const currentLimit = meta.limit // Get current limit from meta

  const pageSizes = [10, 20, 50, 100] // Options for items per page

  const createPageURL = (pageNumber: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    params.set("limit", limit.toString()) // Ensure limit is always in the URL
    return `/transactions?${params.toString()}`
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(createPageURL(currentPage - 1, currentLimit))
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      router.push(createPageURL(currentPage + 1, currentLimit))
    }
  }

  const handleLimitChange = (newLimit: string) => {
    const newLimitNum = Number.parseInt(newLimit)
    // When limit changes, reset to page 1 to avoid out-of-bounds issues
    router.push(createPageURL(1, newLimitNum))
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={currentLimit.toString()} />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages} (Total: {meta.total})
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handlePrevious} disabled={currentPage <= 1}>
          Previous
        </Button>
        <Button variant="outline" onClick={handleNext} disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}
