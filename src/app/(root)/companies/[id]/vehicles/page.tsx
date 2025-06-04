import { VehicleListWithSearch } from "@/components/pages/company-vehicle/vehicle-list-with-search";
import { companyVehiclesColumn } from "@/components/ui/table/columns";
import { getVehiclesFromCompanies } from "@/lib/controller/company-controller";

export default async function Vehicles({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "13";

  try {
    // Fetch ALL vehicles for this company
    // You might need to adjust this based on your API
    const allVehiclesResponse = await getVehiclesFromCompanies(
      params.id,
      "1",
      "999999"
    );

    return (
      <div className="px-4">
        <VehicleListWithSearch
          allVehicles={allVehiclesResponse?.rows || []}
          columns={companyVehiclesColumn}
          companyId={params.id}
          currentPage={Number(page)}
          limit={Number(limit)}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching vehicles:", error);

    return (
      <div className="px-4">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading vehicles. Please try again.
          </p>
        </div>
      </div>
    );
  }
}
