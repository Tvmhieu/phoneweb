import prisma from "@/lib/prisma";
import ProductCatalog from "@/components/ProductCatalog";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const fallbackProducts = [
  { id: 1, name: "Máy Chủ Dell PowerEdge R440", brand: "Dell", category: "SERVER", price: 45000000, rentalPricePerDay: 500000, isRentable: true, stock: 5, imageUrl: "/assets/server.jpg" },
  { id: 2, name: "Máy In HP LaserJet Pro", brand: "HP", category: "PRINTER", price: 4200000, rentalPricePerDay: null, isRentable: false, stock: 12, imageUrl: "/assets/printer.jpg" },
  { id: 3, name: "Switch Cisco Catalyst 2960", brand: "Cisco", category: "NETWORK", price: 9500000, rentalPricePerDay: 80000, isRentable: true, stock: 8, imageUrl: "/assets/switch.jpg" },
  { id: 4, name: "Máy POS Quản Lý Bán Hàng Sunmi", brand: "Sunmi", category: "POS", price: 12000000, rentalPricePerDay: 150000, isRentable: true, stock: 15, imageUrl: "/assets/pos.jpg" },
  { id: 5, name: "Laptop ThinkPad T14s", brand: "Lenovo", category: "LAPTOP", price: 28000000, rentalPricePerDay: 250000, isRentable: true, stock: 20, imageUrl: "/assets/laptop.jpg" },
];

export default async function ProductsPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
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
