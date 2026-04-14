"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { userRole, userInfo, logout } = useAuth();
  const { items } = useCart();
  const [hydrated, setHydrated] = useState(false);

  const pathname = usePathname();

  useEffect(() => setHydrated(true), []);

  const isAdminPath = pathname.startsWith("/admin");
  const isInternalRole = userRole === "ADMIN" || userRole === "MANAGER" || userRole === "EMPLOYEE";

  if (hydrated && isAdminPath && isInternalRole) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm px-0" style={{ backgroundColor: "#0D6EFD", transition: "all 0.3s ease" }}>
      <style>{`
        .navbar-brand { font-size: 1.4rem; letter-spacing: -0.5px; }
        .nav-link { font-weight: 500; font-size: 0.95rem; padding: 0.5rem 1rem !important; transition: all 0.2s ease; }
        .nav-link:hover { color: #fff !important; transform: translateY(-1px); }
        .navbar-shrink { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .cart-badge-bounce { animation: bounce 0.4s ease; }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        .btn-auth-premium { border-radius: 50px; font-weight: 600; padding: 0.5rem 1.25rem; }
        @media (max-width: 991px) {
            .navbar-nav { padding-bottom: 1rem; }
            .d-flex { flex-direction: column; align-items: stretch !important; width: 100%; gap: 10px; }
            .btn-auth-premium { text-align: center; width: 100%; }
        }
      `}</style>
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold d-flex align-items-center">
          <i className="bi bi-cpu-fill me-2 fs-3 text-info"></i>
          <span>ABC <span className="text-info">XYZ</span></span>
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto ps-lg-4">
            <li className="nav-item"><Link href="/products" className={`nav-link ${pathname === '/products' ? 'active fw-bold' : ''}`}>Danh mục thiết bị</Link></li>
            <li className="nav-item"><Link href="/warranty" className={`nav-link ${pathname === '/warranty' ? 'active fw-bold' : ''}`}><i className="bi bi-tools me-1"></i>Bảo hành</Link></li>
            <li className="nav-item"><Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active fw-bold' : ''}`}>Liên hệ hỗ trợ</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {hydrated && (
              <>
                {/* Chưa đăng nhập */}
                {!userRole && (
                  <Link href="/login" className="btn btn-outline-light btn-auth-premium"><i className="bi bi-person-circle me-1"></i> Đăng nhập</Link>
                )}

                {/* Khách hàng (Customer) */}
                {userRole === "CUSTOMER" && (
                  <>
                    <div className="dropdown">
                      <button className="btn btn-outline-light btn-auth-premium dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                        <i className="bi bi-person-circle me-1"></i> {userInfo?.name || "Tài khoản"}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2">
                        <li className="px-3 py-2 border-bottom">
                          <div className="fw-bold text-primary">{userInfo?.name}</div>
                          <div className="small text-muted">{userInfo?.email}</div>
                        </li>
                        <li><Link className="dropdown-item py-2" href="/orders"><i className="bi bi-receipt me-2"></i>Đơn hàng</Link></li>
                        <li><Link className="dropdown-item py-2" href="/warranty"><i className="bi bi-clock-history me-2"></i>Lịch sử bảo hành</Link></li>
                      </ul>
                    </div>
                    {/* Nút đăng xuất bên ngoài theo yêu cầu (nằm giữa tên và giỏ hàng) */}
                    <button onClick={logout} className="btn btn-outline-light btn-auth-premium border-0 px-2 ms-1" title="Đăng xuất">
                      <i className="bi bi-box-arrow-right fs-5"></i>
                    </button>
                  </>
                )}

                {/* Giỏ hàng (dành cho GUEST và CUSTOMER) */}
                {(!userRole || userRole === "CUSTOMER") && (
                  <Link href="/cart" className="btn btn-warning btn-auth-premium position-relative shadow-sm ms-2">
                    <i className="bi bi-cart3 me-1"></i> Giỏ hàng
                    {items.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light shadow-sm cart-badge-bounce" style={{ fontSize: '10px' }}>
                        {items.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Nhân viên/Quản lý/Admin */}
                {(userRole === "ADMIN" || userRole === "MANAGER" || userRole === "EMPLOYEE") && (
                  <div className="d-flex align-items-center">
                    <Link href="/admin" className="btn btn-light text-primary btn-auth-premium me-2 shadow-sm border-0">
                      <i className="bi bi-shield-lock-fill me-1"></i> Bảng điều khiển ({userRole})
                    </Link>
                    <button onClick={logout} className="btn btn-outline-light btn-auth-premium border-0" title="Đăng xuất"><i className="bi bi-power fs-5"></i></button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
