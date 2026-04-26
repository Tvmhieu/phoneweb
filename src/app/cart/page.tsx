"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const { userRole, userInfo } = useAuth();
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!userRole || !userInfo) {
      alert("Há»‡ thá»‘ng yÃªu cáº§u ÄÄ‚NG NHáº¬P Ä‘á»ƒ ghi nháº­n Ä‘Æ¡n hÃ ng doanh nghiá»‡p.");
      return;
    }

    if (!address.trim()) {
      alert("Vui lÃ²ng nháº­p Ä‘á»‹a chá»‰ nháº­n hÃ ng/vÄƒn phÃ²ng dá»± Ã¡n.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ userId: userInfo.id, items, address }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c lÆ°u vÃ o há»‡ thá»‘ng thÃ nh cÃ´ng! ChuyÃªn viÃªn kinh doanh sáº½ liÃªn há»‡ xÃ¡c nháº­n sá»›m nháº¥t.");
        clearCart();
        setAddress("");
      } else {
        alert("Lá»—i xá»­ lÃ½ Ä‘Æ¡n hÃ ng: " + data.message);
      }
    } catch (e) {
      alert("Lá»—i káº¿t ná»‘i mÃ¡y chá»§ CSDL!");
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
            <h1 className="fw-bold mb-0">Giá» hÃ ng cá»§a báº¡n</h1>
            <span className="ms-3 badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill">{items.length} Sáº£n pháº©m</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center p-5 bg-white shadow-sm rounded-4 border">
            <div className="display-1 text-muted opacity-25 mb-4">
                <i className="bi bi-cart3"></i>
            </div>
            <h3 className="fw-bold text-dark">ChÆ°a cÃ³ thiáº¿t bá»‹ nÃ o</h3>
            <p className="text-muted fs-5 mb-4">HÃ£y báº¯t Ä‘áº§u lá»±a chá»n nhá»¯ng chiáº¿c smartphone Ä‘áº³ng cáº¥p cho bá»™ sÆ°u táº­p cá»§a báº¡n.</p>
            <Link href="/products" className="btn btn-primary px-5 py-3 rounded-pill fw-bold fs-5">TIáº¾P Tá»¤C CHá»ŒN Sáº¢N PHáº¨M</Link>
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
                          <th className="ps-4 py-3 text-muted small fw-bold text-uppercase border-0">Chi tiáº¿t thiáº¿t bá»‹</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase text-end border-0">Táº¡m tÃ­nh</th>
                          <th className="pe-4 py-3 border-0"></th>
                        </tr>
                      </thead>
                      <tbody className="border-0">
                        {items.map((item) => (
                          <tr key={item.id} className="border-bottom">
                            <td className="ps-4 py-4" data-label="Thiáº¿t bá»‹">
                              <div className="d-flex align-items-center">
                                <img src={item.image} alt={item.name} className="item-img me-3 shadow-sm border" />
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                                  <div className="text-muted small">Sá»‘ lÆ°á»£ng: <span className="fw-bold text-dark">{item.quantity}</span></div>
                                  <div className="text-muted small">ÄÆ¡n giÃ¡: <span className="fw-bold">{item.price.toLocaleString("vi-VN")} Ä‘</span></div>
                                </div>
                              </div>
                            </td>
                            <td className="text-end py-4" data-label="Táº¡m tÃ­nh">
                              <div className="text-danger fw-bold fs-5 mb-0">
                                {(item.price * item.quantity).toLocaleString("vi-VN")} <small>Ä‘</small>
                              </div>
                            </td>
                            <td className="pe-4 text-end">
                              <button onClick={() => removeFromCart(item.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 shadow-sm" title="XÃ³a khá»i giá»">
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
                  <h5 className="fw-bold mb-4 border-bottom pb-3">TÃ“M Táº®T Dá»° TOÃN</h5>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tá»•ng táº¡m tÃ­nh:</span>
                    <span className="fw-bold text-dark">{cartTotal.toLocaleString("vi-VN")} Ä‘</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Thuáº¿ VAT (10%):</span>
                    <span className="fw-bold">{ (cartTotal * 0.1).toLocaleString("vi-VN") } Ä‘</span>
                  </div>
                  
                  <div className="alert alert-info border-0 rounded-4 px-3 py-2 small mb-4 mt-3">
                    <i className="bi bi-info-circle me-2"></i>Chiáº¿t kháº¥u dá»± Ã¡n sáº½ Ä‘Æ°á»£c Ã¡p dá»¥ng sau khi nhÃ¢n viÃªn tháº©m Ä‘á»‹nh cáº¥u hÃ¬nh.
                  </div>

                  <hr className="my-4 opacity-10" />
                  
                  <div className="d-flex justify-content-between mb-5">
                    <span className="fw-bold fs-5">Tá»”NG Cá»˜NG:</span>
                    <div className="text-end">
                        <span className="fw-bold fs-3 text-danger d-block">{(cartTotal * 1.1).toLocaleString("vi-VN")} Ä‘</span>
                        <small className="text-muted">ÄÃ£ bao gá»“m VAT</small>
                    </div>
                  </div>

                  {!userRole ? (
                    <div className="mb-4">
                        <div className="alert alert-warning border-0 rounded-4 py-3 px-3 small text-center mb-3">
                             âš  <strong>YÃªu cáº§u xÃ¡c thá»±c</strong> <br/>
                             HÃ£y Ä‘Äƒng nháº­p tÃ i khoáº£n doanh nghiá»‡p Ä‘á»ƒ chÃºng tÃ´i lÆ°u trá»¯ lá»‹ch sá»­ cáº¥u hÃ¬nh mÃ¡y cá»§a báº¡n.
                        </div>
                        <Link href="/login" className="btn btn-outline-primary w-100 fw-bold py-3 rounded-pill border-2">ÄÄ‚NG NHáº¬P Äá»‚ Äáº¶T HÃ€NG</Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="form-label fw-bold small text-muted"><i className="bi bi-geo-alt me-1"></i>Äá»‹a chá»‰ nháº­n hÃ ng / VÄƒn phÃ²ng dá»± Ã¡n</label>
                        <textarea 
                          className="form-control border-2 rounded-3 shadow-sm bg-white" 
                          rows={3} 
                          placeholder="Nháº­p Ä‘á»‹a chá»‰ chi tiáº¿t (Sá»‘ nhÃ , tÃªn Ä‘Æ°á»ng, quáº­n/huyá»‡n...)"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                      </div>
                      <button onClick={handleCheckout} disabled={isProcessing} className="btn btn-primary btn-checkout w-100 py-3 shadow">
                        {isProcessing ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>ÄANG Xá»¬ LÃ...</>
                        ) : (
                            <><i className="bi bi-shield-check me-2"></i>XÃC NHáº¬N Äáº¶T HÃ€NG</>
                        )}
                    </button>
                    </>
                  )}
                  
                  <p className="text-center text-muted small mt-4">
                    Báº±ng cÃ¡ch Ä‘áº·t hÃ ng, báº¡n Ä‘á»“ng Ã½ vá»›i <Link href="#" className="text-primary">Äiá»u khoáº£n dá»‹ch vá»¥</Link> cá»§a PhoneStore.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
