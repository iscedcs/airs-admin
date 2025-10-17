import { allUsers } from "@/actions/users";
import { getAllVehicles } from "@/actions/vehicles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SummaryCard from "./summary-card";

export default async function SummarySection() {
  const [allAgents, allVehicles] = await Promise.all([
    allUsers({ role: "AIRS_AGENT", page: 1, pageSize: 10 }),
    getAllVehicles(),
  ]);

  return (
    <div className="grid w-full grid-cols-1 gap-5 py-6 md:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        href="/agents"
        title="Agents"
        description="All Agents"
        value={allAgents.success?.totalUsers ?? 0}
      />
      <SummaryCard
        href="/vehicles"
        title="Vehicles"
        description="Summary of vehicle details"
        value={allVehicles.success?.totalVehicles ?? 0}
      />
    </div>
  );
}

export function SummarySectionSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-5 py-6 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-2 h-4 w-28" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 px-2 py-4">
            <div className="relative grid gap-2 rounded-md border bg-secondary p-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
