import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const claims = await prisma.warrantyClaim.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: true, user: true }
    });
    return NextResponse.json({ success: true, claims });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tải bảo hành" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId, issueDetail } = await req.json();
    const claim = await prisma.warrantyClaim.create({
      data: { userId, productId, issueDetail, status: "PENDING" }
    });
    return NextResponse.json({ success: true, claim });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tạo phiếu sự cố" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status, resolution, techNote } = await req.json();
    const updated = await prisma.warrantyClaim.update({
        where: { id },
        data: { 
          ...(status ? { status } : {}), 
          ...(resolution !== undefined ? { resolution } : {}),
          ...(techNote !== undefined ? { techNote } : {})
        }
    });
    return NextResponse.json({ success: true, claim: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật bảo hành" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");
    if (!id) return NextResponse.json({ success: false, message: "ID không hợp lệ" }, { status: 400 });
    await prisma.warrantyClaim.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa sự cố" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi xóa sự cố" }, { status: 500 });
  }
}
