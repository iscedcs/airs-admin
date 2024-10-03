"use client";

import Receipt from "@/components/shared/receipt/vehicle-transaction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { WAIVER_STATUS } from "@/lib/consts";
import { deleteIcon, editIcon, paymentIcon, printIcon } from "@/lib/icons";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  EyeIcon,
  MapPinIcon,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import Cbadge from "../category-badge";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "../dialog";
import Pill from "../pill";
import { DataTableColumnHeader } from "./data-column-table-header";
import { UpdateBitsForm } from "@/components/forms/update-bits-form";
import { UpdateSettingsForm } from "@/components/forms/update-settings-form";
import DeleteWaiverButton from "@/components/shared/delete-buttons/delete-waiver-button";
import UpdateWaiverButton from "@/components/role/rider/update-waiver-button";

export const debtColumns: ColumnDef<IVehiclePayment>[] = [
  {
    accessorKey: " ",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div>{format(new Date(payment.transaction_date), "MMM, dd yyyy")}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-right font-medium">₦{amount}</div>;
    },
  },
  {
    accessorKey: "transaction_type",
    header: () => <div className="text-right">Transaction Type</div>,
    cell: ({ row }) => {
      const tt = row.original.transaction_type;
      return <div className="text-right font-medium">{tt}</div>;
    },
  },
];
export const paymentColumns: ColumnDef<IVehiclePayment>[] = [
  {
    accessorKey: "transaction_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const payment = row.original;
      return formatDate(payment.transaction_date);
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "amount",
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="font-medium">₦{amount}</div>;
    },
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.payment_status;
      const style =
        status === "failed"
          ? "text-destructive-foreground"
          : status === "success"
          ? "text-awesome-foreground"
          : status === "processing"
          ? "text-orange-300"
          : "text-primary";
      return <div className={`uppercase ${style}`}>{status}</div>;
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="uppercase">{row.original.payment_type}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.vehicle_transaction_id)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger className="px-2 text-sm">
                  View receipt
                </DialogTrigger>
                <DialogContent>
                  <Receipt receipt={payment} />
                  <DialogFooter className="grid grid-cols-2 gap-3">
                    <Button>Print</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const adminsColumns: ColumnDef<IUserExtended>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/admins/${row.original.id}`} className="">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.original.phone}</div>,
  },
  {
    accessorKey: "blacklisted",
    header: "Status",
    cell: ({ row }) => {
      if (row.getValue("blacklisted") === true)
        return <Pill status={"inactive"} text={"inactive"} />;
      else return <Pill status={"active"} text={"active"} />;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-start items-center">
          <Link
            href={`/admins/${row.original.id}`}
            className="h-5 w-5 items-center shrink-0"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
        </div>
      );
    },
  },
];
export const agentsColumns: ColumnDef<IUserExtended>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/agents/${row.original.id}`} className="">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.original.phone}</div>,
  },
  {
    accessorKey: "blacklisted",
    header: "Status",
    cell: ({ row }) => {
      if (row.getValue("blacklisted") === true)
        return <Pill status={"inactive"} text={"inactive"} />;
      else return <Pill status={"active"} text={"active"} />;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-start items-center">
          <Link
            href={`/agents/${row.original.id}`}
            className="h-5 w-5 items-center shrink-0"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
          {/* <DeleteAgentButton id={row.original.id} /> */}
        </div>
      );
    },
  },
];

export const vehiclesColumns: ColumnDef<IVehicle>[] = [
  {
    accessorKey: "Drivers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <Link href={`/vehicles/${row.original.id}`} className="">
        {row.original.owner.name}
      </Link>
    ),
  },
  {
    accessorKey: "plate_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate Number" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.original.plate_number}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="uppercase">{row.original.status}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div className="uppercase">{row.original.category}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-black" align="end">
            <DropdownMenuItem
              className="border-b border-black rounded-none"
              asChild
            >
              <Link href={`/vehicles/${vehicle.id}`}>
                <span className="h-4 w-4 mr-3">{editIcon}</span>
                View Vehicle
              </Link>
            </DropdownMenuItem>
            {vehicle.tracker && vehicle.tracker.terminal_id && (
              <DropdownMenuItem
                className="border-b border-black rounded-none"
                asChild
              >
                <Link href={`/vehicles/${vehicle.id}/location`}>
                  <MapPinIcon className="h-4 w-4 mr-3" />
                  View Location
                </Link>
              </DropdownMenuItem>
            )}
            {/* <DropdownMenuItem
							className='border-b border-black rounded-none'
							asChild
						>
							<Link
								href={`/vehicles/${vehicle.vehicle_id}/payments`}
							>
								<span className='h-4 w-4 mr-3'>
									{paymentIcon}
								</span>
								View Payment
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className='border-b border-black rounded-none'
							asChild
						>
							<Link
								href={`/vehicles/${vehicle.vehicle_id}/fines`}
							>
								<span className='h-4 w-4 mr-3'>
									{finesIcon}
								</span>
								View Fines
							</Link>
						</DropdownMenuItem> */}
            <DropdownMenuItem className="text-destructive">
              Delete Vehicle
            </DropdownMenuItem>
            {/* <DropdownMenuItem
							className=''
							onClick={() =>
								navigator.clipboard.writeText(
									vehicle.id
								)
							}
						>
							Copy vehicle ID
						</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const propertiesColumns: ColumnDef<IProperty>[] = [
  {
    accessorKey: "propertyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property ID" />
    ),
    cell: ({ row }) => (
      <Link href={`/property/${row.original.propertyId}`} className="">
        {row.original.propertyId}
      </Link>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.original.ownerName}</div>
    ),
  },
  // {
  // 	accessorKey: 'isPaid',
  // 	header: ({ column }) => (
  // 		<DataTableColumnHeader
  // 			column={column}
  // 			title='Status'
  // 		/>
  // 	),
  // 	cell: ({ row }) => (
  // 		<div className='uppercase'>{row.original.isPaid.valueOf()}</div>
  // 	),
  // },
  {
    accessorKey: "paymentDueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.original.paymentDueDate}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-black" align="end">
            <DropdownMenuItem
              className="border-b border-black rounded-none"
              asChild
            >
              <Link href={`/property/${property.propertyId}`}>
                <span className="h-4 w-4 mr-3">{editIcon}</span>
                View Vehicle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="border-b border-black rounded-none"
              asChild
            >
              <Link href={`/property/${property.propertyId}/location`}>
                <MapPinIcon className="h-4 w-4 mr-3" />
                View Location
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Property
            </DropdownMenuItem>
            <DropdownMenuItem
              className=""
              onClick={() => navigator.clipboard.writeText(property.propertyId)}
            >
              Copy Property ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const propertyPaymentColumns: ColumnDef<IPropertyPaymentRecord>[] = [
  {
    accessorKey: "amountPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Paid" />
    ),
    cell: ({ row }) => <div className="">{row.original.amountPaid}</div>,
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Paid" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.original.paymentDate}</div>
    ),
  },
];
export const agentPaymentColumns: ColumnDef<AgentPayment>[] = [
  {
    accessorKey: "driver",
    header: "Driver",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount");
      return <div className="text-right font-medium">{`₦${amount}`}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const style =
        status === "failed"
          ? "text-destructive-foreground"
          : status === "successful"
          ? "text-awesome-foreground"
          : status === "pending"
          ? "text-orange-300"
          : "text-primary";
      return <div className={`uppercase ${style}`}>{status}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button
          className="gap-2"
          onClick={() => navigator.clipboard.writeText(payment.driver)}
        >
          <div className="h-4 w-4">{printIcon}</div>Print
        </Button>
      );
    },
  },
];
export const viewDriversColumns: ColumnDef<DriverPayment>[] = [
  {
    accessorKey: "Date",
    header: "Date",
  },
  {
    accessorKey: "amount_NGN",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount_NGN");
      return <div className="text-right font-medium">{`₦${amount}`}</div>;
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => {
      const payment_type = row.original.payment_type;
      const style =
        payment_type === "Cash"
          ? "text-destructive-foreground"
          : payment_type === "Mobile Transfer"
          ? "text-awesome-foreground"
          : payment_type === "Transfer"
          ? "text-orange-300"
          : "text-primary";
      return <div className={`uppercase ${style}`}>{payment_type}</div>;
    },
  },

  {
    accessorKey: "handled_by",
    header: "Handled By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button
          className="gap-2"
          onClick={() => navigator.clipboard.writeText(payment.driver)}
        >
          <div className="h-4 w-4">{printIcon}</div>Print
        </Button>
      );
    },
  },
];
export const driversColumns: ColumnDef<IDriver>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/drivers/${row.original.driver_id}`} className="">
        {`${row.original.firstname} ${row.original.lastname}`}
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "lga",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LGA" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div
          className=" cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(driver.driver_id);
          }}
        >
          Copy ID
        </div>
      );
    },
  },
];
export const settingsColumns: ColumnDef<ISettings>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="">{row.original.name}</div>,
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const setting = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <EyeIcon className="h-4 w-4" />
              <span className="hidden md:block">View</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <UpdateSettingsForm settings={setting} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const bitsColumns: ColumnDef<IBits>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="">{row.original.name}</div>,
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bit = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <EyeIcon className="h-4 w-4" />
              <span className="hidden md:block">View</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <UpdateBitsForm bit={bit} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

// WEBAGENT
export const webAgentDriversColumns: ColumnDef<AgentT>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "plate",
    header: "Vehicle Plate Number",
    cell: ({ row }) => (
      <span className="uppercase">{row.getValue("plate")}</span>
    ),
  },
  {
    accessorKey: "plate",
    header: "Vehicle Plate Number",
    cell: ({ row }) => (
      <span className="uppercase">{row.getValue("plate")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Today Status",
    cell: ({ row }) => (
      <Pill status={row.getValue("status")} text={row.getValue("status")} />
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Cbadge variant={row.getValue("category")} />,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-black" align="end">
            <DropdownMenuItem
              className="border-b border-black rounded-none"
              asChild
            >
              <Link href={`/web-agent/driver/${row.id}`}>
                <span className="h-4 w-4 mr-3">{editIcon}</span>
                View Driver
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="border-b border-black rounded-none"
              asChild
            >
              <Link href={`/web-agent/driver/payment/${row.id}`}>
                <span className="h-4 w-4 mr-3">{paymentIcon}</span>
                Make Payment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <span className="h-4 w-4 mr-3">{deleteIcon}</span>
              Delete Driver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const viewWebAgentDriversColumns: ColumnDef<DriverPayment>[] = [
  {
    accessorKey: "Date",
    header: "Date",
  },
  {
    accessorKey: "amount_NGN",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue("amount_NGN");
      return <div className="text-right font-medium">{`₦${amount}`}</div>;
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => {
      const payment_type = row.original.payment_type;
      const style =
        payment_type === "Cash"
          ? "text-destructive-foreground"
          : payment_type === "Mobile Transfer"
          ? "text-awesome-foreground"
          : payment_type === "Transfer"
          ? "text-orange-300"
          : "text-primary";
      return <div className={`uppercase ${style}`}>{payment_type}</div>;
    },
  },

  {
    accessorKey: "handled_by",
    header: "Handled By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Button
          className="gap-2"
          onClick={() => navigator.clipboard.writeText(payment.driver)}
        >
          <div className="h-4 w-4">{printIcon}</div>Print
        </Button>
      );
    },
  },
];

export const viewWaiverColumns: ColumnDef<IWaiver>[] = [
  {
    accessorKey: "start_date",
    header: "Timeline",
    cell: ({ row }) => {
      const startDate = row.original.start_date;
      const endDate = row.original.end_date;
      return (
        <div className="font-medium">{`${format(
          new Date(startDate),
          "MMM dd"
        )} - ${
          endDate === "9999-01-01T00:00:00.000Z"
            ? "FOREVER"
            : format(new Date(endDate), "MMM dd")
        }`}</div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => <div className="">Reason</div>,
    cell: ({ row }) => {
      const reason = row.original.reason;
      return <div className="font-medium">{`${reason}`}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return <div className={`uppercase`}>{status}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const waiver = row.original;
      if (waiver.status !== WAIVER_STATUS.cancelled)
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border border-black" align="end">
              <DeleteWaiverButton id={waiver.vehicle_id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
    },
  },
];
export const viewWaiverColumnsAdmin: ColumnDef<IWaiver>[] = [
  {
    accessorKey: "start_date",
    header: "Timeline",
    cell: ({ row }) => {
      const startDate = row.original.start_date;
      const endDate = row.original.end_date;
      return (
        <div className="font-medium">{`${format(
          new Date(startDate),
          "MMM dd"
        )} - ${
          endDate === "9999-01-01T00:00:00.000Z"
            ? "FOREVER"
            : format(new Date(endDate), "MMM dd")
        }`}</div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => <div className="">Reason</div>,
    cell: ({ row }) => {
      const reason = row.original.reason;
      return <div className="font-medium">{`${reason}`}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      return <div className={`uppercase`}>{status}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const waiver = row.original;
      if (waiver.status !== WAIVER_STATUS.cancelled)
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border border-black" align="end">
              <DropdownMenuItem asChild>
                <UpdateWaiverButton waiver={waiver} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteWaiverButton id={waiver.vehicle_id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
    },
  },
];
