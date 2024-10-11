import AdvancedSearch from "@/components/ui/advanced-search";
// import Searchbar from '@/components/ui/searchbar';
import React from "react";

export default function SearchDriver() {
  return (
    <div className="max-w-[500px] p-2 mx-auto my-[100px]">
      <AdvancedSearch placeholder="Search vehicle Plate, Name and Tcode" variant="primary" />
    </div>
  );
}