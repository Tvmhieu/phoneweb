"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartProps = {
  product: {
    id: number;
    name: string;
    price: number;
    isRentable: boolean;
    rentalPricePerDay: number | null;
    imageUrl: string;
    stock: number;
  }
};

// Hàm tính số ngày giữa 2 mốc
function calcDays(start: string, end: string): number {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
}

// Hàm cộng ngày
function addDays(date: string, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

// Format ngày kiểu Việt Nam
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [rentMode, setRentMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Date Picker states
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [endDate, setEndDate] = useState(addDays(today, 1));

  // Cập nhật Ngày trả khi Số ngày thuê thay đổi
  const handleDaysChange = (val: number) => {
    const newDays = Math.max(1, val);
    setNumberOfDays(newDays);
    setEndDate(addDays(startDate, newDays));
  };

  // Cập nhật Số ngày thuê khi Ngày trả thay đổi
  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    const days = calcDays(startDate, val);
    setNumberOfDays(days);
  };

  // Cập nhật Ngày trả khi Ngày bắt đầu thay đổi (giữ nguyên số ngày thuê)
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setEndDate(addDays(val, numberOfDays));
  };

  const rentalTotal = (product.rentalPricePerDay || 0) * numberOfDays * quantity;
  // Tiền cọc = 50% GIÁ TRỊ MÁY (theo yêu cầu khách hàng)
  const deposit = Math.round((product.price * quantity) * 0.5); 

  const handleAdd = () => {
    if (quantity > (product.stock || 0)) {
      alert(`Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${product.stock || 0})!`);
      return;
    }
    if (rentMode) {
// ...
      if (!endDate || numberOfDays < 1) {
        alert("Vui lòng chọn thời gian thuê hợp lệ!");
        return;
      }
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.rentalPricePerDay || product.price,
        quantity,
        type: "RENT",
        rentalDays: numberOfDays,
        image: product.imageUrl
      });
    } else {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        type: "BUY",
        image: product.imageUrl
      });
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4 bg-light">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3"><i className="bi bi-bag-check me-2"></i>Tùy chọn Mua sắm</h5>
        
        {/* Lựa chọn hình thức */}
        {product.isRentable && (
          <div className="d-flex gap-2 mb-4">
            <button onClick={() => setRentMode(false)} className={`btn flex-fill py-2 fw-bold ${!rentMode ? "btn-primary" : "btn-outline-primary"}`}>
              <i className="bi bi-cart-check me-1"></i> Mua Đứt
            </button>
            <button onClick={() => setRentMode(true)} className={`btn flex-fill py-2 fw-bold ${rentMode ? "btn-warning text-dark" : "btn-outline-warning text-dark"}`}>
              <i className="bi bi-calendar-event me-1"></i> Thuê Máy (Event/Dự án)
            </button>
          </div>
        )}

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

        {/* ===== DATE PICKER CHO THUÊ ĐÃ CẬP NHẬT ===== */}
        {rentMode && (
          <div className="mb-4 p-3 bg-white border border-warning rounded-3">
            <h6 className="fw-bold text-dark mb-3"><i className="bi bi-calendar-range me-2 text-warning"></i>Cấu hình thuê máy</h6>

            <div className="mb-3">
              <label className="form-label small text-muted fw-bold">Số ngày thuê dự kiến:</label>
              <div className="input-group" style={{ maxWidth: "150px" }}>
                <button className="btn btn-outline-secondary" onClick={() => handleDaysChange(numberOfDays - 1)}>−</button>
                <input type="number" className="form-control text-center fw-bold" value={numberOfDays} onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)} min={1} />
                <button className="btn btn-outline-secondary" onClick={() => handleDaysChange(numberOfDays + 1)}>+</button>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small text-muted fw-bold">Ngày nhận máy</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={startDate}
                  min={today}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>
              
              <div className="col-6">
                <label className="form-label small text-muted fw-bold">Ngày trả máy</label>
                <input 
                  type="date" 
                  className="form-control border-primary"
                  value={endDate}
                  min={addDays(startDate, 1)}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-light border rounded p-3">
                <table className="table table-sm table-borderless mb-0 small">
                  <tbody>
                    <tr>
                      <td className="text-muted">Thời gian:</td>
                      <td className="text-end fw-bold">{numberOfDays} ngày</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Đơn giá thuê:</td>
                      <td className="text-end">{product.rentalPricePerDay?.toLocaleString("vi-VN")} đ/ngày</td>
                    </tr>
                    <tr className="border-top">
                      <td className="text-muted fw-bold">Tổng cước thuê:</td>
                      <td className="text-end text-danger fw-bold fs-6">{rentalTotal.toLocaleString("vi-VN")} đ</td>
                    </tr>
                    <tr>
                      <td className="text-primary fw-bold"><i className="bi bi-shield-lock me-1"></i>Tiền cọc (50% giá trị máy):</td>
                      <td className="text-end text-primary fw-bold fs-6">{deposit.toLocaleString("vi-VN")} đ</td>
                    </tr>
                  </tbody>
                </table>
                <div className="alert alert-info py-2 px-3 small mt-2 mb-0 border-0" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Tiền cọc tính trên 50% giá gốc niêm yết ({product.price.toLocaleString("vi-VN")} đ).
                </div>
            </div>
          </div>
        )}

        {!rentMode && (
          <div className="mb-3 p-2 bg-white border rounded text-end">
            <span className="text-muted small">Thành tiền: </span>
            <span className="text-danger fw-bold fs-5">{(product.price * quantity).toLocaleString("vi-VN")} đ</span>
          </div>
        )}

        <button 
          onClick={handleAdd} 
          disabled={product.stock <= 0}
          className="btn w-100 fw-bold py-2 fs-5" 
          style={{ backgroundColor: product.stock <= 0 ? "#dee2e6" : (rentMode ? "#ffc107" : "#0D6EFD"), color: product.stock <= 0 ? "#adb5bd" : (rentMode ? "#000" : "#fff") }}
        >
          <i className={`bi ${product.stock <= 0 ? "bi-x-circle" : (rentMode ? "bi-calendar-check" : "bi-cart-plus-fill")} me-2`}></i> 
          {product.stock <= 0 ? "HẾT HÀNG TẠM THỜI" : (rentMode ? `THUÊ MÁY (Cọc: ${deposit.toLocaleString("vi-VN")} đ)` : "THÊM VÀO GIỎ HÀNG")}
        </button>
      </div>
    </div>
  );
}
