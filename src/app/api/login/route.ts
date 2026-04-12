import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Vui lòng điền đủ thông tin!" }, { status: 400 });
    }

    // 1. Tìm user trong cơ sở dữ liệu thật (MS SQL Server)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Email không tồn tại trong hệ thống." }, { status: 404 });
    }

    // 2. So sánh mật khẩu (Hỗ trợ cả mật khẩu đã băm và mật khẩu cũ chưa băm)
    const isHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$");
    let passwordMatched = false;

    if (isHashed) {
      passwordMatched = await compare(password, user.password);
    } else {
      // Dành cho các tài khoản Admin/Customer cũ được tạo trước khi áp dụng mã hóa bcrypt
      passwordMatched = (password === user.password);
    }

    if (!passwordMatched) {
      return NextResponse.json({ success: false, message: "Sai mật khẩu!" }, { status: 401 });
    }

    // 3. Trả về thành công kèm thông tin Quyền Hạn
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      } 
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi kết nối CSDL." }, { status: 500 });
  }
}
