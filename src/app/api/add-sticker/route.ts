import { API, URLS } from "@/lib/consts";
import { getSSession } from "@/lib/get-data";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
     const { access_token } = await getSSession();
     const body = await req.json();
     const headers = {
          "Content-Type": "application/json",
          "api-secret": process.env.API_SECRET || "",
          Authorization: `Bearer ${access_token}`,
     };
     const payload = { barcode: body.barcode };

     try {
          const url = `${API}${URLS.vehicle.all}/${body.id}`;
          const response = await fetch(url, {
               method: "PUT",
               headers,
               body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (!response.ok) {
               return NextResponse.json(result.errors, {
                    status: result.status_code,
               });
          } else {
               return NextResponse.json(result);
          }
     } catch (error: any) {
          return NextResponse.json(error, { status: 500 });
     }
}
