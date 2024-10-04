import { vehicle } from "@/db/schema";
import db from "@/lib/database";
import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
     try {
          const { searchParams } = new URL(request.url);
          const requestedFields =
               searchParams
                    .get("fields")
                    ?.split(",")
                    .filter((field) => field.trim() !== "") || [];
          let filters = {};
          if (requestedFields.length > 0) {
               for (const field of requestedFields) {
                    // @ts-ignore
                    filters[field] = vehicle[field];
               }
          } else {
               filters = { vehicle_id: vehicle.vehicle_id };
          }
          const limit = Number(searchParams.get("limit")) || 0;
          const offset = Number(searchParams.get("offset")) || 0;
          const vehicleResult = await db
               .select(filters)
               .from(vehicle)
               .limit(limit)
               .offset(offset);
          return NextResponse.json(vehicleResult, { status: 200 });
     } catch (error) {
          return NextResponse.json(error, { status: 500 });
     }
}
