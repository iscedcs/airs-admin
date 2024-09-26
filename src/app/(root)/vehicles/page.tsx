import { options } from "@/app/api/auth/options";
import { PaginationISCE } from "@/components/shared/pagination-isce";
import AgentSearchBar from "@/components/ui/agent-search-bar";
import { buttonVariants } from "@/components/ui/button";
import { vehiclesColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
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

     const page = searchParams["page"] ?? "1";
     const limit = searchParams["limit"] ?? "15";

     const vehicles = await getVehicles(page, limit);
     const start = (Number(page) - 1) * Number(limit);
     const end = start + Number(limit);
     return (
          <>
               <div className="flex items-center justify-between font-bold uppercase">
                    <div className="shrink-0 grow-0">VEHICLES</div>
                    {session.user.role?.toLowerCase() !== "agent" &&
                         session.user.role?.toLowerCase() !==
                              "green_engine" && (
                              <div className="shrink-0 grow-0">
                                   <Link
                                        href={"/vehicles/new-vehicle"}
                                        className={cn(buttonVariants(), "")}
                                   >
                                        <Plus className="mr-2 h-4 w-4 shrink-0" />
                                        NEW VEHICLE
                                   </Link>
                              </div>
                         )}
               </div>
               <div className="inline-flex h-10 w-full items-end justify-start border-b border-primary bg-background text-muted-foreground">
                    <div className="inline-flex items-center justify-center whitespace-nowrap border-primary px-3 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                         All Vehicles
                    </div>
               </div>
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
                         <AgentSearchBar
                              placeholder="Enter T-Code"
                              variant="primary"
                         />
                    </div>
               )}
          </>
     );
}
