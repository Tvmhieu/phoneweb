import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"] },
        isDeleted: false
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
    const { name, email, password, role, phone } = await req.json();

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
    const { id, name, email, role, phone, password } = await req.json();

    if (!id || !email || !role) {
      return NextResponse.json({ success: false, message: "Thiếu dữ liệu bắt buộc" }, { status: 400 });
    }

    interface UserUpdateData {
      name?: string;
      email: string;
      role: string;
      phone?: string;
      password?: string;
    }

    const updateData: UserUpdateData = { name, email, role, phone };
    if (password) {
      updateData.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
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

    await prisma.user.update({ 
      where: { id: parseInt(id) },
      data: { isDeleted: true }
    });
    return NextResponse.json({ success: true, message: "Đã xóa người dùng khỏi danh sách hoạt động" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi xóa người dùng (Có thể user này đã có đơn hàng)" }, { status: 500 });
  }
}
