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
import { PaginationISCE } from "@/components/shared/pagination-isce";
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

interface AdvancedVehicleFilterAllDataProps {
  allVehicles?: Vehicle[];
  columns: any[];
  companyId: string;
  currentPage: number;
  limit: number;
}

export function AdvancedVehicleFilterAllData({
  allVehicles = [],
  columns,
  companyId,
  currentPage,
  limit,
}: AdvancedVehicleFilterAllDataProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    vehicleType: searchParams.get("vehicleType") || "all",
    year: searchParams.get("year") || "",
    make: searchParams.get("make") || "all",
    color: searchParams.get("color") || "all",
    category: searchParams.get("category") || "all",
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
      color: searchParams.get("color") || "all",
      category: searchParams.get("category") || "all",
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

  // Get unique values for filter options from ALL vehicles
  const filterOptions = useMemo(() => {
    if (!Array.isArray(allVehicles)) {
      return { statuses: [], types: [], makes: [], colors: [], categories: [] };
    }

    const statuses = [
      ...Array.from(
        new Set(
          allVehicles.map((v) => v.status).filter((status) => status !== null)
        )
      ),
    ];
    const types = [
      ...Array.from(
        new Set(
          allVehicles.map((v) => v.vehicle_type).filter((type) => type !== null)
        )
      ),
    ];
    const makes = [
      ...Array.from(
        new Set(
          allVehicles.map((v) => v.make).filter((make) => make !== null)
        )
      ),
    ];
    const colors = [
      ...Array.from(
        new Set(
          allVehicles.map((v) => v.color).filter((color) => color !== null)
        )
      ),
    ];
    const categories = [
      ...Array.from(
        new Set(
          allVehicles
            .map((v) => v.category)
            .filter((category) => category !== null)
        )
      ),
    ];

    return { statuses, types, makes, colors, categories };
  }, [allVehicles]);

  // Filter ALL vehicles based on all criteria
  const filteredVehicles = useMemo(() => {
    if (!Array.isArray(allVehicles)) {
      return [];
    }

    return allVehicles.filter((vehicle) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        (vehicle?.plate_number &&
          vehicle.plate_number.toLowerCase().includes(searchLower)) ||
        (vehicle?.model && vehicle.model.toLowerCase().includes(searchLower)) ||
        (vehicle?.make && vehicle.make.toLowerCase().includes(searchLower)) ||
        (vehicle?.vin && vehicle.vin.toLowerCase().includes(searchLower)) ||
        (vehicle?.status &&
          vehicle.status.toLowerCase().includes(searchLower)) ||
        (vehicle?.color && vehicle.color.toLowerCase().includes(searchLower)) ||
        (vehicle?.category &&
          vehicle.category.toLowerCase().includes(searchLower));

      const matchesStatus =
        filters.status === "all" || vehicle?.status === filters.status;
      const matchesType =
        filters.vehicleType === "all" ||
        vehicle?.vehicle_type === filters.vehicleType;
      const matchesMake =
        filters.make === "all" || vehicle?.make === filters.make;
      const matchesColor =
        filters.color === "all" || vehicle?.color === filters.color;
      const matchesCategory =
        filters.category === "all" || vehicle?.category === filters.category;
      const matchesYear =
        !filters.year ||
        (vehicle?.year && vehicle.year.toString() === filters.year);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesMake &&
        matchesColor &&
        matchesCategory &&
        matchesYear
      );
    });
  }, [allVehicles, filters]);

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
      color: "all",
      category: "all",
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t">
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
                  <label className="text-sm font-medium mb-2 block">
                    Color
                  </label>
                  <Select
                    value={filters.color}
                    onValueChange={(value) => updateFilter("color", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All colors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All colors</SelectItem>
                      {filterOptions.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => updateFilter("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {filterOptions.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                {hasActiveFilters ? (
                  <>
                    Found <span className="font-medium">{totalResults}</span>{" "}
                    vehicle
                    {totalResults !== 1 ? "s" : ""} out of{" "}
                    <span className="font-medium">{totalVehicles}</span> total
                  </>
                ) : (
                  <>
                    Showing all{" "}
                    <span className="font-medium">{totalVehicles}</span>{" "}
                    vehicles
                  </>
                )}
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
      {totalResults === 0 && hasActiveFilters && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No vehicles found with the current filters
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear all filters to see all vehicles
          </button>
        </div>
      )}
    </div>
  );
}
