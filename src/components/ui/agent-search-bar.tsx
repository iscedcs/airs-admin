"use client";
import { Loader2, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./button";

export default function AgentSearchBar({
     placeholder,
     variant,
}: {
     placeholder: string;
     variant: string;
}) {
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [searchValue, setSearchValue] = useState("");
     const router = useRouter();

     const variants =
          variant === "primary"
               ? "bg-secondary text-primary-400"
               : variant === "secondary"
                 ? "bg-transparent border border-black"
                 : "bg-primary-900 text-primary-400";

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setIsLoading(true);
          router.push(`/vehicles/search/${searchValue}`);
     };

     return (
          <form
               className={`relative flex h-14 w-full items-center overflow-hidden rounded-[40px] text-body ${variants}`}
               onSubmit={handleSubmit}
          >
               <Button
                    type="submit"
                    variant="default"
                    className="absolute z-10 aspect-square h-full rounded-none"
               >
                    {isLoading ? (
                         <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                         <SearchIcon className="h-4 w-4" />
                    )}
               </Button>
               <input
                    name="search"
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    required
                    onChange={(e) => setSearchValue(e.target.value)} // Update searchValue when the input changes
                    className={`absolute h-14 w-full rounded-2xl bg-transparent py-4 pl-24 focus:outline-0`}
               />
          </form>
     );
}
