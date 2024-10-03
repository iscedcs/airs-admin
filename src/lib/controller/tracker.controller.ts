import { TRACKER_BASE_URL, URLS } from "../consts";

export const revalidate = 600;

export const getAllTrackerLocation = async (imei: string[]) => {
     const headers = {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_TRACKER_API_KEY || "",
     };

     const url = `${TRACKER_BASE_URL}${URLS.tracker.location}`;

     const res = await fetch(url, {
          method: "POST",
          headers,
          cache: "no-store",
          body: JSON.stringify(imei),
     });

     const result: ITracker[] = await res.json();
     const modifiedTrackerDetails: IModifiedTrackerDetails[] = result.map(
          (location) => ({
               carNumber: location.carNumber,
               createTime: location.createTime,
               lat: location.location.lat,
               lon: location.location.lon,
               nickname: location.nickname,
               terminalID: location.terminalID,
               speed: location.location.speed,
          }),
     );
     return modifiedTrackerDetails;
};
