import BarcodeAdder from "@/components/layout/barcode-adder";
import DashboardCard from "@/components/layout/dashboard-card";
import FareFlexAdder from "@/components/layout/fareflex-adder";
import NextOfKinAdder from "@/components/layout/nex-of-kin-adder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVehicleByTCodeOrPlateNumber } from "@/lib/controller/vehicle-controller";
import { getVehicleWaiver } from "@/lib/controller/waiver.controller";
import { getSSession } from "@/lib/get-data";
import { failureIcon, successIcon } from "@/lib/icons";
import { addDays, format } from "date-fns";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SearchVehicle({ id }: { id: string }) {
     const { role } = await getSSession();
     const vehicle = await getVehicleByTCodeOrPlateNumber(id);
     const waivers = await getVehicleWaiver(id);
     const onWaiver = false;
     if (!vehicle) {
          notFound();
     }

     const isOwing = false;
     const hasFareFlex = !!vehicle.fairFlexImei;
     const hasSticker = !vehicle.barcode || vehicle.barcode.trim() !== "";
     // const dateSupplied = new Date(vehicle.wallet.next_transaction_date);
     // dateSupplied.setUTCHours(dateSupplied.getUTCHours() + 2);

     // Access only the date portion and format as desired
     // const formattedDate = format(dateSupplied, "yyyy-MM-dd");

     // const fee =
     //      vehicle.category.toLowerCase() === "tricycle"
     //           ? "200"
     //           : vehicle.category === "SHUTTLE_BUS"
     //             ? "250"
     //             : "300";

     // const daysOwed = generateDaysOwedArray(dateSupplied, fee);
     // daysOwed.sort(
     // 	(a, b) =>
     // 		new Date(b.transaction_date).getTime() -
     // 		new Date(a.transaction_date).getTime()
     // );
     // const totalPendingAmount = daysOwed.reduce(
     // 	(a, b) => a + parseFloat(b.amount),
     // 	0
     // );
     return (
          <div className="flex h-full w-full flex-col gap-6">
               <div className="flex w-full flex-col justify-between gap-1 text-center">
                    {role && (
                         <div className="text-sm">
                              <div className="uppercase">{`Vehicle Owner`}</div>
                              <div className="text-xl font-bold">
                                   {vehicle.owner.name}
                              </div>
                         </div>
                    )}
                    {vehicle.t_code && (
                         <div className="text-sm">
                              <div className="uppercase">{`T CODE`}</div>
                              <div className="text-xl font-bold">
                                   {vehicle.t_code}
                              </div>
                         </div>
                    )}
                    <div className="text-sm uppercase">
                         <div className="">Plate number</div>
                         <div className="text-xl font-bold">
                              {vehicle.plate_number}
                         </div>
                    </div>
                    <div className="text-sm uppercase">
                         <div className="">Sticker ID</div>
                         <div className="text-xl font-bold">
                              {vehicle.barcode &&
                              vehicle.barcode.trim() !== "" ? (
                                   vehicle.barcode
                              ) : (
                                   <span className="text-destructive-foreground">
                                        No sticker attached
                                   </span>
                              )}
                         </div>
                    </div>
                    <div className="text-sm uppercase">
                         <div className="">FareFlex ID</div>
                         <div className="text-xl font-bold">
                              {vehicle.fairFlexImei &&
                              vehicle.fairFlexImei.trim() !== "" ? (
                                   vehicle.fairFlexImei
                              ) : (
                                   <span className="text-destructive-foreground">
                                        No Device Installed
                                   </span>
                              )}
                         </div>
                    </div>
                    <div
                         className={`text-sm uppercase ${
                              isOwing
                                   ? "text-red-500"
                                   : "text-awesome-foreground"
                         }`}
                    >
                         <div className="">Next Payment Date</div>
                         <div className="text-xl font-bold">
                              {format(addDays(new Date(), 2), "MMMM d, yyyy")}
                         </div>
                    </div>
                    {/* {vehicle.wallet.wallet_balance && (
                         <div className="text-sm uppercase">
                              <div className="">Total Payment</div>
                              <div className="text-xl font-bold text-awesome-foreground">
                                   ₦{vehicle.wallet.net_total}
                              </div>
                         </div>
                    )} */}
                    {/* {vehicle.wallet.wallet_balance && (
                         <div className="text-sm uppercase">
                              <div className="">Wallet Balance</div>
                              <div className="text-xl font-bold text-awesome-foreground">
                                   ₦{vehicle.wallet.wallet_balance}
                              </div>
                         </div>
                    )} */}

                    {role &&
                         vehicle.fairFlexImei &&
                         vehicle.fairFlexImei !== "" && (
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
                         )}
               </div>
               <Tabs
                    defaultValue="overview"
                    className="mx-auto w-full max-w-xl"
               >
                    <TabsList
                         className={`grid ${
                              isOwing ? "grid-cols-2" : "grid-cols-1"
                         }`}
                    >
                         <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
                         {isOwing && (
                              <TabsTrigger value="days-owed">
                                   DAYS OWED
                              </TabsTrigger>
                         )}
                    </TabsList>
                    <TabsContent value="overview">
                         {/* <Card className="grid w-full gap-2 bg-secondary p-3 text-xs lg:text-base">
                              <div className="pb-3 text-center font-bold uppercase">
                                   Payment Details
                              </div>
                              <div className="">
                                   <div className="flex items-center justify-between gap-5">
                                        <div className="">Bank Name</div>
                                        {vehicle.wallet.meta.bank_name}
                                   </div>
                                   <div className="flex items-center justify-between gap-5">
                                        <div className="">Account Name</div>
                                        {vehicle.wallet.meta.account_name}
                                   </div>
                                   <div className="flex items-center justify-between gap-5">
                                        <div className="">Account Number</div>
                                        {vehicle.wallet.meta.nuban}
                                   </div>
                              </div>
                              <CopyButton
                                   label="Copy Account Details"
                                   text={`${vehicle.wallet.meta.bank_name} ${vehicle.wallet.meta.nuban} ${vehicle.wallet.meta.account_name}`}
                              />
                         </Card> */}
                         <div className="w-full">
                              {onWaiver ? (
                                   <div className="mb-20 flex w-full flex-col items-center gap-2 p-3">
                                        <div className="text-green-500">
                                             {successIcon}
                                        </div>
                                        <div className="flex py-2">
                                             <div className="shrink-0 grow-0 text-title1Bold">
                                                  Vehicle is on Waiver!
                                             </div>
                                        </div>
                                        <Button asChild>
                                             <Link
                                                  href={"waiver/history"}
                                                  className="uppercase"
                                             >
                                                  View Waiver History
                                             </Link>
                                        </Button>
                                   </div>
                              ) : isOwing ? (
                                   <>
                                        <div className="flex w-full flex-col items-center gap-2 p-3">
                                             <div className="text-red-500">
                                                  {failureIcon}
                                             </div>
                                             <div className="flex flex-col items-center py-2">
                                                  <div className="shrink-0 grow-0 text-title1Bold">
                                                       Vehicle is Owing!
                                                  </div>
                                                  <div className="text-4xl font-bold text-destructive-foreground">
                                                       {/* {`₦${
												totalPendingAmount +
												daysOwed.length * 20
											}`} */}
                                                       {`₦,5000`}
                                                  </div>
                                             </div>
                                        </div>
                                   </>
                              ) : (
                                   <div className="mb-20 flex w-full flex-col items-center gap-2 p-3">
                                        <div className="text-green-500">
                                             {successIcon}
                                        </div>
                                        <div className="flex py-2">
                                             <div className="shrink-0 grow-0 text-title1Bold">
                                                  Vehicle is clear!
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </TabsContent>
                    {/* {isOwing && (
					<TabsContent value='days-owed'>
						<div className='w-full grid'>
							<DataTable
								showPagination
								columns={debtColumns}
								data={daysOwed}
							/>
						</div>
					</TabsContent>
				)} */}
               </Tabs>
               {role && (
                    <div className="mx-auto w-full max-w-6xl">
                         <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              <>
                                   {role?.toLowerCase() !== "green_engine" && (
                                        <>
                                             <DashboardCard
                                                  name="Vehicle Information"
                                                  href={`/vehicles/${vehicle.id}/edit`}
                                                  image={"/personalinfo.png"}
                                                  description={
                                                       "View Vehicle information"
                                                  }
                                             />

                                             {vehicle?.barcode === "" ||
                                             !vehicle?.barcode ? (
                                                  <BarcodeAdder
                                                       id={vehicle.id}
                                                       name="Add Sticker"
                                                       image={"/payment.png"}
                                                       description={
                                                            "Scan to add sticker to vehicle"
                                                       }
                                                       t_code={vehicle.t_code}
                                                  />
                                             ) : (
                                                  <></>
                                             )}
                                        </>
                                   )}
                                   {role?.toLowerCase() === "green_engine" ? (
                                        vehicle?.fairFlexImei === "" ||
                                        !vehicle?.fairFlexImei ? (
                                             <>
                                                  <FareFlexAdder
                                                       id={vehicle.id}
                                                       name="Add Fare Flex Device"
                                                       image={"/fareflex.png"}
                                                       description={
                                                            "Add fareflex imei to vehicle"
                                                       }
                                                  />
                                                  <NextOfKinAdder
                                                       vehicle={vehicle}
                                                       name="Update Vehicle Info"
                                                       image={"/tricycle.jpg"}
                                                       description={
                                                            "Fareflex installation details"
                                                       }
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
          </div>
     );
}
