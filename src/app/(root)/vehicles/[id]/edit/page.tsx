import { UpdateVehicleForm } from "@/components/forms/update-vehicle-form";
import { getVehicleById } from "@/lib/controllers/vehicle-controller";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function VehicleInformationPage({
     params,
}: {
     params: { id: string };
}) {
     const vehicle = await getVehicleById(params.id);
     if (!vehicle) {
          notFound();
     }
     return (
          <>
               <div className="mb-8 flex w-full flex-col gap-3 p-2 xs:p-5">
                    <div className="flex items-center justify-between">
                         <h1 className="py-2 text-title1Bold">Edit Vehicle</h1>
                    </div>

                    <UpdateVehicleForm vehicle={vehicle} />
               </div>
          </>
     );
}
