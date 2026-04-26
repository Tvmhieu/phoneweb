import Link from "next/link";

export const metadata = {
  title: "Chính Sách Bảo Hành - PhoneStore",
  description: "Chính sách bảo hành điện thoại và máy tính bảng tại PhoneStore. Cam kết đổi mới trong 30 ngày và bảo hành 12 tháng chính hãng.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="warranty-policy bg-light min-vh-100 py-5">
      <style>{`
        .policy-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            padding: 50px;
            margin-top: 2rem;
        }
        .policy-title {
            color: #0d6efd;
            font-weight: 800;
            border-bottom: 3px solid #0d6efd;
            display: inline-block;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        .section-header {
            color: #212529;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }
        .section-header i {
            color: #0d6efd;
            margin-right: 12px;
            font-size: 1.5rem;
        }
        .policy-content p, .policy-content li {
            color: #4b5563;
            line-height: 1.8;
        }
        .highlight-box {
            background: #f8f9fa;
            border-left: 5px solid #0d6efd;
            padding: 20px;
            border-radius: 0 12px 12px 0;
            margin: 20px 0;
        }
        @media (max-width: 768px) {
            .policy-container {
                padding: 30px 20px;
            }
        }
      `}</style>

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Chính sách bảo hành</li>
          </ol>
        </nav>

        <div className="policy-container mx-auto" style={{ maxWidth: '900px' }}>
          <div className="text-center">
            <h1 className="policy-title text-uppercase">Chính Sách Bảo Hành Điện Thoại & Máy Tính Bảng</h1>
          </div>

          <div className="policy-content">
            <section>
              <h4 className="section-header"><i className="bi bi-info-circle-fill"></i> 1. Phạm vi áp dụng</h4>
              <p>Chính sách này áp dụng cho tất cả các thiết bị di động do PhoneStore cung cấp, bao gồm nhưng không giới hạn: điện thoại thông minh (smartphone), máy tính bảng, đồng hồ thông minh và các phụ kiện đi kèm.</p>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-arrow-repeat"></i> 2. Chính sách đổi mới (30 ngày đầu)</h4>
              <div className="highlight-box">
                <p className="mb-0 fw-bold text-dark">Khách hàng được đổi mới sản phẩm trong vòng 30 ngày kể từ ngày mua hàng.</p>
              </div>
              <p className="fw-bold mb-2">Điều kiện áp dụng:</p>
              <ul>
                <li>Sản phẩm phát sinh lỗi kỹ thuật được xác định là <strong>lỗi từ nhà sản xuất (NSX)</strong>.</li>
                <li>Sản phẩm còn đầy đủ hộp, phụ kiện, tem niêm phong và hóa đơn mua hàng.</li>
              </ul>
              <p className="small text-muted"><em>Trường hợp không đủ điều kiện đổi mới, sản phẩm sẽ được chuyển sang hình thức bảo hành.</em></p>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-shield-check"></i> 3. Chính sách bảo hành (12 tháng)</h4>
              <p>Tất cả thiết bị được <strong>bảo hành 12 tháng</strong> kể từ ngày mua nếu xảy ra lỗi từ nhà sản xuất.</p>
              <p className="fw-bold mb-2">Hình thức bảo hành:</p>
              <ul>
                <li>Sửa chữa miễn phí hoặc thay thế linh kiện lỗi.</li>
                <li>Thời gian xử lý tùy thuộc vào mức độ hư hỏng và linh kiện thay thế.</li>
              </ul>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-check2-circle"></i> 4. Điều kiện bảo hành hợp lệ</h4>
              <p>Sản phẩm được bảo hành khi:</p>
              <ul>
                <li>Còn trong thời hạn bảo hành.</li>
                <li>Lỗi phát sinh do kỹ thuật hoặc linh kiện từ nhà sản xuất.</li>
                <li>Tem bảo hành và số serial còn nguyên vẹn, không bị rách hoặc sửa đổi.</li>
              </ul>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-x-circle"></i> 5. Trường hợp không được bảo hành</h4>
              <ul>
                <li>Sản phẩm bị hư hỏng do: rơi vỡ, va đập, vào nước, cháy nổ, thiên tai.</li>
                <li>Sử dụng sai hướng dẫn hoặc tự ý sửa chữa.</li>
                <li>Tem bảo hành bị mất, rách hoặc không hợp lệ.</li>
                <li>Hao mòn tự nhiên trong quá trình sử dụng (mực in, pin, linh kiện tiêu hao...).</li>
              </ul>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-gear-wide-connected"></i> 6. Quy trình bảo hành</h4>
              <ol>
                <li>Khách hàng liên hệ bộ phận kỹ thuật hoặc trung tâm bảo hành.</li>
                <li>Cung cấp hóa đơn và thông tin sản phẩm.</li>
                <li>Kỹ thuật viên kiểm tra và xác định lỗi.</li>
                <li>Tiến hành đổi mới hoặc bảo hành theo chính sách.</li>
              </ol>
            </section>

            <section>
              <h4 className="section-header"><i className="bi bi-patch-check"></i> 7. Cam kết</h4>
              <p>Chúng tôi cam kết mang đến dịch vụ bảo hành nhanh chóng, minh bạch và đảm bảo quyền lợi tốt nhất cho khách hàng.</p>
            </section>

            <hr className="my-5" />

            <div className="contact-info bg-primary bg-opacity-10 p-4 rounded-4 text-center">
              <h5 className="fw-bold text-primary mb-3">Mọi thắc mắc xin liên hệ:</h5>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                <div><i className="bi bi-telephone-fill me-2 text-primary"></i> <strong>Hotline:</strong> 1900 8888</div>
                <div><i className="bi bi-envelope-fill me-2 text-primary"></i> <strong>Email:</strong> support@phonestore.com.vn</div>
              </div>
              <Link href="/warranty" className="btn btn-primary rounded-pill px-4 py-2 mt-4 fw-bold">
                GỬI YÊU CẦU BẢO HÀNH ONLINE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
