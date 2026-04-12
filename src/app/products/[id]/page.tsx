import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import ImageGallery from "@/components/ImageGallery";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findFirst({
      where: { 
        id: parseInt(id),
        isVisible: true,
        isDeleted: false
      },
      include: { images: true }
    });
  } catch (error) {
    console.warn("Lỗi tải sản phẩm:", error);
  }

  if (!product) return notFound();

  // Lấy danh sách link ảnh từ bảng ProductImage
  const allImages = product.images?.map((img: any) => img.url) || [];

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mt-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/"><i className="bi bi-house-door"></i> Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link href="/products">Sản phẩm</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
        <div className="col-md-5 mb-4">
          <ImageGallery 
            mainImage={product.imageUrl} 
            allImages={allImages} 
            productName={product.name} 
            productId={product.id} 
          />
        </div>
        
        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <div className="col-md-7">
          <span className="badge bg-primary mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>{product.category}</span>
          <h2 className="fw-bold mb-2 text-dark" style={{ lineHeight: 1.3 }}>{product.name}</h2>
          
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span className="text-secondary"><i className="bi bi-building me-1 text-primary"></i>Thương hiệu: <b className="text-dark">{product.brand}</b></span>
            <span className="text-secondary"><i className="bi bi-shield-check me-1 text-success"></i>Bảo hành: <b className="text-success">{product.warrantyMonths} Tháng</b></span>
            <span className="text-secondary"><i className="bi bi-box-seam me-1 text-info"></i>Kho: <b className="text-dark">{product.stock} máy</b></span>
          </div>

          <hr className="my-4 opacity-50" />
          
          {/* GIÁ BÁN & THUÊ */}
          <div className="mb-4 p-4 bg-white border rounded shadow-sm">
            <div className="row align-items-center">
              <div className="col-sm-12">
                <div className="text-muted small mb-1 fw-bold text-uppercase">Giá bán niêm yết</div>
                <h3 className="text-danger fw-bold mb-0" style={{ fontSize: "2.2rem" }}>{product.price?.toLocaleString("vi-VN")} VNĐ</h3>
              </div>
              
              {product.isRentable && (
                 <div className="col-sm-12 mt-3">
                   <div className="p-3 border-start border-4 border-primary bg-primary bg-opacity-10 rounded-end">
                     <span className="text-primary small d-block fw-bold text-uppercase">Giải pháp cho thuê dự án / thuê sự kiện:</span>
                     <strong className="text-dark fs-5">{product.rentalPricePerDay?.toLocaleString("vi-VN")} VNĐ / Ngày</strong>
                   </div>
                 </div>
              )}
            </div>
          </div>

          {/* NÚT MUA / GIỎ HÀNG */}
          <AddToCart product={product as any} />
          
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle me-1"></i> Giá trên đã bao gồm VAT và hỗ trợ kỹ thuật onsite.
          </div>
        </div>
      </div>

      {/* ====== MÔ TẢ SẢN PHẨM & GIỚI THIỆU CHỨC NĂNG ====== */}
      <div className="mt-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white border-bottom fw-bold py-3 fs-5">
            <i className="bi bi-file-text me-2 text-primary"></i> Mô tả sản phẩm & Giới thiệu chức năng
          </div>
          <div className="card-body p-4" style={{ textAlign: "justify", lineHeight: 2, whiteSpace: "pre-line", color: "#495057", fontSize: '1.1rem' }}>
            {product.description ? product.description : "Đang cập nhật nội dung mô tả chi tiết cho thiết bị này..."}
          </div>
        </div>
      </div>

      {/* ====== CAM KẾT DỊCH VỤ ====== */}
      <div className="mt-5 mb-5">
        <div className="card shadow-sm border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4 border-bottom pb-2 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>Cam Kết Dịch Vụ ABC XYZ
            </h5>
            <div className="row g-4 text-start">
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Hàng chính hãng</div>
                  <small className="text-muted">Đầy đủ CO/CQ, VAT xuất hóa đơn đỏ theo dự án.</small>
              </div>
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Hỗ trợ 24/7</div>
                  <small className="text-muted">Kỹ thuật xử lý onsite toàn quốc trong 4-8h.</small>
              </div>
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Đổi trả linh hoạt</div>
                  <small className="text-muted">Thay thế máy ngay lập tức nếu gặp lỗi kỹ thuật.</small>
              </div>
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Bán & Cho thuê</div>
                  <small className="text-muted">Giải pháp tài chính tối ưu cho doanh nghiệp B2B.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
