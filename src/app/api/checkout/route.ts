import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Dữ liệu giỏ hàng rỗng hoặc chưa đăng nhập!" }, { status: 400 });
    }

    // Tách riêng danh sách Hàng Bán (BUY) và Hàng Thuê (RENT)
    const buyItems = items.filter((item: any) => item.type === "BUY");
    const rentItems = items.filter((item: any) => item.type === "RENT");

    // 1. Tạo Hóa Đơn Bán Hàng (SaleOrder) Nếu có thiết bị chọn Mua
    if (buyItems.length > 0) {
      const saleTotal = buyItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      
      await prisma.saleOrder.create({
        data: {
          userId,
          total: saleTotal * 1.1, // VAT 10%
          status: "PENDING",
          items: {
            create: buyItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
    }

    // 2. Tạo Hợp Đồng Khung Cho Thuê (RentalOrder) Nếu có máy Thuê
    if (rentItems.length > 0) {
      const rentalTotal = rentItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity * item.rentalDays), 0);
      // Giả lập tiền cọc là 50% tổng cước thuê 
      const mockDeposit = rentalTotal * 0.5;

      await prisma.rentalOrder.create({
        data: {
          userId,
          deposit: mockDeposit,
          totalRental: rentalTotal * 1.1, // VAT 10%
          status: "PENDING",
          startDate: new Date(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (rentItems[0].rentalDays || 1)), // Lấy ngày của sản phẩm đầu để demo
          items: {
             create: rentItems.map((item: any) => ({
               productId: item.productId,
               quantity: item.quantity,
               pricePerDay: item.price
             }))
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Lên đơn thành công!" });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi kết nối CSDL khi thanh toán." }, { status: 500 });
  }
}
