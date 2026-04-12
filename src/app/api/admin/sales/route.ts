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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Thiếu ID" }, { status: 400 });

    const orderId = parseInt(id);
    await prisma.saleOrderItem.deleteMany({ where: { orderId } });
    await prisma.saleOrder.delete({ where: { id: orderId } });
    
    return NextResponse.json({ success: true, message: "Đã xóa hóa đơn bán hàng" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi xóa hóa đơn" }, { status: 500 });
  }
}
