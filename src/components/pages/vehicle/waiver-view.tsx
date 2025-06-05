"use client"

import { Calendar } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export default function VehicleWaiverView({
    waiverInfo,
    vehicle,
    owner
}: { waiverInfo: any; vehicle: IVehicle;  owner: any}) {
  return (
    <Card className={`mx-auto min-h-[70svh] w-full max-w-4xl bg-emerald-600 shadow-xl rounded-2xl`}>
      {/* Header Info */}
      <CardHeader className="bg-[#4C3D13] text-white p-4 rounded-t-2xl">
        <div className="space-y-2 text-center">
          <div className="uppercase text-xs">VEHICLE OWNER</div>
          <div className="font-semibold">{owner?.name}</div>
          <div className="uppercase text-xs">VEHICLE TYPE</div>
          <div className="font-semibold">{vehicle.category}</div>
          <div className="uppercase text-xs">WAIVER EXPIRY DATE</div>
          <div className="text-yellow-300 font-semibold">{waiverInfo.endDate}</div>
        </div>
      </CardHeader>

      {/* Status Banner */}
      <div className="bg-yellow-500 p-4 flex flex-col items-center justify-center text-white">
        <div className="rounded-full bg-white/20 p-3 mb-2">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="text-center">
          <div className="font-semibold">Vehicle is on Waiver</div>
          <div className="font-semibold text-4xl">{waiverInfo.daysLeft}</div>
          <div className="text-sm">days remaining</div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">T CODE</div>
          <div className="font-semibold">{vehicle.t_code}</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">ASIN</div>
          <div className="font-semibold">{vehicle.asin_number}</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">PLATE NUMBER</div>
          <div className="font-semibold">{vehicle.plate_number}</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">STICKER</div>
          <div className="font-semibold">{vehicle.barcode}</div>
        </div>
      </div>

      {/* Waiver Information */}
      <div className="bg-white mx-4 mb-4 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Waiver Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Reason:</span> {waiverInfo.reason}
          </div>
          <div>
            <span className="text-gray-600">Additional Info:</span> {waiverInfo.additionalInfo}
          </div>
          <div>
            <span className="text-gray-600">Start Date:</span> {waiverInfo.startDate}
          </div>
          <div>
            <span className="text-gray-600">End Date:</span> {waiverInfo.endDate}
          </div>
        </div>
      </div>
    </Card>
  )
}

