import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"] }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tải danh sách người dùng" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, companyName, phone } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email đã tồn tại" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyName,
        phone
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi tạo tài khoản" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email, role, companyName, phone, password } = await req.json();

    const data: any = { name, email, role, companyName, phone };
    if (password) {
      data.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật tài khoản" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Thiếu ID" }, { status: 400 });

    await prisma.user.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: "Đã xóa người dùng" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi xóa người dùng (Có thể user này đã có đơn hàng)" }, { status: 500 });
  }
}
