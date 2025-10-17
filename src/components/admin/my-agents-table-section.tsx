import { DataTable } from "@/components/ui/table/data-table";
import { agentsColumns } from "@/components/ui/table/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { allUsers } from "@/actions/users";
import { getServerSession } from "next-auth";
import { getUser } from "@/lib/controller/users.controller";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/options";

export default async function MyAgentsTableSection() {
  const { success, error } = await allUsers({ role: "AIRS_AGENT" });
  const agents = success?.data || [];
  return (
    <div className="mb-20 flex flex-col gap-2">
      <DataTable
        showSearch
        searchWith="name"
        searchWithPlaceholder="Search with name"
        showColumns
        columns={agentsColumns}
        data={agents}
      />
    </div>
  );
}

export function MyAgentsTableSkeleton() {
  return (
    <div className="mb-20 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="mt-3 grid gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-3 rounded-md border p-3">
            <Skeleton className="col-span-3 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-2 h-4" />
            <Skeleton className="col-span-3 h-4" />
            <Skeleton className="col-span-2 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
