"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FNTC, VEHICLE_CATEGORIES_PRICE } from "@/lib/consts";

interface VehicleCategoryUpdaterProps {
  vehicleId: string;
  currentCategory?: string;
  noBalanceUpdate?: boolean;
}

export default function VehicleCategoryUpdater({
  vehicleId,
  currentCategory = "",
  noBalanceUpdate = true,
}: VehicleCategoryUpdaterProps) {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateVehicleCategory = async (category: string) => {
    if (!category || category === currentCategory) return;

    setIsUpdating(true);

    const payload = {
      category,
      noBalanceUpdate,
    };
    console.log({ payload });
    try {
      const response = await fetch(`/api/update-category/${vehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update category: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      toast.success("Vehicle category updated successfully", {
        description: `Category changed to ${category}`,
      });

      setSelectedCategory(category);
    } catch (error) {
      console.error({ error });

      toast.error("Failed to update vehicle category", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });

      // Reset to previous value on error
      setSelectedCategory(currentCategory);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateVehicleCategory(value);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Update Vehicle Category</CardTitle>
        <CardDescription>
          Change the category for vehicle ID: {vehicleId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category-select">Vehicle Category</Label>
          <div className="relative">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
              disabled={isUpdating}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select a vehicle category" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_CATEGORIES_PRICE.map((cat, i) => (
                  <SelectItem value={cat.name} key={i}>
                    {cat.name.split("_").join(" ")} - {FNTC.format(cat.price)}
                    /Week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUpdating && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {selectedCategory && (
          <div className="text-sm text-muted-foreground">
            Current category:{" "}
            <span className="font-medium">{selectedCategory}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
