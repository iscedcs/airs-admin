import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Suspense } from "react"
import { getTransactions } from "@/actions/transactions"
import { TransactionFilters } from "@/components/transaction-filters"
import { TransactionsTable } from "@/components/transactions-table"
import { PaginationControls } from "@/components/pagination-controls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TransactionsPageProps {
  searchParams: {
    paymentType?: string
    vehicleId?: string
    page?: string
    limit?: string
  }
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const limit = Number.parseInt(searchParams.limit || "10") // Ensure limit is parsed

  const filters = {
    paymentType: (searchParams?.paymentType ?? "CVOF") as PaymentType,
    vehicleId: searchParams.vehicleId,
    page,
    limit, // Pass limit to the Server Action
  }

  const apiResponse = await getTransactions(filters)
  const transactions = apiResponse?.data?.data || []
  const paginationMeta = apiResponse?.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold">Transactions</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters />
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <Suspense fallback={<TransactionsTableSkeleton />}>
            <TransactionsTable transactions={transactions} />
          </Suspense>
          <PaginationControls meta={paginationMeta} />
        </CardContent>
      </Card>
    </main>
  )
}

function TransactionsTableSkeleton() {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[200px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[70px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
