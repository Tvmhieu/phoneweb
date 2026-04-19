"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const { userRole } = useAuth();
  
  const isAdminPath = pathname.startsWith("/admin");
  const isInternalRole = userRole === "ADMIN" || userRole === "MANAGER" || userRole === "EMPLOYEE";

  // Không hiện Footer chung ở trang Admin nội bộ
  if (isAdminPath && isInternalRole) {
    return null;
  }

  return (
    <footer className="footer-premium text-white pt-5 pb-3 mt-auto" style={{ backgroundColor: "#0a2e6b" }}>
      <style>{`
        .footer-premium { border-top: 4px solid #00f2fe; position: relative; }
        .footer-premium::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 10% 20%, rgba(13, 110, 253, 0.05) 0%, transparent 50%); pointer-events: none; }
        .footer-premium > .container { position: relative; z-index: 1; }
        .footer-link { color: rgba(255,255,255,0.7); text-decoration: none; transition: all 0.2s; font-size: 0.9rem; }
        .footer-link:hover { color: #00f2fe; padding-left: 5px; }
        .footer-heading { color: #ffffff; font-weight: 700; margin-bottom: 1.5rem; font-size: 1.1rem; }
        .text-accent { color: #00f2fe; font-weight: 600; }
      `}</style>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 text-start">
            <h5 className="footer-heading d-flex align-items-center mb-3">
              <i className="bi bi-cpu-fill text-accent me-2 fs-3"></i>
              ABC <span className="text-accent ms-1">XYZ</span>
            </h5>
            <p className="small text-white-50 mb-4 lh-lg">
              Hệ thống cung cấp giải pháp chuyển đổi số và thiết bị CNTT chuyên nghiệp hàng đầu Việt Nam. Đối tác tin cậy cho mọi doanh nghiệp.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 px-3 shadow-sm border-opacity-25" style={{ fontSize: '1.1rem' }}><i className="bi bi-facebook"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 px-3 shadow-sm border-opacity-25" style={{ fontSize: '1.1rem' }}><i className="bi bi-linkedin"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 px-3 shadow-sm border-opacity-25" style={{ fontSize: '1.1rem' }}><i className="bi bi-youtube"></i></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 text-start">
            <h6 className="footer-heading">Khám phá</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/products" className="footer-link">Sản phẩm bán lẻ</Link></li>
              <li className="mb-2"><Link href="/warranty" className="footer-link">Trung tâm bảo hành</Link></li>
              <li className="mb-2"><Link href="/warranty-policy" className="footer-link">Chính sách bảo hành</Link></li>
              <li className="mb-2"><Link href="/contact" className="footer-link">Liên hệ tư vấn</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 text-start">
            <h6 className="footer-heading">Thông tin ABC XYZ</h6>
            <ul className="list-unstyled">
              <li className="mb-3 small text-white-50 d-flex align-items-start"><i className="bi bi-geo-alt-fill text-accent me-3 fs-5"></i> <div className="flex-grow-1" style={{ minWidth: 0 }}>Số 456 Đường Công Nghệ, Khu CNC Quận 9, TP. Thủ Đức, HCM</div></li>
              <li className="mb-3 small text-white-50"><i className="bi bi-telephone-fill text-accent me-3 fs-5"></i> Hotline: <span className="text-white fw-bold fs-6">028 7777 9999</span></li>
              <li className="mb-3 small text-white-50"><i className="bi bi-envelope-fill text-accent me-3 fs-5"></i> Email: <span className="text-white">contact@abcxyz.com.vn</span></li>
              <li className="mb-2 small text-white-50"><i className="bi bi-clock-fill text-accent me-3 fs-5"></i> Giờ làm việc: 8:00 - 18:00 (T2-T7)</li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 text-start">
            <h6 className="footer-heading">An toàn giao dịch</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-light bg-opacity-10 p-2 text-white border border-light border-opacity-10"><i className="bi bi-shield-lock-fill me-1 text-accent"></i> SSL 256-bit</span>
              <span className="badge bg-light bg-opacity-10 p-2 text-white border border-light border-opacity-10"><i className="bi bi-check-circle-fill me-1 text-success"></i> Verified B2B</span>
            </div>
            <p className="x-small text-white-50 opacity-50 mt-2">Hệ thống đạt chuẩn bảo mật quốc tế cho mọi giao dịch doanh nghiệp trực tuyến.</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
