import FormError from "@/components/shared/FormError";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_ROLES, VehicleValues } from "@/lib/consts";
import { cn, getNextPaymentDate } from "@/lib/utils";
import { vehicle_transactions_transaction_category_enum } from "@prisma/client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  FileText,
  History,
  User,
  Wallet,
} from "lucide-react";
import { getWaiverDueToDisablementById } from "@/actions/waiver";
import PaymentHistoryUsingController from "../payment-history-using-controller";
import ExtraRoles from "../extra-roles";
import VehicleWaiverView from "../waiver-view";
import { Separator } from "@/components/ui/separator";
import { RecalculateNetTotalButton } from "@/components/RecalculateNetTotalButton";

export default async function IndivdualStatusLatest({
  vehicle,
  role,
}: {
  vehicle: IVehicle;
  role?: string;
}) {
  if (!vehicle) return <FormError message="Vehicle Not Found" />;
  const disabledWaiver = await getWaiverDueToDisablementById(vehicle?.id);
  const onWaiver = !!disabledWaiver;
  const wallet = vehicle?.wallet;

  const isVehicleClear =
    vehicle.status === "ACTIVE" && Number(wallet.cvof_owing) === 0;
  const CVOFOwing = Number(wallet.cvof_owing);

  const isValidCategory =
    vehicle.category !== vehicle_transactions_transaction_category_enum.OTHERS;
  const hasFareFlex =
    !!vehicle.fairFlexImei && vehicle.fairFlexImei.trim() !== "";
  const hasSticker = !!vehicle.barcode && vehicle.barcode.trim() !== "";
  const isBarcodeValid = !!vehicle.barcode;

  if (onWaiver) {
    return (
      <VehicleWaiverView
        waiverInfo={disabledWaiver}
        owner={vehicle.owner}
        vehicle={vehicle}
      />
    );
  }

  return (
    <>
      {!isValidCategory && (
        <div className="mb-2 flex flex-col items-center justify-center text-center font-bold uppercase text-destructive-foreground">
          <ExclamationTriangleIcon className="h-10 w-10" />
          Update vehicle category to add sticker.
        </div>
      )}
      <Card
        className={`mx-auto min-h-[80svh] w-full max-w-4xl ${
          isVehicleClear ? "bg-emerald-600" : "bg-destructive-foreground"
        } shadow-xl`}
      >
        <CardHeader className="rounded-t-lg bg-primary text-center">
          <div className="rounded-t-lg bg-secondary py-3">
            <CardTitle className="text-lg font-bold">
              <div className="text-sm font-light">VEHICLE OWNER</div>
              <div className="mb-1">{vehicle.owner.name}</div>
              <div className="text-sm font-light">VEHICLE TYPE</div>
              <div className="mb-1">{vehicle.category}</div>
              <div className="font-semibold">NEXT PAYMENT DATE</div>
              <div
                className={`text-lg font-bold uppercase ${
                  isVehicleClear
                    ? "text-emerald-600"
                    : "text-destructive-foreground"
                }`}
              >
                {isValidCategory
                  ? getNextPaymentDate(
                      Number(wallet.cvof_balance),
                      Number(wallet.cvof_owing),
                      vehicle.category as keyof typeof VehicleValues
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Update Vehicle Category "}
              </div>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="mb-4 flex items-center justify-center">
            {isVehicleClear ? (
              <div className="flex flex-col items-center space-x-2 text-white">
                <CheckCircle2 className="h-20 w-20" />
                <div className="text-xl font-medium">Vehicle is clear!</div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-x-2 text-white">
                <AlertTriangle className="h-20 w-20" />
                <div className="text-xl font-medium">
                  You have overdue payment of
                </div>
                <div className="text-3xl font-bold">
                  ₦{CVOFOwing.toLocaleString()}
                </div>
              </div>
            )}
          </div>
          <Tabs className="mb-2 w-full" defaultValue="overview">
            <TabsList
              className={`p-1" grid w-full grid-cols-5 rounded-lg bg-muted`}
            >
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-background"
              >
                <User className="mr-2 h-5 w-5" />
                <span className="hidden md:inline-block">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="data-[state=active]:bg-background"
              >
                <Car className="mr-2 h-5 w-5" />
                <span className="hidden md:inline-block">Vehicles</span>
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="data-[state=active]:bg-background"
              >
                <Wallet className="mr-2 h-5 w-5" />{" "}
                <span className="hidden md:inline-block">Wallet</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-background"
              >
                <FileText className="mr-2 h-5 w-5" />{" "}
                <span className="hidden md:inline-block">Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment-history"
                className="data-[state=active]:bg-background"
              >
                <History className="mr-2 h-4 w-4" />
                <span className="hidden md:inline-block">History</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-2">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoItem label="T CODE" value={vehicle.t_code} />
                <InfoItem
                  className={`${
                    vehicle.asin_number ? "" : "text-destructive-foreground"
                  }`}
                  label="ASIN"
                  value={vehicle.asin_number ?? "NO ASIN NUMBER"}
                />
                <InfoItem label="PLATE NUMBER" value={vehicle.plate_number} />
                <InfoItem
                  label="STICKER"
                  className={hasSticker ? "" : "text-destructive-foreground"}
                  value={hasSticker ? vehicle.barcode : "NO STICKER ADDED"}
                />
                <InfoItem
                  label="FAREFLEX"
                  className={hasFareFlex ? "" : "text-destructive-foreground"}
                  value={
                    hasFareFlex ? vehicle.fairFlexImei : "NO FAREFLEX INSTALLED"
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="vehicle" className="mt-2">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoItem
                  label="Chasis No"
                  value={vehicle.vin ?? "NO CHASIS NUMBER"}
                />
                <InfoItem label="T CODE" value={vehicle.t_code} />
                <InfoItem
                  label="STICKER ID"
                  value={vehicle.barcode ?? "NO STICKER ID"}
                />
                <InfoItem label="CATEGORY" value={vehicle.category} />
              </div>
            </TabsContent>
            <TabsContent value="wallet" className="mt-2">
              <div className="space-y-2">
                <div className="grid gap-2 md:grid-cols-2">
                  <InfoItem
                    label="Vehicle Balance"
                    value={`₦${Number(wallet.cvof_balance).toLocaleString()}`}
                  />
                  <InfoItem
                    label="Vehicle Owing"
                    value={`₦${Number(wallet.cvof_owing).toLocaleString()}`}
                  />
                  <InfoItem
                    label="FareFlex Balance"
                    value={`₦${Number(
                      wallet.fareflex_balance
                    ).toLocaleString()}`}
                  />
                  <InfoItem
                    label="FareFlex Owing"
                    value={`₦${Number(wallet.fareflex_owing).toLocaleString()}`}
                  />
                  <InfoItem
                    label="Device Maintenance"
                    value={`₦${Number(wallet.isce_balance).toLocaleString()}`}
                  />
                </div>
                {role && ADMIN_ROLES.includes(role) && (
                  <InfoItem
                    label="Net Total"
                    value={`₦${Number(wallet.net_total).toLocaleString()}`}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="documents" className="mt-2">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoItem
                  label="Owner Name"
                  value={vehicle.owner.name ?? "NO OWNER NAME"}
                />
                <InfoItem
                  label="Gender"
                  value={vehicle.owner.gender ?? "NO OWNER GENDER"}
                />
                {role && (
                  <>
                    <InfoItem
                      label="Phone"
                      value={vehicle.owner.phone ?? "NO OWNER PHONE"}
                    />
                    <InfoItem
                      label="Marital Status"
                      value={
                        vehicle.owner.marital_status ?? "NO MARITAL STATUS"
                      }
                    />
                    <InfoItem
                      label="Address"
                      value={vehicle.owner.address ?? "NO OWNER ADDRESS"}
                    />
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="payment-history" className="mt-2">
              <div className="space-y-2">
                <div className="mt-2">
                  <PaymentHistoryUsingController vehicleId={vehicle.id} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {role && (
            <ExtraRoles
              showExtra
              isBarcodeValid={isBarcodeValid}
              role={role}
              vehicle={vehicle}
            />
          )}
          <>
            <Separator className="my-5" />
            <div className="grid grid-cols-2 gap-3">
              {/* <UpdateStartDate tCode={vehicle.t_code} /> */}
              <RecalculateNetTotalButton vehicleId={vehicle.id} />
            </div>
          </>
        </CardContent>
      </Card>
    </>
  );
}

export function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-white p-3 shadow", className)}>
      <p className=" uppercase text-sm text-muted-foreground">{label}</p>
      <p className={cn("font-bold", className)}>{value}</p>
    </div>
  );
}
