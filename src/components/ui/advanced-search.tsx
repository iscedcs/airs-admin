"use client";

import { loadingSpinner, searchIcon } from "@/lib/icons";
import React, { useState, useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getVehicles } from "@/actions/vehicles";
import type { vehicles } from "@prisma/client";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Car } from "lucide-react";

export default function AdvancedSearch({
  placeholder,
  variant,
}: {
  placeholder: string;
  variant: "primary" | "secondary" | "default";
}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchVehicles, setSearchVehicles] = useState<Partial<vehicles>[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const variants = useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-secondary text-primary-foreground";
      case "secondary":
        return "bg-background border border-input";
      default:
        return "bg-primary text-primary-foreground";
    }
  }, [variant]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`/search/${searchValue}`);
    },
    [router, searchValue]
  );

  const search = useDebouncedCallback(async (value: string) => {
    if (value.trim()) {
      startTransition(async () => {
        const result = await getVehicles(1, 10, { search: value });
        setSearchVehicles(result?.vehicles || []);
      });
    } else {
      setSearchVehicles([]);
    }
  }, 300);

  const handleChange = async (value: string) => {
    setSearchValue(value);
    await search(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        className={`flex relative text-body w-full items-center h-14 rounded-[40px] overflow-hidden ${variants}`}
        onSubmit={handleSubmit}
      >
        <Button
          type="submit"
          variant="default"
          className="absolute h-14 w-14 aspect-square z-10 rounded-none"
        >
          {isPending ? loadingSpinner : searchIcon}
        </Button>
        <input
          name="search"
          type="text"
          placeholder={placeholder}
          value={searchValue}
          required
          onChange={(e) => handleChange(e.target.value)}
          className={`bg-secondary focus:outline-0 pl-16 py-4 h-14 w-full text-primary text-[14px] rounded-2xl absolute`}
        />
      </form>
      {searchValue && (
        <Card className="mt-4">
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] w-full rounded-md border">
              {searchVehicles.length > 0 ? (
                <ul className="divide-y" role="region" aria-live="polite">
                  {searchVehicles.map((vehicle) => (
                    <li
                      key={vehicle.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Car className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            <Highlighted
                              content={vehicle.plate_number}
                              query={searchValue}
                            />
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <Highlighted
                              /* @ts-ignore */
                              content={vehicle.owner.name}
                              query={searchValue}
                            />
                            <Highlighted
                              content={vehicle.asin_number}
                              query={searchValue}
                            />
                            <Highlighted
                              content={vehicle.vin}
                              query={searchValue}
                            />
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/search/${vehicle.plate_number}`)
                          }
                        >
                          View
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No vehicles found</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const Highlighted = ({
  query,
  content,
}: {
  query: string;
  content?: string | null | undefined;
}) => {
  if (!content) return null;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = content.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
};
