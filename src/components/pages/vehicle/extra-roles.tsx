import { RecalculateNetTotalButton } from "@/components/RecalculateNetTotalButton";
// import { UpdateStartDate } from "@/components/UpdateStartDate";
import BarcodeAdder from "@/components/layout/barcode-adder";
import BarcodeReplacer from "@/components/layout/barcode-replacer";
import DashboardCard from "@/components/layout/dashboard-card";
import FareFlexAdder from "@/components/layout/fareflex-adder";
import NextOfKinAdder from "@/components/layout/nex-of-kin-adder";
import ViewRegistrar from "@/components/layout/view-registar";
import { Separator } from "@/components/ui/separator";
import { ADMIN_ROLES } from "@/lib/consts";
import { $Enums, users_role_enum } from "@prisma/client";

export default function ExtraRoles({
  role,
  vehicle,
  isBarcodeValid,
  showExtra,
}: {
  role: string;
  vehicle: IVehicle;
  isBarcodeValid: boolean;
  showExtra?: boolean;
}) {
  const wallet = vehicle?.wallet;
  return (
    <>
      <div className="mx-auto w-full max-w-6xl ">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <>
            {ADMIN_ROLES.includes(role) && (
              <ViewRegistrar
                id={vehicle.id}
                name="View Registrar"
                image={"/registrar.jpg"}
                description={"Check who onboarded this vehicle"}
                t_code={vehicle.t_code}
                plate_number={vehicle.plate_number}
              />
            )}
            {role !== $Enums.users_role_enum.GREEN_ENGINE &&
              role !== $Enums.users_role_enum.GREEN_ENGINE_AGENT && (
                <>
                  <DashboardCard
                    name="Vehicle Information"
                    href={`/vehicles/${vehicle.id}/edit`}
                    image={"/personalinfo.png"}
                    description={"View Vehicle information"}
                  />

                  {/* {!isBarcodeValid ? (
                    <BarcodeAdder
                      id={vehicle.id}
                      name="Add Sticker"
                      image={"/qrcode.png"}
                      description={"Scan to add sticker to vehicle"}
                      t_code={vehicle.t_code}
                      wallet={wallet}
                    />
                  ) : (
                    <BarcodeReplacer
                      id={vehicle.id}
                      name="Replace Sticker"
                      image={"/qrcode.png"}
                      description={"Replace sticker on vehicle"}
                      t_code={vehicle.t_code}
                      wallet={wallet}
                    />
                  )} */}
                </>
              )}
            {role.toLowerCase() === "superadmin" || 
            role?.toLowerCase() === "green_engine" ? (
              vehicle?.fairFlexImei === "" || !vehicle?.fairFlexImei ? (
                <>
                  <FareFlexAdder
                    id={vehicle.id}
                    name="Add Fare Flex Device"
                    image={"/fareflex.png"}
                    description={"Add fareflex imei to vehicle"}
                  />
                  <NextOfKinAdder
                    vehicle={vehicle}
                    name="Update Vehicle Info"
                    image={"/tricycle.jpg"}
                    description={"Fareflex installation details"}
                  />
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </>
        </div>
      </div>
      {showExtra && ADMIN_ROLES.includes(role as users_role_enum[number]) && (
        <>
          <Separator className="my-5" />
          <div className="grid grid-cols-2 gap-3">
            {/* <UpdateStartDate tCode={vehicle.t_code} /> */}
            <RecalculateNetTotalButton vehicleId={vehicle.id} />
          </div>
        </>
      )}
    </>
  );
}
