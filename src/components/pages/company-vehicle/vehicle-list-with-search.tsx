"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/table/data-table";
import { VehicleSearch } from "./vehicle-search";
import { PaginationISCE } from "@/components/shared/pagination-isce";
import { vehicles } from "@prisma/client";

interface Vehicle {
  id: string;
  plate_number: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  color: string | null;
  category: string | null;
  image: string | null;
  blacklisted: boolean;
  model: string | null;
  make: string | null;
  year: string | null;
  vin: string | null;
  status: string | null;
  waiverExp: Date | null;
}

interface VehicleListWithSearchProps {
  allVehicles?: vehicles[]; // Make optional and add default
  columns: any[];
  companyId: string;
  currentPage: number;
  limit: number;
}

export function VehicleListWithSearch({
  allVehicles = [], // Default to empty array
  columns,
  companyId,
  currentPage,
  limit,
}: VehicleListWithSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search term from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [previousSearchTerm, setPreviousSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Update search term when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Filter ALL vehicles based on search term with null checks
  const filteredVehicles = useMemo(() => {
    // Ensure allVehicles is an array
    if (!Array.isArray(allVehicles)) {
      return [];
    }

    if (!searchTerm.trim()) {
      return allVehicles;
    }

    const searchLower = searchTerm.toLowerCase();
    return allVehicles.filter((vehicle) => {
      // Add null checks for each property
      return (
        vehicle?.plate_number &&
        vehicle.plate_number.toLowerCase().includes(searchLower)
      );
    });
  }, [allVehicles, searchTerm]);

  // Handle search with URL update
  const handleSearch = (newSearchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearchTerm.trim()) {
      params.set("search", newSearchTerm);

      // Only reset to page 1 if this is a NEW search term
      if (newSearchTerm !== previousSearchTerm) {
        params.set("page", "1");
        setPreviousSearchTerm(newSearchTerm);
      }
    } else {
      params.delete("search");
      params.set("page", "1"); // Reset to page 1 when clearing search
      setPreviousSearchTerm("");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Calculate pagination for filtered results with safety checks
  const totalResults = filteredVehicles?.length || 0;
  const totalVehicles = allVehicles?.length || 0;
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const paginatedVehicles = filteredVehicles?.slice(start, end) || [];
  const totalPages = Math.ceil(totalResults / limit) || 1;

  // Create vehicles object that matches your expected structure
  const vehiclesData =
    totalResults > 0
      ? {
          rows: paginatedVehicles,
          meta: {
            totalVehicles: totalResults,
            totalPages: totalPages,
            currentPage: currentPage,
            limit: limit,
          },
        }
      : null;

  // Loading state
  if (!allVehicles) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalVehicles === 0) {
    return (
      <div className="px-4">
        <p className="text-[20px] mb-4 font-bold uppercase">All Vehicles</p>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No vehicles found for this company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[20px] mb-4 font-bold uppercase">All Vehicles</p>
        <VehicleSearch
          placeholder="Search vehicles by plate number,"
          onSearch={handleSearch}
          searchValue={searchTerm}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            {searchTerm ? (
              <>
                Found <span className="font-medium">{totalResults}</span>{" "}
                vehicle
                {totalResults !== 1 ? "s" : ""} matching "{searchTerm}" out of{" "}
                <span className="font-medium">{totalVehicles}</span> total
                vehicles
              </>
            ) : (
              <>
                Showing <span className="font-medium">{totalVehicles}</span>{" "}
                total vehicles
              </>
            )}
          </p>
          {totalResults > 0 && (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-5">
        <DataTable
          showSearch={false}
          searchWith="plate_number"
          searchWithPlaceholder="Enter vehicle plate number"
          showColumns
          columns={columns}
          data={paginatedVehicles}
        />
      </div>

      {/* Use PaginationISCE component matching your structure */}
      {vehiclesData && (
        <PaginationISCE
          hasNextPage={end < vehiclesData.meta?.totalVehicles}
          hasPrevPage={start > 0}
          page={Number(currentPage)}
          limit={Number(limit)}
          total={Number(vehiclesData.meta?.totalVehicles)}
          hrefPrefix={`/companies/${companyId}/vehicles/`}
        />
      )}

      {/* No Results Message */}
      {totalResults === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No vehicles found matching "{searchTerm}"
          </p>
          <button
            onClick={() => handleSearch("")}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear search to see all vehicles
          </button>
        </div>
      )}
    </div>
  );
}
