import { API, URLS } from "../consts";
import { getSSession } from "../get-data";
import { isBarcodeId, isURL, isUUID } from "../utils";

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
          console.log(error);
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
          const asinUrl = `${API}${URLS.vehicle.asin}/${id}`;
          const res = await fetch(asinUrl, { headers, cache: "no-store" });
          if (!res.ok) {
               return undefined;
          }
          const externalVehicleData = await res.json();
          const existingVehicle = await getVehicleByPlateNumber(
               externalVehicleData.data.plate_number,
          );

          if (!existingVehicle) {
               return undefined;
          }
          return existingVehicle;
     } catch (error) {
          console.error("Error fetching or updating vehicle:", error);
          return undefined;
     }
};

export const verifyVehicleByAsin = async (asin: string) => {
     const session = await getSSession();
     const headers = {
          "Content-Type": "application/json",
          "api-secret": process.env.API_SECRET || "",
          Authorization: `Bearer ${session.access_token}`,
     };
     try {
          const url = `${API}${URLS.vehicle.asin}/${asin}`;
          const res = await fetch(url, { headers, cache: "no-store" });
          const result = await res.json();

          console.log({ result });
          if (!result.status) return undefined;

          const vehicle: IVehicle = result.data;
          return vehicle;
     } catch (error) {
          console.log("error while verifying vehicle", { error });
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
