import BarcodeAdder from "@/components/layout/barcode-adder";
import DashboardCard from "@/components/layout/dashboard-card";
import FareFlexAdder from "@/components/layout/fareflex-adder";
import NextOfKinAdder from "@/components/layout/nex-of-kin-adder";
import ViewRegistrar from "@/components/layout/view-registar";
import FormError from "@/components/shared/FormError";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleValues } from "@/lib/consts";
import { getVehicleByTCodeOrPlateNumber } from "@/lib/controller/vehicle-controller";
import { getSSession } from "@/lib/get-data";
import { cn, getNextPaymentDate } from "@/lib/utils";
import { vehicle_transactions_transaction_category_enum } from "@prisma/client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  FileText,
  User,
  Wallet,
} from "lucide-react";

export default async function SearchVehicle({ id }: { id: string }) {
  const { role } = await getSSession();
  const vehicle = await getVehicleByTCodeOrPlateNumber(id);

  if (!vehicle) return <FormError message="Vehicle Not Found" />;
  const wallet = vehicle?.wallet;

  const isVehicleClear =
    vehicle.status === "ACTIVE" && Number(wallet.cvof_owing) === 0;
  const CVOFBalance = Number(wallet.cvof_balance);
  const CVOFOwing = Number(wallet.cvof_owing);

  const isValidCategory =
    vehicle.category !== vehicle_transactions_transaction_category_enum.OTHERS;
  const isOwing = false;
  const hasFareFlex =
    !!vehicle.fairFlexImei && vehicle.fairFlexImei.trim() !== "";
  const hasSticker = !!vehicle.barcode && vehicle.barcode.trim() !== "";

  return (
    <>
      {!isValidCategory && (
        <div className="mb-2 flex flex-col items-center justify-center text-center font-bold uppercase text-destructive-foreground">
          <ExclamationTriangleIcon className="h-10 w-10" />
          Update vehicle category to add sticker.
        </div>
      )}
      {/* {role && vehicle.fairFlexImei && vehicle.fairFlexImei !== "" && (
                    <Button
                         className="mx-auto w-full max-w-xl rounded-xl bg-primary-800 text-white"
                         asChild
                         variant={"default"}
                    >
                         <Link
                              href={`/vehicles/${vehicle.plate_number}/location`}
                              className="shrink-0 whitespace-nowrap"
                         >
                              <MapPin className="mr-2 h-4 w-4 shrink-0" />
                              View live location
                         </Link>
                    </Button>
               )} */}
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
                {getNextPaymentDate(
                  Number(wallet.cvof_balance),
                  Number(wallet.cvof_owing),
                  vehicle.category as keyof typeof VehicleValues
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
              className={`p-1" grid w-full ${
                role ? "grid-cols-4" : "grid-cols-3"
              } rounded-lg bg-muted`}
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
              {role && (
                <TabsTrigger
                  value="wallet"
                  className="data-[state=active]:bg-background"
                >
                  <Wallet className="mr-2 h-5 w-5" />{" "}
                  <span className="hidden md:inline-block">Wallet</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-background"
              >
                <FileText className="mr-2 h-5 w-5" />{" "}
                <span className="hidden md:inline-block">Documents</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-2">
              <div className="grid gap-2 md:grid-cols-2">
                <InfoItem label="T CODE" value={vehicle.t_code} />
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
              {/* <div className="mt-3">
                                        <h3 className="mb-2 font-semibold">
                                             Vehicle Image
                                        </h3>
                                        <img
                                             src={vehicle.image}
                                             alt="Vehicle"
                                             className="h-48 w-full rounded-lg object-cover"
                                        />
                                   </div> */}
            </TabsContent>
            {role && (
              <TabsContent value="wallet" className="mt-2">
                <div className="space-y-2">
                  {/* <div>
                                             <h3 className="mb-2 font-semibold">
                                                  Wallet Balance
                                             </h3>
                                             <Progress
                                                  value={
                                                       (CVOFBalance /
                                                            (CVOFBalance +
                                                                 CVOFOwing)) *
                                                       100
                                                  }
                                                  className="h-4"
                                             />
                                             <div className="mt-2 flex justify-between">
                                                  <span>
                                                       ₦
                                                       {CVOFBalance.toLocaleString()}
                                                  </span>
                                                  <span className="text-destructive">
                                                       ₦
                                                       {CVOFOwing.toLocaleString()}{" "}
                                                       owing
                                                  </span>
                                             </div>
                                        </div> */}
                  <div className="grid gap-2 md:grid-cols-2">
                    {/* <InfoItem
                                                  label="Total paid till date"
                                                  value={`₦${Number(wallet.wallet_balance).toLocaleString()}`}
                                             />
                                             <InfoItem
                                                  label="Amount Owed"
                                                  value={`₦${Number(wallet.amount_owed).toLocaleString()}`}
                                             /> */}
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
                      value={`₦${Number(
                        wallet.fareflex_owing
                      ).toLocaleString()}`}
                    />
                    {/* <InfoItem
                                                  label="ISCE Balance"
                                                  value={`₦${Number(wallet.isce_balance).toLocaleString()}`}
                                                  />
                                                  <InfoItem
                                                  label="ISCE Owing"
                                                  value={`₦${Number(wallet.isce_owing).toLocaleString()}`}
                                             /> */}
                  </div>
                  <InfoItem
                    label="Net Total"
                    value={`₦${Number(wallet.net_total).toLocaleString()}`}
                  />
                </div>
              </TabsContent>
            )}
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
          </Tabs>
          {role && (
            <div className="mx-auto w-full max-w-6xl">
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <>
                  {role.toLowerCase() === "superadmin" ||
                    (role.toLowerCase() === "admin" && (
                      <ViewRegistrar
                        id={vehicle.id}
                        name="View Registrar"
                        image={"/registrar.jpg"}
                        description={"Check who onboarded this vehicle"}
                        t_code={vehicle.t_code}
                        plate_number={vehicle.plate_number}
                      />
                    ))}
                  {role?.toLowerCase() !== "green_engine" && (
                    <>
                      <DashboardCard
                        name="Vehicle Information"
                        href={`/vehicles/${vehicle.id}/edit`}
                        image={"/personalinfo.png"}
                        description={"View Vehicle information"}
                      />

                      {vehicle?.barcode === "" || !vehicle?.barcode ? (
                        <div className="">
                          {isValidCategory && (
                            <BarcodeAdder
                              id={vehicle.id}
                              name="Add Sticker"
                              image={"/payment.png"}
                              description={"Scan to add sticker to vehicle"}
                              t_code={vehicle.t_code}
                            />
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  {role?.toLowerCase() === "green_engine" ? (
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
                  {/* {role?.toLowerCase() !== "agent" && (
                                        <>
                                             <DashboardCard
                                                  name="Payment"
                                                  href={`/vehicles/${vehicle.id}/payments`}
                                                  image={"/payment.png"}
                                                  description={
                                                       "Make Payment & Check Payment History"
                                                  }
                                             />

                                             <DashboardCard
										name='Fines & Penalties'
										href={`/vehicles/${vehicle.id}/fines`}
										image={'/fineandpenal.png'}
										description='Fine Driver & Check Fine Payment'
									/>
                                        </>
                                   )} */}
                </>
              </div>
              <div className="flex flex-col gap-5">
                {role?.toLowerCase() !== "agent" && (
                  <>
                    {/* <div className='flex flex-col gap-2'>
									<div className='flex justify-between py-2'>
										<div className='shrink-0 grow-0 text-title1Bold'>
											Fine History
										</div>
										<div className='shrink-0 grow-0 text-title1Bold'>
											<Button
												asChild
												variant='link'
											>
												<Link
													href={`/vehicles/${vehicle.id}/fines`}
												>
													See all
												</Link>
											</Button>
										</div>
									</div>
									<div className=''>
										<DataTable
											columns={
												viewDriversColumns
											}
											data={VIEW_DRIVER_TABLE.slice(
												0,
												3
											)}
										/>
									</div>
								</div> */}
                    {/* <div className='flex flex-col gap-2 '>
									<div className='flex justify-between py-2'>
										<div className='shrink-0 grow-0 text-title1Bold'>
											Payment History
										</div>
										<div className='shrink-0 grow-0 text-title1Bold'>
											<Button
												asChild
												variant='link'
											>
												<Link
													href={`/vehicles/${vehicle.id}/payments`}
												>
													See all
												</Link>
											</Button>
										</div>
									</div>
									<div className=''>
										<DataTable
											columns={debtColumns}
											data={vehicle.VehicleTransactions.slice(
												0,
												3
											)}
										/>
									</div>
								</div> */}
                  </>
                )}

                {/* <div className='flex flex-col gap-2 mb-20'>
							{vehicle.Drivers && (
								<>
									<div className='flex justify-between py-2'>
										<div className='shrink-0 grow-0 text-title1Bold'>
											Drivers
										</div>
										<div className='shrink-0 grow-0 text-title1Bold'>
											<Button
												asChild
												variant='link'
											>
												<Link
													href={`/vehicles/${vehicle.id}/drivers`}
												>
													See all
												</Link>
											</Button>
										</div>
									</div>
									<div className=''>
										<DataTable
											columns={driversColumns}
											data={vehicle.Drivers.slice(
												0,
												3
											)}
										/>
									</div>
								</>
							)}
						</div> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function InfoItem({
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
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("font-bold", className)}>{value}</p>
    </div>
  );
}
