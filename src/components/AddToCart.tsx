"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartProps = {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  }
};

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (quantity > (product.stock || 0)) {
      alert(`Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${product.stock || 0})!`);
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      type: "BUY",
      image: product.imageUrl
    });
  };

  return (
    <div className="card shadow-sm border-0 mb-4 bg-light">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3"><i className="bi bi-bag-check me-2"></i>Tùy chọn Mua sắm</h5>
        
        {/* Số lượng */}
        <div className="mb-3">
          <label className="form-label small text-muted fw-bold">Số lượng:</label>
          <div className="input-group" style={{ maxWidth: "160px" }}>
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <input type="number" className="form-control text-center fw-bold" value={quantity} min={1} max={product.stock} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} />
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
          </div>
          {quantity >= product.stock && <div className="text-danger x-small mt-1 fw-bold"><i className="bi bi-exclamation-triangle"></i> Đã đạt giới hạn linh kiện trong kho</div>}
        </div>

        <div className="mb-3 p-2 bg-white border rounded text-end">
          <span className="text-muted small">Thành tiền: </span>
          <span className="text-danger fw-bold fs-5">{(product.price * quantity).toLocaleString("vi-VN")} đ</span>
        </div>

        <button 
          onClick={handleAdd} 
          disabled={product.stock <= 0}
          className="btn w-100 fw-bold py-2 fs-5 text-white" 
          style={{ backgroundColor: product.stock <= 0 ? "#dee2e6" : "#0D6EFD" }}
        >
          <i className={`bi ${product.stock <= 0 ? "bi-x-circle" : "bi-cart-plus-fill"} me-2`}></i> 
          {product.stock <= 0 ? "HẾT HÀNG TẠM THỜI" : "THÊM VÀO GIỎ HÀNG"}
        </button>
      </div>
    </div>
  );
}
