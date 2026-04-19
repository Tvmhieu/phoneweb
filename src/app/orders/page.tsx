"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = { name: string; imageUrl?: string };
type SaleItem = { id: number; product: Product; quantity: number; price: number };
type Sale = { id: number; createdAt: string; total: number; status: string; items: SaleItem[] };

export default function OrdersPage() {
  const { userInfo, userRole } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ cho phép CUSTOMER truy cập trang này
    if (userRole && userRole !== "CUSTOMER") {
        router.push("/");
        return;
    }
    
    if (!userInfo && !loading) {
        router.push("/login");
        return;
    }

    if (userInfo?.id) {
      setLoading(true);
      fetch(`/api/my-orders?userId=${userInfo.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setSales(data.sales);
          }
        })
        .finally(() => setLoading(false));
    } else if (!loading) {
      setLoading(false);
    }
  }, [userInfo, userRole, router, loading]);

  const getSaleStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i>Chờ xác nhận</span>;
    if (s === "PAID") return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle me-1"></i>Đã thanh toán</span>;
    if (s === "SHIPPING") return <span className="badge bg-info text-white px-3 py-2 rounded-pill"><i className="bi bi-truck me-1"></i>Đang giao hàng</span>;
    if (s === "CANCELLED") return <span className="badge bg-danger px-3 py-2 rounded-pill"><i className="bi bi-x-circle me-1"></i>Đã hủy</span>;
    return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="orders-page bg-light min-vh-100 py-5">
      <style>{`
        .order-card {
          border: none;
          border-radius: 16px;
          transition: all 0.3s ease;
          background: white;
          overflow: hidden;
        }
        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
        }
        .item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 12px;
          background: #f8f9fa;
        }
      `}</style>

      <div className="container">
        <div className="mb-5">
          <h2 className="fw-bold mb-1">Lịch sử đơn hàng</h2>
          <p className="text-muted">Theo dõi và quản lý các đơn hàng mua thiết bị của bạn.</p>
        </div>

        <div className="row g-4">
          {sales.length === 0 ? (
            <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
              <i className="bi bi-inbox display-1 text-muted opacity-25"></i>
              <p className="mt-3 fs-5 text-muted">Bạn chưa có đơn hàng mua nào.</p>
              <Link href="/products" className="btn btn-primary rounded-pill px-4">Mua sắm ngay</Link>
            </div>
          ) : (
            sales.map(sale => (
              <div key={sale.id} className="col-12">
                <div className="order-card shadow-sm">
                  <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-bold text-primary">MÃ ĐƠN: #SALE-{sale.id}</span>
                      <span className="text-muted ms-3 small"><i className="bi bi-calendar3 me-1"></i>{new Date(sale.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {getSaleStatusBadge(sale.status)}
                  </div>
                  <div className="card-body p-4">
                    {sale.items.map(item => (
                      <div key={item.id} className="d-flex align-items-center mb-3">
                        <div className="item-img me-3 overflow-hidden position-relative" style={{ width: "60px", height: "60px" }}>
                          <Image 
                            src={item.product.imageUrl || "https://placehold.co/100x100?text=Product"} 
                            alt={item.product.name} 
                            fill
                            sizes="60px"
                            style={{ objectFit: "cover" }} 
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold">{item.product.name}</div>
                          <div className="text-muted small">Số lượng: {item.quantity} × {item.price.toLocaleString()}đ</div>
                        </div>
                        <div className="text-end fw-bold">
                          {(item.quantity * item.price).toLocaleString()}đ
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card-footer bg-light py-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="text-muted small">Đã bao gồm VAT 10%</div>
                    <div>
                      <span className="me-2">Tổng thanh toán:</span>
                      <span className="fs-4 fw-bold text-danger">{sale.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
