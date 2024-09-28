"use server";

import { db } from "@/lib/db";
import { vehicle_transactions_transaction_category_enum } from "@prisma/client";

interface FetchVehicleParams {
     page?: number;
     pageSize?: number;
}

export const allVehicles = async ({
     page = 1,
     pageSize = 10,
}: FetchVehicleParams) => {
     try {
          // Calculate the offset for pagination
          const skip = (page - 1) * pageSize;

          const query = {
               skip,
               take: pageSize,
               // select: {
               //      id: true,
               //      created_at: true,
               //      updated_at: true,
               //      deleted_at: true,
               // },
               where: {}, // Default empty filter
          };

          const vehicles = await db.vehicles.findMany(query);

          // Fetch the total number of vehicles with the same role (or all vehicles if no role filter)
          const totalVehicles = await db.vehicles.count();

          return {
               success: {
                    message: "OKAY",
                    data: vehicles,
                    totalVehicles, // Total count of vehicles with the current filter
                    currentPage: page,
                    totalPages: Math.ceil(totalVehicles / pageSize), // Calculate total pages for front-end
               },
          };
     } catch (error) {
          console.error("Error fetching vehicles:", error);
          return { error: "Something went wrong!!!" };
     }
};

export const allVehiclesCount = async () => {
     try {
          const vehiclesCount = await db.vehicles.count();

          return {
               success: {
                    message: "OKAY",
                    data: vehiclesCount,
               },
          };
     } catch {
          return { error: "Something went wrong!!!" };
     }
};

export const allVehiclesRegisteredByAgentId = async (userId: string) => {
     try {
          const vehiclesCount = await db.audit_trails.findMany({
               where: {
                    name: "VEHICLE_UPDATED",
                    meta: {
                         path: ["user", "id"],
                         equals: userId,
                    },
               },
          });

          // Use a Set to store unique plate numbers
          const uniquePlateNumbers = new Set<string>();

          vehiclesCount.forEach((vehicle) => {
               // Assuming the plate number is always in the format "Vehicle <plate_number> information was updated successfully"
               const regex = /Vehicle\s(\w+)\sinformation/; // This regex captures the plate number
               const match = vehicle.description.match(regex);

               if (match) {
                    const plateNumber = match[1]; // Get the plate number from the regex match
                    uniquePlateNumbers.add(plateNumber); // Add to the set for unique entries
               }
          });

          // Return the count of unique plate numbers
          return {
               success: {
                    message: "OKAY",
                    data: {
                         vehicles: uniquePlateNumbers,
                         count: uniquePlateNumbers.size,
                    }, // Return the count of unique plate numbers
               },
          };
     } catch (error) {
          console.error(error);
          return { error: "Something went wrong!!!" };
     }
};

export const getVehicleBySticker = async (barcode: string) => {
     try {
          const vehicle = await db.vehicles.findFirst({
               where: {
                    barcode,
               },
          });
          if (vehicle) {
               return {
                    success: {
                         message: "OKAY",
                         data: {
                              vehicle,
                         }, // Return the count of unique plate numbers
                    },
               };
          } else {
               return undefined;
          }
     } catch (error) {
          return {
               error: `Could not fetch vehicle with barcode ${barcode}`,
          };
     }
};
export const getVehicleCategoriesData = async (
     categories: vehicle_transactions_transaction_category_enum[],
) => {
     try {
          // Query the database to count vehicles in each category
          const vehicles = await db.vehicles.groupBy({
               by: ["category"],
               _count: {
                    category: true,
               },
               where: {
                    category: {
                         in: categories,
                    },
               },
          });

          // Structure the result
          const categoryCounts = categories.reduce(
               (acc, category) => {
                    const categoryData = vehicles.find(
                         (v) => v.category === category,
                    );
                    acc[category] = categoryData
                         ? categoryData._count.category
                         : 0;
                    return acc;
               },
               {} as Record<
                    vehicle_transactions_transaction_category_enum,
                    number
               >,
          );

          // Return the counts for the predefined categories
          return categoryCounts;
     } catch (error) {
          console.error("Error fetching vehicle data: ", error);
          throw new Error("Failed to get vehicle category data");
     }
};
export const getVehicleCategoriesCounts = async () => {
     try {
          // Query the database to count vehicles grouped by category
          const vehicles = await db.vehicles.groupBy({
               by: ["category"],
               _count: {
                    category: true,
               },
          });

          // Query the database to get the total count of vehicles
          const totalVehicles = await db.vehicles.count();

          // Structure the result by mapping the counts of each category
          const categoryCounts = vehicles.reduce(
               (acc, vehicle) => {
                    acc[vehicle.category || "OTHERS"] = vehicle._count.category;
                    return acc;
               },
               {} as Record<string, number>, // Use 'string' since categories may be dynamic
          );

          // Return the counts for all categories found in the database
          return {
               totalVehicles, // Total count of all vehicles
               categories: categoryCounts, // Count of vehicles per category
          };
     } catch (error) {
          console.error("Error fetching vehicle data: ", error);
          throw new Error("Failed to get vehicle category data");
     }
};
