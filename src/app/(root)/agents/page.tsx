import { allUsers } from "@/actions/users";
import { PaginationISCE } from "@/components/shared/pagination-isce";
import { Button } from "@/components/ui/button";
import { agentsColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "@/lib/controller/users.controller";
import { addIcon } from "@/lib/icons";
import Link from "next/link";

export default async function Agents({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "15";
  const agents = await getUsers({
    page,
    limit,
    blacklisted: false,
  });

  const airs_agents = await allUsers({ role: "AIRS_AGENT" });
  console.log({ airs_agents });

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  return (
    <div className="flex h-full w-full flex-col p-5">
      <div className="flex items-center justify-between font-bold uppercase">
        <div className="shrink-0 grow-0">Agents</div>
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
              <div className="mr-2 h-4 w-4 shrink-0">{addIcon}</div>
              New Agent
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger className="" value="all">
              All AIRS Agents
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DataTable
              showSearch
              searchWith="name"
              searchWithPlaceholder="Search with name"
              showColumns
              columns={agentsColumns}
              data={airs_agents.success?.data ?? []}
            />
            {agents && agents.rows && (
              <PaginationISCE
                hasNextPage={end < agents.meta.total}
                hasPrevPage={start > 0}
                page={Number(page)}
                limit={Number(limit)}
                total={agents.meta.total}
                hrefPrefix="/agents"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
