import { options } from "@/app/api/auth/options";
import { AdminVehicleUpdateForm } from "@/components/forms/admin-vehicle-update-form";
import VehicleCategoryUpdater from "@/components/forms/update-category-form";
import { UpdateVehicleForm } from "@/components/forms/update-vehicle-form";
import FormError from "@/components/shared/FormError";
import { ADMIN_ROLES } from "@/lib/consts";
import { getVehicleById } from "@/lib/controller/vehicle-controller";
import { users_role_enum } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function VehicleInformationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(options);
  if (!session?.user.id) {
    redirect("/signin");
  }
  const vehicle = await getVehicleById(params.id);
  if (!vehicle) {
    return <FormError message="Vehicle Not Found" />;
  }

  const isAdmin = ADMIN_ROLES.includes(
    session.user.role as users_role_enum[number]
  );
  const shouldShowCategoryUpdater =
    isAdmin || vehicle.category.toUpperCase() === "OTHERS";
  return (
    <div className="mb-8 flex w-full flex-col gap-3 p-2 xs:p-5">
      <div className="flex items-center justify-between">
        <h1 className="py-2 text-title1Bold">Edit Vehicle</h1>
      </div>
      {shouldShowCategoryUpdater && (
        <VehicleCategoryUpdater
          vehicleId={vehicle.id}
          currentCategory={vehicle.category}
          noBalanceUpdate={false}
        />
      )}
      {isAdmin ? (
        <AdminVehicleUpdateForm vehicle={vehicle} />
      ) : (
        <UpdateVehicleForm vehicle={vehicle} />
      )}
    </div>
  );
}
