import { API, URLS } from "@/lib/consts";
import { getSSession } from "@/lib/get-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { access_token } = await getSSession();
  const body: ICreateVehicleForm = await req.json();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${access_token}`,
  };
  const payload = body;
  const url = API + URLS.vehicle.all;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  try {
    if (!result.status) {
      throw new Error(`Something Went wrong ${result}`);
    } else {
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return error?.message;
  }
}

export async function PUT(req: NextRequest) {
  const { access_token } = await getSSession();
  const body = await req.json();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${access_token}`,
  };
  const payload = {
    category: body.category,
    plate_number: body.plate_number,
    asin_number: body.asin_number?.trim() !== "" ? body.asin_number : "NULL",
    t_code: body.t_code?.trim() !== "" ? body.t_code : "NULL",
    color: body.color,
    image: body.image,
    status: body.status,
    type: body.type,
    vin: body.vin,
    barcode: body.barcode,
    tracker_id: body.tracker_id,
    blacklisted: body.blacklisted,
    owner: {
      name: body.owner.name,
      phone: body.owner.phone.trim() !== "" ? body.owner.phone : "OTHER",
      address: body.owner.address,
      gender: body.owner.gender,
      marital_status: body.owner.marital_status,
      // whatsapp: body.owner.whatsapp,
      // email: body.owner.email,
      valid_id: body.owner.valid_id,
      nok_name: body.owner.nok_name,
      // nok_phone: body.owner.nok_phone,
      nok_relationship: body.owner.nok_relationship,
    },
  };

  try {
    const url = `${API}${URLS.vehicle.all}/${body.id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!result.status) {
      return NextResponse.json(
        { error: result.errors },
        {
          status: result.status_code,
        }
      );
    } else {
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { access_token } = await getSSession();
  const body: ICreateVehicleForm = await req.json();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const url = `${API}${URLS.vehicle.all}/${body.vehicle_id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Something Went wrong ${response.statusText}`);
    } else {
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return error?.message;
  }
}
