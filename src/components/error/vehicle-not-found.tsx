"use client";
import Link from "next/link";
import { Car, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VehicleNotFound({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Car className="h-12 w-12 text-muted-foreground" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-2">
        Vehicle Not Found
      </h1>

      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the vehicle you're looking for in our system.
      </p>

      {isAdmin && (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button asChild className="flex-1">
            <Link href="/vehicles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex-1">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Vehicles
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
