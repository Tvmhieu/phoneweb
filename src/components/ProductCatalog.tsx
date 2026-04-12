"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProductCatalog({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");
  const [minPrice, setMinPrice] = useState(0); 
  const [maxPrice, setMaxPrice] = useState(100000000); 
  const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat.toUpperCase());
    } else {
      setCategory("ALL");
    }
  }, [searchParams]);

  let filteredProducts = initialProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    let matchCat = true;
    if (category === "ALL") {
      matchCat = true;
    } else if (category === "RENT") {
      matchCat = !!p.isRentable;
    } else {
      matchCat = p.category === category;
    }

    const price = p.price || 0;
    const matchPrice = price >= minPrice && price <= maxPrice;

    return matchSearch && matchCat && matchPrice;
  });

  // Sắp xếp theo giá (tham khảo từ Hshop)
  if (sortOrder === "asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOrder === "desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  // Gợi ý tìm kiếm (tham khảo từ Hshop search suggestions)
  const searchSuggestions = searchTerm.length >= 2 
    ? initialProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Danh sách category để lấy từ data
  const categories = Array.from(new Set(initialProducts.map(p => p.category)));

  return (
    <div className="container py-4">
      <style>{`
        .product-card-hover {
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .product-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        .product-image-zoom {
          transition: transform 0.35s ease;
          transform-origin: center;
        }
        .product-card-hover:hover .product-image-zoom {
          transform: scale(1.08);
        }
      `}</style>

      {/* Breadcrumb (Tham khảo từ Hshop) */}
      <nav aria-label="breadcrumb" className="mt-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/"><i className="bi bi-house-door"></i> Trang chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Danh sách sản phẩm</li>
        </ol>
      </nav>

      <h1 className="fw-bold text-primary mb-4" style={{ fontSize: "1.75rem" }}>
        {category === "RENT" ? "Thuê thiết bị IT — Giải pháp B2B" : "Danh mục Thiết bị IT — Chính hãng 100%"}
      </h1>

      {/* GENERAL HERO - HIỆN KHI KHÔNG PHẢI CATEGORY RENT */}
      {category !== "RENT" && (
        <div className="card border-0 rounded-4 overflow-hidden mb-5 shadow-sm" style={{ background: "linear-gradient(135deg, #0d6efd 0%, #004085 100%)" }}>
           <div className="card-body p-4 p-lg-5 text-white position-relative">
              <div className="row align-items-center">
                 <div className="col-lg-8">
                    <div className="text-info mb-2 fw-bold text-uppercase small" style={{ letterSpacing: '1.5px' }}>Trung tâm thiết bị IT Doanh nghiệp</div>
                    <h2 className="display-6 fw-bold mb-3">Hạ Tầng Công Nghệ Đột Phá</h2>
                    <p className="lead mb-4 opacity-75">
                       Khám phá kho thiết bị Server, Network và Workstation cấu hình cao từ các thương hiệu hàng đầu thế giới Dell, HP, Cisco, Lenovo. Giải pháp tối ưu cho trung tâm dữ liệu.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                       <div className="bg-white bg-opacity-10 p-2 px-3 rounded-pill small fw-bold border border-white border-opacity-10"><i className="bi bi-patch-check-fill me-2 text-info"></i>100% Chính hãng</div>
                       <div className="bg-white bg-opacity-10 p-2 px-3 rounded-pill small fw-bold border border-white border-opacity-10"><i className="bi bi-headset me-2 text-info"></i>Hỗ trợ 24/7</div>
                       <div className="bg-white bg-opacity-10 p-2 px-3 rounded-pill small fw-bold border border-white border-opacity-10"><i className="bi bi-truck me-2 text-info"></i>Giao hàng hỏa tốc</div>
                    </div>
                 </div>
                 <div className="col-lg-4 d-none d-lg-block text-center mt-4 mt-lg-0">
                    <i className="bi bi-cpu-fill text-white opacity-10" style={{ fontSize: '10rem' }}></i>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* RENTAL HERO - HIỆN KHI CHỌN CATEGORY LÀ RENT */}
      {category === "RENT" && (
        <div className="card border-0 rounded-4 overflow-hidden mb-5 shadow-sm" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
           <div className="card-body p-4 p-lg-5 text-dark position-relative">
              <div className="row align-items-center">
                 <div className="col-lg-8">
                    <div className="text-primary mb-2 fw-bold text-uppercase small" style={{ letterSpacing: '1.5px' }}>Giải pháp thuê máy dự án</div>
                    <h2 className="display-6 fw-bold mb-3 text-primary">Dịch Vụ Thuê Thiết Bị IT B2B</h2>
                    <p className="lead mb-4 fw-medium" style={{ color: "#004085" }}>
                       ABC XYZ cung cấp cấu hình máy chủ, máy trạm và hạ tầng mạng theo yêu cầu ngắn hạn và dài hạn. 
                       Hỗ trợ kỹ thuật 24/7 onsite và thay thế linh kiện ngay lập tức.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                       <div className="bg-white bg-opacity-40 p-2 px-3 rounded-pill small fw-bold border border-white"><i className="bi bi-shield-check me-2 text-primary"></i>Bảo hiểm thiết bị</div>
                       <div className="bg-white bg-opacity-40 p-2 px-3 rounded-pill small fw-bold border border-white"><i className="bi bi-clock-history me-2 text-primary"></i>Thuê linh hoạt</div>
                       <div className="bg-white bg-opacity-40 p-2 px-3 rounded-pill small fw-bold border border-white"><i className="bi bi-tools me-2 text-primary"></i>Onsite 4h</div>
                    </div>
                 </div>
                 <div className="col-lg-4 d-none d-lg-block text-center mt-4 mt-lg-0">
                    <i className="bi bi-calendar2-check-fill text-primary opacity-10" style={{ fontSize: '10rem' }}></i>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* THANH TÌM KIẾM (Tham khảo search-form từ Hshop) */}
      <div className="position-relative mb-4">
        <div className="input-group shadow-sm" style={{ maxWidth: "500px" }}>
          <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
          <input 
            type="search" 
            className="form-control border-start-0" 
            placeholder="Tìm theo tên sản phẩm, hãng (Dell, Cisco, HP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Gợi ý tìm kiếm (tương tự search-suggestions của Hshop) */}
        {searchSuggestions.length > 0 && (
          <div className="position-absolute bg-white border rounded shadow-lg mt-1" style={{ zIndex: 2000, width: "500px", maxHeight: "400px", overflowY: "auto" }}>
            {searchSuggestions.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="d-flex align-items-center p-3 text-decoration-none border-bottom" style={{ transition: "all 0.2s" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px", flexShrink: 0 }}>
                  <i className={`bi ${p.category === 'SERVER' ? 'bi-hdd-network' : p.category === 'PRINTER' ? 'bi-printer' : p.category === 'LAPTOP' ? 'bi-laptop' : 'bi-router'} text-primary`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>{p.name}</div>
                  <div className="text-primary fw-bold" style={{ fontSize: "0.85rem" }}>{p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* BỘ LỌC + SẮP XẾP */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row align-items-center g-3">

            {/* Dòng 1: Phân loại */}
            <div className="col-12">
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <span className="text-muted small fw-bold me-2"><i className="bi bi-grid me-1"></i>Phân loại:</span>
                <button onClick={() => setCategory("ALL")} className={`btn btn-sm ${category === "ALL" ? "btn-primary" : "btn-outline-primary"}`}>Tất cả</button>
                <button onClick={() => setCategory("SERVER")} className={`btn btn-sm ${category === "SERVER" ? "btn-primary" : "btn-outline-secondary"}`}><i className="bi bi-hdd-network me-1"></i>Máy Chủ</button>
                <button onClick={() => setCategory("NETWORK")} className={`btn btn-sm ${category === "NETWORK" ? "btn-primary" : "btn-outline-secondary"}`}><i className="bi bi-router me-1"></i>Thiết Bị Mạng</button>
                <button onClick={() => setCategory("PRINTER")} className={`btn btn-sm ${category === "PRINTER" ? "btn-primary" : "btn-outline-secondary"}`}><i className="bi bi-printer me-1"></i>Máy In</button>
                <button onClick={() => setCategory("LAPTOP")} className={`btn btn-sm ${category === "LAPTOP" ? "btn-primary" : "btn-outline-secondary"}`}><i className="bi bi-laptop me-1"></i>Laptop</button>
                <button onClick={() => setCategory("POS")} className={`btn btn-sm ${category === "POS" ? "btn-primary" : "btn-outline-secondary"}`}><i className="bi bi-phone me-1"></i>Máy POS</button>
                <button onClick={() => setCategory("RENT")} className={`btn btn-sm ${category === "RENT" ? "btn-primary fw-bold" : "btn-outline-primary"}`}><i className="bi bi-clock-history me-1"></i>Dịch vụ Cho Thuê</button>
              </div>
            </div>

            {/* Dòng 2: Sắp xếp giá (tham khảo select sort từ Hshop) + Thanh lọc giá */}
            <div className="col-md-3">
              <label className="form-label small text-muted mb-1"><i className="bi bi-sort-down me-1"></i>Sắp xếp theo giá:</label>
              <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Mặc định</option>
                <option value="asc">Giá thấp đến cao ↑</option>
                <option value="desc">Giá cao đến thấp ↓</option>
              </select>
            </div>

            <div className="col-md-9">
              <label className="form-label small text-muted mb-1"><i className="bi bi-funnel me-1"></i>Lọc theo khoảng giá:</label>
              <div className="d-flex gap-2 align-items-center">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white small">Từ</span>
                  <input type="number" className="form-control text-primary fw-bold text-end" min="0" value={minPrice} onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)} />
                </div>
                <span className="fw-bold text-muted">—</span>
                <div className="input-group input-group-sm">
                  <input type="number" className="form-control text-danger fw-bold text-end" min="0" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)} />
                  <span className="input-group-text bg-white small">VNĐ</span>
                </div>
              </div>
              {/* Thanh trượt kép gom 1 trục */}
              <div className="position-relative mt-2" style={{ height: "24px" }}>
                <div className="position-absolute w-100 bg-secondary rounded" style={{ height: "4px", top: "10px", opacity: 0.15 }}></div>
                <div className="position-absolute rounded" style={{ height: "4px", top: "10px", backgroundColor: "#0D6EFD", left: `${(minPrice / 100000000) * 100}%`, width: `${((maxPrice - minPrice) / 100000000) * 100}%` }}></div>
                <input type="range" className="position-absolute top-0 w-100" style={{ appearance: "none", background: "transparent", pointerEvents: "none", zIndex: 3, margin: 0, height: "24px" }} min="0" max="100000000" step="1000000" value={minPrice} onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), maxPrice - 1000000))} />
                <input type="range" className="position-absolute top-0 w-100" style={{ appearance: "none", background: "transparent", pointerEvents: "none", zIndex: 4, margin: 0, height: "24px" }} min="0" max="100000000" step="1000000" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), minPrice + 1000000))} />
                <style jsx>{`input[type=range]::-webkit-slider-thumb{pointer-events:all;width:20px;height:20px;-webkit-appearance:none;background:#fff;border:3px solid #0D6EFD;border-radius:50%;cursor:pointer;position:relative;top:2px;box-shadow:0 1px 4px rgba(0,0,0,0.2)}`}</style>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo kết quả tìm kiếm (tham khảo từ Hshop) */}
      {searchTerm && (
        <div className="alert alert-info py-2 px-3 small">
          Tìm kiếm cho: "<strong>{searchTerm}</strong>" — Có <strong>{filteredProducts.length}</strong> kết quả
        </div>
      )}

      {/* LƯỚI SẢN PHẨM */}
      <div className="row g-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-box-seam d-block" style={{ fontSize: "4rem" }}></i>
            <h5 className="mt-3">Không tìm thấy sản phẩm phù hợp.</h5>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div key={p.id} className="col-sm-6 col-md-4 col-lg-3">
              <Link href={`/products/${p.id}`} className="text-decoration-none">
                <div className="card card-product product-card-hover h-100 shadow-sm border-0 position-relative">
                  {p.isRentable && (
                    <span className="position-absolute top-0 end-0 badge bg-primary text-white m-2 p-2 rounded-pill shadow-sm" style={{ zIndex: 5, fontSize: '0.7rem' }}><i className="bi bi-clock-history me-1"></i>Có Cho Thuê</span>
                  )}
                  
                  {/* Ảnh sản phẩm (Cập nhật: Hiện ảnh nếu có, ngược lại hiện ID) */}
                  <div className="bg-light text-center rounded-top d-flex align-items-center justify-content-center border-bottom overflow-hidden" style={{ height: "220px" }}>
                    {(p.imageUrl || p.images?.[0]?.url) ? (
                      <img src={p.imageUrl || p.images?.[0]?.url} alt={p.name} className="w-100 h-100 product-image-zoom" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="text-center">
                        <i className={`bi ${p.category === 'SERVER' ? 'bi-hdd-network-fill' : p.category === 'PRINTER' ? 'bi-printer-fill' : p.category === 'LAPTOP' ? 'bi-laptop' : p.category === 'POS' ? 'bi-phone' : 'bi-router-fill'} d-block mb-2`} style={{ fontSize: "4rem", color: "#adb5bd" }}></i>
                        <span className="badge bg-secondary opacity-50">MÃ SP: #{p.id}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold" style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>{p.name}</h5>
                    <p className="card-text text-danger fw-bold fs-5 mb-1">{p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}</p>
                    {p.isRentable && p.rentalPricePerDay && (
                      <p className="text-muted small mb-2"><i className="bi bi-clock-history"></i> Thuê: {p.rentalPricePerDay.toLocaleString('vi-VN')} đ/ngày</p>
                    )}
                    <div className="mt-auto">
                      <span className="btn btn-sm btn-outline-primary w-100">Xem chi tiết</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
