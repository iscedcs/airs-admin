"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { getPaymentNotificonCount } from "@/lib/controller/payment-notifications-count";
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
  const [cvof, setCVOF] = React.useState("0");
  const [total, setTotal] = React.useState("0");
  const [isce, setISCE] = React.useState("0");
  const [fairflex, setFairflex] = React.useState("0");

  useEffect(() => {
    if (!dateRange?.from) return;

    const startDate = new Date(dateRange.from.setHours(0, 0, 0, 0));
    const endDate = dateRange.to
      ? new Date(dateRange.to.setHours(23, 59, 59, 999))
      : new Date();

    const fetchCustomNotifications = async () => {
      const data: paymentNotificationType = await getPaymentNotificonCount({
        startDate,
        endDate,
      });
      setCVOF(data?.categories?.cvof ?? "N/A");
      setTotal(data?.total ?? "N/A");
      setISCE(data?.categories?.isce ?? "N/A");
      setFairflex(data?.categories?.fareflex ?? "N/A");
      console.log({ data });
    };
    fetchCustomNotifications();
  }, [dateRange]);

  const formattedDateRange = dateRange?.from
    ? dateRange.to
      ? `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`
      : dateRange.from.toDateString()
    : "No date selected";

  return (
    <div className="w-full">
      <p className="font-bold">Number of payment notifications</p>
      <div className="mt-3 flex flex-col md:flex-row gap-3">
        {/* Calendar */}
        <div className="">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border shadow-sm w-full"
            captionLayout="dropdown"
          />
        </div>

        {/* Notification Cards */}
        <Card className="p-5 flex-1">
          <p className="text-sm sm:text-base">{`Number of payment notifications from ${formattedDateRange}`}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mt-5">
            <NotificationCard title="TOTAL" value={total} />
            <NotificationCard title="CVOF" value={cvof} />
            <NotificationCard title="STICKER" value={isce} />
            <NotificationCard title="FAREFLEX" value={fairflex} />
          </div>
        </Card>
      </div>
    </div>
  );
}
