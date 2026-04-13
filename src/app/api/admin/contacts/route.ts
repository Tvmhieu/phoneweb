import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tải hộp thư" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, isRead } = await req.json();
    const updated = await prisma.contactMessage.update({
        where: { id },
        data: { isRead }
    });
    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi đánh dấu thư" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Thiếu ID" }, { status: 400 });

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true, message: "Đã xóa liên hệ" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi khi xóa liên hệ" }, { status: 500 });
  }
}
