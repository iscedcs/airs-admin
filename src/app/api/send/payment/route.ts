import { getSSession } from "@/lib/get-data";
import { NextResponse } from "next/server";

export async function POST() {
  const { access_token } = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${access_token}`,
  };
  const payload = {};
  const url = "http://localhost:7000/api/v1/payment-notifications/webhook";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: result }, { status: 500 });
    } else {
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
