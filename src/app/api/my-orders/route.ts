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

    // Kiểm tra quyền hạn (Chỉ CUSTOMER mới có lịch sử mua hàng kiểu này)
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (!user || user.role !== "CUSTOMER") {
        return NextResponse.json({ success: false, message: "Quyền truy cập không hợp lệ" }, { status: 403 });
    }

    // Lấy tất cả đơn hàng bán
    const sales = await prisma.saleOrder.findMany({
      where: { userId: id },
      include: { 
        items: { 
          include: { 
            product: true 
          } 
        } 
      },
      orderBy: { createdAt: "desc" }
    });

    // Lấy tất cả đơn hàng thuê
    const rentals = await prisma.rentalOrder.findMany({
      where: { userId: id },
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
      sales, 
      rentals 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
