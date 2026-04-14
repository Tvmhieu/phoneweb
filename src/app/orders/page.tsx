"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = { name: string; imageUrl?: string };
type SaleItem = { id: number; product: Product; quantity: number; price: number };
type Sale = { id: number; createdAt: string; total: number; status: string; items: SaleItem[] };
type RentalItem = { id: number; product: Product; quantity: number; pricePerDay: number };
type Rental = { id: number; createdAt: string; totalRental: number; deposit: number; status: string; startDate: string; endDate: string; items: RentalItem[] };

export default function OrdersPage() {
  const { userInfo, userRole } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"SALES" | "RENTALS">("SALES");

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
      fetch(`/api/my-orders?userId=${userInfo.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setSales(data.sales);
            setRentals(data.rentals);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [userInfo]);

  const getSaleStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i>Chờ xác nhận</span>;
    if (s === "PAID") return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-check-circle me-1"></i>Đã thanh toán</span>;
    if (s === "SHIPPING") return <span className="badge bg-info text-white px-3 py-2 rounded-pill"><i className="bi bi-truck me-1"></i>Đang giao hàng</span>;
    if (s === "CANCELLED") return <span className="badge bg-danger px-3 py-2 rounded-pill"><i className="bi bi-x-circle me-1"></i>Đã hủy</span>;
    return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
  };

  const getRentalStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i>Đang chờ duyệt</span>;
    if (s === "ACTIVE") return <span className="badge bg-primary px-3 py-2 rounded-pill"><i className="bi bi-play-circle me-1"></i>Đang thuê</span>;
    if (s === "RETURNED") return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-box-arrow-in-left me-1"></i>Đã trả máy</span>;
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
        .nav-pills .nav-link {
          border-radius: 50px;
          padding: 0.6rem 1.5rem;
          font-weight: 600;
          color: #6c757d;
        }
        .nav-pills .nav-link.active {
          background-color: #0d6efd;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
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
          <p className="text-muted">Theo dõi và quản lý các đơn hàng mua và thuê máy của bạn.</p>
        </div>

        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "SALES" ? "active" : "bg-white border text-dark"}`} onClick={() => setActiveTab("SALES")}>
              <i className="bi bi-receipt me-2"></i>Đơn hàng mua ({sales.length})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "RENTALS" ? "active" : "bg-white border text-dark"}`} onClick={() => setActiveTab("RENTALS")}>
              <i className="bi bi-clock-history me-2"></i>Hợp đồng thuê ({rentals.length})
            </button>
          </li>
        </ul>

        {activeTab === "SALES" ? (
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
                          <img src={item.product.imageUrl || "https://placehold.co/100x100?text=Product"} alt={item.product.name} className="item-img me-3" />
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
        ) : (
          <div className="row g-4">
            {rentals.length === 0 ? (
              <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                <i className="bi bi-clock display-1 text-muted opacity-25"></i>
                <p className="mt-3 fs-5 text-muted">Bạn chưa có hợp đồng thuê nào.</p>
                <Link href="/products?category=RENT" className="btn btn-primary rounded-pill px-4">Thuê máy ngay</Link>
              </div>
            ) : (
              rentals.map(rental => (
                <div key={rental.id} className="col-12">
                  <div className="order-card shadow-sm border-start border-primary border-5">
                    <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold text-primary">HỢP ĐỒNG: #RENT-{rental.id}</span>
                        <span className="text-muted ms-3 small"><i className="bi bi-calendar-range me-1"></i>{new Date(rental.startDate).toLocaleDateString("vi-VN")} - {new Date(rental.endDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                      {getRentalStatusBadge(rental.status)}
                    </div>
                    <div className="card-body p-4">
                      {rental.items.map(item => (
                        <div key={item.id} className="d-flex align-items-center mb-3">
                          <img src={item.product.imageUrl || "https://placehold.co/100x100?text=Product"} alt={item.product.name} className="item-img me-3" />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{item.product.name}</div>
                            <div className="text-muted small">Số lượng: {item.quantity} × {item.pricePerDay.toLocaleString()}đ/ngày</div>
                          </div>
                        </div>
                      ))}
                      <div className="row mt-3 pt-3 border-top g-2">
                        <div className="col-md-4">
                          <div className="p-3 bg-light rounded-3">
                            <div className="small text-muted mb-1">Tiền cọc thiết bị</div>
                            <div className="fw-bold text-dark">{rental.deposit.toLocaleString()}đ</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 bg-light rounded-3">
                            <div className="small text-muted mb-1">Tiền thuê dự kiến</div>
                            <div className="fw-bold text-dark">{rental.totalRental.toLocaleString()}đ</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="p-3 bg-primary bg-opacity-10 rounded-3">
                            <div className="small text-primary mb-1">Cần thanh toán trước</div>
                            <div className="fw-bold text-primary">{(rental.deposit).toLocaleString()}đ</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top py-3 px-4 text-end">
                      <Link href="/warranty" className="btn btn-outline-primary btn-sm rounded-pill fw-bold me-2"><i className="bi bi-shield-check me-1"></i>Bảo hành/Hỗ trợ</Link>
                      <button className="btn btn-link text-decoration-none text-muted btn-sm">Chi tiết hợp đồng <i className="bi bi-arrow-right"></i></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
