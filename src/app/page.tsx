import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

interface ProductImage {
  url: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  images?: ProductImage[];
}

export const dynamic = "force-dynamic";

const fallbackProducts = [
  { id: 1, name: "Máy Chủ Dell PowerEdge R440", brand: "Dell", category: "SERVER", price: 45000000, imageUrl: "" },
  { id: 2, name: "Máy In HP LaserJet Pro", brand: "HP", category: "PRINTER", price: 4200000, imageUrl: "" },
  { id: 3, name: "Switch Cisco Catalyst 2960", brand: "Cisco", category: "NETWORK", price: 9500000, imageUrl: "" },
  { id: 4, name: "Laptop ThinkPad T14s Gen 3", brand: "Lenovo", category: "LAPTOP", price: 28500000, imageUrl: "" },
];

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = (await prisma.product.findMany({
      where: {
        AND: [
          { isVisible: true },
          { isDeleted: false }
        ]
      },
      take: 8,
      orderBy: { id: 'desc' },
      include: { images: { select: { url: true } } }
    })) as unknown as Product[];
    if (featuredProducts.length === 0) featuredProducts = fallbackProducts as unknown as Product[];
  } catch (error) {
    featuredProducts = fallbackProducts as unknown as Product[];
  }

  return (
    <div className="homepage">
      <style>{`
        .hero-gradient {
            background: linear-gradient(135deg, #0d6efd 0%, #003d99 100%);
            position: relative;
            overflow: hidden;
            color: white;
            padding: 100px 0;
        }
        @media (max-width: 768px) {
            .hero-gradient { padding: 60px 0; }
            .display-3 { font-size: 2.5rem; }
        }
        .hero-gradient::after {
            content: "";
            position: absolute;
            top: -50%;
            right: -10%;
            width: 800px;
            height: 800px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
            z-index: 0;
        }
        .category-card {
            transition: all 0.3s ease;
            border: 1px solid #eee;
            border-radius: 12px;
            background: white;
            padding: 24px;
            text-align: center;
        }
        .category-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
            border-color: #0d6efd;
        }
        .product-card {
            border: none;
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .btn-premium {
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
        }
        .section-title {
            position: relative;
            padding-bottom: 15px;
            margin-bottom: 40px;
            font-weight: 800;
        }
        .section-title::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: #0d6efd;
            border-radius: 2px;
        }
        .brand-logo {
            filter: grayscale(100%);
            opacity: 0.5;
            transition: all 0.3s;
            max-height: 40px;
        }
        .brand-logo:hover {
            filter: grayscale(0%);
            opacity: 1;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark mb-3 px-3 py-2 fw-bold text-uppercase">B2B TECHNOLOGY SOLUTIONS</span>
              <h1 className="display-3 fw-bold mb-4">
                Hạ tầng thiết bị IT <br/>
                <span className="text-info">Chuyên nghiệp & Toàn diện</span>
              </h1>
              <p className="lead fs-4 mb-5 opacity-90">
                ABC XYZ cung cấp cấu hình máy chủ, máy trạm và hạ tầng mạng theo yêu cầu doanh nghiệp. 
                Sản phẩm chính hãng với chính sách bảo hành ưu việt.
              </p>
              <div className="d-flex gap-3">
                <Link href="/products" className="btn btn-light btn-lg btn-premium text-primary">Xem Sản phẩm</Link>
                <Link href="/contact" className="btn btn-outline-light btn-lg btn-premium">Yêu cầu Tư vấn</Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
               <div className="p-4 bg-white bg-opacity-10 rounded-4 shadow-lg backdrop-blur">
                  <i className="bi bi-hdd-rack display-1 text-white opacity-50"></i>
                  <div className="mt-4">
                    <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-shield-check fs-3 me-3 text-info"></i>
                        <span className="fw-bold">Cam kết chính hãng 100%</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 text-start">
                        <i className="bi bi-patch-check fs-3 me-3 text-info"></i>
                        <span className="fw-bold">Bảo hành linh hoạt đến 36 tháng</span>
                    </div>
                    <div className="d-flex align-items-center text-start">
                        <i className="bi bi-headset fs-3 me-3 text-info"></i>
                        <span className="fw-bold">Hỗ trợ kỹ thuật 24/7 onsite</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-5 bg-white">
        <div className="container pt-4">
          <h2 className="section-title">Danh mục Thiết bị</h2>
          <div className="row g-4">
            <div className="col-6 col-md-4 col-lg-2 mt-4">
              <Link href="/products?category=SERVER" className="text-decoration-none text-dark">
                <div className="category-card">
                  <i className="bi bi-hdd-network-fill display-5 text-primary mb-3 d-block"></i>
                  <h6 className="fw-bold mb-0">Máy Chủ</h6>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2 mt-4">
              <Link href="/products?category=NETWORK" className="text-decoration-none text-dark">
                <div className="category-card">
                  <i className="bi bi-router-fill display-5 text-primary mb-3 d-block"></i>
                  <h6 className="fw-bold mb-0">Thiết Bị Mạng</h6>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2 mt-4">
              <Link href="/products?category=LAPTOP" className="text-decoration-none text-dark">
                <div className="category-card">
                  <i className="bi bi-laptop display-5 text-primary mb-3 d-block"></i>
                  <h6 className="fw-bold mb-0">Máy Trạm</h6>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2 mt-4">
              <Link href="/products?category=PRINTER" className="text-decoration-none text-dark">
                <div className="category-card">
                  <i className="bi bi-printer-fill display-5 text-primary mb-3 d-block"></i>
                  <h6 className="fw-bold mb-0">Máy In</h6>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2 mt-4">
              <Link href="/products?category=POS" className="text-decoration-none text-dark">
                <div className="category-card">
                  <i className="bi bi-phone-fill display-5 text-primary mb-3 d-block"></i>
                  <h6 className="fw-bold mb-0">Máy POS</h6>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="section-title mb-0">Thiết bị Nổi bật</h2>
              <p className="text-muted mt-2">Được nhiều doanh nghiệp tin dùng & cấu hình sẵn sàng</p>
            </div>
            <Link href="/products" className="btn btn-outline-primary fw-bold">Xem tất cả <i className="bi bi-chevron-right small"></i></Link>
          </div>

          <div className="row g-3 g-md-4">
            {featuredProducts.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                <div className="card h-100 shadow-sm product-card border-0">
                  <div className="position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                    {(p.imageUrl || p.images?.[0]?.url) ? (
                      <Image 
                        src={p.imageUrl || p.images?.[0]?.url || ""} 
                        className="w-100 h-100" 
                        style={{ objectFit: "cover" }} 
                        alt={p.name} 
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <i className={`bi ${p.category === 'SERVER' ? 'bi-hdd-network' : p.category === 'PRINTER' ? 'bi-printer' : 'bi-laptop'} display-3 text-muted`}></i>
                    )}
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <small className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '11px', letterSpacing: '1px' }}>{p.brand}</small>
                    <h5 className="card-title fw-bold text-dark mb-3 h6" style={{ height: "40px", overflow: "hidden" }}>{p.name}</h5>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-danger fw-extrabold fs-5">{(p.price || 0).toLocaleString()} <small>đ</small></span>
                        <span className="badge text-bg-light border small">{p.category}</span>
                      </div>
                      <Link href={`/products/${p.id}`} className="btn btn-outline-primary btn-sm w-100 fw-bold">Xem Chi Tiết</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Partners */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center g-5">
            <div className="col-12 mb-2">
                <p className="text-muted fw-bold small text-uppercase">Đối tác chiến lược</p>
            </div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">DELL</span></div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">CISCO</span></div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">HP</span></div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">LENOVO</span></div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">SUNMI</span></div>
            <div className="col-6 col-md-2 mt-0"><span className="fw-bold fs-3 text-muted">IBM</span></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 my-5">
        <div className="container">
            <div className="card border-0 shadow-lg p-5 bg-dark text-white rounded-5 overflow-hidden position-relative">
                <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
                    <i className="bi bi-gear-fill" style={{ fontSize: '250px' }}></i>
                </div>
                <div className="row position-relative" style={{ zIndex: 1 }}>
                    <div className="col-lg-8">
                        <h2 className="display-5 fw-bold mb-3">Sẵn sàng nâng cấp hạ tầng doanh nghiệp?</h2>
                        <p className="lead opacity-75 mb-0">Liên hệ ngay để nhận báo giá dự án và ưu đãi đặc biệt cho đối tác lâu năm.</p>
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-lg-end mt-4 mt-lg-0">
                        <Link href="/contact" className="btn btn-info btn-lg btn-premium fw-bold px-5">LIÊN HỆ NGAY</Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
