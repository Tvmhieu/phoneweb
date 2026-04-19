import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "temp"; // Nếu chưa có ID thì vào temp

    if (!file) {
      return NextResponse.json({ success: false, message: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo thư mục theo sản phẩm
    const relativeDir = path.join("products", productId.toString());
    const uploadDir = path.join(process.cwd(), "public", "uploads", relativeDir);
    
    // Đảm bảo thư mục tồn tại
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filename = Date.now() + "_" + file.name.replace(/\s/g, "_");
    const relativePath = `/uploads/products/${productId}/${filename}`;
    const absolutePath = path.join(uploadDir, filename);

    await writeFile(absolutePath, buffer);

    return NextResponse.json({ success: true, url: relativePath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Lỗi khi upload file" }, { status: 500 });
  }
}
