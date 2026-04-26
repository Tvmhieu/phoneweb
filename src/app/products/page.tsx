import prisma from "@/lib/prisma";
import ProductCatalog from "@/components/ProductCatalog";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const fallbackProducts = [
  { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", category: "IPHONE", price: 30990000, stock: 50, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "SAMSUNG", price: 28490000, stock: 35, imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Xiaomi 14 Ultra 5G", brand: "Xiaomi", category: "XIAOMI", price: 22990000, stock: 20, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351af963?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Oppo Find X7 Ultra", brand: "Oppo", category: "OPPO", price: 19990000, stock: 15, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "iPad Pro M4 11-inch (2024)", brand: "Apple", category: "TABLET", price: 26990000, stock: 25, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" },
];

export default async function ProductsPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      where: {
        AND: [
          { isVisible: true },
          { isDeleted: false }
        ]
      },
      include: { images: { select: { url: true } } }
    });
    if (products.length === 0) products = fallbackProducts;
  } catch (error) {
    console.error("Lỗi kết nối CSDL:", error);
    products = fallbackProducts;
  }

  return (
    <Suspense fallback={<div className="text-center py-5"><div className="spinner-border text-primary"></div></div>}>
      <ProductCatalog initialProducts={products} />
    </Suspense>
  );
}
