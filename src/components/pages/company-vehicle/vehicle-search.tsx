"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";

interface VehicleSearchProps {
  placeholder?: string;
  className?: string;
  onSearch: (searchTerm: string) => void;
  searchValue: string;
}

export function VehicleSearch({
  placeholder = "Search vehicles by plate number...",
  className = "",
  onSearch,
  searchValue,
}: VehicleSearchProps) {
  // Debounce the search to avoid too many URL updates
  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 300);

  const handleSearch = (term: string) => {
    debouncedSearch(term);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          defaultValue={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}
