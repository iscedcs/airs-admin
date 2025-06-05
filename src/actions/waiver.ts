"use server"

import { db } from "@/lib/db"

export const getWaiverDueToDisablementById = async (vehicleId: string) => {
  const today = new Date()

  const activeWaiver = await db.vehicle_waivers.findFirst({
    where: {
      reason: "DISABLED",
      status: "APPROVED",
      vehicleId,
      start_date: { lte: today },
      end_date: { gte: today },
    },
  })

  if (!activeWaiver) {
    return null
  }

  const daysLeft = Math.ceil((activeWaiver.end_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const totalDuration = Math.ceil(
    (activeWaiver.end_date.getTime() - activeWaiver.start_date.getTime()) / (1000 * 60 * 60 * 24),
  )
  const isExpiringSoon = daysLeft <= 30

  const waiverInfo = {
    id: activeWaiver.id,
    createdAt: activeWaiver.created_at.toISOString(),
    updatedAt: activeWaiver.updated_at.toISOString(),
    deletedAt: activeWaiver.deleted_at ? activeWaiver.deleted_at.toISOString() : null,
    reason: activeWaiver.reason,
    additionalInfo: activeWaiver.additional_info,
    startDate: activeWaiver.start_date.toISOString().split("T")[0], // YYYY-MM-DD format
    endDate: activeWaiver.end_date.toISOString().split("T")[0], // YYYY-MM-DD format
    status: activeWaiver.status,
    vehicleId: activeWaiver.vehicleId,
    approvedById: activeWaiver.approvedById,
    daysLeft,
    totalDuration,
    isExpiringSoon,
  }

  return waiverInfo
}