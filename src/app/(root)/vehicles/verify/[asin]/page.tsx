import { verifyVehicleByAsin } from "@/lib/controller/vehicle-controller";
import React from "react";

export default async function SearchPage({
  params,
}: {
  params: { asin: string };
}) {
  // const { role } = await getSSession();
  const vehicle = await verifyVehicleByAsin(params.asin);
  return <pre className="w-full">{JSON.stringify(vehicle, null, 5)}</pre>;
}
