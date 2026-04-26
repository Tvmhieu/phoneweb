import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import ImageGallery from "@/components/ImageGallery";

interface ProductImage {
  id: number;
  url: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number | null;
  stock: number;
  imageUrl: string | null;
  description: string | null;
  warrantyMonths: number;
  images: ProductImage[];
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: Product | null = null;
  try {
    product = (await prisma.product.findFirst({
      where: { 
        id: parseInt(id),
        isVisible: true,
        isDeleted: false
      },
      include: { images: true }
    })) as any; // Cast as any then back to Product to handle Prisma's complex types simply for the UI layer
  } catch (error) {
    console.warn("Lá»—i táº£i sáº£n pháº©m:", error);
  }

  if (!product) return notFound();

  // Láº¥y danh sÃ¡ch link áº£nh tá»« báº£ng ProductImage
  const allImages = product.images?.map((img) => img.url) || [];

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mt-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/"><i className="bi bi-house-door"></i> Trang chá»§</Link></li>
          <li className="breadcrumb-item"><Link href="/products">Sáº£n pháº©m</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Cá»˜T TRÃI: áº¢NH Sáº¢N PHáº¨M */}
        <div className="col-md-5 mb-4">
          <ImageGallery 
            mainImage={product.imageUrl} 
            allImages={allImages} 
            productName={product.name} 
            productId={product.id} 
          />
        </div>
        
        {/* Cá»˜T PHáº¢I: THÃ”NG TIN CHI TIáº¾T */}
        <div className="col-md-7">
          <span className="badge bg-primary mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>{product.category}</span>
          <h2 className="fw-bold mb-2 text-dark" style={{ lineHeight: 1.3 }}>{product.name}</h2>
          
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span className="text-secondary"><i className="bi bi-building me-1 text-primary"></i>ThÆ°Æ¡ng hiá»‡u: <b className="text-dark">{product.brand}</b></span>
            <span className="text-secondary"><i className="bi bi-shield-check me-1 text-success"></i>Báº£o hÃ nh: <b className="text-success">{product.warrantyMonths} ThÃ¡ng</b></span>
            <span className="text-secondary"><i className="bi bi-box-seam me-1 text-info"></i>Kho: <b className="text-dark">{product.stock} mÃ¡y</b></span>
          </div>

          <hr className="my-4 opacity-50" />
          
          {/* GIÃ BÃN */}
          <div className="mb-4 p-4 bg-white border rounded shadow-sm">
            <div className="row align-items-center">
              <div className="col-sm-12">
                <div className="text-muted small mb-1 fw-bold text-uppercase">GiÃ¡ bÃ¡n niÃªm yáº¿t</div>
                <h3 className="text-danger fw-bold mb-0 product-price" style={{ fontSize: "2.2rem" }}>{product.price?.toLocaleString("vi-VN")} VNÄ</h3>
                <style>{`
                  @media (max-width: 768px) { 
                    .product-price { font-size: 1.8rem !important; }
                    h2 { font-size: 1.5rem !important; }
                  }
                `}</style>
              </div>
              
            </div>
          </div>

          {/* NÃšT MUA / GIá»Ž HÃ€NG */}
          <AddToCart product={product} />
          
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle me-1"></i> GiÃ¡ trÃªn Ä‘Ã£ bao gá»“m VAT vÃ  há»— trá»£ ká»¹ thuáº­t onsite.
          </div>
        </div>
      </div>

      {/* ====== MÃ” Táº¢ Sáº¢N PHáº¨M & GIá»šI THIá»†U CHá»¨C NÄ‚NG ====== */}
      <div className="mt-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white border-bottom fw-bold py-3 fs-5">
            <i className="bi bi-file-text me-2 text-primary"></i> MÃ´ táº£ sáº£n pháº©m & Giá»›i thiá»‡u chá»©c nÄƒng
          </div>
          <div className="card-body p-4" style={{ textAlign: "justify", lineHeight: 2, whiteSpace: "pre-line", color: "#495057", fontSize: '1.1rem' }}>
            {product.description ? product.description : "Äang cáº­p nháº­t ná»™i dung mÃ´ táº£ chi tiáº¿t cho thiáº¿t bá»‹ nÃ y..."}
          </div>
        </div>
      </div>

      {/* ====== CAM Káº¾T Dá»ŠCH Vá»¤ ====== */}
      <div className="mt-5 mb-5">
        <div className="card shadow-sm border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4 border-bottom pb-2 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                <i className="bi bi-patch-check-fill text-primary me-2"></i>Cam Káº¿t Dá»‹ch Vá»¥ ABC XYZ
            </h5>
            <div className="row g-4 text-start">
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>HÃ ng chÃ­nh hÃ£ng</div>
                  <small className="text-muted">Äáº§y Ä‘á»§ CO/CQ, VAT xuáº¥t hÃ³a Ä‘Æ¡n Ä‘á» theo dá»± Ã¡n.</small>
              </div>
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Há»— trá»£ 24/7</div>
                  <small className="text-muted">Ká»¹ thuáº­t xá»­ lÃ½ onsite toÃ n quá»‘c trong 4-8h.</small>
              </div>
              <div className="col-md-3">
                  <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>Äá»•i tráº£ linh hoáº¡t</div>
                  <small className="text-muted">Thay tháº¿ mÃ¡y ngay láº­p tá»©c náº¿u gáº·p lá»—i ká»¹ thuáº­t.</small>
              </div>
               <div className="col-md-3">
                   <div className="fw-bold mb-1"><i className="bi bi-check-circle-fill text-success me-2"></i>GiÃ¡ tá»‘t nháº¥t</div>
                   <small className="text-muted">Æ¯u Ä‘Ã£i tá»‘i Æ°u cho doanh nghiá»‡p vÃ  Ä‘á»‘i tÃ¡c lÃ¢u nÄƒm.</small>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
