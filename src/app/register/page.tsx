"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, companyName: companyName || "Cá nhân", email, password, address })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
        router.push("/login");
      } else {
        alert("Lỗi Đăng Ký: " + data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page bg-light min-vh-100 d-flex align-items-center py-5">
      <style>{`
        .register-card {
            border: none;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            overflow: hidden;
            background: white;
            max-width: 900px;
            width: 100%;
        }
        .register-sidebar {
            background: linear-gradient(135deg, #198754 0%, #0a58ca 100%);
            color: white;
            padding: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .form-container {
            padding: 50px;
        }
        .input-premium {
            background-color: #f8f9fa;
            border: 2px solid transparent;
            border-radius: 12px;
            padding: 12px 16px;
            transition: all 0.3s;
        }
        .input-premium:focus {
            background-color: white;
            border-color: #0d6efd;
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .btn-register {
            border-radius: 12px;
            padding: 14px;
            font-weight: 700;
            background: #198754;
            border: none;
            transition: all 0.3s;
        }
        .btn-register:hover {
            background: #146c43;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(25, 135, 84, 0.2);
        }
      `}</style>

      <div className="container d-flex justify-content-center">
        <div className="register-card row g-0">
          <div className="col-md-5 register-sidebar d-none d-md-flex">
            <h2 className="display-6 fw-bold mb-4">Trở thành Đối tác Nhân Việt</h2>
            <p className="opacity-75 fs-5">Khởi tạo tài khoản để quản lý thiết bị, yêu cầu thuê máy và theo dõi bảo hành tập trung.</p>
            <div className="mt-5">
                <div className="d-flex align-items-center mb-4 text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-person-check-fill fs-5"></i>
                    </div>
                    <span>Dành cho cả doanh nghiệp & khách lẻ</span>
                </div>
                <div className="d-flex align-items-center mb-4 text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-tags-fill fs-5"></i>
                    </div>
                    <span>Nhận ưu đãi chiết khấu dự án lớn</span>
                </div>
                <div className="d-flex align-items-center text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-clock-history fs-5"></i>
                    </div>
                    <span>Lưu lịch sử giao dịch trọn đời</span>
                </div>
            </div>
          </div>
          <div className="col-md-7 form-container">
            <div className="text-center mb-5 d-md-none">
                <h3 className="fw-bold text-success">Nhân Việt B2B</h3>
            </div>
            <h3 className="fw-bold mb-2">Đăng Ký Tài Khoản Mới</h3>
            <p className="text-muted mb-4 small">Lưu ý: Tài khoản khởi tạo mặc định có quyền <strong>Khách Hàng (Customer)</strong>.</p>

            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Họ và Tên</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="VD: Nguyễn Văn A" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Tên Đơn Vị / Công Ty</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="Để trống nếu là cá nhân" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)} 
                    />
                </div>
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Email Công Ty / Liên Hệ</label>
                    <input 
                        type="email" 
                        className="form-control input-premium border-0" 
                        placeholder="email@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Địa chỉ giao hàng / Văn phòng</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="VD: 123 Nguyễn Văn Linh, Quận 7, TP.HCM" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                <div className="col-md-12 mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control input-premium border-0" 
                        placeholder="Tối thiểu 6 ký tự" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting} className="btn btn-success btn-register w-100 mb-4 py-3">
                {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>ĐANG KHỞI TẠO...</>
                ) : (
                    "HOÀN TẤT ĐĂNG KÝ"
                )}
              </button>
              
              <div className="text-center">
                <span className="text-muted small">Đã có tài khoản thành viên?</span>
                <Link href="/login" className="text-primary ms-2 fw-bold text-decoration-none small">Đăng nhập</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
