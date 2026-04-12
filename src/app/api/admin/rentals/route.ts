import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rentals = await prisma.rentalOrder.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, items: { include: { product: true } } }
    });
    return NextResponse.json({ success: true, rentals });
  } catch (error: any) {
    console.error("Rentals GET Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải đơn thuê: " + error.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const { id, status, adminNotes, returnDate, returnNote, isDepositRefunded } = await req.json();
    const cleanId = Number(id);
    if (!cleanId) return NextResponse.json({ success: false, message: "ID hợp đồng không hợp lệ" }, { status: 400 });

    const updated = await prisma.rentalOrder.update({
        where: { id: cleanId },
        data: { 
            ...(status ? { status } : {}), 
            ...(adminNotes !== undefined ? { adminNotes } : {}),
            ...(returnDate ? { returnDate: new Date(returnDate) } : {}),
            ...(returnNote !== undefined ? { returnNote } : {}),
            ...(isDepositRefunded !== undefined ? { isDepositRefunded, depositRefundDate: isDepositRefunded ? new Date() : null } : {})
        }
    });
    return NextResponse.json({ success: true, rent: updated });
  } catch (error: any) {
    console.error("Rentals PUT Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật đơn thuê: " + error.message }, { status: 500 });
  }
}
