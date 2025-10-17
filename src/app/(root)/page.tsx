import { options } from "@/app/api/auth/options";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PaymentNotificationCalendar from "@/components/shared/payment-notification";
import RevenueSection, {
  RevenueSectionSkeleton,
} from "@/components/admin/revenue-section";
import SummarySection, {
  SummarySectionSkeleton,
} from "@/components/admin/summary-section";
import MyAgentsTableSection, {
  MyAgentsTableSkeleton,
} from "@/components/admin/my-agents-table-section";
import { getUser } from "@/lib/controller/users.controller";

export default async function DashboardAdmin() {
  const session = await getServerSession(options);
  const user = await getUser(session?.user.id!);
  if (!session || !session.user || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex w-full flex-col gap-5 p-3 md:p-5">
      <div className="text-title2Bold md:text-h5Bold">
        Welcome Back, {user.name ?? "User"}
      </div>
      <div className="w-full">
        {/* Revenue Tabs */}
        <Suspense fallback={<RevenueSectionSkeleton />}>
          <RevenueSection />
        </Suspense>

        <Separator className="my-4" />
        <Suspense fallback={<SummarySectionSkeleton />}>
          <SummarySection />
        </Suspense>

        {/* Payment Notification Calendar */}
        <Separator className="my-4" />
        <PaymentNotificationCalendar />

        <Suspense fallback={<MyAgentsTableSkeleton />}>
          <MyAgentsTableSection />
        </Suspense>
      </div>
    </div>
  );
}
