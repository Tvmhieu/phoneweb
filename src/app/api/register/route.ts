import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, address } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin bắt buộc!" }, { status: 400 });
    }

    // Kiểm tra trùng lặp email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email này đã được sử dụng!" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    // Tạo User vào SQL Server (Role mặc định là CUSTOMER theo Prisma)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
      }
    });

    return NextResponse.json({ success: true, message: "Tạo tài khoản thành công!" });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi máy chủ CSDL." }, { status: 500 });
  }
}
