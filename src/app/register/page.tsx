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
        body: JSON.stringify({ name, companyName: companyName || "CÃ¡ nhÃ¢n", email, password, address })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("ÄÄƒng kÃ½ thÃ nh cÃ´ng! Äang chuyá»ƒn hÆ°á»›ng Ä‘áº¿n trang Ä‘Äƒng nháº­p...");
        router.push("/login");
      } else {
        alert("Lá»—i ÄÄƒng KÃ½: " + data.message);
      }
    } catch (err) {
      alert("Lá»—i káº¿t ná»‘i mÃ¡y chá»§");
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
            <h2 className="display-6 fw-bold mb-4">Trá»Ÿ thÃ nh Ä‘á»‘i tÃ¡c lÃ¢u dÃ i</h2>
            <p className="opacity-75 fs-5">Khá»Ÿi táº¡o tÃ i khoáº£n Ä‘á»ƒ quáº£n lÃ½ thiáº¿t bá»‹, Ä‘Æ¡n hÃ ng vÃ  theo dÃµi báº£o hÃ nh táº­p trung.</p>
            <div className="mt-5">
                <div className="d-flex align-items-center mb-4 text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-person-check-fill fs-5"></i>
                    </div>
                    <span>DÃ nh cho cáº£ doanh nghiá»‡p & khÃ¡ch láº»</span>
                </div>
                <div className="d-flex align-items-center mb-4 text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-tags-fill fs-5"></i>
                    </div>
                    <span>Nháº­n Æ°u Ä‘Ã£i chiáº¿t kháº¥u dá»± Ã¡n lá»›n</span>
                </div>
                <div className="d-flex align-items-center text-start">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-clock-history fs-5"></i>
                    </div>
                    <span>LÆ°u lá»‹ch sá»­ giao dá»‹ch trá»n Ä‘á»i</span>
                </div>
            </div>
          </div>
          <div className="col-md-7 form-container">
            <div className="text-center mb-5 d-md-none">
                <h3 className="fw-bold text-success">NhÃ¢n Viá»‡t B2B</h3>
            </div>
            <h3 className="fw-bold mb-2">ÄÄƒng KÃ½ TÃ i Khoáº£n Má»›i</h3>
            <p className="text-muted mb-4 small">LÆ°u Ã½: TÃ i khoáº£n khá»Ÿi táº¡o máº·c Ä‘á»‹nh cÃ³ quyá»n <strong>KhÃ¡ch HÃ ng (Customer)</strong>.</p>

            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Há» vÃ  TÃªn</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="VD: Nguyá»…n VÄƒn A" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">TÃªn ÄÆ¡n Vá»‹ / CÃ´ng Ty</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="Äá»ƒ trá»‘ng náº¿u lÃ  cÃ¡ nhÃ¢n" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)} 
                    />
                </div>
                <div className="col-md-12 mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">Email</label>
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
                    <label className="form-label small fw-bold text-muted text-uppercase">Äá»‹a chá»‰ giao hÃ ng / VÄƒn phÃ²ng</label>
                    <input 
                        type="text" 
                        className="form-control input-premium border-0" 
                        placeholder="VD: 123 Nguyá»…n VÄƒn Linh, Quáº­n 7, TP.HCM" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>
                <div className="col-md-12 mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">Máº­t kháº©u</label>
                    <input 
                        type="password" 
                        className="form-control input-premium border-0" 
                        placeholder="Tá»‘i thiá»ƒu 6 kÃ½ tá»±" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting} className="btn btn-success btn-register w-100 mb-4 py-3">
                {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>ÄANG KHá»žI Táº O...</>
                ) : (
                    "HOÃ€N Táº¤T ÄÄ‚NG KÃ"
                )}
              </button>
              
              <div className="text-center">
                <span className="text-muted small">ÄÃ£ cÃ³ tÃ i khoáº£n thÃ nh viÃªn?</span>
                <Link href="/login" className="text-primary ms-2 fw-bold text-decoration-none small">ÄÄƒng nháº­p</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
