import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [saleOrders, rentalOrders, activeRentalsCount, pendingWarranties, pendingSales, pendingRentals, totalProducts, totalCustomers] = await Promise.all([
      prisma.saleOrder.findMany({
        where: { status: { in: ["PAID", "DELIVERED", "PENDING"] } },
        select: { total: true, status: true, createdAt: true }
      }),
      prisma.rentalOrder.findMany({
        where: { status: { in: ["ACTIVE", "RETURNED", "PENDING"] } },
        select: { totalRental: true, status: true, createdAt: true }
      }),
      prisma.rentalOrder.count({ where: { status: "ACTIVE" } }),
      prisma.warrantyClaim.count({ where: { status: "PENDING" } }),
      prisma.saleOrder.count({ where: { status: "PENDING" } }),
      prisma.rentalOrder.count({ where: { status: "PENDING" } }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } })
    ]);

    const revenueSales = saleOrders
      .filter((order) => order.status === "PAID" || order.status === "DELIVERED")
      .reduce((acc, order) => acc + order.total, 0);

    const revenueRentals = rentalOrders
      .filter((order) => order.status === "ACTIVE" || order.status === "RETURNED")
      .reduce((acc, order) => acc + order.totalRental, 0);

    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    const monthLabels = monthKeys.map((key) => {
      const [year, month] = key.split("-");
      return `T${Number(month)}/${year}`;
    });

    const revenueByMonth = new Map<string, { doanhThuBan: number; doanhThuThue: number }>();
    monthKeys.forEach((key) => revenueByMonth.set(key, { doanhThuBan: 0, doanhThuThue: 0 }));

    saleOrders
      .filter((order) => order.status === "PAID" || order.status === "DELIVERED")
      .forEach((order) => {
        const date = new Date(order.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const bucket = revenueByMonth.get(key);
        if (bucket) bucket.doanhThuBan += order.total;
      });

    rentalOrders
      .filter((order) => order.status === "ACTIVE" || order.status === "RETURNED")
      .forEach((order) => {
        const date = new Date(order.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const bucket = revenueByMonth.get(key);
        if (bucket) bucket.doanhThuThue += order.totalRental;
      });

    const chartData = monthKeys.map((key, index) => ({
      name: monthLabels[index],
      doanhThuBan: revenueByMonth.get(key)?.doanhThuBan || 0,
      doanhThuThue: revenueByMonth.get(key)?.doanhThuThue || 0
    }));

    return NextResponse.json({
      success: true,
      stats: {
        revenue: revenueSales + revenueRentals,
        salesRevenue: revenueSales,
        rentalRevenue: revenueRentals,
        activeRentals: activeRentalsCount,
        pendingErrors: pendingWarranties,
        pendingOrders: pendingSales + pendingRentals,
        pendingSales,
        pendingRentals,
        totalProducts,
        totalCustomers,
        chartData
      }
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi thống kê: " + error.message }, { status: 500 });
  }
}
