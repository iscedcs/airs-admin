"use client";
import { loadingSpinner, searchIcon } from "@/lib/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VerifyAsinPage() {
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [searchValue, setSearchValue] = useState("");
     const router = useRouter();
     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setIsLoading(true);
          router.push(`/vehicles/verify/${searchValue}`);
     };

     return (
          <form
               className={`relative flex h-14 w-full items-center overflow-hidden rounded-[40px] text-body`}
               onSubmit={handleSubmit}
          >
               <Button
                    type="submit"
                    variant="default"
                    className="absolute z-10 aspect-square h-14 w-14 rounded-none"
               >
                    {isLoading ? loadingSpinner : searchIcon}
               </Button>
               <input
                    name="search"
                    type="text"
                    placeholder={"Enter T-code or platenumber"}
                    value={searchValue}
                    required
                    onChange={(e) => setSearchValue(e.target.value)} // Update searchValue when the input changes
                    className={`absolute h-14 w-full rounded-2xl bg-secondary py-4 pl-16 focus:outline-0`}
               />
          </form>
     );
}
