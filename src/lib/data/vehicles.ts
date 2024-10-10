
import { Prisma } from '@prisma/client'
import { db } from '../db'

export type VehicleFilter = {
  status?: 'INACTIVE' | 'ACTIVE' | 'CLEARED' | 'OWING'
  category?: string
  type?: string
  search?: string
}

export async function getVehicles(
  page: number = 1,
  pageSize: number = 10,
  filter: VehicleFilter = {}
) {
  const where: Prisma.vehiclesWhereInput = {}

  if (filter.status) {
    where.status = filter.status
  }

  if (filter.category) {
    where.category = filter.category
  }

  if (filter.type) {
    where.type = filter.type
  }

  if (filter.search) {
    where.OR = [
      { plate_number: { contains: filter.search, mode: 'insensitive' } },
      { vin: { contains: filter.search, mode: 'insensitive' } },
      { asin_number: { contains: filter.search, mode: 'insensitive' } },
    ]
  }

  const [vehicles, totalCount] = await db.$transaction([
    db.vehicles.findMany({
      where,
      select: {
        id: true,
        plate_number: true,
        color: true,
        category: true,
        type: true,
        status: true,
        asin_number: true,
        t_code: true,
        created_at: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: 'desc' },
    }),
    db.vehicles.count({ where }),
  ])

  return {
    vehicles,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  }
}

export async function getVehicleById(id: string) {
  return db.vehicles.findUnique({
    where: { id },
    include: {
      drivers: true,
      vehicle_wallets: true,
      vehicle_trackers: true,
      vehicle_transactions: {
        take: 5,
        orderBy: { created_at: 'desc' },
      },
    },
  })
}