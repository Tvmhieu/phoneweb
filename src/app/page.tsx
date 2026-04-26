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
  { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", category: "IPHONE", price: 30990000, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "SAMSUNG", price: 28490000, imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Xiaomi 14 Ultra 5G", brand: "Xiaomi", category: "XIAOMI", price: 22990000, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351af963?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "iPad Pro M4 11-inch (2024)", brand: "Apple", category: "TABLET", price: 26990000, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" },
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
            background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
            position: relative;
            overflow: hidden;
            color: white;
            padding: 120px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
            .hero-gradient { padding: 80px 0; }
            .display-3 { font-size: 2.8rem; }
        }
        .hero-floating-elements div {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13, 110, 253, 0.2) 0%, transparent 70%);
          z-index: 0;
        }
        .hero-btn {
          padding: 15px 40px;
          border-radius: 100px;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hero-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .category-item {
          transition: all 0.3s ease;
          border-radius: 20px;
          background: white;
          padding: 30px 20px;
          height: 100%;
        }
        .category-item:hover {
          background: #0d6efd;
          color: white !important;
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(13,110,253,0.15);
        }
        .category-item:hover i { color: white !important; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
        .product-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s ease;
          border: 1px solid #f0f0f0;
        }
        .product-card:hover {
          transform: scale(1.02);
          box-shadow: 0 30px 60px rgba(0,0,0,0.08);
          border-color: transparent;
        }
        .price-tag {
          font-weight: 800;
          color: #121212;
          font-size: 1.25rem;
        }
        .section-heading {
          font-weight: 800;
          letter-spacing: -1px;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="hero-floating-elements">
          <div style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }}></div>
          <div style={{ width: '300px', height: '300px', bottom: '-50px', right: '10%' }}></div>
        </div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge rounded-pill bg-info bg-opacity-10 text-info mb-4 px-3 py-2 fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>New Arrival: iPhone 15 Pro</span>
              <h1 className="display-3 fw-extrabold mb-4">
                Siêu phẩm công nghệ <br/>
                <span className="text-info">Trong tầm tay bạn</span>
              </h1>
              <p className="lead fs-4 mb-5 opacity-75">
                Khám phá bộ sưu tập điện thoại mới nhất từ Apple, Samsung, Xiaomi với ưu đãi trả góp 0% và bảo hành chính hãng lên đến 18 tháng.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link href="/products" className="btn btn-info btn-lg hero-btn text-white">Mua ngay</Link>
                <Link href="/warranty" className="btn btn-outline-light btn-lg hero-btn">Bảo hành</Link>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
               <div className="glass-card p-2 p-md-4 text-center">
                  <div className="position-relative" style={{ height: "450px" }}>
                     <Image 
                        src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" 
                        alt="Featured Phone" 
                        fill 
                        style={{ objectFit: 'contain' }}
                        className="drop-shadow"
                      />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="section-heading display-6 mb-3">Danh mục nổi bật</h2>
            <p className="text-muted">Lựa chọn thương hiệu điện thoại yêu thích của bạn</p>
          </div>
          <div className="row g-4 justify-content-center">
            {['IPHONE', 'SAMSUNG', 'XIAOMI', 'OPPO', 'TABLET'].map((cat, idx) => (
              <div className="col-6 col-md-4 col-lg-2" key={cat}>
                <Link href={`/products?category=${cat}`} className="text-decoration-none text-dark">
                  <div className="category-item border text-center shadow-sm">
                    <i className={`bi ${
                        cat === 'IPHONE' ? 'bi-apple' : 
                        cat === 'TABLET' ? 'bi-tablet' : 'bi-phone'
                    } display-5 text-info mb-3 d-block`}></i>
                    <h6 className="fw-bold mb-0">{cat}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
            <div>
              <h2 className="section-heading display-6 mb-0">Sản phẩm mới nhất</h2>
              <p className="text-muted mt-2">Cập nhật những model flagship vừa ra mắt trên thị trường</p>
            </div>
            <Link href="/products" className="btn btn-dark rounded-pill px-4 fw-bold">Xem tất cả sản phẩm</Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                <div className="card h-100 product-card">
                  <div className="position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ height: "260px" }}>
                    {(p.imageUrl || p.images?.[0]?.url) ? (
                      <Image 
                        src={p.imageUrl || p.images?.[0]?.url || ""} 
                        className="w-100 h-100 p-3 product-image-zoom" 
                        style={{ objectFit: "contain", mixBlendMode: "multiply" }} 
                        alt={p.name} 
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <i className="bi bi-smartphone display-1 text-muted opacity-25"></i>
                    )}
                    <div className="position-absolute top-0 end-0 p-3">
                      <button className="btn btn-white btn-sm rounded-circle shadow-sm"><i className="bi bi-heart"></i></button>
                    </div>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-info fw-bold text-uppercase" style={{ fontSize: '11px' }}>{p.brand}</small>
                      <span className="badge text-bg-light border-0 text-muted small">{p.category}</span>
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-3 h6" style={{ height: "40px", overflow: "hidden", lineHeight: "1.4" }}>{p.name}</h5>
                    <div className="mt-auto">
                      <div className="mb-3">
                        <span className="price-tag">{(p.price || 0).toLocaleString()} <small className="fw-normal fs-6">đ</small></span>
                      </div>
                      <Link href={`/products/${p.id}`} className="btn btn-dark w-100 rounded-pill fw-bold py-2">Chi tiết</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4">
                <i className="bi bi-truck display-4 text-info mb-3"></i>
                <h5 className="fw-bold">Giao hàng siêu tốc</h5>
                <p className="text-muted">Nhận máy trong 2h tại TP.HCM và Hà Nội. Miễn phí giao hàng toàn quốc.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4">
                <i className="bi bi-patch-check display-4 text-info mb-3"></i>
                <h5 className="fw-bold">Bảo hành 1 đổi 1</h5>
                <p className="text-muted">Chính sách bảo hành lỗi là đổi mới trong 30 ngày đầu tiên sử dụng.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4">
                <i className="bi bi-credit-card-2-back display-4 text-info mb-3"></i>
                <h5 className="fw-bold">Trả góp 0% lãi suất</h5>
                <p className="text-muted">Hỗ trợ trả góp qua thẻ tín dụng và các công ty tài chính phổ biến.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center g-5 opacity-50">
            <div className="col-6 col-md-3"><i className="bi bi-apple" style={{ fontSize: '2.5rem' }}></i></div>
            <div className="col-6 col-md-3"><span className="fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>SAMSUNG</span></div>
            <div className="col-6 col-md-3"><span className="fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>XIAOMI</span></div>
            <div className="col-6 col-md-3"><span className="fw-bold text-success" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>OPPO</span></div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5">
        <div className="container">
            <div className="card border-0 shadow-lg p-5 bg-info text-white rounded-5 overflow-hidden position-relative" style={{ background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)' }}>
                <div className="row align-items-center">
                    <div className="col-lg-7 mb-4 mb-lg-0">
                        <h2 className="display-6 fw-bold mb-3">Đăng ký nhận ưu đãi mới nhất</h2>
                        <p className="lead opacity-75 mb-0">Chúng tôi sẽ gửi thông báo cho bạn khi có các đợt giảm giá lớn và model mới về.</p>
                    </div>
                    <div className="col-lg-5">
                        <div className="input-group input-group-lg shadow-sm">
                            <input type="text" className="form-control border-0 rounded-start-pill" placeholder="Email của bạn..." />
                            <button className="btn btn-dark rounded-end-pill px-4 fw-bold">Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
