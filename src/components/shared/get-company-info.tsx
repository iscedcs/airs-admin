import { getVehiclesFromCompanies } from "@/lib/controller/company-controller";
import React, { useEffect, useState } from "react";

export default function GetCompanyVehicle({ id }: { id: string }) {
  const [count, setCount] = useState<number | null>(0);
  useEffect(() => {
    const fetchCount = async () => {
      const vehicleRequest = await getVehiclesFromCompanies(id);
      setCount(vehicleRequest?.meta.totalVehicles ?? 0);
    };

    fetchCount();
  }, [id]);

  return (
    <div>
      <p>{count}</p>
    </div>
  );
}

// export function GetCompanyDirectors({ id }: { id: string }) {
//   const [count, setCount] = useState<number | null>(0);

//   useEffect(() => {
//     const fetchCount = async () => {
//       // const;
//     };

//     fetchCount();
//   }, [id]);

//   return <div className="">{count}</div>;
// }
