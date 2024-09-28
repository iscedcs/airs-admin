"use server";

import { db } from "@/lib/db";
import { $Enums } from "@prisma/client";

// Pagination parameters: page, pageSize, and filtering by role
interface AllUsersFetchParams {
     page?: number;
     pageSize?: number;
     role?: $Enums.users_role_enum; // Optional role filter
}

interface AllAgentsCreatedByAdminIdFetchParams {
     page?: number;
     pageSize?: number;
     adminId: string;
}

export const allUsers = async ({
     page = 1,
     pageSize = 10,
     role,
}: AllUsersFetchParams) => {
     try {
          // Calculate the offset for pagination
          const skip = (page - 1) * pageSize;

          // Build the query object dynamically based on whether role is provided
          const query = {
               skip,
               take: pageSize,
               select: {
                    id: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                    name: true,
                    phone: true,
                    email: true,
                    role: true,
                    blacklisted: true,
                    address: true,
                    identification: true,
               },
               where: {}, // Default empty filter
          };

          // Add role filter to the query if a role is provided
          if (role) {
               query.where = { role };
          }

          // Fetch users with the optional role filter and pagination
          const users = await db.users.findMany(query);

          // Fetch the total number of users with the same role (or all users if no role filter)
          const totalUsers = await db.users.count({
               where: role ? { role } : {},
          });

          return {
               success: {
                    message: "OKAY",
                    data: users,
                    totalUsers, // Total count of users with the current filter
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / pageSize), // Calculate total pages for front-end
               },
          };
     } catch (error) {
          console.error("Error fetching users:", error);
          return { error: "Something went wrong!!!" };
     }
};

export const allAgentsCreatedByAdminId = async ({
     page = 1,
     pageSize = 10,
     adminId,
}: AllAgentsCreatedByAdminIdFetchParams) => {
     try {
          // Calculate the offset for pagination
          const skip = (page - 1) * pageSize;

          // Build the query object dynamically based on whether role is provided
          const query = {
               skip,
               take: pageSize,
               select: {
                    id: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                    name: true,
                    phone: true,
                    email: true,
                    role: true,
                    blacklisted: true,
                    address: true,
                    identification: true,
               },
               where: {}, // Default empty filter
          };

          // Fetch users with the optional role filter and pagination
          const users = await db.users.findMany(query);

          // Fetch the total number of users with the same role (or all users if no role filter)
          const totalUsers = await db.users.count({
               where: {
                    role: "AGENT",
               },
          });

          return {
               success: {
                    message: "OKAY",
                    data: users,
                    totalUsers, // Total count of users with the current filter
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / pageSize), // Calculate total pages for front-end
               },
          };
     } catch (error) {
          console.error("Error fetching users:", error);
          return { error: "Something went wrong!!!" };
     }
};
