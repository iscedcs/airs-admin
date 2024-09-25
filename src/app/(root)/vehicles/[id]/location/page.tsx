import { getAllTrackerLocation } from "@/lib/controllers/tracker.controller";
import { getVehicleById } from "@/lib/controllers/vehicle-controller";
import { notFound } from "next/navigation";
import MapView from "./map-view";

export default async function LocationPage({
     params,
}: {
     params: { id: string };
}) {
     const vehicle = await getVehicleById(params.id);
     const trackerLocation = await getAllTrackerLocation([
          vehicle?.fairFlexImei ?? "",
     ]);

     console.log({ trackerLocation });

     if (!vehicle) return notFound();
     return (
          <div className="flex flex-col">
               <MapView tracker={trackerLocation[0]} vehicle={vehicle} />
          </div>
     );
}
