"use server"

import { options } from "@/app/api/auth/options";
import { API } from "@/lib/consts";
import { getServerSession } from "next-auth";

export async function recalculateNetTotal(vehicleId: string) {
  const session = await getServerSession(options);
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session?.user.access_token}`,
  };
  try {
    const response = await fetch(
      `${API}/api/v1/vehicles/${vehicleId}/net-total`,
      {
        method: "PUT",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, message: result.data.message };
  } catch (error) {
    console.error("Failed to recalculate net total:", error);
    return {
      success: false,
      message: "Failed to recalculate net total. Please try again.",
    };
  }
}