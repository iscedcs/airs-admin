"use server";
import { options } from "@/app/api/auth/options";
import { API } from "@/lib/consts";
import { db } from "@/lib/db";
import { PaymentNotifications, Prisma } from "@prisma/client";
import { format } from "date-fns";
import moment from "moment";
import { getServerSession } from "next-auth";

export type PaymentNotificationFilter = {
  startDate?: Date;
  endDate?: Date;
  search?: string;
  tcode?: string;
  plate_number?: string;
  revenueCode?: string;
};

const REVENUE_TYPES = {
  CVOF: "29001001-12040682",
  FAREFLEX: "20008001-12040411",
  ISCE: "20008001-12040632",
};

const REVENUE_CODE_MAP: Record<PaymentType, string> = {
  cvof: REVENUE_TYPES.CVOF,
  "device-maintenance": REVENUE_TYPES.ISCE,
  fareflex: REVENUE_TYPES.FAREFLEX,
};

type RevenueType = keyof typeof REVENUE_TYPES;

export async function getPaymentNotifications(
  page: number = 1,
  pageSize: number = 10,
  filter: PaymentNotificationFilter = {}
) {
  const where: Prisma.PaymentNotificationsWhereInput = {};

  if (filter.startDate && filter.endDate) {
    where.payment_date = {
      gte: filter.startDate,
      lte: filter.endDate,
    };
  }

  if (filter.search) {
    where.OR = [
      { payment_reference: { contains: filter.search, mode: "insensitive" } },
      { customer_name: { contains: filter.search, mode: "insensitive" } },
      { tcode: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter.tcode && filter.plate_number) {
    where.OR = [
      { tcode: { equals: filter.tcode, mode: "insensitive" } },
      { tcode: { equals: filter.plate_number, mode: "insensitive" } },
    ];
  }

  if (filter.revenueCode) {
    where.revenue_code = { equals: filter.revenueCode, mode: "insensitive" };
  }

  const [notifications, totalCount] = await db.$transaction([
    db.paymentNotifications.findMany({
      where,
      select: {
        id: true,
        payment_reference: true,
        customer_name: true,
        payment_date: true,
        amount: true,
        tcode: true,
        revenue_name: true,
        revenue_code: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { payment_date: "desc" },
    }),
    db.paymentNotifications.count({ where }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getPaymentNotificationsByTcode(
  tcode: string,
  page: number = 1,
  pageSize: number = 10
) {
  const [notifications, totalCount] = await db.$transaction([
    db.paymentNotifications.findMany({
      where: { tcode },
      select: {
        id: true,
        payment_reference: true,
        customer_name: true,
        payment_date: true,
        amount: true,
        tcode: true,
        revenue_name: true,
        revenue_code: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { payment_date: "desc" },
    }),
    db.paymentNotifications.count({ where: { tcode } }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getPaymentNotificationByReference(
  paymentReference: string
) {
  return db.paymentNotifications.findFirst({
    where: { payment_reference: paymentReference },
    include: {
      vehicles: true,
    },
  });
}

export async function getPaymentNotificationsByRevenueCode(
  revenueCode: string,
  page: number = 1,
  pageSize: number = 10
) {
  const [notifications, totalCount] = await db.$transaction([
    db.paymentNotifications.findMany({
      where: { revenue_code: revenueCode },
      select: {
        id: true,
        payment_reference: true,
        customer_name: true,
        payment_date: true,
        amount: true,
        tcode: true,
        revenue_name: true,
        revenue_code: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { payment_date: "desc" },
    }),
    db.paymentNotifications.count({ where: { revenue_code: revenueCode } }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getPaymentNotificationsGroupedByTcode(
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  pageSize: number = 10
) {
  const where: Prisma.PaymentNotificationsWhereInput = {};

  if (startDate && endDate) {
    where.payment_date = {
      gte: startDate,
      lte: endDate,
    };
  }

  // @ts-expect-error
  const [groupedNotifications, totalCount] = await db.$transaction([
    db.paymentNotifications.groupBy({
      by: ["tcode"],
      _sum: {
        amount: true,
      },
      _count: {
        payment_reference: true,
      },
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        tcode: "asc",
      },
    }),
    db.paymentNotifications
      .groupBy({
        by: ["tcode"],
        where,
        _count: true,
      })
      .then((result) => result.length),
  ]);

  const formattedGroupedNotifications = groupedNotifications.map(
    (group: any) => ({
      tcode: group.tcode,
      totalAmount: group._sum.amount,
      transactionCount: group._count.payment_reference,
    })
  );

  return {
    groupedNotifications: formattedGroupedNotifications,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getPaymentNotificationById(id: string) {
  return db.paymentNotifications.findUnique({
    where: { id },
    include: {
      vehicles: true,
    },
  });
}

export async function getPaymentTotalsOld(startDate?: Date, endDate?: Date) {
  const now = moment().toDate();
  const startOfDay = moment().startOf("day").toDate();
  const startOfWeek = moment().startOf("week").toDate();
  const startOfMonth = moment().startOf("month").toDate();
  const startOfYear = moment().startOf("year").toDate();

  const [
    allTimeTotal,
    yearToDateTotal,
    monthToDateTotal,
    weekToDateTotal,
    dayToDateTotal,
    customRangeTotal,
  ] = await db.$transaction([
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: { payment_date: { gte: startOfYear } },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: { payment_date: { gte: startOfMonth } },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: { payment_date: { gte: startOfWeek } },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: { payment_date: { gte: startOfDay } },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        payment_date: {
          gte: moment(startDate ?? now)
            .startOf("hour")
            .toDate(),
          lte: moment(endDate ?? now)
            .endOf("hour")
            .toDate(),
        },
      },
    }),
  ]);

  return {
    allTimeTotal: allTimeTotal._sum.amount || 0,
    yearToDateTotal: yearToDateTotal._sum.amount || 0,
    monthToDateTotal: monthToDateTotal._sum.amount || 0,
    weekToDateTotal: weekToDateTotal._sum.amount || 0,
    dayToDateTotal: dayToDateTotal._sum.amount || 0,
    customRangeTotal: customRangeTotal._sum.amount ?? 0,
  };
}

export async function getPaymentTotals({
  endDate,
  revenueType,
  startDate,
}: {
  startDate?: Date;
  endDate?: Date;
  revenueType?: RevenueType;
}) {
  const now = moment().toDate();
  const startOfDay = moment().startOf("day").toDate();
  const startOfWeek = moment().startOf("week").toDate();
  const startOfMonth = moment().startOf("month").toDate();
  const startOfYear = moment().startOf("year").toDate();

  // Create a base where clause
  const baseWhereClause: any = {};
  if (revenueType) {
    baseWhereClause.revenue_code = { startsWith: REVENUE_TYPES[revenueType] };
  }

  const [
    allTimeTotal,
    yearToDateTotal,
    monthToDateTotal,
    weekToDateTotal,
    dayToDateTotal,
    customRangeTotal,
  ] = await db.$transaction([
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: baseWhereClause,
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfYear },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfMonth },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfWeek },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfDay },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: {
          gte: moment(startDate ?? now)
            .startOf("hour")
            .toDate(),
          lte: moment(endDate ?? now)
            .endOf("hour")
            .toDate(),
        },
      },
    }),
  ]);

  return {
    allTimeTotal: allTimeTotal._sum.amount || 0,
    yearToDateTotal: yearToDateTotal._sum.amount || 0,
    monthToDateTotal: monthToDateTotal._sum.amount || 0,
    weekToDateTotal: weekToDateTotal._sum.amount || 0,
    dayToDateTotal: dayToDateTotal._sum.amount || 0,
    customRangeTotal: customRangeTotal._sum.amount ?? 0,
  };
}
export async function getPaymentTotalsForStickers({
  endDate,
  revenueType,
  startDate,
}: {
  startDate?: Date;
  endDate?: Date;
  revenueType?: RevenueType;
}) {
  const now = moment().toDate();
  const startOfDay = moment().startOf("day").toDate();
  const startOfWeek = moment().startOf("week").toDate();
  const startOfMonth = moment().startOf("month").toDate();
  const startOfYear = moment().startOf("year").toDate();

  // Create a base where clause
  const baseWhereClause: any = {};
  if (revenueType) {
    baseWhereClause.revenue_code = { startsWith: REVENUE_TYPES.ISCE };
  }

  const [
    allTimeTotal,
    yearToDateTotal,
    monthToDateTotal,
    weekToDateTotal,
    dayToDateTotal,
    customRangeTotal,
  ] = await db.$transaction([
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: baseWhereClause,
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfYear },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfMonth },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfWeek },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: { gte: startOfDay },
      },
    }),
    db.paymentNotifications.aggregate({
      _sum: { amount: true },
      where: {
        ...baseWhereClause,
        payment_date: {
          gte: moment(startDate ?? now)
            .startOf("hour")
            .toDate(),
          lte: moment(endDate ?? now)
            .endOf("hour")
            .toDate(),
        },
      },
    }),
  ]);

  return {
    allTimeTotal: allTimeTotal._sum.amount || 0,
    yearToDateTotal: yearToDateTotal._sum.amount || 0,
    monthToDateTotal: monthToDateTotal._sum.amount || 0,
    weekToDateTotal: weekToDateTotal._sum.amount || 0,
    dayToDateTotal: dayToDateTotal._sum.amount || 0,
    customRangeTotal: customRangeTotal._sum.amount ?? 0,
  };
}

export async function getPaymentNotificationsByTcodeOrPlateNumber(
  options: { tcode: string; plate_number: string },
  page: number = 1,
  pageSize: number = 10
) {
  const { plate_number, tcode } = options;
  const [notifications, totalCount] = await db.$transaction([
    db.paymentNotifications.findMany({
      where: {
        OR: [
          {
            tcode,
          },
          { tcode: plate_number },
        ],
      },
      select: {
        id: true,
        payment_reference: true,
        customer_name: true,
        payment_date: true,
        amount: true,
        tcode: true,
        revenue_name: true,
        revenue_code: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { payment_date: "desc" },
    }),
    db.paymentNotifications.count({ where: { tcode } }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getChatData(
  frequency: "all" | "yearly" | "monthly" | "weekly" | "daily",
  date: Date,
  revenueType: RevenueType = "CVOF"
) {
  let startDate: Date;
  let endDate: Date;
  let groupBy: string;

  switch (frequency) {
    case "all":
      startDate = new Date(0); // Beginning of time
      endDate = new Date();
      groupBy = "year";
      break;
    case "yearly":
      startDate = moment(date).startOf("year").toDate();
      endDate = moment(date).endOf("year").toDate();
      groupBy = "month";
      break;
    case "monthly":
      startDate = moment(date).startOf("month").toDate();
      endDate = moment(date).endOf("month").toDate();
      groupBy = "week";
      break;
    case "weekly":
      startDate = moment(date).startOf("week").toDate();
      endDate = moment(date).endOf("week").toDate();
      groupBy = "day";
      break;
    case "daily":
      startDate = moment(date).startOf("day").toDate();
      endDate = moment(date).endOf("day").toDate();
      groupBy = "hour";
      break;
  }

  const transactions = await db.paymentNotifications.findMany({
    where: {
      payment_date: {
        gte: startDate,
        lte: endDate,
      },
      revenue_code: REVENUE_TYPES[revenueType],
    },
    select: {
      payment_date: true,
      amount: true,
    },
    orderBy: {
      payment_date: "asc",
    },
  });

  const total = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  let chartData: { date: string; amount: number }[] = [];

  if (frequency === "daily") {
    // For daily, we want to show data in 2-hour intervals
    for (let i = 0; i < 24; i += 1) {
      const hourStart = moment(date).startOf("day").add(i, "hours");
      const hourEnd = moment(date)
        .startOf("day")
        .add(i + 1, "hours");
      const amount = transactions
        .filter((t) => moment(t.payment_date).isBetween(hourStart, hourEnd))
        .reduce((sum, t) => sum + Number(t.amount), 0);
      chartData.push({ date: hourStart.toISOString(), amount });
    }
  } else {
    chartData = transactions.reduce((acc, transaction) => {
      const key = moment(transaction.payment_date)
        .startOf(groupBy as moment.unitOfTime.StartOf)
        .format("YYYY-MM-DD HH:mm:ss");
      const existingEntry = acc.find((entry) => entry.date === key);
      if (existingEntry) {
        existingEntry.amount += Number(transaction.amount);
      } else {
        acc.push({ date: key, amount: Number(transaction.amount) });
      }
      return acc;
    }, [] as { date: string; amount: number }[]);
  }

  return {
    total,
    chartData,
    revenueType,
  };
}

export type PaymentType = "cvof" | "device-maintenance" | "fareflex";
export type PaymentData = {
  payments: PaymentNotifications[];
  dailyTotal: number;
};

// export async function getPayments(type: PaymentType): Promise<PaymentData> {
//   try {
//     // Map payment type to API endpoint path
//     const endpointMap: Record<PaymentType, string> = {
//       cvof: "cvof",
//       "device-maintenance": "device-maintenance",
//       fareflex: "fareflex",
//     };

//     // Fetch from internal API
//     const res = await fetch(
//       `${API}/api/payment-notifications/${endpointMap[type]}`
//     );

//     if (!res.ok) {
//       throw new Error(`Failed to fetch ${type} payments`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error(`Error fetching ${type} payments:`, error);
//     return { payments: [], dailyTotal: 0 };
//   }
// }

export async function getDailyTotal(type: PaymentType): Promise<number> {
  const session = await getServerSession(options);
  try {
    const today = format(new Date(), "yyyy-MM-dd");
    const revenueCode = REVENUE_CODE_MAP[type];

    const response = await fetch(
      `${API}/api/v1/revenue/daily?date=${today}&revenue_code=${revenueCode}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
          accept: "*/*",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch daily total for ${type}`);
    }

    const data = await response.json();
    return data.data.dailyRevenue || 0;
  } catch (error) {
    console.error(`Error fetching daily total for ${type}:`, error);
    return 0;
  }
}

export async function getLatestTransactions(
  type: PaymentType,
  limit = 20
): Promise<PaymentNotifications[]> {
  try {
    // Get the revenue code for this payment type
    const revenueCode = REVENUE_CODE_MAP[type];

    const payments = await db.paymentNotifications.findMany({
      where: {
        revenue_code: revenueCode,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });

    return payments;
  } catch (error) {
    console.error(`Error fetching transactions for ${type}:`, error);
    return [];
  }
}

export async function getPayments(type: PaymentType): Promise<PaymentData> {
  try {
    // Fetch both data points in parallel
    const [dailyTotal, payments] = await Promise.all([
      getDailyTotal(type),
      getLatestTransactions(type),
    ]);

    return {
      payments,
      dailyTotal,
    };
  } catch (error) {
    console.error(`Error fetching payment data for ${type}:`, error);
    return { payments: [], dailyTotal: 0 };
  }
}
