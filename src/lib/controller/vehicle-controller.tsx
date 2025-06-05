import { API, URLS } from "../consts";
import { getSSession } from "../get-data";
import { IPaymnetHistory } from "../types";
import { identifyIdType, isBarcodeId, isUUID } from "../utils";

export const runtime = "edge"; // 'nodejs' is the default
export const dynamic = "force-dynamic";

export const getVehicles = async (page?: string, limit?: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  try {
    const url = `${API}${URLS.vehicle.all}?page=${page ?? 1}&limit=${
      limit ?? 10
    }`;

    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return undefined;
    const result = await res.json();
    const vehicles: {
      rows: IVehicle[];
      meta: { total: number; total_pages: number; page: number };
    } = result.data;
    return vehicles;
  } catch (error: any) {
    return undefined;
  }
};

export const getGroups = async (page?: string, limit?: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  try {
    const url = `${API}${URLS.group.all}?page=${page ?? 1}&limit=${
      limit ?? 10
    }`;

    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return undefined;
    const result = await res.json();
    const group: {
      rows: IGroup[];
      meta: { total: number; total_pages: number; page: number };
    } = result.data;
    return group;
  } catch (error: any) {
    return undefined;
  }
};

export const getVehicleById = async (id: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  const url = isUUID(id)
    ? `${API}${URLS.vehicle.all}/${id}`
    : isBarcodeId(id)
    ? `${API}${URLS.vehicle.all}/barcode/${id}`
    : `${API}${URLS.vehicle.all}/plate-number/${id}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();
  if (!result.status) return undefined;

  const vehicle: IVehicle = result.data;
  return vehicle;
};

export const getVehicleByBarcode = async (barcode: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  const url = `${API}${URLS.vehicle.barcode.replace("{barcode}", barcode)}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();
  if (!result.status) return undefined;

  const vehicle: IVehicle = result.data;
  return vehicle;
};

export const getVehicleGroupById = async (id: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  const url = `${API}${URLS.group.all}/${id}`;

  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();
  if (!result.status) return undefined;

  const group = result.data;
  return group;
};

export const getVehicleByPlateNumber = async (plate_number: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };
  const url = `${API}${URLS.vehicle.all}/plate-number/${plate_number}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();
  if (!result.status) return undefined;

  const vehicle: IVehicle = result.data;
  return vehicle;
};

export const getVehicleByTCodeOrPlateNumber = async (id: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };

  try {
    const idType = identifyIdType(id);
    let apiUrl: string;

    switch (idType) {
      case "asin":
        apiUrl = `${API}${URLS.vehicle.withAsin.replace("{asin}", id)}`;
        break;
      case "tcode":
        apiUrl = `${API}${URLS.vehicle.tcode.replace("{tcode}", id)}`;
        break;
      case "plate_number":
        apiUrl = `${API}${URLS.vehicle.plate.replace("{plateNumber}", id)}`;
        break;
      case "uuid":
      default:
        apiUrl = `${API}${URLS.vehicle.one.replace("{id}", id)}`;
        break;
    }

    const res = await fetch(apiUrl, { headers, cache: "no-store" });
    const result = await res.json();
    // console.log({ result });

    if (!result.data) {
      const vehicle = await verifyVehicleByAsin(id);
      // console.log({ vehicle });
      if (vehicle) {
        return vehicle;
      }
      return undefined;
    }

    return result.data ? result.data : undefined;
  } catch (error) {
    console.error("Error fetching or verifying vehicle:", error);
    return undefined;
  }
};

export const verifyVehicleByAsin = async (asin: string) => {
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
  };
  try {
    const url = `${API}${URLS.vehicle.asin}/${asin}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    const result = await res.json();
    if (!result.status) return undefined;

    const vehicle: IVehicle = result.data;
    return vehicle;
  } catch (error) {     
    return undefined;
  }
};

export const getVehicleSummary = async (plate_number: string) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let url;
  if (isUUID(plate_number)) {
    url = `${API}${URLS.vehicle.all}/summary?id=${plate_number}`;
  } else if (isBarcodeId(plate_number)) {
    url = `${API}${URLS.vehicle.all}/summary?barcode=${plate_number}`;
  } else {
    url = `${API}${URLS.vehicle.all}/summary?plate_number=${plate_number}`;
  }

  const res = await fetch(url, { headers, cache: "no-store" });
  const result = await res.json();

  if (!res.ok) {
    return undefined;
  }

  const summary: IVehicleSummary = result;
  return summary;
};

export const searchVehicle = async (id: string) => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };

  const url = isUUID(id)
    ? `${API}${URLS.vehicle.search}?id=${id}`
    : `${API}${URLS.vehicle.search}?plate_number=${id}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return undefined;
  const result = await res.json();
  const vehicle = result.data;
  return vehicle;
};

export const getVehiclePaymentHistoryById = async (
  id: string
): Promise<IPaymnetHistory[]> => {
  const session = await getSSession();
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session.access_token}`,
  };

  const url = `${API}${URLS.vehicle.payment}/${id}/cvof`;

  try {
    const request = await fetch(url, { headers, cache: "no-store" });
    const response = await request.json();
    if (response.status) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log({ error });
    return [];
  }
};
