import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Dữ liệu giỏ hàng rỗng hoặc chưa đăng nhập!" }, { status: 400 });
    }

    // Tính tổng đơn hàng bán (VAT 10%)
    const saleTotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    await prisma.saleOrder.create({
      data: {
        userId,
        total: saleTotal * 1.1, // VAT 10%
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, message: "Lên đơn thành công!" });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi kết nối CSDL khi thanh toán." }, { status: 500 });
  }
}
