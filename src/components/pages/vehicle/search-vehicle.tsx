import BusinessStatusLatest from "./status-display/business-status-latest";
import IndivdualStatusLatest from "./status-display/individual-status-latest";
import VehicleNotFound from "@/components/error/vehicle-not-found";
import { getSSession } from "@/lib/get-data";
import { Suspense } from "react";
import BusinessStatusSkeleton from "./status-display/business-status-skeleton";
import { getVehicleByTCodeOrPlateNumber } from "@/lib/controller/vehicle-controller";

export default async function SearchVehicle({ id }: { id: string }) {
  const vehicle = await getVehicleByTCodeOrPlateNumber(id);
  if (!vehicle) {
    return <VehicleNotFound />;
  }
  const { role } = await getSSession();
  const isCompany = !!vehicle?.company?.id;
  return (
    <div className="">
      {isCompany ? (
        <BusinessStatusLatest role={role} vehicle={vehicle} />
      ) : (
        <Suspense fallback={<BusinessStatusSkeleton />}>
          <IndivdualStatusLatest role={role} vehicle={vehicle} />
        </Suspense>
      )}
    </div>
  );
}
