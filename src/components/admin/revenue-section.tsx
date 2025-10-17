// components/dashboard/sections/revenue-section.tsx (snippet)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueAmountCardSkeleton from "./revenue-amount-card.skeleton";
import RevenueAmountCardServer from "./revenue-amount-card-server";

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
      {children}
    </div>
  );
}

export default async function RevenueSection() {
  return (
    <Tabs defaultValue="cvof">
      <TabsList className="mb-5">
        <TabsTrigger value="cvof">CVOF</TabsTrigger>
        <TabsTrigger value="isce">Sticker Payment</TabsTrigger>
        <TabsTrigger value="fareflex">Fareflex Payment</TabsTrigger>
      </TabsList>

      <TabsContent value="cvof">
        <Grid>
          {[
            {
              type: "ALL",
              title: "All Time Revenue",
              desc: "All time",
              link: "/dashboard/history/all?revenue=CVOF",
              revenueType: "CVOF",
            },
            {
              type: "YEAR",
              title: "Year Till Date Revenue",
              desc: "Year till date",
              link: "/dashboard/history/yearly?revenue=CVOF",
              revenueType: "CVOF",
            },
            {
              type: "MONTH",
              title: "Month Till Date Revenue",
              desc: "Month till date",
              link: "/dashboard/history/monthly?revenue=CVOF",
              revenueType: "CVOF",
            },
            {
              type: "WEEK",
              title: "Week Till Date Revenue",
              desc: "Week till date",
              link: "/dashboard/history/weekly?revenue=CVOF",
              revenueType: "CVOF",
            },
            {
              type: "DAY",
              title: "Day Till Date Revenue",
              desc: "Day till date",
              link: "/dashboard/history/daily?revenue=CVOF",
              revenueType: "CVOF",
            },
          ].map((p, i) => (
            <Suspense key={i} fallback={<RevenueAmountCardSkeleton />}>
              <RevenueAmountCardServer {...(p as any)} />
            </Suspense>
          ))}
        </Grid>
      </TabsContent>
      <TabsContent value="isce">
        <Grid>
          {[
            {
              type: "ALL",
              title: "All Time Revenue",
              desc: "All time",
              link: "/dashboard/history/all?revenue=ISCE",
              revenueType: "ISCE",
            },
            {
              type: "YEAR",
              title: "Year Till Date Revenue",
              desc: "Year till date",
              link: "/dashboard/history/yearly?revenue=ISCE",
              revenueType: "ISCE",
            },
            {
              type: "MONTH",
              title: "Month Till Date Revenue",
              desc: "Month till date",
              link: "/dashboard/history/monthly?revenue=ISCE",
              revenueType: "ISCE",
            },
            {
              type: "WEEK",
              title: "Week Till Date Revenue",
              desc: "Week till date",
              link: "/dashboard/history/weekly?revenue=ISCE",
              revenueType: "ISCE",
            },
            {
              type: "DAY",
              title: "Day Till Date Revenue",
              desc: "Day till date",
              link: "/dashboard/history/daily?revenue=ISCE",
              revenueType: "ISCE",
            },
          ].map((p, i) => (
            <Suspense key={i} fallback={<RevenueAmountCardSkeleton />}>
              <RevenueAmountCardServer {...(p as any)} />
            </Suspense>
          ))}
        </Grid>
      </TabsContent>
      <TabsContent value="fareflex">
        <Grid>
          {[
            {
              type: "ALL",
              title: "All Time Revenue",
              desc: "All time",
              link: "/dashboard/history/all?revenue=FAREFLEX",
              revenueType: "FAREFLEX",
            },
            {
              type: "YEAR",
              title: "Year Till Date Revenue",
              desc: "Year till date",
              link: "/dashboard/history/yearly?revenue=FAREFLEX",
              revenueType: "FAREFLEX",
            },
            {
              type: "MONTH",
              title: "Month Till Date Revenue",
              desc: "Month till date",
              link: "/dashboard/history/monthly?revenue=FAREFLEX",
              revenueType: "FAREFLEX",
            },
            {
              type: "WEEK",
              title: "Week Till Date Revenue",
              desc: "Week till date",
              link: "/dashboard/history/weekly?revenue=FAREFLEX",
              revenueType: "FAREFLEX",
            },
            {
              type: "DAY",
              title: "Day Till Date Revenue",
              desc: "Day till date",
              link: "/dashboard/history/daily?revenue=FAREFLEX",
              revenueType: "FAREFLEX",
            },
          ].map((p, i) => (
            <Suspense key={i} fallback={<RevenueAmountCardSkeleton />}>
              <RevenueAmountCardServer {...(p as any)} />
            </Suspense>
          ))}
        </Grid>
      </TabsContent>
    </Tabs>
  );
}

export function RevenueSectionSkeleton() {
  return (
    <div>
      <div className="mb-5 flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex h-24 w-full flex-col justify-between rounded-2xl bg-secondary p-3 shadow-md">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
