"use server";
import { getSSession } from "@/lib/get-data";
import { API, URLS } from "../consts";

interface DateType {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const getPaymentNotificonCount = async ({
  startDate,
  endDate,
}: DateType) => {
  const session = await getSSession();
  const url = `${API}${URLS.payment_notification.custom_count}`;
  const payload = {
    startDate,
    endDate,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-secret": process.env.API_SECRET || "",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    // console.log(data.data);
    if (res.ok) {
      return data.data;
    }
    return null;
  } catch (e: any) {
    console.log(e.message);
  }
};
