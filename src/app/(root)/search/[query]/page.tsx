import SearchVehicle from "@/components/pages/vehicle/search-vehicle";

export default function SearchPage({ params }: { params: { query: string } }) {
     return (
          <div className="w-full">
               <SearchVehicle id={params.query} />
          </div>
     );
}
