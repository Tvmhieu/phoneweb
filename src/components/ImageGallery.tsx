"use client";
import { useState } from "react";

export default function ImageGallery({ mainImage, allImages, productName, productId }: { mainImage: string | null, allImages: string[], productName: string, productId: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Gộp ảnh đại diện và bộ sưu tập
  const gallery = allImages.length > 0 ? allImages : (mainImage ? [mainImage] : []);

  const nextImg = () => setActiveIndex((prev) => (prev + 1) % gallery.length);
  const prevImg = () => setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  if (gallery.length === 0) {
    return (
        <div className="bg-light border rounded p-5 text-center shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "450px" }}>
            <i className="bi bi-image text-muted" style={{ fontSize: "5rem" }}></i>
            <h4 className="fw-bold text-muted mt-3">MÃ SỐ: #{productId}</h4>
            <span className="badge bg-secondary opacity-50">Sản phẩm chưa có ảnh</span>
        </div>
    );
  }

  return (
    <div className="position-relative">
      {/* KHUNG ẢNH CHÍNH */}
      <div className="bg-white border rounded p-2 text-center shadow-sm position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center bg-checkered" style={{ minHeight: "450px" }}>
          
          <img 
            src={gallery[activeIndex]} 
            alt={productName} 
            className="img-fluid rounded cursor-zoom-in" 
            style={{ maxHeight: "400px", objectFit: "contain", cursor: "zoom-in" }} 
            onClick={() => setShowLightbox(true)}
          />

          {/* NÚT ĐIỀU HƯỚNG < > */}
          {gallery.length > 1 && (
            <>
              <button 
                className="position-absolute start-0 top-50 translate-middle-y btn btn-dark btn-sm rounded-circle m-2 opacity-50 hover-opacity-100" 
                onClick={(e) => { e.preventDefault(); prevImg(); }}
                style={{ width: "40px", height: "40px", zIndex: 10 }}
              >
                <i className="bi bi-chevron-left fs-5"></i>
              </button>
              <button 
                className="position-absolute end-0 top-50 translate-middle-y btn btn-dark btn-sm rounded-circle m-2 opacity-50 hover-opacity-100" 
                onClick={(e) => { e.preventDefault(); nextImg(); }}
                style={{ width: "40px", height: "40px", zIndex: 10 }}
              >
                <i className="bi bi-chevron-right fs-5"></i>
              </button>
            </>
          )}

          {/* PHÓNG TO ICON */}
          <button className="position-absolute bottom-0 end-0 btn btn-light btn-sm m-3 shadow-sm border" onClick={() => setShowLightbox(true)}>
             <i className="bi bi-zoom-in"></i> Phóng to
          </button>
      </div>

      {/* DANH SÁCH ẢNH NHỎ (THUMBNAILS) */}
      {gallery.length > 1 && (
        <div className="d-flex gap-2 mt-3 overflow-auto pb-2 scrollbar-none">
          {gallery.map((url, idx) => (
            <div 
              key={idx} 
              className={`border rounded cursor-pointer overflow-hidden ${activeIndex === idx ? 'border-primary border-2 shadow-sm' : 'opacity-75'}`} 
              style={{ width: "70px", height: "70px", flexShrink: 0, transition: "all 0.2s" }}
              onClick={() => setActiveIndex(idx)}
            >
              <img src={url} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX (FULLSCREEN ZOOM) */}
      {showLightbox && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-90 d-flex align-items-center justify-content-center" style={{ zIndex: 9999 }}>
            <button className="position-absolute top-0 end-0 btn btn-link text-white fs-1 m-4 text-decoration-none" onClick={() => setShowLightbox(false)}>&times;</button>
            
            <button className="btn btn-link text-white fs-1 position-absolute start-0 m-4 d-none d-md-block" onClick={prevImg}>
                <i className="bi bi-chevron-left"></i>
            </button>

            <img src={gallery[activeIndex]} className="img-fluid" style={{ maxHeight: "90vh", maxWidth: "90vw" }} />

            <button className="btn btn-link text-white fs-1 position-absolute end-0 m-4 d-none d-md-block" onClick={nextImg}>
                <i className="bi bi-chevron-right"></i>
            </button>
            
            <div className="position-absolute bottom-0 text-white mb-4 fw-bold">
                {activeIndex + 1} / {gallery.length} — {productName}
            </div>
        </div>
      )}

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hover-opacity-100:hover { opacity: 1 !important; }
        .bg-checkered {
          background-image: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
