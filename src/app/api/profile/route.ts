import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ success: false, message: "Thiếu userId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          role: true,
          createdAt: true
      }
    });

    if (!user) return NextResponse.json({ success: false, message: "Không tìm thấy người dùng" }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, name, phone, address } = await req.json();

    if (!userId) return NextResponse.json({ success: false, message: "Thiếu userId" }, { status: 400 });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name,
        phone,
        address
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
