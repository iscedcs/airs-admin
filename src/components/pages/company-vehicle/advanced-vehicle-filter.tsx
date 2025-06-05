"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/table/data-table";
import { useDebouncedCallback } from "use-debounce";

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
  vehicle_type: string | null;
  waiverExp: Date | null;
}

interface AdvancedVehicleFilterProps {
  vehicles: Vehicle[];
  columns: any[];
  companyId: string;
  currentPage: number;
  limit: number;
  totalVehicles: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function AdvancedVehicleFilter({
  vehicles,
  columns,
  companyId,
  currentPage,
  limit,
  totalVehicles,
  hasNextPage,
  hasPrevPage,
}: AdvancedVehicleFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    vehicleType: searchParams.get("vehicleType") || "all",
    year: searchParams.get("year") || "",
    make: searchParams.get("make") || "all",
  });

  // Track previous filter state to detect changes
  const [previousFilters, setPreviousFilters] = useState(filters);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      vehicleType: searchParams.get("vehicleType") || "all",
      year: searchParams.get("year") || "",
      make: searchParams.get("make") || "all",
    };
    setFilters(newFilters);
  }, [searchParams]);

  // Debounced URL update with smart page reset logic
  const debouncedUpdateURL = useDebouncedCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Check if any filter actually changed
      const filtersChanged = Object.keys(newFilters).some(
        (key) =>
          newFilters[key as keyof typeof newFilters] !==
          previousFilters[key as keyof typeof previousFilters]
      );

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Only reset to page 1 if filters actually changed
      if (filtersChanged) {
        params.set("page", "1");
        setPreviousFilters(newFilters);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    300
  );

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const statuses = [
      ...Array.from(
        new Set(
          vehicles.map((v) => v.status).filter((status) => status !== null)
        )
      ),
    ];
    const types = [
      ...Array.from(
        new Set(
          vehicles.map((v) => v.vehicle_type).filter((type) => type !== null)
        )
      ),
    ];
    const makes = [
      ...Array.from(new Set(vehicles.map((v) => v.make).filter((make) => make !== null))),
    ];

    return { statuses, types, makes };
  }, [vehicles]);

  // Filter vehicles based on all criteria
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        (vehicle.plate_number &&
          vehicle.plate_number.toLowerCase().includes(searchLower)) ||
        (vehicle.model && vehicle.model.toLowerCase().includes(searchLower)) ||
        (vehicle.make && vehicle.make.toLowerCase().includes(searchLower)) ||
        (vehicle.vin && vehicle.vin.toLowerCase().includes(searchLower));

      const matchesStatus =
        filters.status === "all" || vehicle.status === filters.status;
      const matchesType =
        filters.vehicleType === "all" ||
        vehicle.vehicle_type === filters.vehicleType;
      const matchesMake =
        filters.make === "all" || vehicle.make === filters.make;
      const matchesYear =
        !filters.year ||
        (vehicle.year && vehicle.year.toString() === filters.year);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesMake &&
        matchesYear
      );
    });
  }, [vehicles, filters]);

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedUpdateURL(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      status: "all",
      vehicleType: "all",
      year: "",
      make: "all",
    };
    setFilters(clearedFilters);
    setPreviousFilters(clearedFilters);

    const params = new URLSearchParams(searchParams.toString());
    Object.keys(clearedFilters).forEach((key) => params.delete(key));
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) =>
    key !== "search" ? value !== "all" && value !== "" : value !== ""
  );

  // Calculate pagination for filtered results
  const isFiltering = hasActiveFilters;
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const paginatedVehicles = filteredVehicles.slice(start, end);
  const filteredTotal = filteredVehicles.length;
  const filteredHasNext = end < filteredTotal;
  const filteredHasPrev = start > 0;

  // Custom pagination for filtered results
  const FilteredPagination = () => {
    const totalPages = Math.ceil(filteredTotal / limit);

    const goToPage = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.replace(`${pathname}?${params.toString()}`);
    };

    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {start + 1} to {Math.min(end, filteredTotal)} of{" "}
          {filteredTotal} filtered results
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!filteredHasPrev}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!filteredHasNext}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[20px] mb-4 font-bold uppercase">All Vehicles</p>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Search & Filter Vehicles
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvanced ? "Simple" : "Advanced"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by plate number"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => updateFilter("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {filterOptions.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Vehicle Type
                  </label>
                  <Select
                    value={filters.vehicleType}
                    onValueChange={(value) =>
                      updateFilter("vehicleType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {filterOptions.types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Make</label>
                  <Select
                    value={filters.make}
                    onValueChange={(value) => updateFilter("make", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All makes</SelectItem>
                      {filterOptions.makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Input
                    type="number"
                    placeholder="e.g., 2020"
                    value={filters.year}
                    onChange={(e) => updateFilter("year", e.target.value)}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>
            )}

            {/* Clear Filters & Results Count */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTotal} of {totalVehicles} vehicles
                {hasActiveFilters && ` (filtered)`}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10 flex flex-col gap-5">
        <DataTable
          showSearch={false}
          searchWith="plate_number"
          searchWithPlaceholder="Enter vehicle plate number"
          showColumns
          columns={columns}
          data={isFiltering ? paginatedVehicles : vehicles}
        />
      </div>

      {isFiltering ? (
        <FilteredPagination />
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalVehicles)} of {totalVehicles}{" "}
            vehicles
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (currentPage - 1).toString());
                router.replace(`${pathname}?${params.toString()}`);
              }}
              disabled={!hasPrevPage}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(totalVehicles / limit)}
            </span>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (currentPage + 1).toString());
                router.replace(`${pathname}?${params.toString()}`);
              }}
              disabled={!hasNextPage}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
