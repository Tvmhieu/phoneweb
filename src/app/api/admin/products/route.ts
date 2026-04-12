import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          brand: true,
          category: true,
          description: true,
          imageUrl: true,
          stock: true,
          price: true,
          warrantyMonths: true,
          isRentable: true,
          rentalPricePerDay: true,
          createdAt: true,
          updatedAt: true,
          images: {
            select: { url: true }
          }
        }
    });
    const normalizedProducts = products.map((product) => ({
      ...product,
      allImages: product.images.map((image) => image.url)
    }));
    return NextResponse.json({ success: true, products: normalizedProducts });
  } catch (error: any) {
    console.error("Products GET Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải kho: " + error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const isUpdating = !!data.id;
    
    // Xử lý logic type number
    const stock = Number(data.stock) || 0;
    const price = Number(data.price) || 0;
    const warrantyMonths = Number(data.warrantyMonths) || 12;
    const rentalPricePerDay = Number(data.rentalPricePerDay) || null;
    
    // Mảng link ảnh (tối đa 10)
    const imagesData = Array.isArray(data.allImages) ? data.allImages.slice(0, 10) : [];

    if (isUpdating) {
        // Cập nhật sản phẩm và xóa ảnh cũ để thay bằng ảnh mới (đơn giản hóa)
        const p = await prisma.product.update({
            where: { id: data.id },
            data: {
               name: data.name,
               brand: data.brand,
               category: data.category,
               description: data.description,
               imageUrl: data.imageUrl || null,
               stock,
               price,
               warrantyMonths,
               isRentable: data.isRentable,
               rentalPricePerDay,
               images: {
                 deleteMany: {},
                 create: imagesData.map((url: string) => ({ url }))
               }
            }
        });
        return NextResponse.json({ success: true, product: p });
    } else {
        const p = await prisma.product.create({
            data: {
               name: data.name,
               brand: data.brand,
               category: data.category,
               description: data.description,
               imageUrl: data.imageUrl || null,
               stock,
               price,
               warrantyMonths,
               isRentable: data.isRentable,
               rentalPricePerDay,
               images: {
                 create: imagesData.map((url: string) => ({ url }))
               }
            }
        });
        return NextResponse.json({ success: true, product: p });
    }
  } catch (error) {
    console.error("Product Save Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi lưu kho thiết bị" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Thiếu ID" }, { status: 400 });

    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm khỏi kho" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi xóa sản phẩm. Có thể sản phẩm này đang nằm trong đơn hàng." }, { status: 500 });
  }
}
