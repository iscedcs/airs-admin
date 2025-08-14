"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPaymentNotificonCount } from "@/lib/controller/payment-notifications-count";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";
import NotificationCard from "./notification-card";

interface paymentNotificationType {
  total: string;
  categories: { cvof: string; fareflex: string; isce: string };
}

export default function PaymentNotificationCalendar() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(
    new Date()
  );

  // State for single date tab
  const [singleTotals, setSingleTotals] = React.useState({
    total: "0",
    cvof: "0",
    isce: "0",
    fareflex: "0",
  });

  // State for range tab
  const [rangeTotals, setRangeTotals] = React.useState({
    total: "0",
    cvof: "0",
    isce: "0",
    fareflex: "0",
  });

  // const [role, setRole] = useState<string>();

  // useEffect(() => {
  //   const roleSet = async () => {
  //     const session = await getServerSession(options);
  //     const role = session?.user?.role;

  //     setRole(role);
  //   };

  //   roleSet();
  // }, []);

  const { data: session } = useSession();

  const role = session?.user.role;
  console.log({ role });

  const fetchNotifications = async (
    start: Date,
    end: Date
  ): Promise<paymentNotificationType> => {
    return await getPaymentNotificonCount({
      startDate: start,
      endDate: end,
    });
  };

  // Fetch for range
  useEffect(() => {
    if (!dateRange?.from) return;
    const startDate = new Date(dateRange.from.setHours(0, 0, 0, 0));
    const endDate = new Date(
      (dateRange.to ?? dateRange.from).setHours(23, 59, 59, 999)
    );

    fetchNotifications(startDate, endDate).then((data) => {
      setRangeTotals({
        total: data?.total ?? "N/A",
        cvof: data?.categories?.cvof ?? "N/A",
        isce: data?.categories?.isce ?? "N/A",
        fareflex: data?.categories?.fareflex ?? "N/A",
      });
    });
  }, [dateRange]);

  // Fetch for single date
  useEffect(() => {
    if (!singleDate) return;
    const startDate = new Date(singleDate.setHours(0, 0, 0, 0));
    const endDate = new Date(singleDate.setHours(23, 59, 59, 999));

    fetchNotifications(startDate, endDate).then((data) => {
      setSingleTotals({
        total: data?.total ?? "N/A",
        cvof: data?.categories?.cvof ?? "N/A",
        isce: data?.categories?.isce ?? "N/A",
        fareflex: data?.categories?.fareflex ?? "N/A",
      });
    });
  }, [singleDate]);

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? dateRange.from.toDateString() === dateRange.to.toDateString()
        ? dateRange.from.toDateString()
        : `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`
      : dateRange?.from
      ? dateRange.from.toDateString()
      : "No date selected";

  const formattedSingleDate = singleDate
    ? singleDate.toDateString()
    : "No date selected";

  return (
    <div className="w-full">
      <p className="font-bold">Number of payment notifications</p>
      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Single Date</TabsTrigger>
          <TabsTrigger value="range">Date Range</TabsTrigger>
        </TabsList>

        {/* Single date */}
        <TabsContent value="single">
          <div className="mt-3 flex flex-col md:flex-row gap-3">
            <div>
              <Calendar
                mode="single"
                selected={singleDate}
                onSelect={(date) => {
                  if (!date) {
                    setSingleDate(undefined);
                    return;
                  }
                  setSingleDate(date);
                }}
                className="rounded-md border shadow-sm w-full"
                captionLayout="dropdown"
              />
            </div>
            <Card className="p-5 flex-1">
              <p className="text-sm sm:text-base">
                {`Number of payment notifications from ${formattedSingleDate}`}
              </p>
              <div className="">
                {role === "AIRS_ADMIN" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mt-5">
                    <NotificationCard
                      title="TOTAL"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : singleTotals.total
                      }
                    />
                    <NotificationCard
                      title="CVOF"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : singleTotals.cvof
                      }
                    />
                    <NotificationCard
                      title="STICKER"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : singleTotals.isce
                      }
                    />
                    <NotificationCard
                      title="FAREFLEX"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : singleTotals.fareflex
                      }
                    />
                  </div>
                ) : role === "ADMIN" ? (
                  <NotificationCard
                    title="CVOF"
                    value={
                      formattedDateRange === "No date selected"
                        ? "0"
                        : singleTotals.cvof
                    }
                  />
                ) : (
                  <NotificationCard
                    title="CVOF"
                    value={
                      formattedDateRange === "No date selected"
                        ? "0"
                        : singleTotals.cvof
                    }
                  />
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Date range */}
        <TabsContent value="range">
          <div className="mt-3 flex flex-col md:flex-row gap-3">
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from) {
                    setDateRange(undefined);
                    return;
                  }
                  setDateRange(range);
                }}
                className="rounded-md border shadow-sm w-full"
                captionLayout="dropdown"
              />
            </div>
            <Card className="p-5 flex-1">
              <p className="text-sm sm:text-base">
                {`Number of payment notifications from ${formattedDateRange}`}
              </p>
              <div className="">
                {role === "SUPERADMIN" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mt-5">
                    <NotificationCard
                      title="TOTAL"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : rangeTotals.total
                      }
                    />
                    <NotificationCard
                      title="CVOF"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : rangeTotals.cvof
                      }
                    />
                    <NotificationCard
                      title="STICKER"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : rangeTotals.isce
                      }
                    />
                    <NotificationCard
                      title="FAREFLEX"
                      value={
                        formattedDateRange === "No date selected"
                          ? "0"
                          : rangeTotals.fareflex
                      }
                    />
                  </div>
                ) : role === "ADMIN" ? (
                  <NotificationCard
                    title="CVOF"
                    value={
                      formattedDateRange === "No date selected"
                        ? "0"
                        : rangeTotals.cvof
                    }
                  />
                ) : (
                  <NotificationCard
                    title="CVOF"
                    value={
                      formattedDateRange === "No date selected"
                        ? "0"
                        : rangeTotals.cvof
                    }
                  />
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
