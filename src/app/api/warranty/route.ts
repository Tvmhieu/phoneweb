import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, productId, issueDetail } = await req.json();

    if (!userId || !productId || !issueDetail) {
      return NextResponse.json({ success: false, message: "Vui lòng điền đủ thông tin!" }, { status: 400 });
    }

    const claim = await prisma.warrantyClaim.create({
      data: {
        userId,
        productId: parseInt(productId),
        issueDetail,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, message: `Đã gửi yêu cầu bảo hành #${claim.id} thành công!`, id: claim.id });

  } catch (error) {
    console.error("Warranty API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi xử lý yêu cầu bảo hành." }, { status: 500 });
  }
}

// Lấy danh sách ticket bảo hành theo user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Thiếu userId" }, { status: 400 });
    }

    const claims = await prisma.warrantyClaim.findMany({
      where: { userId: parseInt(userId) },
      include: { product: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, claims });
  } catch (error) {
    return NextResponse.json({ success: true, claims: [] });
  }
}
