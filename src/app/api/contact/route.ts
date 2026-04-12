import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đủ họ tên, email và nội dung." },
        { status: 400 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        message: String(message).trim(),
      },
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      message: "Đã gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm.",
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ khi gửi liên hệ." },
      { status: 500 }
    );
  }
}
