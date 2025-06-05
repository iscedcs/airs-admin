import { getAgentRegisteredByAdminId } from "@/actions/audit-trails";
import {
  getPaymentTotals,
  getPaymentTotalsForStickers,
} from "@/actions/payment-notification";
import { allUsers } from "@/actions/users";
import {
  allVehiclesCount,
  allVehiclesWithStickerCount,
} from "@/actions/vehicles";
import { options } from "@/app/api/auth/options";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RevenueAmountCardNew from "@/components/ui/revenue-amount-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { agentsColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/controller/users.controller";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardAdmin() {
  const session = await getServerSession(options);
  const user = await getUser(session?.user.id!);
  if (!session || !session.user || !user) {
    redirect("/sign-in");
  }
  const userId = session.user.id;
  const allAgents = await allUsers({ role: "AIRS_AGENT" });
  const allVehicles = await allVehiclesCount();
  const vehicleWithSticker = await allVehiclesWithStickerCount();
  const myAgents = await getAgentRegisteredByAdminId({ userId });
  const newUsers =
    myAgents &&
    myAgents.success?.data.map(
      (item) => (item.meta as { user: any; newUser: any })?.newUser
    );

  // const {
  //   allTimeTotal,
  //   yearToDateTotal,
  //   monthToDateTotal,
  //   weekToDateTotal,
  //   dayToDateTotal,
  // } = await getPaymentTotals();

  const CVOF = await getPaymentTotals({ revenueType: "CVOF" });
  const ISCE = await getPaymentTotalsForStickers({ revenueType: "ISCE" });
  const FAREFLEX = await getPaymentTotals({ revenueType: "FAREFLEX" });

  const redenderRevenueCards = (
    data: any,
    revenueType: "CVOF" | "ISCE" | "FAREFLEX"
  ) => (
    <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <Suspense
        fallback={
          <Skeleton className="flex h-24 w-full flex-col justify-between rounded-2xl bg-secondary p-3 shadow-md" />
        }
      >
        <RevenueAmountCardNew
          link={`/`}
          type="TOTAL"
          title="All Time Revenue"
          desc="All time"
          total={Number(data.allTimeTotal)}
        />
        <RevenueAmountCardNew
          link={`/history/yearly?revenue=${revenueType}`}
          type="YEAR"
          title="Year Till Date Revenue"
          desc="Year till date"
          total={Number(data.yearToDateTotal)}
        />
        <RevenueAmountCardNew
          link={`/history/monthly?revenue=${revenueType}`}
          type="MONTH"
          title="Month Till Date Revenue"
          desc="Month till date"
          total={Number(data.monthToDateTotal)}
        />
        <RevenueAmountCardNew
          link={`/history/weekly?revenue=${revenueType}`}
          type="WEEK"
          title="Week Till Date Revenue"
          desc="Week till date"
          total={Number(data.weekToDateTotal)}
        />
        <RevenueAmountCardNew
          link={`/history/daily?revenue=${revenueType}`}
          type="DAY"
          title="Day Till Date Revenue"
          desc="Day till date"
          total={Number(data.dayToDateTotal)}
        />
      </Suspense>
    </div>
  );

  return (
    <div className="p-5">
      <div className="">
        <div className="text-title2Bold md:text-h5Bold">
          Welcome Back, {user?.name ?? "User"}
        </div>
      </div>
      <div className=" w-full">
        <Tabs defaultValue="cvof">
          <TabsList className="mb-5">
            <TabsTrigger value="cvof">CVOF</TabsTrigger>
            <TabsTrigger value="isce">Sticker Payment</TabsTrigger>
            <TabsTrigger value="fareflex">Fareflex Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="cvof">
            {redenderRevenueCards(CVOF, "CVOF")}
          </TabsContent>

          <TabsContent value="isce">
            {redenderRevenueCards(ISCE, "ISCE")}
          </TabsContent>

          <TabsContent value="fareflex">
            {redenderRevenueCards(FAREFLEX, "FAREFLEX")}
          </TabsContent>
        </Tabs>
        <Separator className="my-5" />
      </div>
      <Separator className="my-5" />
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
              <CardDescription>
                All AIRS Agents registered by you
              </CardDescription>
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
        {/* <Link href={"/vehicles"}>
          <Card>
            <CardHeader>
              <CardTitle>Verified Vehicles</CardTitle>
              <CardDescription>Summary of verified vehicle</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 px-2 py-4">
              <div className="pointer-events-none relative grid gap-2 rounded-md border border-primary bg-secondary p-2">
                <p className="font-bold leading-none">Total</p>
                <p className="text-2xl text-muted-foreground">
                  {vehicleWithSticker.success?.data === null
                    ? "0"
                    : vehicleWithSticker.success?.data}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link> */}
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
