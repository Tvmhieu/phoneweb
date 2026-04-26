"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ mainImage, allImages, productName, productId }: { mainImage: string | null, allImages: string[], productName: string, productId: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Gộp ảnh đại diện và bộ sưu tập
  const gallery = allImages.length > 0 ? allImages : (mainImage ? [mainImage] : []);

  const nextImg = () => { setActiveIndex((prev) => (prev + 1) % gallery.length); setZoom(1); };
  const prevImg = () => { setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length); setZoom(1); };

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
      <div className="bg-light border rounded text-center shadow-sm position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center main-img-container" style={{ height: "450px", width: "100%" }}>
        <style>{`
          @media (max-width: 768px) { .main-img-container { height: 350px !important; } }
        `}</style>
          
          <Image 
            src={gallery[activeIndex]} 
            alt={productName} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="cursor-zoom-in p-4" 
            style={{ objectFit: "contain", mixBlendMode: "multiply" }} 
            onClick={() => { setShowLightbox(true); setZoom(1); }}
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
           <button className="position-absolute bottom-0 end-0 btn btn-light btn-sm m-3 shadow-sm border fw-bold" onClick={() => { setShowLightbox(true); setZoom(1); }}>
             <i className="bi bi-zoom-in"></i> Phóng to ảnh
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
              <Image src={url} alt={`${productName} thumbnail ${idx}`} width={70} height={70} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX (FULLSCREEN ZOOM) */}
      {showLightbox && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-90 d-flex align-items-center justify-content-center" style={{ zIndex: 9999 }}>
            <button className="position-absolute top-0 end-0 btn btn-link text-white fs-1 m-4 text-decoration-none" style={{ zIndex: 10001 }} onClick={() => setShowLightbox(false)}>&times;</button>
            
            <button className="btn btn-link text-white fs-1 position-absolute start-0 m-4 d-none d-md-block" style={{ zIndex: 10001 }} onClick={prevImg}>
                <i className="bi bi-chevron-left"></i>
            </button>

            <div 
              className="w-100 h-100 overflow-auto d-flex align-items-center justify-content-center" 
              style={{ padding: "50px" }}
              onWheel={(e) => {
                  if (e.deltaY < 0) setZoom(z => Math.min(z + 0.3, 4));
                  else setZoom(z => Math.max(z - 0.3, 1));
              }}
            >
              <img 
                  src={gallery[activeIndex]} 
                  style={{ 
                      width: zoom === 1 ? 'auto' : `${zoom * 90}vw`,
                      height: zoom === 1 ? 'auto' : 'auto',
                      maxHeight: zoom === 1 ? "90vh" : "none", 
                      maxWidth: zoom === 1 ? "90vw" : "none",
                      cursor: zoom > 1 ? 'zoom-out' : 'zoom-in',
                      transition: "width 0.15s ease-out"
                  }} 
                  title="Cuộn chuột để thu/phóng"
                  onClick={() => setZoom(z => z === 1 ? 2.5 : 1)}
              />
            </div>

            <button className="btn btn-link text-white fs-1 position-absolute end-0 m-4 d-none d-md-block" style={{ zIndex: 10001 }} onClick={nextImg}>
                <i className="bi bi-chevron-right"></i>
            </button>
            
            <div className="position-absolute bottom-0 text-white mb-4 fw-bold text-center w-100" style={{ zIndex: 10000, pointerEvents: 'none' }}>
                <div className="small opacity-75 fw-normal mb-1">Cuộn chuột (scroll) để thu phóng ảnh • Click để khôi phục mặc định</div>
                {activeIndex + 1} / {gallery.length} — {productName}
            </div>
        </div>
      )}

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
