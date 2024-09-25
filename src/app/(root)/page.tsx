"use client";
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { RevenueCharts } from "@/components/shared/chats/revenue-chart";
import { Separator } from "@/components/ui/separator";
import { DashboardDriverSummary } from "@/components/role/super-admin/dashboard-driver-summary";
import { DashboardVehicleSummary } from "@/components/role/super-admin/dashboard-vehicle-summary";
import { DashboardAgentSummary } from "@/components/role/super-admin/dashboard-agent-summary";
import DashboardCard from "@/components/role/super-admin/dashboard-card";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const sampleVehicle = {
  total: 0,
  active: 0,
  owing: 0,
  cleared: 0,
  onWaivers: 0,
};
const sampleDriver = { total: 0, active: 0, inactive: 0 };
const sampleAgent = { total: 0, active: 0, inactive: 0 };
interface ProtectedPageProps {}

const ProtectedPage: React.FC<ProtectedPageProps> = () => {
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Initial, 2: Second PIN, 3: Access granted
  const formattedData = [
    { name: "12 AM", total: 10497 },
    { name: "1 AM", total: 478 },
    { name: "2 AM", total: 6739 },
    { name: "3 AM", total: 0 },
    { name: "4 AM", total: 9887 },
    { name: "5 AM", total: 0 },
    { name: "6 AM", total: 0 },
    { name: "7 AM", total: 0 },
    { name: "8 AM", total: 0 },
    { name: "9 AM", total: 19898 },
    { name: "10 AM", total: 0 },
    { name: "11 AM", total: 0 },
    { name: "12 PM", total: 0 },
    { name: "1 PM", total: 0 },
    { name: "2 PM", total: 11700 },
    { name: "3 PM", total: 0 },
    { name: "4 PM", total: 0 },
    { name: "5 PM", total: 0 },
    { name: "6 PM", total: 0 },
    { name: "7 PM", total: 0 },
    { name: "8 PM", total: 0 },
    { name: "9 PM", total: 14867 },
    { name: "10 PM", total: 0 },
    { name: "11 PM", total: 0 },
  ];

  return (
    <div className="ml-[208px]">
      <>
        <div className="h-16 w-full shrink-0 bg-secondary/60 backdrop-blur-sm">
          <MaxWidthWrapper className="p-2">
            <div className="flex h-full items-center justify-between">
              <Link href={"/"} className="w-52 shrink-0 px-5">
                <Image
                  src={"/logo.png"}
                  height={30}
                  width={150}
                  className="shrink-0"
                  alt="Transpay Logo"
                />
              </Link>
            </div>
          </MaxWidthWrapper>
        </div>
        <MaxWidthWrapper className="flex min-h-[100svh] w-full flex-col justify-start p-3">
          <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-2">
            <DashboardVehicleSummary info={sampleVehicle} />
            <DashboardAgentSummary info={sampleAgent} />
          </div>
          <Separator className="my-5" />
          <div className="rounded-xl bg-secondary p-2">
            <RevenueCharts data={formattedData} />
          </div>
        </MaxWidthWrapper>
      </>
    </div>
  );
};

export default ProtectedPage;
