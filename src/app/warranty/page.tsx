"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type SaleItem = { id: number; productId: number; product: { name: string; warrantyMonths: number }; quantity: number };
type Sale = { id: number; createdAt: string; items: SaleItem[] };

type WarrantyClaim = {
  id: number;
  productId: number;
  issueDetail: string;
  status: string;
  createdAt: string;
  product?: { name: string };
};

export default function WarrantyPage() {
  const { userInfo } = useAuth();
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [issueDetail, setIssueDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myClaims, setMyClaims] = useState<WarrantyClaim[]>([]);
  
  const [mySales, setMySales] = useState<Sale[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Lấy danh sách ticket và tài sản
  useEffect(() => {
    if (userInfo?.id) {
      // Tickets
      fetch(`/api/warranty?userId=${userInfo.id}`)
        .then(r => r.json())
        .then(data => { if (data.success) setMyClaims(data.claims); });
      
      // Assets (Sales)
      setLoadingAssets(true);
      fetch(`/api/my-assets?userId=${userInfo.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setMySales(data.sales);
          }
        })
        .finally(() => setLoadingAssets(false));
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return alert("Vui lòng đăng nhập!");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/warranty", {
        method: "POST",
        body: JSON.stringify({ userId: userInfo.id, productId: parseInt(productId), issueDetail })
      });
      const data = await res.json();
      if (data.success) {
        alert("Gửi yêu cầu bảo hành thành công!");
        setProductId("");
        setProductName("");
        setIssueDetail("");
        // Reload claims
        fetch(`/api/warranty?userId=${userInfo.id}`).then(r => r.json()).then(d => d.success && setMyClaims(d.claims));
      } else alert(data.message);
    } catch { alert("Lỗi kết nối!"); } finally { setIsSubmitting(false); }
  };

  const isWarrantyValid = (purchaseDate: string, months: number) => {
    const start = new Date(purchaseDate);
    const end = new Date(start.setMonth(start.getMonth() + months));
    return end > new Date();
  };

  const statusBadge = (status: string) => {
    if (status === "PENDING") return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-hourglass-split me-1"></i>Chờ xử lý</span>;
    if (status === "CHECKING" || status === "PROCESSING") return <span className="badge bg-info text-white px-3 py-2 rounded-pill"><i className="bi bi-tools me-1"></i>Đang kiểm tra/Sửa chữa</span>;
    if (status === "DONE") return <span className="badge bg-success text-white px-3 py-2 rounded-pill"><i className="bi bi-check-circle me-1"></i>Đã xử lý xong</span>;
    if (status === "REJECTED") return <span className="badge bg-danger text-white px-3 py-2 rounded-pill"><i className="bi bi-x-circle me-1"></i>Từ chối bảo hành</span>;
    return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
  };

  return (
    <div className="warranty-page bg-light min-vh-100 py-5">
      <style>{`
        .warranty-hero {
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
            color: white;
            padding: 50px 0;
            margin-top: -3rem;
            margin-bottom: 3rem;
        }
        .asset-card {
            border: none;
            border-radius: 12px;
            transition: all 0.3s;
            overflow: hidden;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .asset-card:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transform: translateY(-3px);
        }
        .ticket-item {
            border-left: 4px solid #f8f9fa;
            transition: all 0.2s;
        }
        .ticket-item:hover {
            background: #fff;
            border-left-color: #0d6efd;
        }
      `}</style>

      <section className="warranty-hero shadow-sm">
        <div className="container">
           <div className="row align-items-center">
             <div className="col-md-7">
                <h1 className="display-5 fw-bold mb-3"><i className="bi bi-shield-lock me-2"></i>Trung Tâm Bảo Hành PhoneStore</h1>
                <p className="lead opacity-75 mb-3">Hỗ trợ bảo hành nhanh chóng cho các sản phẩm mua tại PhoneStore. Cam kết xử lý và phản hồi trong 24 giờ.</p>
                <Link href="/warranty-policy" className="btn btn-warning btn-sm rounded-pill fw-bold px-3 border-0 shadow-sm text-dark">
                    <i className="bi bi-file-earmark-text me-1"></i> Xem chi tiết Chính sách bảo hành
                </Link>
             </div>
             <div className="col-md-5 d-none d-md-block text-end">
                <i className="bi bi-tools opacity-25" style={{ fontSize: '100px' }}></i>
             </div>
           </div>
        </div>
      </section>

      <div className="container">
        <div className="row g-4">
            {/* DANH SÁCH TÀI SẢN */}
            <div className="col-lg-7">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-dark">SẢN PHẨM KHÁCH HÀNG ĐÃ MUA</h5>
                    <span className="badge bg-white text-dark border shadow-sm px-3 py-2">{mySales.length} Sản phẩm</span>
                </div>

                {loadingAssets ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-3 text-muted">Đang truy xuất danh sách máy...</p>
                    </div>
                ) : (
                    <>
                        {mySales.length === 0 && (
                            <div className="card text-center py-5 border-dashed bg-white bg-opacity-50">
                                <i className="bi bi-phone display-1 text-muted opacity-25"></i>
                                <p className="mt-3 fs-5 text-muted">Bạn chưa có lịch sử mua hàng nào tại PhoneStore.</p>
                                <div className="mt-2 text-center">
                                    <Link href="/products" className="btn btn-outline-primary btn-sm rounded-pill fw-bold">XEM ĐIỆN THOẠI MỚI</Link>
                                </div>
                            </div>
                        )}

                        {/* Mua hàng */}
                        {mySales.map(sale => (
                            <div key={sale.id} className="asset-card mb-4 shadow-sm border-0">
                                <div className="bg-dark text-white px-3 py-2 d-flex justify-content-between align-items-center">
                                    <span className="small fw-bold"><i className="bi bi-receipt me-2"></i>HÓA ĐƠN: INV-#{sale.id}</span>
                                    <span className="small opacity-75">{new Date(sale.createdAt).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <div className="p-0">
                                    <table className="table table-hover align-middle mb-0 border-0">
                                        <tbody className="border-0">
                                            {sale.items.map(item => {
                                                const isValid = isWarrantyValid(sale.createdAt, item.product.warrantyMonths);
                                                return (
                                                    <tr key={item.id} className="border-0">
                                                        <td className="ps-4 py-4">
                                                            <div className="fw-bold text-dark">{item.product.name}</div>
                                                            <div className="small text-muted mt-1"><i className="bi bi-clock me-1"></i>Bảo hành: <span className={isValid ? 'text-success fw-bold' : 'text-primary fw-bold'}>{item.product.warrantyMonths} Tháng</span></div>
                                                        </td>
                                                        <td className="pe-4 text-end">
                                                            {isValid ? (
                                                                <button onClick={() => {setProductId(item.productId.toString()); setProductName(item.product.name); window.scrollTo({top: 0, behavior: 'smooth'})}} className="btn btn-sm btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">GỬI YÊU CẦU</button>
                                                            ) : (
                                                                <button disabled className="btn btn-sm btn-light border px-4 py-2 rounded-pill text-muted">HẾT BẢO HÀNH</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                    </>
                )}
            </div>

            {/* FORM GỬI BẢO HÀNH & LỊCH SỬ */}
            <div className="col-lg-5">
                <div className="card shadow-lg border-0 mb-5">
                    <div className="card-header bg-primary text-white py-3 fw-bold fs-5"><i className="bi bi-pencil-square me-2"></i>PHIẾU BÁO LỖI</div>
                    <div className="card-body p-4">
                        {!userInfo ? (
                            <div className="text-center py-4">
                                <i className="bi bi-lock-fill display-3 text-muted opacity-25 mb-3"></i>
                                <h5 className="fw-bold">Yêu cầu đăng nhập</h5>
                                <p className="text-muted small">Bạn cần đăng nhập để chúng tôi xác thực tài sản của bạn.</p>
                                <Link href="/login" className="btn btn-primary px-5 py-2 rounded-pill mt-3">Đăng nhập ngay</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">Sản phẩm đang chọn xử lý</label>
                                    <div className="p-3 bg-light border rounded-3 fw-bold text-primary d-flex justify-content-between align-items-center">
                                        <span>{productName || "CHƯA CHỌN SẢN PHẨM..."}</span>
                                        {productId && <span className="badge bg-dark">ID: {productId}</span>}
                                    </div>
                                    {!productId && <small className="text-muted mt-2 d-block"><i className="bi bi-info-circle me-1"></i>Hãy nhấn <strong>Gửi yêu cầu</strong> từ danh sách bên cạnh</small>}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">Mô tả chi tiết sự cố <span className="text-primary">*</span></label>
                                    <textarea className="form-control bg-light border-0" rows={5} value={issueDetail} onChange={e => setIssueDetail(e.target.value)} required placeholder="Ví dụ: Điện thoại khởi động không lên, sạc không vào pin, liệt cảm ứng góc màn hình..." />
                                </div>
                                <button type="submit" disabled={isSubmitting || !productId} className="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-pill shadow">
                                    {isSubmitting ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>XỬ LÝ...</>
                                    ) : (
                                        <><i className="bi bi-send-fill me-2"></i>GỬI YÊU CẦU BẢO HÀNH</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {userInfo && (
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 py-3 fw-bold"><i className="bi bi-journal-text me-2 text-primary"></i>LỊCH SỬ BẢO HÀNH (GẦN NHẤT)</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {myClaims.length === 0 && <li className="list-group-item text-center py-5 text-muted small"><i className="bi bi-inbox-fill d-block fs-1 opacity-25"></i>Bạn chưa gửi yêu cầu nào</li>}
                                {[...myClaims].slice(0, 5).map(c => (
                                    <li key={c.id} className="list-group-item p-4 ticket-item bg-transparent">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold fs-5 text-dark">#BH-{c.id}</span>
                                            {statusBadge(c.status)}
                                        </div>
                                        <div className="text-primary fw-bold mb-1"><i className="bi bi-phone me-1"></i>{c.product?.name}</div>
                                        <div className="small text-muted d-flex justify-content-between align-items-center">
                                            <span><i className="bi bi-calendar3 me-1"></i>{new Date(c.createdAt).toLocaleDateString("vi-VN")}</span>
                                            <Link href={`/warranty/${c.id}`} className="text-decoration-underline text-muted">Chi tiết <i className="bi bi-arrow-right small"></i></Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
