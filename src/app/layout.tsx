import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ABC XYZ - Giải pháp & Thiết bị Công Nghệ",
  description: "Trang bị doanh nghiệp với máy chủ, máy tính và các giải pháp hạ tầng công nghệ hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" defer></script>
      </head>
      <body className="bg-light d-flex flex-column min-vh-100">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {/* Nội dung chính các trang (Page Router) */}
            <main className="flex-grow-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
