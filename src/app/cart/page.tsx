"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const { userRole, userInfo } = useAuth();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!userRole || !userInfo) {
      alert("Hệ thống yêu cầu ĐĂNG NHẬP để ghi nhận đơn hàng.");
      return;
    }

    if (!phone.trim() || !address.trim()) {
      alert("Vui lòng nhập đầy đủ Số điện thoại và Địa chỉ nhận hàng.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const fullShippingAddress = `SĐT: ${phone} - Địa chỉ: ${address}`;
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ userId: userInfo.id, items, address: fullShippingAddress }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Đơn hàng đã được lưu vào hệ thống thành công! Đội ngũ hỗ trợ sẽ liên hệ xác nhận sớm nhất.");
        clearCart();
        setAddress("");
      } else {
        alert("Lỗi xử lý đơn hàng: " + data.message);
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ CSDL!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-page bg-light min-vh-100 py-5">
      <style>{`
        .cart-card {
            border: none;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .item-img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 12px;
        }
        .summary-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(13, 110, 253, 0.1);
            position: sticky;
            top: 20px;
        }
        .btn-checkout {
            padding: 16px;
            border-radius: 14px;
            font-weight: 800;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
        }
        .btn-checkout:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2);
        }
        .badge-buy { background-color: #e6f7ef; color: #198754; }
        @media (max-width: 768px) {
            .item-img { width: 70px; height: 70px; }
            .cart-page { py-3 !important; }
            h1 { font-size: 1.5rem !important; }
            .table-responsive { border: 0; }
            .table thead { display: none; }
            .table tr { display: block; margin-bottom: 1rem; border: 1px solid #eee; border-radius: 12px; padding: 10px; background: white; }
            .table td { display: block; text-align: left !important; padding: 0.5rem 0 !important; border: 0 !important; }
            .table td:before { content: attr(data-label); font-weight: bold; display: block; text-transform: uppercase; font-size: 0.7rem; color: #999; margin-bottom: 4px; }
        }
      `}</style>

      <div className="container">
        <div className="d-flex align-items-center mb-5">
            <Link href="/products" className="btn btn-light rounded-circle p-2 me-3 border shadow-sm">
                <i className="bi bi-chevron-left"></i>
            </Link>
            <h1 className="fw-bold mb-0">Giỏ hàng của bạn</h1>
            <span className="ms-3 badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill">{items.length} Sản phẩm</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center p-5 bg-white shadow-sm rounded-4 border">
            <div className="display-1 text-muted opacity-25 mb-4">
                <i className="bi bi-cart3"></i>
            </div>
            <h3 className="fw-bold text-dark">Chưa có thiết bị nào</h3>
            <p className="text-muted fs-5 mb-4">Hãy bắt đầu lựa chọn những chiếc smartphone đẳng cấp cho bộ sưu tập của bạn.</p>
            <Link href="/products" className="btn btn-primary px-5 py-3 rounded-pill fw-bold fs-5">TIẾP TỤC CHỌN SẢN PHẨM</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card cart-card">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="bg-light border-0">
                        <tr>
                          <th className="ps-4 py-3 text-muted small fw-bold text-uppercase border-0">Chi tiết thiết bị</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase text-end border-0">Tạm tính</th>
                          <th className="pe-4 py-3 border-0"></th>
                        </tr>
                      </thead>
                      <tbody className="border-0">
                        {items.map((item) => (
                          <tr key={item.id} className="border-bottom">
                            <td className="ps-4 py-4" data-label="Thiết bị">
                              <div className="d-flex align-items-center">
                                <img src={item.image} alt={item.name} className="item-img me-3 shadow-sm border" />
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                                  <div className="text-muted small">Số lượng: <span className="fw-bold text-dark">{item.quantity}</span></div>
                                  <div className="text-muted small">Đơn giá: <span className="fw-bold">{item.price.toLocaleString("vi-VN")} đ</span></div>
                                </div>
                              </div>
                            </td>
                            <td className="text-end py-4" data-label="Tạm tính">
                              <div className="text-danger fw-bold fs-5 mb-0">
                                {(item.price * item.quantity).toLocaleString("vi-VN")} <small>đ</small>
                              </div>
                            </td>
                            <td className="pe-4 text-end">
                              <button onClick={() => removeFromCart(item.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 shadow-sm" title="Xóa khỏi giỏ">
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
               <div className="card summary-card p-4">
                  <h5 className="fw-bold mb-4 border-bottom pb-3">TÓM TẮT ĐƠN HÀNG</h5>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tổng tạm tính:</span>
                    <span className="fw-bold text-dark">{cartTotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Thuế VAT (10%):</span>
                    <span className="fw-bold">{ (cartTotal * 0.1).toLocaleString("vi-VN") } đ</span>
                  </div>
                  
                  <div className="alert alert-info border-0 rounded-4 px-3 py-2 small mb-4 mt-3">
                    <i className="bi bi-info-circle me-2"></i>Kiểm tra kỹ thông tin đơn hàng trước khi xác nhận đặt hàng.
                  </div>

                  <hr className="my-4 opacity-10" />
                  
                  <div className="d-flex justify-content-between mb-5">
                    <span className="fw-bold fs-5">TỔNG CỘNG:</span>
                    <div className="text-end">
                        <span className="fw-bold fs-3 text-danger d-block">{(cartTotal * 1.1).toLocaleString("vi-VN")} đ</span>
                        <small className="text-muted">Đã bao gồm VAT</small>
                    </div>
                  </div>

                  {!userRole ? (
                    <div className="mb-4">
                        <div className="alert alert-warning border-0 rounded-4 py-3 px-3 small text-center mb-3">
                             ⚠ <strong>Yêu cầu xác thực</strong> <br/>
                             Hãy đăng nhập tài khoản để chúng tôi lưu trữ lịch sử mua hàng của bạn.
                        </div>
                        <Link href="/login" className="btn btn-outline-primary w-100 fw-bold py-3 rounded-pill border-2">ĐĂNG NHẬP ĐỂ ĐẶT HÀNG</Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="form-label fw-bold small text-muted"><i className="bi bi-telephone me-1"></i>Số điện thoại người nhận</label>
                        <input
                          type="tel"
                          className="form-control border-2 rounded-3 shadow-sm bg-white mb-3"
                          placeholder="Nhập số điện thoại liên hệ"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                        <label className="form-label fw-bold small text-muted"><i className="bi bi-geo-alt me-1"></i>Địa chỉ nhận hàng</label>
                        <textarea 
                          className="form-control border-2 rounded-3 shadow-sm bg-white" 
                          rows={3} 
                          placeholder="Nhập địa chỉ chi tiết (Số nhà, tên đường, quận/huyện...)"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                      </div>
                      <button onClick={handleCheckout} disabled={isProcessing} className="btn btn-primary btn-checkout w-100 py-3 shadow">
                        {isProcessing ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>ĐANG XỬ LÝ...</>
                        ) : (
                            <><i className="bi bi-shield-check me-2"></i>XÁC NHẬN ĐẶT HÀNG</>
                        )}
                    </button>
                    </>
                  )}
                  
                  <p className="text-center text-muted small mt-4">
                    Bằng cách đặt hàng, bạn đồng ý với <Link href="#" className="text-primary">Điều khoản dịch vụ</Link> của PhoneStore.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
