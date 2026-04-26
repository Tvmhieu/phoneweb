"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        login({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role
        });
      } else {
        alert("Lá»—i Ä‘Äƒng nháº­p: " + data.message);
      }
    } catch (err) {
      alert("Lá»—i káº¿t ná»‘i mÃ¡y chá»§");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page bg-light min-vh-100 d-flex align-items-center py-5">
      <style>{`
        .login-card {
            border: none;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            overflow: hidden;
            background: white;
            max-width: 900px;
            width: 100%;
        }
        .login-sidebar {
            background: linear-gradient(135deg, #0d6efd 0%, #003d99 100%);
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
        .btn-login {
            border-radius: 12px;
            padding: 14px;
            font-weight: 700;
            background: #0d6efd;
            border: none;
            transition: all 0.3s;
        }
        .btn-login:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2);
        }
      `}</style>

      <div className="container d-flex justify-content-center">
        <div className="login-card row g-0">
          <div className="col-md-5 login-sidebar d-none d-md-flex">
            <h2 className="display-6 fw-bold mb-4">ChÃ o má»«ng trá»Ÿ láº¡i!</h2>
            <p className="opacity-75 fs-5">Truy cáº­p há»‡ thá»‘ng quáº£n lÃ½ bÃ¡n hÃ ng vÃ  há»— trá»£ khÃ¡ch hÃ ng dÃ nh riÃªng cho Ä‘á»‘i tÃ¡c PhoneStore.</p>
            <div className="mt-5">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-shield-lock-fill fs-5"></i>
                    </div>
                    <span>Há»‡ thá»‘ng báº£o máº­t giao dá»‹ch an toÃ n</span>
                </div>
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-smartphone fs-5"></i>
                    </div>
                    <span>Quáº£n lÃ½ Ä‘Æ¡n hÃ ng thá»i gian thá»±c</span>
                </div>
                <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                        <i className="bi bi-headset fs-5"></i>
                    </div>
                    <span>Há»— trá»£ ká»¹ thuáº­t pháº§n má»m 24/7</span>
                </div>
            </div>
          </div>
          <div className="col-md-7 form-container">
            <div className="text-center mb-5 d-md-none">
                <h3 className="fw-bold text-primary">PhoneStore</h3>
            </div>
            <h3 className="fw-bold mb-2">ÄÄƒng Nháº­p TÃ i Khoáº£n</h3>
            <p className="text-muted mb-5">Vui lÃ²ng nháº­p thÃ´ng tin Ä‘á»ƒ truy cáº­p há»‡ thá»‘ng.</p>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Email / TÃ i khoáº£n</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0 rounded-start-3"><i className="bi bi-envelope text-muted"></i></span>
                    <input 
                        type="email" 
                        className="form-control input-premium border-0 rounded-start-0" 
                        placeholder="user@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Máº­t kháº©u</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-0 rounded-start-3"><i className="bi bi-key text-muted"></i></span>
                    <input 
                        type="password" 
                        className="form-control input-premium border-0 rounded-start-0" 
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label small" htmlFor="rememberMe">Ghi nhá»› Ä‘Äƒng nháº­p</label>
                </div>
                <Link href="#" className="small text-primary text-decoration-none">QuÃªn máº­t kháº©u?</Link>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-login w-100 mb-4">
                {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>ÄANG XÃC THá»°C...</>
                ) : (
                    "ÄÄ‚NG NHáº¬P Há»† THá»NG"
                )}
              </button>
              <div className="text-center">
                <span className="text-muted small">ChÆ°a cÃ³ tÃ i khoáº£n Ä‘á»‘i tÃ¡c?</span>
                <Link href="/register" className="text-primary ms-2 fw-bold text-decoration-none small">ÄÄƒng kÃ½ ngay</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
