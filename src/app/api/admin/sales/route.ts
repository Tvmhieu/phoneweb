import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sales = await prisma.saleOrder.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, items: { include: { product: true } } }
    });
    return NextResponse.json({ success: true, sales });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tải đơn bán" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status, adminNotes } = await req.json();
    const updated = await prisma.saleOrder.update({
        where: { id },
        data: { ...(status ? { status } : {}), ...(adminNotes !== undefined ? { adminNotes } : {}) }
    });
    return NextResponse.json({ success: true, sale: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật đơn bán" }, { status: 500 });
  }
}
