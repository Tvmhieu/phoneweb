import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Thiếu userId" }, { status: 400 });
    }

    const id = parseInt(userId);

    // Lấy đơn hàng (Sales)
    const sales = await prisma.saleOrder.findMany({
      where: { userId: id, status: "PAID" },
      include: { 
        items: { 
          include: { 
            product: true 
          } 
        } 
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ 
      success: true, 
      sales
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
