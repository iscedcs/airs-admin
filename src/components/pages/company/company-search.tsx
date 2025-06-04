"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchCompaniesProps {
  placeholder?: string;
}

export function SearchCompanies({
  placeholder = "Search company name...",
}: SearchCompaniesProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);

    // Use shorter delay for shorter search terms
    const delay = searchTerm.length <= 2 ? 50 : 100;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", searchTerm);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      } else if (searchParams.has("query")) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("query");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(delayDebounceFn);
      setIsSearching(false);
    };
  }, [searchTerm, router, pathname, searchParams]);

  return (
    <div className="relative w-full">
      {isSearching ? (
        <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
