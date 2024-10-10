import { getAgentRegisteredByAdminId } from "@/actions/audit-trails";
import { options } from "@/app/api/auth/options";
import FormError from "@/components/shared/FormError";
import { PaginationISCE } from "@/components/shared/pagination-isce";
import { Button } from "@/components/ui/button";
import { agentsColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addIcon } from "@/lib/icons";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Agents({
     searchParams,
}: {
     searchParams: { [key: string]: string | undefined };
}) {
     const session = await getServerSession(options);
     if (!session || !session.user || !session.user.id)
          return (
               <FormError message="You are not authorized to view this page" />
          );
     const userId = session.user.id;
     const page = searchParams["page"] ?? "1";
     const limit = searchParams["limit"] ?? "15";
     const myAgents = await getAgentRegisteredByAdminId({
          userId,
          page: Number(page),
          pageSize: Number(limit),
     });
     const newUsers =
          myAgents &&
          myAgents.success?.data.map(
               (item) => (item.meta as { user: any; newUser: any })?.newUser,
          );

     const start = (Number(page) - 1) * Number(limit);
     const end = start + Number(limit);
     return (
          <div className="flex h-full w-full flex-col p-5">
               <div className="flex items-center justify-between font-bold uppercase">
                    <div className="shrink-0 grow-0">My Agents</div>
                    <div className="shrink-0 grow-0">
                         <Button
                              className="justify-start rounded-xl bg-primary-800 text-white"
                              asChild
                              variant={"default"}
                         >
                              <Link
                                   href={"/agents/new-agent"}
                                   className="shrink-0 whitespace-nowrap"
                              >
                                   <div className="mr-2 h-4 w-4 shrink-0">
                                        {addIcon}
                                   </div>
                                   New Agent
                              </Link>
                         </Button>
                    </div>
               </div>
               <div className="flex flex-col gap-5">
                    <Tabs defaultValue="all" className="w-full">
                         <TabsList>
                              <TabsTrigger className="" value="all">
                                   All Agents
                              </TabsTrigger>
                         </TabsList>
                         <TabsContent value="all">
                              <DataTable
                                   showSearch
                                   searchWith="name"
                                   searchWithPlaceholder="Search with name"
                                   showColumns
                                   columns={agentsColumns}
                                   data={newUsers ?? []}
                              />
                              {newUsers && (
                                   <PaginationISCE
                                        hasNextPage={
                                             end <
                                             myAgents.success?.totalAgents!
                                        }
                                        hasPrevPage={start > 0}
                                        page={Number(page)}
                                        limit={Number(limit)}
                                        total={myAgents.success?.totalAgents!}
                                        hrefPrefix="/dashboard/my-agents"
                                   />
                              )}
                         </TabsContent>
                    </Tabs>
               </div>
          </div>
     );
}
