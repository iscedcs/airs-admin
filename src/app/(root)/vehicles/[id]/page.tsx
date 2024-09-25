import ViewVehicleDetails from "@/components/pages/vehicle/view-vehicle-details";
import { getVehicleById } from "@/lib/controllers/vehicle-controller";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
     const vehicle = await getVehicleById(params.id);
     if (!vehicle) return notFound();
     return {
          title: `${vehicle?.owner.name} - ${vehicle?.category || "TRICYCLE"}`,
     };
}
export default async function VehiclePage({
     params,
}: {
     params: { id: string };
}) {
     return (
          <div className="w-full">
               <ViewVehicleDetails id={params.id} />
          </div>
     );
}
