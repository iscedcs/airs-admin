'use server'

import { db } from "@/lib/db";

export async function getGroupsAction(page: number = 1, pageSize: number = 20) {

    const [vehicle_groups, totalCount] = await db.$transaction([
         db.vehicle_groups.findMany({
              select: {
                   id: true,
                  groupName: true,
                  totalCharge: true,
                  _count: true,
                  vehicles: true,
                  created_at: true,
                  updated_at: true,
                  deleted_at: true,
              },
              skip: (page - 1) * pageSize,
              take: pageSize,
              orderBy: { created_at: "desc" },
         }),
         db.vehicle_groups.count()
    ]);

    return {
        vehicle_groups,
         pagination: {
              page,
              pageSize,
              totalCount,
              totalPages: Math.ceil(totalCount / pageSize),
         },
    };
}
export async function getGroupsByName() {

    const [groupName] = await db.$transaction([
         db.vehicle_groups.findMany({
              select: {
                  groupName: true,
                  
              },

         }),
    ]);

    return {
        groupName,
        
    };
}
export async function getGroupsId(page: number = 1, pageSize: number = 20, id: string) {

    const [vehicle_groups, totalCount] = await db.$transaction([
         db.vehicle_groups.findMany({
              select: {
                   id: true,
                  groupName: true,
                  totalCharge: true,
                  _count: true,
                  vehicles: true,
                  created_at: true,
                  updated_at: true,
                  deleted_at: true,
              },
              skip: (page - 1) * pageSize,
              take: pageSize,
              orderBy: { created_at: "desc" },
         }),
         db.vehicle_groups.count(),
    ]);

    return {
        vehicle_groups,
        id,
         pagination: {
              page,
              pageSize,
              totalCount,
              totalPages: Math.ceil(totalCount / pageSize),
         },
    };
}
export async function getGroupById(id?: string) {
     if (!id) return null
     try {
          const group = await db.vehicle_groups.findUnique({
               where: { id },
               select: {
                    vehicles: true,
                    _count: true,
                    created_at: true,
                    deleted_at: true,
                    groupName: true,
                    id: true,
                    totalCharge: true,
                    updated_at: true
               }
          })
          return group
     } catch (error) {
          return null
     }
}

export async function getGroups() {
     try {
          const groups = await db.vehicle_groups.findMany({
               select: {
                    groupName: true,
                    id: true,
               }
          })
          return groups
     } catch (error) {
          return null
     }
}
