"use client";

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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

interface AdvancedVehicleSearchProps {
  className?: string;
}

export function AdvancedVehicleSearch({
  className = "",
}: AdvancedVehicleSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    vehicleType: searchParams.get("vehicleType") || "all",
    year: searchParams.get("year") || "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedSearch = useDebouncedCallback((newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove search parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to first page when searching
    if (newFilters.search !== searchParams.get("search")) {
      params.set("page", "1");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      debouncedSearch(newFilters);
    },
    [filters, debouncedSearch]
  );

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      status: "",
      vehicleType: "",
      year: "",
    };
    setFilters(clearedFilters);

    const params = new URLSearchParams(searchParams.toString());
    Object.keys(clearedFilters).forEach((key) => params.delete(key));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Search Vehicles</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilter("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Vehicle Type
              </label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) => updateFilter("vehicleType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
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

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
