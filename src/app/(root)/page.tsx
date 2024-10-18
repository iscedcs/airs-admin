import { getAgentRegisteredByAdminId } from "@/actions/audit-trails";
import { allUsers } from "@/actions/users";
import { allVehiclesCount } from "@/actions/vehicles";
import { options } from "@/app/api/auth/options";
import FormError from "@/components/shared/FormError";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { agentsColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { getUser } from "@/lib/controller/users.controller";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardAdmin() {
  const session = await getServerSession(options);
  const user = await getUser(session?.user.id!);
  if (!session || !session.user || !session.user.id) {
    redirect("/sign-in");
  }
  const userId = session.user.id;
  const allAgents = await allUsers({ role: "AIRS_AGENT" });
  const allVehicles = await allVehiclesCount();
  const myAgents = await getAgentRegisteredByAdminId({ userId });
  const newUsers =
    myAgents &&
    myAgents.success?.data.map(
      (item) => (item.meta as { user: any; newUser: any })?.newUser
    );

  return (
    <div className="p-5">
      <div className="">
        <div className="text-title2Bold md:text-h5Bold">
          Welcome Back, {user?.name ?? "User"}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-[20px] gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Link href={"/agents"}>
          <Card>
            <CardHeader>
              <CardTitle>AIRS Agents</CardTitle>
              <CardDescription>All AIRS Agents</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 px-2 py-4">
              <div className="pointer-events-none relative grid gap-2 rounded-md border border-primary bg-secondary p-2">
                <p className="font-bold leading-none">Total</p>
                <p className="text-2xl text-muted-foreground">
                  {allAgents.success?.totalUsers == null
                    ? "0"
                    : allAgents.success?.totalUsers}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/my-agents?page=1&limit=15"}>
          <Card>
            <CardHeader>
              <CardTitle>Registered AIRS Agents</CardTitle>
              <CardDescription>All AIRS Agents registered by you</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 px-2 py-4">
              <div className="pointer-events-none relative grid gap-2 rounded-md border border-primary bg-secondary p-2">
                <p className="font-bold leading-none">Total</p>
                <p className="text-2xl text-muted-foreground">
                  {myAgents.success?.totalAgents == null
                    ? "0"
                    : myAgents.success?.totalAgents}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/vehicles"}>
          <Card>
            <CardHeader>
              <CardTitle>Vehicles</CardTitle>
              <CardDescription>Summary of vehicle details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 px-2 py-4">
              <div className="pointer-events-none relative grid gap-2 rounded-md border border-primary bg-secondary p-2">
                <p className="font-bold leading-none">Total</p>
                <p className="text-2xl text-muted-foreground">
                  {allVehicles.success?.data === null
                    ? "0"
                    : allVehicles.success?.data}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="mb-20 flex flex-col gap-2">
        <DataTable
          showSearch
          searchWith="name"
          searchWithPlaceholder="Search with name"
          showColumns
          columns={agentsColumns}
          data={newUsers ?? []}
        />
        {/* <div className="text-title1Bold md:text-h4Bold">
                         Revenue & Statistics
                    </div>
                    <div className="rounded-3xl">
                         <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3">
                              {DATE_RANGE.map(
                                   ({ type, title, description }, b) => (
                                        <Suspense
                                             key={b}
                                             fallback={
                                                  <Skeleton className="flex h-24 w-full flex-col justify-between rounded-2xl bg-secondary p-3 shadow-md" />
                                             }
                                        >
                                             <RevenueAmountCard
                                                  type={type}
                                                  title={`${title} Revenue`}
                                                  desc={description}
                                             />
                                        </Suspense>
                                   ),
                              )}
                         </div>
                    </div> */}
      </div>
    </div>
  );
}
