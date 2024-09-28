"use server";

import { db } from "@/lib/db";

export const getAgentRegisteredByAdminId = async ({
     userId,
     page = 1,
     pageSize = 10,
}: {
     userId: string;
     page?: number;
     pageSize?: number;
}) => {
     try {
          const skip = (page - 1) * pageSize;

          const allAgentsByAdminId = await db.audit_trails.findMany({
               skip,
               take: pageSize,
               where: {
                    userId,
                    name: "USER_CREATED",
                    description: {
                         contains: "AGENT",
                    },
               },
          });

          const totalAgents = await db.audit_trails.count({
               where: {
                    userId,
                    name: "USER_CREATED",
                    description: {
                         contains: "AGENT",
                    },
               },
          });
          return {
               success: {
                    message: "OKAY",
                    data: allAgentsByAdminId,
                    totalAgents, // Total count of users with the current filter
                    currentPage: page,
                    totalPages: Math.ceil(totalAgents / pageSize), // Calculate total pages for front-end
               },
          };
     } catch (error) {
          console.error("Error fetching users:", error);
          return { error: "Something went wrong!!!" };
     }
};
