import { getOwingVehicles } from "@/actions/vehicles";
import { options } from "@/app/api/auth/options";
import { PaginationISCE } from "@/components/shared/pagination-isce";
import AgentSearchBar from "@/components/ui/agent-search-bar";
import { buttonVariants } from "@/components/ui/button";
import {
  owingvehiclesColumns,
  vehiclesColumns,
} from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getVehicles } from "@/lib/controller/vehicle-controller";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Vehicles({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(options);
  if (!session) return redirect("/sign-in");

  const page = Number(searchParams["page"] ?? "1");
  const limit = Number(searchParams["limit"] ?? "15");

  const owingVehicles = await getOwingVehicles(page, limit);

  const vehicles = await getVehicles(page.toString(), limit.toString());

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  return (
    <>
      <div className="flex items-center justify-between font-bold uppercase">
        <div className="shrink-0 grow-0">VEHICLES</div>
      </div>
      <Tabs defaultValue="all" className="mt-[20px]">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="owing">Owing Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {session.user.role?.toLowerCase() !== "agent" &&
          session.user.role?.toLowerCase() !== "green_engine" ? (
            <>
              <div className="mb-10 flex flex-col gap-5">
                <DataTable
                  showSearch
                  searchWith="plate_number"
                  searchWithPlaceholder="Search with plate number"
                  showColumns
                  columns={vehiclesColumns}
                  data={vehicles?.rows ?? []}
                />
              </div>
              {vehicles && (
                <PaginationISCE
                  hasNextPage={end < vehicles.meta.total}
                  hasPrevPage={start > 0}
                  page={Number(page)}
                  limit={Number(limit)}
                  total={vehicles.meta.total}
                  hrefPrefix="/vehicles"
                />
              )}
            </>
          ) : (
            <div className="mx-auto mt-10 grid h-full w-full max-w-[500px] place-items-center">
              <AgentSearchBar placeholder="Enter T-Code" variant="primary" />
            </div>
          )}
        </TabsContent>
        <TabsContent value="owing">
          {session.user.role?.toLowerCase() !== "agent" &&
          session.user.role?.toLowerCase() !== "green_engine" ? (
            <>
              {" "}
              <DataTable
                showSearch
                searchWith="vehicles.plate_number"
                searchWithPlaceholder="Search with plate number"
                showColumns
                columns={owingvehiclesColumns}
                data={owingVehicles.owingVehicles}
              />
              {owingVehicles && (
                <PaginationISCE
                  hasNextPage={end < owingVehicles.countOwingVehicles.length}
                  hasPrevPage={start > 0}
                  page={Number(page)}
                  limit={Number(limit)}
                  total={owingVehicles.countOwingVehicles.length}
                  hrefPrefix="/vehicles"
                />
              )}
            </>
          ) : (
            <div className="mx-auto mt-10 grid h-full w-full max-w-[500px] place-items-center">
              <AgentSearchBar placeholder="Enter T-Code" variant="primary" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
