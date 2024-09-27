import DashboardCard from "@/components/layout/dashboard-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  driversColumns,
  paymentColumns,
  viewDriversColumns,
} from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { VIEW_DRIVER_TABLE } from "@/lib/consts";
import { getVehicleById } from "@/lib/controller/vehicle-controller";
import { cn } from "@/lib/utils";
import { MapPin, PenLine, Trash } from "lucide-react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ViewVehicleDetails({ id }: { id: string }) {
  const vehicle = await getVehicleById(id);
  const session = await getSession();
  const role = session?.user.role;
  if (!vehicle) return notFound();
  return (
    <>
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-5 shadow-lg">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <Image
              alt="Vehicle"
              className="mb-6 h-full w-full object-cover object-center lg:mb-0"
              src={vehicle.image ?? "/tricycle.jpg"}
              height={400}
              width={400}
            />
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
              <CardDescription>
                Check your vehicle&apos;s status and payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="h-4 border-l border-gray-200" />
                {vehicle.wallet && (
                  <div className="text-sm font-medium">
                    Next payment date: {vehicle.wallet.next_transaction_date}
                  </div>
                )}
              </div>
              <div>
                <h1 className="mt-[20px] text-[23px] font-bold">
                  Vehicle Information
                </h1>
                <div className="my-4 grid grid-cols-2 gap-4 border-t border-gray-200 py-4">
                  <p className="mb-4 text-gray-700">
                    Plate Number: {vehicle.plate_number}
                  </p>
                  <p className="mb-4 text-gray-700">Color: {vehicle.color}</p>
                  <p className="mb-4 text-gray-700">
                    Category: {vehicle.category}
                  </p>
                  <p className="mb-4 text-gray-700">Status: {vehicle.status}</p>
                  <p className="mb-4 text-gray-700">
                    Chasis Number: {vehicle.vin}
                  </p>
                  <p className="mb-4 text-gray-700">
                    FareFlex ID:{" "}
                    {vehicle.tracker?.terminal_id ?? "No FareFlex Installed"}
                  </p>
                </div>
              </div>
              {/* {vehicle.wallet && (
                                        <div className="my-4 grid grid-cols-3 gap-4 border-y border-gray-200 py-4">
                                             <div>
                                                  <div className="text-sm font-medium">
                                                       Amount owed
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       ₦
                                                       {
                                                            vehicle.wallet
                                                                 .amount_owed
                                                       }
                                                  </div>
                                             </div>
                                             <div className="flex flex-col items-center">
                                                  <div className="text-sm font-medium">
                                                       Net total
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       ₦
                                                       {
                                                            vehicle.wallet
                                                                 .net_total
                                                       }
                                                  </div>
                                             </div>
                                             <div className="flex flex-col items-end">
                                                  <div className="text-sm font-medium">
                                                       Wallet balance
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       ₦
                                                       {
                                                            vehicle.wallet
                                                                 .wallet_balance
                                                       }
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                                   {vehicle.wallet && (
                                        <div className="">
                                             <div>
                                                  <div className="text-sm font-medium">
                                                       Account Name
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       {
                                                            vehicle.wallet.meta
                                                                 .account_name
                                                       }
                                                  </div>
                                             </div>
                                             <div>
                                                  <div className="text-sm font-medium">
                                                       Account Number
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       {
                                                            vehicle.wallet.meta
                                                                 .nuban
                                                       }
                                                  </div>
                                             </div>
                                             <div>
                                                  <div className="text-sm font-medium">
                                                       Bank Name
                                                  </div>
                                                  <div className="text-xl font-semibold">
                                                       {
                                                            vehicle.wallet.meta
                                                                 .bank_name
                                                       }
                                                  </div>
                                             </div>
                                        </div>
                                   )} */}
            </CardContent>
          </Card>
        </div>
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="">
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-4 grid grid-cols-2 gap-4 border-t border-gray-200 py-4">
                <p className="mb-4 text-gray-700">Name: {vehicle.owner.name}</p>
                <p className="mb-4 text-gray-700">
                  Email: {vehicle.owner.email}
                </p>
                <p className="mb-4 text-gray-700">
                  Phone: {vehicle.owner.phone}
                </p>
                <p className="mb-4 text-gray-700">Gender: MALE</p>
                <p className="mb-4 text-gray-700">
                  Address: {vehicle.owner.address}
                </p>
                <p className="mb-4 text-gray-700">
                  Marital Status: {vehicle.owner.marital_status}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-6 py-6">
        {/* <div className='flex items-center justify-between'>
					<div className='text-title1Bold'>
						Vehicle Owner: Mr. {vehicle.owner.name}
					</div>
					<div className='flex gap-2 items-center justify-center'>
						{vehicle.tracker && vehicle.tracker.terminal_id !== '' && (
							<Button
								className='justify-start  text-white rounded-xl bg-primary-800'
								asChild
								variant={'default'}
							>
								<Link
									href={`/vehicles/${id}/location`}
									className='shrink-0 whitespace-nowrap'
								>
									<MapPin className='mr-2 h-4 w-4 shrink-0' />
									View live location
								</Link>
							</Button>
						)}
						<Link
							href={`/vehicles/${id}/new-driver`}
							className={cn(buttonVariants())}
						>
							Add Driver
						</Link>
					</div>
				</div> */}
        {/* <Card className=' max-w-lg'> */}
        {/* <CardHeader className='border-b text-awesome-foreground text-xl py-1'>
					<div className='grid grid-cols-2'>
						<div className=''>Wallet Balance:</div>
						<div className='text-end'>
							₦{vehicle.wallet.wallet_balance}
						</div>
					</div>
				</CardHeader> */}
        {/* <CardContent className='grid gap-1 py-2 text-lg'> */}
        {/* <div className='grid grid-cols-2'>
						<div className=''>Total Levy Paid:</div>
						<div className='text-end'>
							₦{vehicle.wallet.net_total}
						</div>
					</div> */}
        {/* <div
						className={`grid grid-cols-2 	`}
						// ${isOwing ? 'text-red-500' : ''}
					>
						<div className=''>Next Payment Date:</div>
						<div className='text-end'>
							{format(
								new Date(
									vehicle.wallet.next_transaction_date
								),
								'MMMM d, yyyy'
							)}
						</div>
					</div> */}
        {/* <div className='grid grid-cols-2 text-destructive-foreground'>
						<div className=''>Total Levy Owed:</div> */}
        {/* <div className='text-end'>
							₦
							{vehicle.VehicleBalance.deficit_balance.toFixed(
								2
							)}
						</div> */}
      </div>
      {/* </CardContent> */}
      {/* </Card> */}
      {/* <div className='text-[10px] uppercase text-red-500'>
				** Maintenance is still ongoing and all previous debts
				accrued by customers will be updated before morning
			</div> */}
      <div className="w-full">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {role && (
            <>
              <DashboardCard
                name="Vehicle Information"
                href={`${id}/edit`}
                image={"/personalinfo.png"}
                description={"View Vehicle information"}
              />

              <DashboardCard
                name="Drivers"
                href={`${id}/drivers`}
                image={"/fineandpenal.png"}
                description="Fine Driver & Check Fine Payment"
              />
              {role?.toLowerCase() !== "agent" && (
                <>
                  <DashboardCard
                    name="Payment"
                    href={`${id}/payments`}
                    image={"/payment.png"}
                    description={"Make Payment & Check Payment History"}
                  />

                  <DashboardCard
                    name="Fines & Penalties"
                    href={`${id}/fines`}
                    image={"/fineandpenal.png"}
                    description="Fine Driver & Check Fine Payment"
                  />
                </>
              )}
              <DashboardCard
                name="Waiver Form"
                href={`${id}/waiver`}
                image={"/fineandpenal.png"}
                description="Fill waiver form to process driver grace period"
              />
            </>
          )}
        </div>
        {role && (
          <div className="flex flex-col gap-5">
            {role?.toLowerCase() !== "agent" && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-2">
                    <div className="shrink-0 grow-0 text-title1Bold">
                      Fine History
                    </div>
                    <div className="shrink-0 grow-0 text-title1Bold">
                      <Button asChild variant="link">
                        <Link href={`/vehicles/${id}/fines`}>See all</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="">
                    <DataTable
                      columns={viewDriversColumns}
                      data={VIEW_DRIVER_TABLE.slice(0, 3)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-2">
                    <div className="shrink-0 grow-0 text-title1Bold">
                      Payment History
                    </div>
                    <div className="shrink-0 grow-0 text-title1Bold">
                      <Button asChild variant="link">
                        <Link href={`/vehicles/${id}/payments`}>See all</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="">
                    <DataTable columns={paymentColumns} data={[]} />
                  </div>
                </div>
              </>
            )}

            <div className="mb-20 flex flex-col gap-2">
              <div className="flex justify-between py-2">
                <div className="shrink-0 grow-0 text-title1Bold">Drivers</div>
                <div className="shrink-0 grow-0 text-title1Bold">
                  <Button asChild variant="link">
                    <Link href={`/vehicles/${id}/drivers`}>See all</Link>
                  </Button>
                </div>
              </div>
              <div className="">
                <DataTable
                  columns={driversColumns}
                  // data={vehicle.Drivers?.slice(0, 3)}
                  data={[]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* </div> */}
    </>
  );
}
