import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;
    const userId = parseInt(body.userId);

    if (isNaN(userId) || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Dữ liệu giỏ hàng rỗng hoặc chưa đăng nhập!" }, { status: 400 });
    }

    interface CheckoutItem {
      productId: any;
      price: number;
      quantity: number;
    }

    // Tính tổng đơn hàng bán (VAT 10%)
    const saleTotal = items.reduce((acc: number, item: CheckoutItem) => acc + (Number(item.price) * Number(item.quantity)), 0);
    
    try {
      await prisma.saleOrder.create({
        data: {
          userId: userId,
          total: saleTotal * 1.1, // VAT 10%
          status: "PENDING",
          items: {
            create: items.map((item: CheckoutItem) => ({
              productId: parseInt(item.productId),
              quantity: parseInt(item.quantity as any),
              price: Number(item.price)
            }))
          }
        }
      });

      return NextResponse.json({ success: true, message: "Lên đơn thành công!" });
    } catch (dbError: any) {
      console.error("Database Error during create:", dbError);
      return NextResponse.json({ success: false, message: "Không thể tạo đơn hàng. Vui lòng kiểm tra lại dữ liệu hoặc kết nối." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Checkout API General Error:", error);
    return NextResponse.json({ success: false, message: `Lỗi xử lý thanh toán: ${error.message}` }, { status: 500 });
  }
}
