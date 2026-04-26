"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSent(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert(data.message || "Không thể gửi liên hệ lúc này.");
      }
    } catch {
      alert("Lỗi kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page bg-light min-vh-100 py-5">
      <style>{`
        .contact-hero {
            background: linear-gradient(135deg, #0d6efd 0%, #003d99 100%);
            color: white;
            padding: 60px 0;
            margin-top: -3rem;
            margin-bottom: 3rem;
        }
        .contact-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .info-box {
            background: white;
            border-radius: 15px;
            padding: 25px;
            height: 100%;
            transition: all 0.3s;
            border: 1px solid #f0f0f0;
        }
        .info-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border-color: #0d6efd;
        }
        .icon-circle {
            width: 50px;
            height: 50px;
            background: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
      `}</style>

      <section className="contact-hero">
        <div className="container text-center">
            <h1 className="display-4 fw-bold mb-3">Liên Hệ & Hỗ Trợ</h1>
            <p className="lead opacity-75">Chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn những sản phẩm công nghệ ưng ý nhất.</p>
        </div>
      </section>

      <div className="container">
        <div className="row g-4 mb-5">
            <div className="col-md-4">
                <div className="info-box text-center">
                    <div className="icon-circle mx-auto"><i className="bi bi-geo-alt-fill"></i></div>
                    <h5>Địa Chỉ</h5>
                    <p className="text-muted mb-0">Trần Trọng Cung, Quận 7,<br/>TP. Hồ Chí Minh</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="info-box text-center">
                    <div className="icon-circle mx-auto"><i className="bi bi-telephone-fill"></i></div>
                    <h5>Hotline Hỗ Trợ</h5>
                    <p className="text-muted mb-0">Hỗ trợ 24/7 chuyên sâu:<br/><span className="fw-bold text-primary">1900 8888</span></p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="info-box text-center">
                    <div className="icon-circle mx-auto"><i className="bi bi-envelope-fill"></i></div>
                    <h5>Email Hỗ Trợ</h5>
                    <p className="text-muted mb-0">Gửi yêu cầu báo giá dự án:<br/><span className="fw-bold text-primary">support@phonestore.com.vn</span></p>
                </div>
            </div>
        </div>

        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="card contact-card">
                    <div className="row g-0">
                        <div className="col-md-5 d-none d-md-block bg-primary p-5 text-white d-flex flex-column justify-content-center">
                            <h3 className="fw-bold mb-4">Gửi tin nhắn cho đội ngũ chuyên gia</h3>
                            <p className="opacity-75">Điền vào form bên cạnh, đội ngũ chăm sóc khách hàng của chúng tôi sẽ phản hồi sớm nhất.</p>
                            <div className="mt-4">
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    <span>Tư vấn cấu hình Server miễn phí</span>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    <span>Tư vấn trang bị máy chủ dự án lớn</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    <span>Hỗ trợ kỹ thuật On-site 24/7</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 p-4 p-md-5 bg-white">
                            {sent ? (
                                <div className="text-center py-5">
                                    <div className="text-success mb-4" style={{ fontSize: '5rem' }}>
                                        <i className="bi bi-check2-circle"></i>
                                    </div>
                                    <h2 className="fw-bold mb-3">Gửi thành công!</h2>
                                    <p className="text-muted mb-4">Cảm ơn bạn đã tin tưởng PhoneStore. Yêu cầu của bạn đã được chuyển đến bộ phận chuyên trách.</p>
                                    <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold" onClick={() => setSent(false)}>GỬI YÊU CẦU MỚI</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Họ Tên / Cơ Quan</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg bg-light border-0 fs-6"
                                                placeholder="VD: Nguyễn Văn A"
                                                value={formData.name}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Email Công Ty</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-lg bg-light border-0 fs-6"
                                                placeholder="email@congty.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Số Điện Thoại Liên Hệ</label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-lg bg-light border-0 fs-6"
                                                placeholder="09xx xxx xxx"
                                                value={formData.phone}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Nội Dung Tư Vấn / Dự Án</label>
                                            <textarea
                                                className="form-control bg-light border-0 fs-6"
                                                rows={4}
                                                placeholder="Mô tả nhu cầu của bạn (VD: Cần trang bị máy chủ cho dự án SAP...)"
                                                value={formData.message}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm"
                                            >
                                                {isSubmitting ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span>ĐANG XỬ LÝ...</>
                                                ) : (
                                                    "GỬI YÊU CẦU CHO CHÚNG TÔI"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
