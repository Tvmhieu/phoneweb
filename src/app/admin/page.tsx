"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// --- Kiểu dữ liệu ---
type RevenuePoint = { name: string; doanhThuBan: number; doanhThuThue: number };
type SaleItem = {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    brand?: string;
    category?: string;
    warrantyMonths?: number;
  };
};
type Stats = {
  revenue: number;
  salesRevenue: number;
  rentalRevenue: number;
  activeRentals: number;
  pendingErrors: number;
  pendingOrders: number;
  pendingSales: number;
  pendingRentals: number;
  totalProducts: number;
  totalCustomers: number;
  chartData: RevenuePoint[];
} | null;
type Product = { id: number; name: string; brand: string; category: string; price: number; stock: number; isRentable: boolean; rentalPricePerDay: number; warrantyMonths: number; description?: string; imageUrl?: string; images?: {url: string}[], allImages?: string[], isVisible?: boolean };
type Warranty = { 
  id: number; 
  productId: number; 
  userId: number; 
  status: string; 
  issueDetail: string; 
  resolution?: string; 
  techNote?: string; 
  createdAt: string; 
  product: { name: string }; 
  user?: { id: number; name: string; email: string; phone?: string } 
};
type ContactMsg = { id: number; name: string; email: string; phone: string; message: string; isRead: boolean; createdAt: string };
type RentalItem = {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
  };
};
type Rental = { 
  id: number; 
  userId: number; 
  totalRental: number; 
  deposit: number; 
  status: string; 
  startDate: string; 
  endDate: string; 
  isDepositRefunded?: boolean; 
  depositRefundDate?: string; 
  user?: { id: number; name: string; email: string; companyName?: string; phone?: string }; 
  items: RentalItem[]; 
  adminNotes?: string;
  updatedAt: string;
};
type Sale = { id: number; userId: number; total: number; status: string; createdAt: string; user?: { id: number; name?: string | null; email: string; companyName?: string | null; phone?: string | null }; items: SaleItem[]; adminNotes?: string };
type UserAccount = { id: number; name: string; email: string; role: string; companyName?: string; phone?: string; address?: string; createdAt: string };

// --- Thành phần hỗ trợ ---
const SortHeader = ({ label, sortKey, currentSort, onSort, className = "" }: { label: string, sortKey: string, currentSort: { key: string, dir: 'asc'|'desc' }, onSort: (key: string) => void, className?: string }) => {
  const isActive = currentSort.key === sortKey;
  return (
    <th className={`${className} py-3 px-3`}>
      <button 
        className={`btn btn-link p-0 text-decoration-none fw-bold d-flex align-items-center w-100 ${isActive ? 'text-primary' : 'text-dark'}`}
        onClick={() => onSort(sortKey)}
        style={{ fontSize: 'inherit' }}
      >
        <span>{label}</span>
        <span className="ms-auto d-flex flex-column" style={{ lineHeight: 0.5 }}>
          <i className={`bi bi-caret-up-fill ${isActive && currentSort.dir === 'asc' ? 'text-primary' : 'text-muted opacity-25'}`} style={{ fontSize: '10px' }}></i>
          <i className={`bi bi-caret-down-fill ${isActive && currentSort.dir === 'desc' ? 'text-primary' : 'text-muted opacity-25'}`} style={{ fontSize: '10px' }}></i>
        </span>
      </button>
    </th>
  );
};

export default function AdminDashboard() {
  const { userRole, userInfo, logout } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  
  // States data
  const [stats, setStats] = useState<Stats>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // States form & ui
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<UserAccount & { password?: string }> | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [returningRental, setReturningRental] = useState<any | null>(null);

  // Search & Sort states
  const [saleSearch, setSaleSearch] = useState("");
  const [rentalSearch, setRentalSearch] = useState("");
  const [saleSort, setSaleSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'desc' });
  const [rentalSort, setRentalSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'desc' });

  const [productSearch, setProductSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSort, setProductSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'desc' });
  const [staffSort, setStaffSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'asc' });
  const [customerSort, setCustomerSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'asc' });
  const [warrantySort, setWarrantySort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'desc' });
  const [contactSort, setContactSort] = useState<{ key: string, dir: 'asc'|'desc' }>({ key: 'id', dir: 'desc' });

  useEffect(() => {
      setHydrated(true);
  }, []);

    useEffect(() => {
      if (userRole) {
        loadProducts();
      }
    }, [userRole]);

  // Sync data theo tab
  useEffect(() => {
     if (!userRole) return;
     if (activeTab === "OVERVIEW") loadStats();
     if (activeTab === "PRODUCTS") loadProducts();
     if (activeTab === "WARRANTIES") loadWarranties();
     if (activeTab === "CONTACTS") loadContacts();
     if (activeTab === "RENTALS") loadRentals();
     if (activeTab === "SALES") loadSales();
     if (activeTab === "USERS") loadUsers();
      if (activeTab === "CUSTOMERS") loadUsers();
  }, [activeTab, userRole]);

  // =============== CÁC HÀM FETCH DỮ LIỆU ===============
  const loadStats = async () => {
    try { const res = await fetch("/api/admin/dashboard").then(r => r.json()); if (res.success) setStats(res.stats); else console.error(res.message); } catch (e) { }
  };
  
  const loadProducts = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/products").then(r => r.json()); if (res.success) setProducts(res.products); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const loadWarranties = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/warranties").then(r => r.json()); if (res.success) setWarranties(res.claims); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const loadContacts = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/contacts").then(r => r.json()); if (res.success) setContacts(res.contacts); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const loadRentals = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/rentals").then(r => r.json()); if (res.success) setRentals(res.rentals); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const loadSales = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/sales").then(r => r.json()); if (res.success) setSales(res.sales); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try { setLoading(true); const res = await fetch("/api/admin/users").then(r => r.json()); if (res.success) setUsers(res.users); else alert(res.message); } catch(e){} finally { setLoading(false); }
  };

  const getFilteredSales = (list: Sale[]) => {
    let filtered = list.filter(item => 
      item.id.toString().includes(saleSearch) || 
      (item.user?.name || "").toLowerCase().includes(saleSearch.toLowerCase()) ||
      (item.user?.email || "").toLowerCase().includes(saleSearch.toLowerCase())
    );
    return [...filtered].sort((a: any, b: any) => {
      let valA = a[saleSort.key];
      let valB = b[saleSort.key];
      if (saleSort.key === 'user') {
        valA = a.user?.name || "";
        valB = b.user?.name || "";
      }
      if (valA < valB) return saleSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return saleSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getFilteredRentals = (list: Rental[]) => {
    let filtered = list.filter(item => 
      item.id.toString().includes(rentalSearch) || 
      (item.user?.name || "").toLowerCase().includes(rentalSearch.toLowerCase()) ||
      (item.user?.email || "").toLowerCase().includes(rentalSearch.toLowerCase())
    );
    return [...filtered].sort((a: any, b: any) => {
      let valA = a[rentalSort.key];
      let valB = b[rentalSort.key];
      if (rentalSort.key === 'user') {
        valA = a.user?.name || "";
        valB = b.user?.name || "";
      }
      if (rentalSort.key === 'issues') {
        valA = warranties.filter(w => w.userId === a.userId && w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
        valB = warranties.filter(w => w.userId === b.userId && w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
      }
      if (rentalSort.key === 'isDepositRefunded') {
        valA = a.isDepositRefunded ? 1 : 0;
        valB = b.isDepositRefunded ? 1 : 0;
      }
      if (valA < valB) return rentalSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return rentalSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSortSale = (key: string) => {
    setSaleSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const handleSortRental = (key: string) => {
    setRentalSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const getFilteredProducts = (list: Product[]) => {
    let filtered = list.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
    return [...filtered].sort((a: any, b: any) => {
      let valA = a[productSort.key];
      let valB = b[productSort.key];
      if (valA < valB) return productSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return productSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getFilteredStaff = (list: UserAccount[]) => {
    let filtered = list.filter(u => 
      u.name?.toLowerCase().includes(staffSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(staffSearch.toLowerCase())
    );
    return [...filtered].sort((a: any, b: any) => {
      let valA = a[staffSort.key];
      let valB = b[staffSort.key];
      if (valA < valB) return staffSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return staffSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getFilteredCustomers = (list: UserAccount[]) => {
    let filtered = list.filter(u => 
      u.name?.toLowerCase().includes(customerSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      u.companyName?.toLowerCase().includes(customerSearch.toLowerCase())
    );
    return [...filtered].sort((a: any, b: any) => {
      let valA = a[customerSort.key];
      let valB = b[customerSort.key];
      if (valA < valB) return customerSort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return customerSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSortProduct = (key: string) => setProductSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  const handleSortStaff = (key: string) => setStaffSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  const handleSortCustomer = (key: string) => setCustomerSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  const handleSortWarranty = (key: string) => setWarrantySort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  const handleSortContact = (key: string) => setContactSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));

  const getFilteredWarranties = (list: Warranty[]) => {
      return [...list].sort((a: any, b: any) => {
          let valA = a[warrantySort.key];
          let valB = b[warrantySort.key];
          if (warrantySort.key === 'product') valA = a.product?.name || "";
          if (warrantySort.key === 'user') valA = a.user?.name || a.user?.email || "";
          
          if (valA < valB) return warrantySort.dir === 'asc' ? -1 : 1;
          if (valA > valB) return warrantySort.dir === 'asc' ? 1 : -1;
          return 0;
      });
  };

  const getFilteredContacts = (list: ContactMsg[]) => {
      return [...list].sort((a: any, b: any) => {
          let valA = a[contactSort.key];
          let valB = b[contactSort.key];
          if (valA < valB) return contactSort.dir === 'asc' ? -1 : 1;
          if (valA > valB) return contactSort.dir === 'asc' ? 1 : -1;
          return 0;
      });
  };

  // =============== CÁC HÀM XỬ LÝ ACTION ===============
  const [uploading, setUploading] = useState(false);

  const formatCustomer = (order: any) => {
    if (!order.user || order.user.isDeleted) {
      return { 
        name: order.user?.name ? `${order.user.name} (Đã xóa)` : "Người dùng đã xóa", 
        contact: order.user?.email || "Không có thông tin" 
      };
    }
    const name = order.user?.companyName || order.user?.name || "Khách hàng";
    const contact = [order.user?.email, order.user?.phone].filter(Boolean).join(" • ");
    return { name, contact: contact || "Chưa có thông tin liên hệ" };
  };

  const formatSaleItems = (sale: Sale) => {
    return sale.items || [];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setEditingProduct({ ...editingProduct, imageUrl: data.url });
      } else alert(data.message);
    } catch(e) {
      alert("Lỗi upload!");
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch("/api/admin/products", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingProduct)
          });
          const data = await res.json();
          if (data.success) {
              alert("Lưu sản phẩm thành công!");
              setEditingProduct(null);
              loadProducts();
          } else alert(data.message);
      } catch(e) { alert("Lỗi kết nối"); }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa sản phẩm!");
        loadProducts();
        loadStats();
      } else alert(data.message);
    } catch(e) {}
  };

  const toggleProductVisibility = async (id: number, currentVisibility: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !currentVisibility })
      });
      if (res.ok) loadProducts();
    } catch(e) {}
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingUser?.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/users", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingUser)
      });
      const data = await res.json();
      if (data.success) {
        alert("Lưu tài khoản thành công!");
        setEditingUser(null);
        loadUsers();
        loadStats();
      } else alert(data.message);
    } catch(e) {}
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa!");
        loadUsers();
        loadStats();
      } else alert(data.message);
    } catch(e) {}
  };

  const deleteSaleOrder = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hóa đơn bán hàng này?")) return;
    try {
      const res = await fetch(`/api/admin/sales?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa hóa đơn!");
        loadSales();
        loadStats();
      } else alert(data.message);
    } catch(e) {}
  };

  const deleteRentalOrder = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch sử thuê này?")) return;
    try {
      const res = await fetch(`/api/admin/rentals?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa!");
        loadRentals();
        loadStats();
      } else alert(data.message);
    } catch(e) {}
  };

  const updateWarrantyStatus = async (id: number, status: string) => {
      try {
          await fetch("/api/admin/warranties", {
              method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify({id, status})
          });
          loadWarranties();
          loadStats();
      } catch(e) {}
  };

  const deleteWarranty = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn XÓA VĨNH VIỄN sự cố này khỏi hệ thống?")) return;
    try {
      const res = await fetch(`/api/admin/warranties?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa vĩnh viễn!");
        loadWarranties();
      } else alert(data.message);
    } catch(e) {}
  };

  const updateRentalStatus = async (id: number, status: string, customMsg?: string) => {
      const msgs: Record<string, string> = {
          PAID: "Xác nhận khách đã đặt cọc tiền và sẵn sàng bàn giao máy?",
          ACTIVE: "Xác nhận đã bàn giao máy thành công và bắt đầu tính thời gian thuê?",
          RETURNED: "Xác nhận đã thu hồi máy và kết thúc hợp đồng?"
      };
      if (!confirm(customMsg || msgs[status] || "Cập nhật trạng thái hợp đồng?")) return;
      
      try {
          const res = await fetch("/api/admin/rentals", {
              method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify({id, status})
          });
          if (res.ok) {
              loadRentals();
              loadStats();
          } else {
              const data = await res.json();
              alert("Lỗi: " + data.message);
          }
      } catch(e) {
          alert("Lỗi kết nối máy chủ");
      }
  };

  const updateSaleStatus = async (id: number, status: string) => {
    try {
        await fetch("/api/admin/sales", {
            method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify({id, status})
        });
        loadSales();
        loadStats();
    } catch(e) {}
  };

  const markContactRead = async (id: number) => {
      try {
          await fetch("/api/admin/contacts", {
              method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify({id, isRead: true})
          });
          loadContacts();
      } catch(e) {}
  };

  const saveAdminNote = async (id: number, type: 'sale' | 'rental', notes: string) => {
    try {
      const url = type === 'sale' ? "/api/admin/sales" : "/api/admin/rentals";
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNotes: notes })
      });
      const data = await res.json();
      if (data.success) {
        alert("Đã lưu ghi chú nội bộ!");
        if (type === 'sale') loadSales(); else loadRentals();
      } else alert(data.message);
    } catch (e) { alert("Lỗi lưu ghi chú"); }
  };

  if (!hydrated || !userRole) return <div className="p-5 text-center text-muted"><i className="bi bi-shield-lock d-block fs-1"></i>Đang kiểm tra quyền hạn mạng lưới...</div>;

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="row">
        
        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2 pe-0">
          <div className="sidebar-premium shadow-sm border-end border-light d-flex flex-column" style={{ height: "100vh", position: "fixed", width: "inherit", zIndex: 1050, background: "#ffffff" }}>
            {/* Header - Fixed */}
            <div className="sidebar-header py-4 px-4 text-center border-bottom border-light flex-shrink-0">
              <div className="d-inline-flex p-2 rounded-4 bg-primary bg-opacity-10 mb-2">
                <i className="bi bi-cpu-fill fs-2 text-primary"></i>
              </div>
              <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px' }}>ABC <span className="text-primary">XYZ</span></h5>
              <div className="mt-2">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1 rounded-pill x-small">
                  <i className="bi bi-shield-check me-1"></i> {userRole}
                </span>
              </div>
            </div>
            
            {/* Body - Scrollable */}
            <div className="sidebar-body py-3 custom-scrollbar flex-grow-1 overflow-y-auto overflow-x-hidden">
              <div className="px-4 mb-2 mt-2">
                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Điều hành</small>
              </div>
              <ul className="nav flex-column mb-3">
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "OVERVIEW" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("OVERVIEW")}>
                    <i className={`bi bi-grid-fill me-3 ${activeTab === "OVERVIEW" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Tổng quan số liệu</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "PRODUCTS" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("PRODUCTS")}>
                    <i className={`bi bi-box-seam-fill me-3 ${activeTab === "PRODUCTS" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Quản lý kho máy</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "SALES" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("SALES")}>
                    <i className={`bi bi-receipt-cutoff me-3 ${activeTab === "SALES" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Hóa đơn bán lẻ</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "RENTALS" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("RENTALS")}>
                    <i className={`bi bi-clock-history me-3 ${activeTab === "RENTALS" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Quản lý cho thuê</span>
                  </button>
                </li>
              </ul>

              {userRole === "ADMIN" && (
                <>
                  <div className="px-4 mb-2">
                    <small className="text-uppercase text-danger fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}><i className="bi bi-shield-lock-fill me-1"></i>Hệ thống & Cấu hình</small>
                  </div>
                  <ul className="nav flex-column mb-3">
                    <li className="nav-item">
                      <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "USERS" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("USERS")}>
                        <i className={`bi bi-people-fill me-3 ${activeTab === "USERS" ? "text-danger" : "text-muted"}`}></i>
                        <span className="small fw-bold text-dark">Quản lý Nhân viên</span>
                      </button>
                    </li>
                  </ul>
                </>
              )}

              <div className="px-4 mb-2">
                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Dịch vụ khách hàng</small>
              </div>
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "WARRANTIES" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("WARRANTIES")}>
                    <i className={`bi bi-shield-fill-check me-3 ${activeTab === "WARRANTIES" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Hỗ trợ & Bảo hành</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "CONTACTS" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("CONTACTS")}>
                    <i className={`bi bi-chat-dots-fill me-3 ${activeTab === "CONTACTS" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Yêu cầu liên hệ</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link w-100 text-start border-0 bg-transparent py-2 px-4 d-flex align-items-center transition-premium ${activeTab === "CUSTOMERS" ? "active-premium-light" : "text-secondary"}`} onClick={() => setActiveTab("CUSTOMERS")}>
                    <i className={`bi bi-person-lines-fill me-3 ${activeTab === "CUSTOMERS" ? "text-primary" : "text-muted"}`}></i>
                    <span className="small fw-bold">Danh sách đối tác</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="sidebar-footer p-3 border-top border-light flex-shrink-0 bg-white shadow-lg-top">
               <div className="p-2 rounded-3 bg-light d-flex align-items-center mb-2 border">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                    <i className="bi bi-person-fill text-primary" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-dark x-small fw-bold text-truncate">{userInfo?.name || "Member"}</div>
                    <div className="text-muted x-small text-truncate" style={{ fontSize: '9px' }}>{userInfo?.email}</div>
                  </div>
               </div>
               <div className="d-flex gap-2">
                 <Link href="/" className="btn btn-outline-primary border-2 flex-fill py-1 rounded-3 small fw-bold" style={{ fontSize: '0.8rem' }}>
                   <i className="bi bi-house-door-fill me-1"></i> Home
                 </Link>
                 <button onClick={logout} className="btn btn-danger flex-fill py-1 rounded-3 shadow-sm small fw-bold" style={{ fontSize: '0.8rem' }}>
                   <i className="bi bi-power me-1"></i> Thoát
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="col-md-9 col-lg-10 offset-md-3 offset-lg-2 pt-4 px-4 d-flex flex-column min-vh-100">
            <style>{`
                .pointer { cursor: pointer; }
                .pointer:hover { background-color: rgba(0,0,0,0.03) !important; text-decoration: underline; }
                .active-premium-light { background: #f0f7ff !important; color: #0d6efd !important; border-left: 4px solid #0d6efd !important; }
                .card-stats-premium { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .card-stats-premium:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            `}</style>
            <div className="flex-grow-1">
          
          {/* TAB 1: OVERVIEW & STATISTICS */}
          {activeTab === "OVERVIEW" && (
             <div className="animate__animated animate__fadeIn">
                 <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Bảng Điều Khiển Hệ Thống</h2>
                        <p className="text-muted mb-0">Xin chào {userInfo?.name}, đây là số liệu vận hành mạng lưới hôm nay.</p>
                    </div>
                    <button className="btn btn-white shadow-sm border py-2 px-4 rounded-3 fw-bold" onClick={loadStats}>
                        <i className="bi bi-arrow-clockwise me-2 text-primary"></i>Đồng bộ dữ liệu
                    </button>
                 </div>
                 
                 <div className="row g-4 mb-5">
                    <div className="col-md-4 col-xl-3">
                      <div className="card-stats-premium bg-white p-4 shadow-sm border-0 border-start border-primary border-5 rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                                <i className="bi bi-currency-exchange fs-3"></i>
                            </div>
                            <span className="badge text-bg-light border small text-muted">Tháng này</span>
                        </div>
                        <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>Tổng doanh thu dự án</h6>
                        <h3 className="fw-bold text-dark mb-1">{(stats?.revenue || 0).toLocaleString()} <small className="fs-6">đ</small></h3>
                        <div className="d-flex flex-column gap-1 mt-3">
                            <div className="small text-muted"><i className="bi bi-cart-check-fill text-info me-1"></i> Bán: <strong>{(stats?.salesRevenue || 0).toLocaleString()} đ</strong></div>
                            <div className="small text-muted"><i className="bi bi-calendar-check-fill text-warning me-1"></i> Thuê: <strong>{(stats?.rentalRevenue || 0).toLocaleString()} đ</strong></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4 col-xl-3">
                      <div className="card-stats-premium bg-white p-4 shadow-sm border-0 border-start border-warning border-5 rounded-4 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="p-3 rounded-4 bg-warning bg-opacity-10 text-warning">
                                <i className="bi bi-hdd-rack-fill fs-3"></i>
                            </div>
                        </div>
                        <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>Hợp đồng đang cho thuê</h6>
                        <h3 className="fw-bold text-dark mb-auto">{stats?.activeRentals || 0} <small className="fs-6">Đơn vị máy</small></h3>
                        <div className="mt-3 small text-muted"><i className="bi bi-info-circle me-1"></i> Đang vận hành tối ưu</div>
                      </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                      <div className="card-stats-premium bg-white p-4 shadow-sm border-0 border-start border-danger border-5 rounded-4 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="p-3 rounded-4 bg-danger bg-opacity-10 text-danger">
                                <i className="bi bi-shield-lock-fill fs-3"></i>
                            </div>
                        </div>
                        <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>Sự cố & Bảo hành chờ</h6>
                        <h3 className="fw-bold text-danger mb-auto">{stats?.pendingErrors || 0} <small className="fs-6">Ticket</small></h3>
                        <div className="mt-3 small text-muted"><i className="bi bi-exclamation-triangle-fill me-1"></i> Cần kỹ thuật xử lý ngay</div>
                      </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                      <div className="card-stats-premium bg-white p-4 shadow-sm border-0 border-start border-success border-5 rounded-4 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                                <i className="bi bi-people-fill fs-3"></i>
                            </div>
                        </div>
                        <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>Đối tác Doanh nghiệp</h6>
                        <h3 className="fw-bold text-dark mb-auto">{stats?.totalCustomers || 0} <small className="fs-6">Công ty</small></h3>
                        <div className="mt-3 small text-muted"><i className="bi bi-database-fill me-1"></i> Kho: <strong>{stats?.totalProducts || 0} SP</strong></div>
                      </div>
                    </div>
                 </div>

                 <div className="row g-4 mb-5">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                            <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-0">Biểu Đồ Tài Chính</h5>
                                    <small className="text-muted">Doanh thu bán vs Thuê (6 tháng gần nhất)</small>
                                </div>
                            </div>
                            <div className="card-body px-2 py-4">
                                <div style={{ width: "100%", height: 380 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={stats?.chartData || []} margin={{ top: 16, right: 30, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ea0a5', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ea0a5', fontSize: 12}} tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
                                            <Tooltip 
                                                cursor={{fill: '#f8f9fa'}} 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                                                formatter={(val) => [`${Number(val).toLocaleString()} đ`]}
                                            />
                                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
                                            <Bar dataKey="doanhThuBan" name="Doanh thu bán" fill="#0d6efd" radius={[6, 6, 0, 0]} barSize={24} />
                                            <Bar dataKey="doanhThuThue" name="Doanh thu thuê" fill="#20c997" radius={[6, 6, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
                             <div className="card-header bg-transparent border-0 py-4 px-4">
                                <h5 className="fw-bold mb-1 text-dark">Dòng Việc Quan Trọng</h5>
                                <p className="text-muted x-small mb-0">Hành động cần xử lý ngay trong ca trực</p>
                             </div>
                             <div className="card-body px-4 pt-1">
                                <div className="d-flex flex-column gap-3">
                                    <div className="p-3 rounded-4 border border-light shadow-sm d-flex align-items-center transition-premium pointer task-card-premium" onClick={() => setActiveTab("SALES")}>
                                        <div className="bg-primary text-white p-3 rounded-4 me-3 shadow-primary-sm"><i className="bi bi-cart-plus-fill fs-4"></i></div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold text-dark small">Đơn bán hàng mới</span>
                                                <span className="badge bg-primary rounded-pill small">{stats?.pendingSales || 0}</span>
                                            </div>
                                            <div className="text-muted x-small mt-1">Đang chờ kế toán xác nhận</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-4 border border-light shadow-sm d-flex align-items-center transition-premium pointer task-card-premium" onClick={() => setActiveTab("RENTALS")}>
                                        <div className="bg-success text-white p-3 rounded-4 me-3 shadow-success-sm"><i className="bi bi-calendar2-check-fill fs-4"></i></div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold text-dark small">Bàn giao hợp đồng</span>
                                                <span className="badge bg-success rounded-pill small">{stats?.pendingRentals || 0}</span>
                                            </div>
                                            <div className="text-muted x-small mt-1">Lên lịch kỹ thuật bàn giao máy</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-4 border border-light shadow-sm d-flex align-items-center transition-premium pointer task-card-premium" onClick={() => setActiveTab("WARRANTIES")}>
                                        <div className="bg-danger text-white p-3 rounded-4 me-3 shadow-danger-sm"><i className="bi bi-shield-exclamation fs-4"></i></div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold text-dark small">Khắc phục sự cố</span>
                                                <span className="badge bg-danger rounded-pill small">{stats?.pendingErrors || 0}</span>
                                            </div>
                                            <div className="text-muted x-small mt-1">Ticket ưu tiên cấp độ 1</div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "PRODUCTS" && (
              <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="fw-bold mb-0"><i className="bi bi-database-fill text-primary me-2"></i>Quản Lý Kho Hàng</h3>
                      <div className="d-flex gap-3">
                        <div className="input-group" style={{ width: "300px" }}>
                           <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                           <input type="text" className="form-control border-start-0" placeholder="Tìm tên, hiệu, loại..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-success fw-bold" onClick={() => setEditingProduct({isRentable: false})}><i className="bi bi-plus-lg me-2"></i>Thêm Mới Thiết Bị</button>
                      </div>
                  </div>
                  
                  {editingProduct && (
                     <div className="card border-0 shadow mb-4">
                         <div className="card-header bg-primary text-white fw-bold py-3"><i className="bi bi-pencil-square me-2"></i>{editingProduct.id ? `Sửa Thiết Bị #${editingProduct.id}` : "Nhập Thiết Bị Mới Vào Kho"}</div>
                         <div className="card-body p-4">
                             <form onSubmit={saveProduct}>
                                 <div className="row g-3">
                                     <div className="col-md-6">
                                         <label className="form-label small fw-bold">Tên thiết bị (Model)</label>
                                         <input type="text" className="form-control" value={editingProduct.name || ""} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required placeholder="Ví dụ: Dell PowerEdge R440"/>
                                     </div>
                                     <div className="col-md-6">
                                         <label className="form-label small fw-bold"><i className="bi bi-images me-1"></i>Bộ sưu tập ảnh (Tối đa 10 ảnh)</label>
                                         <div className="input-group mb-2">
                                             <input type="file" id="multiUpload" className="d-none" accept="image/*" multiple onChange={(e) => {
                                                if (!e.target.files) return;
                                                const files = Array.from(e.target.files).slice(0, 10);
                                                files.forEach(async (file) => {
                                                  const formData = new FormData();
                                                  formData.append("file", file);
                                                  const res = await fetch(`/api/admin/upload?productId=${editingProduct?.id || 'new'}`, { method: "POST", body: formData });
                                                  const data = await res.json();
                                                  if (data.success) {
                                                    setEditingProduct(prev => {
                                                      if (!prev) return prev;
                                                      const currentImages = prev.allImages || [];
                                                      if (currentImages.length >= 10) return prev;
                                                      const updated = [...currentImages, data.url];
                                                      return { ...prev, allImages: updated, imageUrl: prev.imageUrl || data.url };
                                                    });
                                                  }
                                                });
                                             }} />
                                             <label htmlFor="multiUpload" className="btn btn-outline-primary fw-bold w-100"><i className="bi bi-plus-circle me-1"></i>Tải ảnh từ máy</label>
                                         </div>
                                         <div className="input-group mb-2">
                                             <input type="text" className="form-control" placeholder="Hoặc dán link URL ảnh (https://...)" id="imgUrlInput" onKeyDown={(e) => {
                                               if (e.key === 'Enter') {
                                                 e.preventDefault();
                                                 const url = (e.target as HTMLInputElement).value.trim();
                                                 if (!url) return;
                                                 setEditingProduct(prev => {
                                                   if (!prev) return prev;
                                                   const currentImages = prev.allImages || [];
                                                   if (currentImages.length >= 10) return prev;
                                                   return { ...prev, allImages: [...currentImages, url], imageUrl: prev.imageUrl || url };
                                                 });
                                                 (e.target as HTMLInputElement).value = '';
                                               }
                                             }} />
                                             <button type="button" className="btn btn-outline-secondary" onClick={() => {
                                               const input = document.getElementById('imgUrlInput') as HTMLInputElement;
                                               const url = input?.value?.trim();
                                               if (!url) return;
                                               setEditingProduct(prev => {
                                                 if (!prev) return prev;
                                                 const currentImages = prev.allImages || [];
                                                 if (currentImages.length >= 10) return prev;
                                                 return { ...prev, allImages: [...currentImages, url], imageUrl: prev.imageUrl || url };
                                               });
                                               input.value = '';
                                             }}><i className="bi bi-link-45deg"></i> Thêm URL</button>
                                         </div>
                                         <div className="d-flex flex-wrap gap-2">
                                            {(editingProduct?.allImages || []).map((url: string, idx: number) => {
                                              const isMain = editingProduct.imageUrl === url;
                                              return (
                                                <div key={idx} className={`position-relative border rounded p-1 ${isMain ? 'border-primary border-2 shadow-sm' : ''}`} style={{ width: "90px" }}>
                                                  <div className="position-relative" style={{ height: "80px" }}>
                                                    <img src={url} className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
                                                    {isMain && <span className="position-absolute bottom-0 start-0 bg-primary text-white x-small px-1 fw-bold w-100 text-center" style={{fontSize: '9px'}}>ẢNH CHÍNH</span>}
                                                  </div>
                                                  <div className="d-flex mt-1 gap-1">
                                                    <button type="button" className="btn btn-xs btn-outline-primary flex-fill p-0" title="Đặt làm ảnh chính" onClick={() => setEditingProduct({...editingProduct, imageUrl: url})}>
                                                      <i className="bi bi-star-fill" style={{fontSize: '10px'}}></i>
                                                    </button>
                                                    <button type="button" className="btn btn-xs btn-outline-danger flex-fill p-0" title="Xóa" onClick={() => {
                                                      setEditingProduct(prev => {
                                                        if (!prev) return prev;
                                                        const filtered = (prev.allImages || []).filter((_, i) => i !== idx);
                                                        const nextMain = (prev.imageUrl === url) ? (filtered[0] || "") : prev.imageUrl;
                                                        return { ...prev, allImages: filtered, imageUrl: nextMain };
                                                      });
                                                    }}>
                                                      <i className="bi bi-trash" style={{fontSize: '10px'}}></i>
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                         </div>
                                     </div>
                                      <div className="col-md-3">
                                          <label className="form-label small fw-bold">Thương hiệu</label>
                                          <input type="text" className="form-control" value={editingProduct.brand || ""} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} required placeholder="Dell, HP, Cisco..."/>
                                      </div>
                                      <div className="col-md-3">
                                          <label className="form-label small fw-bold">Loại Máy</label>
                                          <select className="form-select" value={editingProduct.category || "SERVER"} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                              <option value="SERVER">SERVER</option>
                                              <option value="LAPTOP">LAPTOP</option>
                                              <option value="PRINTER">PRINTER</option>
                                              <option value="NETWORK">NETWORK</option>
                                              <option value="POS">POS</option>
                                          </select>
                                      </div>
                                      <div className="col-md-3">
                                          <label className="form-label small fw-bold text-info">Hiển thị Storefront</label>
                                          <select className="form-select border-info fw-bold" value={editingProduct.isVisible !== false ? "SHOW" : "HIDE"} onChange={e => setEditingProduct({...editingProduct, isVisible: e.target.value === "SHOW"})}>
                                              <option value="SHOW">Hiển thị</option>
                                              <option value="HIDE">Ẩn</option>
                                          </select>
                                      </div>
                                      <div className="col-md-3">
                                          <label className="form-label small fw-bold text-success">Giá Bán Niêm Yết (VNĐ)</label>
                                          <input type="number" className="form-control fw-bold text-success" value={editingProduct.price || ""} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} required/>
                                      </div>
                                      <div className="col-md-2">
                                          <label className="form-label small fw-bold">Tồn kho</label>
                                          <input type="number" className="form-control" value={editingProduct.stock || 0} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} required/>
                                      </div>
                                      <div className="col-md-2">
                                          <label className="form-label small fw-bold">Bảo hành (T)</label>
                                          <input type="number" className="form-control" value={editingProduct.warrantyMonths || 12} onChange={e => setEditingProduct({...editingProduct, warrantyMonths: parseInt(e.target.value)})} required/>
                                      </div>
                                      <div className="col-md-2 d-flex align-items-end mb-2">
                                          <div className="form-check form-switch fs-5">
                                            <input className="form-check-input" type="checkbox" role="switch" checked={editingProduct.isRentable || false} onChange={e => setEditingProduct({...editingProduct, isRentable: e.target.checked})} />
                                            <label className="form-check-label fs-6 fw-bold text-primary">Cho Thuê</label>
                                          </div>
                                      </div>
                                      {editingProduct.isRentable && (
                                         <div className="col-md-3">
                                            <label className="form-label small fw-bold text-primary">Giá Thuê / Ngày (VNĐ)</label>
                                            <input type="number" className="form-control border-primary bg-primary bg-opacity-10 fw-bold text-primary" value={editingProduct.rentalPricePerDay || ""} onChange={e => setEditingProduct({...editingProduct, rentalPricePerDay: parseInt(e.target.value)})} required/>
                                         </div>
                                     )}
                                     <div className="col-12 mt-3">
                                         <label className="form-label small fw-bold"><i className="bi bi-file-text me-1"></i>Mô tả sản phẩm & Giới thiệu chức năng</label>
                                         <textarea className="form-control" rows={6} value={editingProduct.description || ""} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Nhập mô tả chi tiết, giới thiệu chức năng, thông số kỹ thuật (xuống dòng để trình bày đẹp)..."></textarea>
                                         <div className="form-text">Mô tả này sẽ hiển thị trực tiếp tại trang chi tiết sản phẩm.</div>
                                     </div>
                                     <div className="col-12 mt-4 text-end">
                                         <button type="button" className="btn btn-light border me-2 px-4 shadow-sm" onClick={() => setEditingProduct(null)}>Hủy bỏ</button>
                                         <button type="submit" className="btn btn-primary fw-bold px-5 shadow-sm">LƯU CƠ SỞ DỮ LIỆU</button>
                                     </div>
                                 </div>
                             </form>
                         </div>
                     </div>
                  )}

                  <div className="card shadow-sm border-0 rounded-3">
                      <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <SortHeader label="THIẾT BỊ" sortKey="name" currentSort={productSort} onSort={handleSortProduct} className="px-4" />
                                      <SortHeader label="LOẠI" sortKey="category" currentSort={productSort} onSort={handleSortProduct} />
                                      <SortHeader label="GIÁ BÁN" sortKey="price" currentSort={productSort} onSort={handleSortProduct} />
                                      <SortHeader label="KHO" sortKey="stock" currentSort={productSort} onSort={handleSortProduct} className="text-center" />
                                      <SortHeader label="THUÊ" sortKey="isRentable" currentSort={productSort} onSort={handleSortProduct} className="text-center" />
                                      <th className="text-end px-4 py-3 text-dark fw-bold">THAO TÁC</th>
                                  </tr>
                              </thead>
                              <tbody>
                                 {loading && products.length === 0 && (
                                   <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">Đang tải kho hàng...</td>
                                   </tr>
                                 )}
                                 {!loading && products.length === 0 && (
                                   <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">Kho hàng đang trống hoặc chưa tải được dữ liệu.</td>
                                   </tr>
                                 )}
                                 {getFilteredProducts(products).map(p => (
                                     <tr key={p.id}>
                                         <td className="px-4 py-3">
                                             <div className="d-flex align-items-center">
                                                 <div className="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center border" style={{ width: "60px", height: "60px" }}>
                                                     {(() => {
                                                        const mainImg = p.imageUrl || p.images?.[0]?.url;
                                                        return mainImg ? (
                                                          <img src={mainImg} alt={p.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                                                        ) : (
                                                          <span className="fw-bold text-muted small">ID: {p.id}</span>
                                                        );
                                                      })()}
                                                 </div>
                                                 <div className="ms-3">
                                                     <div className="fw-bold">{p.name}</div>
                                                     <small className="text-muted">{p.brand}</small>
                                                 </div>
                                             </div>
                                         </td>
                                         <td><span className="badge bg-secondary">{p.category}</span></td>
                                         <td className="text-danger fw-bold">{p.price?.toLocaleString()}đ</td>
                                         <td className="text-center fw-bold">{p.stock}</td>
                                         <td className="text-center">{p.isRentable ? <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1"><i className="bi bi-clock-history me-1"></i> {p.rentalPricePerDay?.toLocaleString()}đ/n</span> : <span className="text-muted small">—</span>}</td>
                                         <td className="text-end px-4">
                                             <select 
                                               className={`form-select form-select-sm d-inline-block w-auto me-2 border-2 ${p.isVisible !== false ? 'border-success text-success' : 'border-secondary text-secondary'} fw-bold`}
                                               value={p.isVisible !== false ? "SHOW" : "HIDE"}
                                               onChange={(e) => toggleProductVisibility(p.id, e.target.value === "HIDE")}
                                             >
                                               <option value="SHOW">Hiển thị</option>
                                               <option value="HIDE">Chế độ Ẩn</option>
                                             </select>
                                             <button className="btn btn-sm btn-outline-primary me-2" onClick={() => {
                                              const pWithImages: Partial<Product> = { ...p, allImages: p.images?.map((i:any) => i.url) || [] };
                                              setEditingProduct(pWithImages);
                                             }}><i className="bi bi-pencil-square"></i></button>
                                             <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}><i className="bi bi-trash"></i></button>
                                         </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: SALES (INVOICES) */}
          {activeTab === "SALES" && (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0"><i className="bi bi-receipt text-primary me-2"></i>Quản Lý Hóa Đơn Bán Lẻ</h3>
                  <div className="d-flex gap-3">
                    <div className="input-group" style={{ width: "300px" }}>
                       <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                       <input type="text" className="form-control border-start-0" placeholder="Tìm mã đơn, tên khách..." value={saleSearch} onChange={e => setSaleSearch(e.target.value)} />
                    </div>
                    <div className="alert alert-info py-2 px-3 mb-0 small d-none d-md-block">
                      <i className="bi bi-info-circle me-1"></i> Doanh thu chỉ được cộng sau khi đơn hàng <b>Đã thanh toán</b>.
                    </div>
                  </div>
                </div>

                {/* HÓA ĐƠN CHƯA THANH TOÁN */}
                <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden">
                    <div className="card-header bg-warning text-dark fw-bold py-3 d-flex justify-content-between">
                      <span><i className="bi bi-hourglass-split me-2"></i>Hóa Đơn Chờ Thanh Toán (Unpaid)</span>
                      <small className="opacity-75">Click vào tiêu đề để sắp xếp</small>
                    </div>
                    <div className="table-responsive">
                        <table className="table hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <SortHeader label="MÃ ĐƠN" sortKey="id" currentSort={saleSort} onSort={handleSortSale} className="px-4" />
                                    <SortHeader label="KHÁCH HÀNG" sortKey="user" currentSort={saleSort} onSort={handleSortSale} />
                                    <SortHeader label="TỔNG TIỀN" sortKey="total" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-center">BẢO HÀNH</th>
                                    <SortHeader label="NGÀY MUA" sortKey="createdAt" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-end px-4 py-3 text-dark fw-bold">THAO TÁC</th>
                                </tr>
                            </thead>
                             <tbody>
                                 {getFilteredSales(sales.filter(s => s.status === "PENDING")).map(s => {
                                   const customer = formatCustomer(s);
                                   return (
                                     <tr key={s.id}>
                                         <td className="px-4 fw-bold text-muted">INV-{s.id}</td>
                                         <td>
                                            <div className="fw-bold small">{customer.name}</div>
                                            <div className="text-muted small">{customer.contact}</div>
                                         </td>
                                         <td className="text-danger fw-bold">{s.total.toLocaleString()} đ</td>
                                         <td className="text-center">
                                            {s.items?.map(it => (
                                                <div key={it.id} className="small text-muted">{it.product?.warrantyMonths || 12}T</div>
                                            ))}
                                         </td>
                                         <td><small className="text-muted">{new Date(s.createdAt).toLocaleString('vi-VN')}</small></td>
                                         <td className="text-end px-4">
                                             <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setSelectedSale(s)}>
                                               <i className="bi bi-eye me-1"></i>Chi tiết
                                             </button>
                                             <button className="btn btn-success btn-sm fw-bold me-2" onClick={() => updateSaleStatus(s.id, "PAID")}>
                                               <i className="bi bi-check-circle me-1"></i> Xác nhận Thanh toán
                                             </button>
                                             <button className="btn btn-outline-danger btn-sm me-2" onClick={() => updateSaleStatus(s.id, "CANCELLED")}>Hủy đơn</button>
                                             <button className="btn btn-sm btn-outline-danger" title="Xóa vĩnh viễn" onClick={() => deleteSaleOrder(s.id)}><i className="bi bi-trash"></i></button>
                                         </td>
                                     </tr>
                                   );
                                 })}
                                 {sales.filter(s => s.status === "PENDING").length === 0 && <tr><td colSpan={5} className="text-center p-4 text-muted">Không có đơn hàng nào đang chờ.</td></tr>}
                             </tbody>
                        </table>
                    </div>
                </div>

                {/* HÓA ĐƠN CHỜ VẬN CHUYỂN */}
                <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden">
                    <div className="card-header bg-info text-white fw-bold py-3 d-flex justify-content-between">
                      <span><i className="bi bi-truck me-2"></i>Hóa Đơn Chờ Vận Chuyển (Paid)</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <SortHeader label="MÃ ĐƠN" sortKey="id" currentSort={saleSort} onSort={handleSortSale} className="px-4" />
                                    <SortHeader label="KHÁCH HÀNG" sortKey="user" currentSort={saleSort} onSort={handleSortSale} />
                                    <SortHeader label="TỔNG TIỀN" sortKey="total" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-center">BẢO HÀNH</th>
                                    <SortHeader label="NGÀY MUA" sortKey="createdAt" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-end px-4 py-3 text-dark fw-bold">THAO TÁC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredSales(sales.filter(s => s.status === "PAID")).map(s => {
                                  const customer = formatCustomer(s);
                                  return (
                                    <tr key={s.id}>
                                        <td className="px-4 fw-bold text-muted">INV-{s.id}</td>
                                        <td>
                                            <div className="fw-bold small">{customer.name}</div>
                                            <div className="text-muted small">{customer.contact}</div>
                                        </td>
                                        <td className="text-primary fw-bold">{s.total.toLocaleString()} đ</td>
                                        <td className="text-center">
                                           {s.items?.map(it => (
                                               <div key={it.id} className="small text-muted">{it.product?.warrantyMonths || 12}T</div>
                                           ))}
                                        </td>
                                        <td><small className="text-muted">{new Date(s.createdAt).toLocaleString('vi-VN')}</small></td>
                                        <td className="text-end px-4">
                                            <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setSelectedSale(s)}>Chi tiết</button>
                                            <button className="btn btn-primary btn-sm fw-bold me-2" onClick={() => updateSaleStatus(s.id, "DELIVERED")}>
                                              <i className="bi bi-box-seam me-1"></i> Xác nhận Đã giao
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" title="Xóa vĩnh viễn" onClick={() => deleteSaleOrder(s.id)}><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                  );
                                })}
                                {sales.filter(s => s.status === "PAID").length === 0 && <tr><td colSpan={6} className="text-center p-4 text-muted">Không có đơn hàng nào đang chờ vận chuyển.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* HÓA ĐƠN ĐÃ HOÀN THÀNH */}
                <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                    <div className="card-header bg-success text-white fw-bold py-3"><i className="bi bi-cash-stack me-2"></i>Lịch Sử Hóa Đơn Đã Hoàn Thành (Delivered)</div>
                    <div className="table-responsive">
                        <table className="table hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <SortHeader label="MÃ ĐƠN" sortKey="id" currentSort={saleSort} onSort={handleSortSale} className="px-4" />
                                    <SortHeader label="KHÁCH HÀNG" sortKey="user" currentSort={saleSort} onSort={handleSortSale} />
                                    <SortHeader label="TỔNG TIỀN" sortKey="total" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-center">BẢO HÀNH</th>
                                    <SortHeader label="NGÀY MUA" sortKey="createdAt" currentSort={saleSort} onSort={handleSortSale} />
                                    <th className="text-end px-4 py-3 text-dark fw-bold">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredSales(sales.filter(s => s.status === "DELIVERED")).map(s => {
                                  const customer = formatCustomer(s);
                                  return (
                                    <tr key={s.id} className="bg-light">
                                        <td className="px-4 fw-bold">INV-{s.id}</td>
                                        <td>
                                            <div className="fw-bold small">{customer.name}</div>
                                            <div className="text-muted small">{customer.contact}</div>
                                        </td>
                                        <td className="text-primary fw-bold">{s.total.toLocaleString()} đ</td>
                                        <td className="text-center">
                                           {s.items?.map(it => (
                                               <div key={it.id} className="small fw-bold text-success" style={{fontSize: '0.7rem'}}>
                                                  {it.product?.warrantyMonths || 12}T 
                                                  <span className="text-muted ms-1">
                                                     ({(() => {
                                                        const d = new Date(s.createdAt);
                                                        d.setMonth(d.getMonth() + (it.product?.warrantyMonths || 12));
                                                        return d.toLocaleDateString('vi-VN');
                                                     })()})
                                                  </span>
                                               </div>
                                           ))}
                                        </td>
                                        <td><small className="text-muted">{new Date(s.createdAt).toLocaleString('vi-VN')}</small></td>
                                        <td className="text-end px-4">
                                          <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setSelectedSale(s)}>Chi tiết</button>
                                          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 me-2">Hoàn thành</span>
                                          <button className="btn btn-sm btn-outline-danger" title="Xóa vĩnh viễn" onClick={() => deleteSaleOrder(s.id)}><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                  );
                                })}
                                {sales.filter(s => s.status === "DELIVERED").length === 0 && <tr><td colSpan={6} className="text-center p-4 text-muted">Chưa có hóa đơn nào hoàn thành.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          )}

          {/* TAB 4: RENTALS MANAGEMENT */}
          {activeTab === "RENTALS" && (
              <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                      <div>
                          <h2 className="fw-bold text-dark mb-1">Thiết Lập Vận Hành Cho Thuê</h2>
                          <p className="text-muted mb-0">Theo dõi trạng thái: Cọc - Bàn giao - Vận hành - Thu hồi thiết bị IT.</p>
                      </div>
                      <div className="d-flex gap-3">
                          <div className="input-group shadow-sm" style={{ width: "320px" }}>
                              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                              <input type="text" className="form-control border-start-0 py-2" placeholder="Mã RT, tên khách, email..." value={rentalSearch} onChange={e => setRentalSearch(e.target.value)} />
                          </div>
                          <button className="btn btn-white border px-4 rounded-3 fw-bold shadow-sm" onClick={loadRentals}><i className="bi bi-arrow-clockwise me-2 text-primary"></i>Làm mới</button>
                      </div>
                  </div>

                  {/* 1. CHỜ THANH TOÁN / ĐẶT CỌC */}
                  <div className="card shadow-sm border-0 rounded-4 mb-5 overflow-hidden border-start border-4 border-warning">
                      <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between">
                         <h5 className="mb-0 fw-bold"><i className="bi bi-hourglass-split me-2 text-warning"></i>1. Hợp đồng chờ xác nhận tài chính & cọc</h5>
                         <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill">Bước 1: Payment Check</span>
                      </div>
                  <div className="table-responsive">
                      <table className="table hover align-middle mb-0">
                          <thead className="bg-light">
                              <tr>
                                  <SortHeader label="Hợp Đồng" sortKey="id" currentSort={rentalSort} onSort={handleSortRental} className="px-4" />
                                  <SortHeader label="Khách Hàng" sortKey="user" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Cọc + Tổng Thuê" sortKey="totalRental" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Sự cố" sortKey="issues" currentSort={rentalSort} onSort={handleSortRental} />
                                  <th className="text-end px-4 py-3">Thao Tác</th>
                              </tr>
                          </thead>
                          <tbody>
                              {getFilteredRentals(rentals.filter(r => r.status === "PENDING")).map(r => (
                                  <tr key={r.id}>
                                      <td className="px-4 fw-bold">RT-#{r.id}</td>
                                      <td><div className="fw-bold">{r.user?.name}</div><small className="text-muted">{r.user?.email}</small></td>
                                      <td>
                                          <div className="small">Cọc: <b>{r.deposit.toLocaleString()} đ</b></div>
                                          <div className="small text-primary">Cước: <b>{r.totalRental.toLocaleString()} đ</b></div>
                                      </td>
                                      <td className="text-center">
                                          {(() => {
                                              const count = warranties.filter(w => w.userId === r.userId && w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
                                              return count > 0 ? <span className="badge bg-danger">{count} sự cố</span> : <span className="text-muted small">Ổn định</span>;
                                          })()}
                                      </td>
                                      <td className="text-end px-4">
                                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelectedRental(r)}>Chi tiết</button>
                                          <button className="btn btn-warning btn-sm fw-bold shadow-sm" onClick={() => updateRentalStatus(r.id, "PAID")}>
                                              <i className="bi bi-cash-coin me-1"></i> Xác nhận Đã Cọc
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {rentals.filter(r => r.status === "PENDING").length === 0 && <tr><td colSpan={4} className="text-center p-4 text-muted small">Không có hợp đồng chờ thanh toán.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* 2. CHỜ BÀN GIAO MÁY */}
              <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden border-start border-4 border-info">
                  <div className="card-header bg-info text-white fw-bold py-3"><i className="bi bi-truck me-2"></i>2. Chờ Bàn Giao Máy Cho Khách</div>
                  <div className="table-responsive">
                      <table className="table hover align-middle mb-0">
                          <thead className="bg-light">
                              <tr>
                                  <SortHeader label="Hợp Đồng" sortKey="id" currentSort={rentalSort} onSort={handleSortRental} className="px-4" />
                                  <SortHeader label="Khách Hàng" sortKey="user" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Ngày Thuê" sortKey="startDate" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Sự cố" sortKey="issues" currentSort={rentalSort} onSort={handleSortRental} />
                                  <th className="text-end px-4 py-3">Thao Tác</th>
                              </tr>
                          </thead>
                          <tbody>
                              {getFilteredRentals(rentals.filter(r => r.status === "PAID")).map(r => (
                                  <tr key={r.id}>
                                      <td className="px-4 fw-bold">RT-#{r.id}</td>
                                      <td><div className="fw-bold">{r.user?.name}</div></td>
                                      <td><span className="badge bg-info-subtle text-info border border-info-subtle">{new Date(r.startDate).toLocaleDateString('vi-VN')}</span></td>
                                      <td className="text-center">
                                          {(() => {
                                              const count = warranties.filter(w => w.userId === r.userId && w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
                                              return count > 0 ? <span className="badge bg-danger">{count} sự cố</span> : <span className="text-muted small">Ổn định</span>;
                                          })()}
                                      </td>
                                      <td className="text-end px-4">
                                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelectedRental(r)}>Chi tiết</button>
                                          <button className="btn btn-info btn-sm text-white fw-bold shadow-sm" onClick={() => updateRentalStatus(r.id, "ACTIVE")}>
                                              <i className="bi bi-truck-flatbed me-1"></i> Kích hoạt Đang thuê
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {rentals.filter(r => r.status === "PAID").length === 0 && <tr><td colSpan={4} className="text-center p-4 text-muted small">Mọi máy đã được bàn giao xong.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* 3. ĐANG CHO THUÊ */}
              <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden border-start border-4 border-success">
                  <div className="card-header bg-success text-white fw-bold py-3"><i className="bi bi-play-circle me-2"></i>3. Đang Trong Quá Trình Cho Thuê</div>
                  <div className="table-responsive">
                      <table className="table hover align-middle mb-0">
                          <thead className="bg-light">
                              <tr>
                                  <SortHeader label="Hợp Đồng" sortKey="id" currentSort={rentalSort} onSort={handleSortRental} className="px-4" />
                                  <SortHeader label="Khách Hàng" sortKey="user" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Hạn Trả" sortKey="endDate" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Sự cố" sortKey="issues" currentSort={rentalSort} onSort={handleSortRental} />
                                  <th className="text-end px-4 py-3">Thao Tác</th>
                              </tr>
                          </thead>
                          <tbody>
                              {getFilteredRentals(rentals.filter(r => r.status === "ACTIVE")).map(r => (
                                  <tr key={r.id}>
                                      <td className="px-4 fw-bold">RT-#{r.id}</td>
                                      <td><div className="fw-bold">{r.user?.name}</div></td>
                                      <td><span className="badge bg-danger">{new Date(r.endDate).toLocaleDateString('vi-VN')}</span></td>
                                      <td className="text-center">
                                          {(() => {
                                              const count = warranties.filter(w => w.userId === r.userId && w.status !== "COMPLETED" && w.status !== "CANCELLED").length;
                                              return count > 0 ? <span className="badge bg-danger">{count} sự cố</span> : <span className="text-muted small">Ổn định</span>;
                                          })()}
                                      </td>
                                      <td className="text-end px-4">
                                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setSelectedRental(r)}>Chi tiết</button>
                                          <button className="btn btn-dark btn-sm fw-bold" onClick={() => setReturningRental({ ...r, returnDate: new Date().toISOString().split('T')[0], returnNote: "", hasIssue: false, issueProductId: r.items?.[0]?.product?.id })}>
                                            <i className="bi bi-box-arrow-in-left me-1"></i> Xác nhận TRẢ MÁY
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {rentals.filter(r => r.status === "ACTIVE").length === 0 && <tr><td colSpan={4} className="text-center p-4 text-muted small">Hiện tại không có máy nào đang cho thuê.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* 4. ĐÃ TRẢ MÁY & HOÀN TẤT */}
              <div className="card shadow-sm border-0 rounded-3 overflow-hidden opacity-75 mb-5">
                  <div className="card-header bg-dark text-white fw-bold py-3"><i className="bi bi-check2-all me-2"></i>4. Lịch Sử Hợp Đồng Đã Kết Thúc & Tất Toán</div>
                  <div className="table-responsive">
                      <table className="table align-middle mb-0">
                          <thead className="bg-light">
                              <tr>
                                  <SortHeader label="Hợp Đồng" sortKey="id" currentSort={rentalSort} onSort={handleSortRental} className="px-4" />
                                  <SortHeader label="Khách Hàng" sortKey="user" currentSort={rentalSort} onSort={handleSortRental} />
                                  <SortHeader label="Hoàn Cọc" sortKey="isDepositRefunded" currentSort={rentalSort} onSort={handleSortRental} className="text-center" />
                                  <SortHeader label="Ngày Xong" sortKey="updatedAt" currentSort={rentalSort} onSort={handleSortRental} />
                                  <th className="text-end px-4 py-3">Hành Động</th>
                              </tr>
                          </thead>
                          <tbody>
                              {getFilteredRentals(rentals.filter(r => r.status === "RETURNED")).map(r => (
                                  <tr key={r.id}>
                                      <td className="px-4 fw-bold">RT-#{r.id}</td>
                                      <td><div className="fw-bold text-muted">{r.user?.name}</div></td>
                                      <td className="text-center">
                                          {r.isDepositRefunded ? (
                                              <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Đã trả cọc</span>
                                          ) : (
                                              <button className="btn btn-xs btn-outline-warning fw-bold" onClick={async () => {
                                                  if(!confirm("Xác nhận đã trả tiền cọc cho khách?")) return;
                                                  await fetch("/api/admin/rentals", { method:"PUT", body: JSON.stringify({id: r.id, isDepositRefunded: true}) });
                                                  loadRentals();
                                              }}>Chưa Trả Cọc <i className="bi bi-arrow-right"></i></button>
                                          )}
                                      </td>
                                      <td><small className="text-muted">{new Date(r.updatedAt).toLocaleDateString('vi-VN')}</small></td>
                                      <td className="text-end px-4">
                                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedRental(r)}>Xem lại</button>
                                      </td>
                                  </tr>
                              ))}
                              {rentals.filter(r => r.status === "RETURNED").length === 0 && <tr><td colSpan={5} className="text-center p-4 text-muted small">Chưa có hợp đồng nào kết thúc.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* 5. DANH SÁCH SỰ CỐ ĐANG XỬ LÝ */}
              <div className="card shadow-sm border-0 rounded-3 overflow-hidden border-start border-4 border-danger mb-5">
                  <div className="card-header bg-danger text-white fw-bold py-3 pt-4"><h5 className="mb-0 fw-bold">5. DANH SÁCH CÁC SỰ CỐ PHÁT SINH KHI THUÊ</h5></div>
                  <div className="table-responsive">
                      <table className="table hover align-middle mb-0">
                          <thead className="bg-light">
                              <tr>
                                  <th className="px-4">MÁY (PRODUCT)</th>
                                  <th>NGƯỜI THUÊ</th>
                                  <th>SỰ CỐ XẢY RA</th>
                                  <th>HƯỚNG GIẢI QUYẾT</th>
                                  <th className="text-center">TÌNH TRẠNG</th>
                                  <th className="text-end px-4">THAO TÁC</th>
                              </tr>
                          </thead>
                          <tbody>
                              {warranties.filter(w => w.status !== "DONE" && w.status !== "CANCELLED").map(w => (
                                  <tr key={w.id}>
                                      <td className="px-4">
                                          <div className="fw-bold">{w.product?.name}</div>
                                          <small className="text-muted">ID: {w.productId}</small>
                                      </td>
                                      <td>
                                          <div className="fw-bold small">{w.user?.name}</div>
                                          <div className="text-muted" style={{fontSize: '0.75rem'}}>{w.user?.phone || w.user?.email}</div>
                                      </td>
                                      <td className="small" style={{maxWidth: '200px'}}>{w.issueDetail}</td>
                                      <td>
                                          <input type="text" className="form-control form-control-sm" placeholder="Nhập hướng xử lý..." defaultValue={w.resolution || ""} onBlur={async (e) => {
                                              await fetch("/api/admin/warranties", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id: w.id, resolution: e.target.value}) });
                                              loadWarranties();
                                          }}/>
                                      </td>
                                      <td className="text-center">
                                          <select className="form-select form-select-sm" value={w.status} onChange={async (e) => {
                                              await fetch("/api/admin/warranties", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id: w.id, status: e.target.value}) });
                                              loadWarranties();
                                          }}>
                                              <option value="PENDING">Chờ xử lý</option>
                                              <option value="CHECKING">Đang kiểm tra</option>
                                              <option value="PROCESSING">Đang sửa chữa/Đổi máy</option>
                                              <option value="DONE">Đã khắc phục xong</option>
                                              <option value="CANCELLED">Hủy bỏ</option>
                                          </select>
                                      </td>
                                      <td className="text-end px-4">
                                          <button className="btn btn-sm btn-outline-danger" title="Xóa vĩnh viễn khỏi CSDL" onClick={() => deleteWarranty(w.id)}><i className="bi bi-trash"></i></button>
                                      </td>
                                  </tr>
                              ))}
                              {warranties.filter(w => w.status !== "DONE" && w.status !== "CANCELLED").length === 0 && <tr><td colSpan={6} className="text-center p-4 text-muted small">Hiện không có sự cố thuê máy nào được báo cáo.</td></tr>}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
        )}

          {/* TAB: USERS CRUD (Quản lý Nhân sự) */}
          {activeTab === "USERS" && (
            <div className="animate__animated animate__fadeIn">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="fw-bold mb-1 text-dark">Quản Lý Đội Ngũ Nhân Sự</h3>
                      <p className="text-muted small mb-0">Điều hành và phân quyền truy cập hệ thống ABC XYZ</p>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="input-group shadow-sm" style={{ width: "300px" }}>
                         <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                         <input type="text" className="form-control border-start-0" placeholder="Tìm tên, email, chức vụ..." value={staffSearch} onChange={e => setStaffSearch(e.target.value)} />
                      </div>
                      <button className="btn btn-danger fw-bold px-4 shadow-sm" onClick={() => setEditingUser({role: "EMPLOYEE"})}><i className="bi bi-person-plus-fill me-2"></i>Thêm Thành Viên</button>
                    </div>
                </div>

                {/* Staff Stats Cards */}
                <div className="row g-4 mb-5">
                   <div className="col-md-4">
                      <div className="p-4 bg-white rounded-4 shadow-sm border-0 border-start border-danger border-5 h-100">
                         <div className="text-secondary small fw-bold text-uppercase mb-2">Quản trị viên (Admin)</div>
                         <div className="d-flex align-items-center">
                            <h2 className="fw-bold mb-0 me-3">{users.filter(u => u.role === "ADMIN").length}</h2>
                            <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle"><i className="bi bi-shield-lock-fill"></i></div>
                         </div>
                      </div>
                   </div>
                   <div className="col-md-4">
                      <div className="p-4 bg-white rounded-4 shadow-sm border-0 border-start border-primary border-5 h-100">
                         <div className="text-secondary small fw-bold text-uppercase mb-2">Quản lý (Manager)</div>
                         <div className="d-flex align-items-center">
                            <h2 className="fw-bold mb-0 me-3">{users.filter(u => u.role === "MANAGER").length}</h2>
                            <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle"><i className="bi bi-person-badge-fill"></i></div>
                         </div>
                      </div>
                   </div>
                   <div className="col-md-4">
                      <div className="p-4 bg-white rounded-4 shadow-sm border-0 border-start border-success border-5 h-100">
                         <div className="text-secondary small fw-bold text-uppercase mb-2">Nhân sự vận hành</div>
                         <div className="d-flex align-items-center">
                            <h2 className="fw-bold mb-0 me-3">{users.filter(u => u.role === "EMPLOYEE").length}</h2>
                            <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle"><i className="bi bi-people-fill"></i></div>
                         </div>
                      </div>
                   </div>
                </div>

                {editingUser && (
                  <div className="card shadow-lg border-0 mb-5 p-4 border-top border-4 border-danger bg-white animate__animated animate__slideInDown">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold text-danger mb-0">{editingUser.id ? `Chỉnh sửa hồ sơ: ${editingUser.name}` : "Thiết lập tài khoản Staff mới"}</h5>
                        <button className="btn-close" onClick={() => setEditingUser(null)}></button>
                      </div>
                      <form onSubmit={saveUser}>
                          <div className="row g-4">
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Họ và Tên</label>
                                <input type="text" className="form-control py-2 shadow-sm" value={editingUser.name || ""} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Email (Đăng nhập)</label>
                                <input type="email" className="form-control py-2 shadow-sm" value={editingUser.email || ""} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Mật khẩu {editingUser.id && "(Bỏ trống nếu không đổi)"}</label>
                                <input type="password" name="password" className="form-control py-2 shadow-sm" onChange={e => setEditingUser({...editingUser, password: e.target.value})} required={!editingUser.id}/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Phòng ban / Chức vụ</label>
                                <input type="text" className="form-control py-2 shadow-sm" value={editingUser.companyName || ""} onChange={e => setEditingUser({...editingUser, companyName: e.target.value})} placeholder="Sale, Kỹ thuật, Kế toán..."/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Nhóm quyền hạn</label>
                                <select className="form-select py-2 shadow-sm" style={{ borderLeft: '5px solid #dc3545' }} value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                                    <option value="ADMIN">ADMINISTRATOR (Toàn quyền)</option>
                                    <option value="MANAGER">MANAGER (Quản lý kho/thuê)</option>
                                    <option value="EMPLOYEE">STAFF (Nhân viên vận hành)</option>
                                </select>
                              </div>
                              <div className="col-md-4 d-flex align-items-end">
                                <div className="d-flex gap-2 w-100">
                                  <button type="button" className="btn btn-light border flex-fill py-2" onClick={() => setEditingUser(null)}>Hủy bỏ</button>
                                  <button type="submit" className="btn btn-danger flex-fill py-2 fw-bold shadow-sm">LƯU HỒ SƠ <i className="bi bi-check2-circle ms-1"></i></button>
                                </div>
                              </div>
                          </div>
                      </form>
                  </div>
                )}

                <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light bg-opacity-50">
                        <tr>
                          <SortHeader label="NHÂN VIÊN" sortKey="name" currentSort={staffSort} onSort={handleSortStaff} className="px-4 py-3" />
                          <SortHeader label="THÔNG TIN LIÊN HỆ" sortKey="email" currentSort={staffSort} onSort={handleSortStaff} />
                          <SortHeader label="PHÒNG BAN" sortKey="companyName" currentSort={staffSort} onSort={handleSortStaff} />
                          <SortHeader label="PHÂN QUYỀN" sortKey="role" currentSort={staffSort} onSort={handleSortStaff} />
                          <th className="text-end px-4 py-3 text-dark fw-bold">QUẢN TRỊ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredStaff(users.filter(u => u.role !== "CUSTOMER")).map(u => {
                          const initials = (u.name || "?").split(" ").map((n:string) => n[0]).join("").substring(0, 2).toUpperCase();
                          const roleColors = {
                             ADMIN: { bg: "#fff5f5", color: "#e03131", border: "#ffa8a8" },
                             MANAGER: { bg: "#f1f3f5", color: "#1971c2", border: "#a5d8ff" },
                             EMPLOYEE: { bg: "#f4fce3", color: "#2f9e44", border: "#b2f2bb" }
                          };
                          const rc = roleColors[u.role as keyof typeof roleColors] || roleColors.EMPLOYEE;

                          return (
                            <tr key={u.id} className="transition-premium">
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center">
                                   <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white me-3 shadow-sm" 
                                        style={{ width: "45px", height: "45px", backgroundColor: u.role === 'ADMIN' ? '#dc3545' : u.role === 'MANAGER' ? '#0d6efd' : '#198754', fontSize: '14px' }}>
                                      {initials}
                                   </div>
                                   <div>
                                      <div className="fw-bold text-dark">{u.name}</div>
                                      <div className="text-muted" style={{ fontSize: '11px' }}>ID: {u.id?.toString().padStart(4, '0')}</div>
                                   </div>
                                </div>
                              </td>
                              <td>
                                <div className="small fw-medium text-dark">{u.email}</div>
                                <div className="x-small text-muted">Hệ thống ABC XYZ Internal</div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border fw-medium px-3 py-2 rounded-pill">
                                  <i className="bi bi-bookmark-fill text-muted me-1"></i> {u.companyName || "N/A"}
                                </span>
                              </td>
                              <td>
                                <span className="badge px-3 py-2 rounded-pill shadow-sm" 
                                      style={{ backgroundColor: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, fontSize: '11px', fontWeight: '800' }}>
                                  <i className={`bi ${u.role === 'ADMIN' ? 'bi-shield-lock-fill' : u.role === 'MANAGER' ? 'bi-award-fill' : 'bi-person-fill'} me-1`}></i>
                                  {u.role === 'EMPLOYEE' ? 'STAFF' : u.role}
                                </span>
                              </td>
                              <td className="text-end px-4">
                                <div className="btn-group shadow-sm rounded-3 overflow-hidden">
                                  <button className="btn btn-sm btn-white border-end" title="Chỉnh sửa" onClick={() => setEditingUser(u)}><i className="bi bi-pencil-square text-primary"></i></button>
                                  <button className="btn btn-sm btn-white" title="Xóa tài khoản" onClick={() => deleteUser(u.id)}><i className="bi bi-trash-fill text-danger"></i></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          )}

          {/* TAB: CUSTOMERS CRUD */}
          {activeTab === "CUSTOMERS" && (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0"><i className="bi bi-person-badge-fill text-dark me-2"></i>Quản Lý Tài Khoản Khách Hàng</h3>
                    <div className="d-flex gap-3">
                      <div className="input-group" style={{ width: "300px" }}>
                         <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                         <input type="text" className="form-control border-start-0" placeholder="Tìm tên, email, cty..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} />
                      </div>
                      <button className="btn btn-dark fw-bold" onClick={() => setEditingUser({role: "CUSTOMER"})}><i className="bi bi-person-plus-fill me-2"></i>Thêm Khách Hàng</button>
                    </div>
                </div>

                {editingUser && (
                  <div className="card shadow-sm border-0 mb-5 p-4 border-start border-5 border-dark bg-white">
                      <h5 className="fw-bold text-dark mb-4">{editingUser.id ? "Sửa thông tin khách hàng" : "Tạo tài khoản khách hàng mới"}</h5>
                      <form onSubmit={saveUser}>
                          <div className="row g-3">
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Tên khách hàng</label>
                                <input type="text" className="form-control" value={editingUser.name || ""} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Email (Dùng đăng nhập)</label>
                                <input type="email" className="form-control" value={editingUser.email || ""} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Mật khẩu {editingUser.id && "(Trống = giữ nguyên)"}</label>
                                <input type="password" name="password" className="form-control" onChange={e => setEditingUser({...editingUser, password: e.target.value})} required={!editingUser.id}/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Tên công ty (B2B)</label>
                                <input type="text" className="form-control" value={editingUser.companyName || ""} onChange={e => setEditingUser({...editingUser, companyName: e.target.value})}/>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small fw-bold">Số điện thoại</label>
                                <input type="text" className="form-control" value={editingUser.phone || ""} onChange={e => setEditingUser({...editingUser, phone: e.target.value})}/>
                              </div>
                              <div className="col-md-8">
                                <label className="form-label small fw-bold">Địa chỉ giao hàng / Văn phòng</label>
                                <input type="text" className="form-control" placeholder="VD: 123 Nguyễn Văn Linh, Q7, TP.HCM" value={editingUser.address || ""} onChange={e => setEditingUser({...editingUser, address: e.target.value})}/>
                              </div>
                              <input type="hidden" value="CUSTOMER" />
                              <div className="col-md-4 d-flex align-items-end">
                                  <button type="button" className="btn btn-light border me-2" onClick={() => setEditingUser(null)}>Hủy</button>
                                  <button type="submit" className="btn btn-dark px-4 fw-bold">LƯU KHÁCH HÀNG</button>
                              </div>
                          </div>
                      </form>
                  </div>
                )}

                <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
                  <div className="table-responsive">
                    <table className="table hover align-middle mb-0">
                      <thead className="bg-light text-uppercase">
                        <tr>
                          <SortHeader label="KHÁCH HÀNG" sortKey="name" currentSort={customerSort} onSort={handleSortCustomer} className="px-4" />
                          <SortHeader label="EMAIL" sortKey="email" currentSort={customerSort} onSort={handleSortCustomer} />
                          <SortHeader label="CÔNG TY" sortKey="companyName" currentSort={customerSort} onSort={handleSortCustomer} />
                          <th className="py-3 px-2 text-dark fw-bold">PHONE</th>
                          <th className="py-3 px-2 text-dark fw-bold">ĐỊA CHỈ</th>
                          <SortHeader label="NGÀY TẠO" sortKey="createdAt" currentSort={customerSort} onSort={handleSortCustomer} />
                          <th className="text-end px-4 py-3 text-dark fw-bold">THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredCustomers(users.filter(u => u.role === "CUSTOMER")).map(u => (
                          <tr key={u.id}>
                            <td className="px-4 fw-bold">{u.name || `Khách hàng #${u.id}`}</td>
                            <td>{u.email}</td>
                            <td>{u.companyName || "-"}</td>
                            <td>{u.phone || "-"}</td>
                            <td><small className="text-muted">{u.address || "—"}</small></td>
                            <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</small></td>
                            <td className="text-end px-4">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingUser(u)}><i className="bi bi-pencil"></i></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u.id)}><i className="bi bi-trash"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          )}

          {/* TAB: WARRANTIES */}
          {activeTab === "WARRANTIES" && (
              <div>
                  <h3 className="fw-bold mb-4"><i className="bi bi-tools text-primary me-2"></i>Quy Trình Bảo Hành & Sửa Chữa</h3>
                  
                  {/* Stage 1: Tiếp nhận */}
                  <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden">
                      <div className="card-header bg-warning text-dark fw-bold py-3"><i className="bi bi-mailbox2 me-2"></i>1. Tiếp nhận & Chờ kiểm tra</div>
                      <div className="table-responsive">
                          <table className="table hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <SortHeader label="TICKET" sortKey="id" currentSort={warrantySort} onSort={handleSortWarranty} className="px-4" />
                                      <SortHeader label="THÔNG TIN" sortKey="user" currentSort={warrantySort} onSort={handleSortWarranty} />
                                      <SortHeader label="THIẾT BỊ" sortKey="product" currentSort={warrantySort} onSort={handleSortWarranty} />
                                      <th className="px-4 py-3 text-dark fw-bold">MÔ TẢ LỖI</th>
                                      <th className="text-end px-4 py-3 text-dark fw-bold">THAO TÁC</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {getFilteredWarranties(warranties.filter(w => w.status === "PENDING")).map(w => (
                                      <tr key={w.id}>
                                          <td className="px-4 fw-bold">#W-{w.id}</td>
                                          <td><div className="fw-bold small">{w.user?.name}</div><div className="text-muted small">{w.user?.phone || w.user?.email}</div></td>
                                          <td><span className="fw-bold text-primary small">{w.product?.name}</span></td>
                                          <td className="small" style={{maxWidth: '250px'}}>{w.issueDetail}</td>
                                          <td className="text-end px-4">
                                              <button className="btn btn-sm btn-outline-info fw-bold" onClick={() => updateWarrantyStatus(w.id, 'CHECKING')}>Bắt đầu kiểm tra <i className="bi bi-arrow-right"></i></button>
                                          </td>
                                      </tr>
                                  ))}
                                  {warranties.filter(w => w.status === "PENDING").length === 0 && <tr><td colSpan={5} className="text-center p-4 text-muted small">Mọi máy đã được tiếp nhận xong.</td></tr>}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Stage 2: Đang xử lý */}
                  <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden border-start border-4 border-info">
                      <div className="card-header bg-info text-white fw-bold py-3"><i className="bi bi-wrench-adjustable-circle me-2"></i>2. Đang Trong Quá Trình Sửa Chữa / Xử Lý</div>
                      <div className="table-responsive">
                          <table className="table hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <th className="px-4">TICKET</th>
                                      <th>THIẾT BỊ / KHÁCH</th>
                                      <th>HƯỚNG GIẢI QUYẾT & GHI CHÚ</th>
                                      <th className="text-center">TÌNH TRẠNG</th>
                                      <th className="text-end px-4">XONG</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {getFilteredWarranties(warranties.filter(w => w.status === "CHECKING" || w.status === "PROCESSING")).map(w => (
                                      <tr key={w.id}>
                                          <td className="px-4 fw-bold">#W-{w.id}</td>
                                          <td><div className="fw-bold small text-primary">{w.product?.name}</div><div className="text-muted small">KH: {w.user?.name}</div></td>
                                          <td>
                                            <input type="text" className="form-control form-control-sm" placeholder="Ghi chú hướng sửa chữa..." defaultValue={w.resolution || ""} onBlur={async (e) => {
                                                await fetch("/api/admin/warranties", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id: w.id, resolution: e.target.value}) });
                                                loadWarranties();
                                            }}/>
                                          </td>
                                          <td className="text-center">
                                              <select className="form-select form-select-sm" value={w.status} onChange={e => updateWarrantyStatus(w.id, e.target.value)}>
                                                  <option value="CHECKING">Đang kiểm tra</option>
                                                  <option value="PROCESSING">Đang sửa chữa/Đổi mới</option>
                                              </select>
                                          </td>
                                          <td className="text-end px-4">
                                              <button className="btn btn-sm btn-success shadow-sm fw-bold" onClick={() => updateWarrantyStatus(w.id, 'DONE')}><i className="bi bi-check-circle me-1"></i>Hoàn tất</button>
                                          </td>
                                      </tr>
                                  ))}
                                  {warranties.filter(w => w.status === "CHECKING" || w.status === "PROCESSING").length === 0 && <tr><td colSpan={5} className="text-center p-4 text-muted small">Hiện không có máy nào đang sửa chữa.</td></tr>}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Stage 3: Hoàn tất */}
                  <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden border-start border-4 border-success">
                      <div className="card-header bg-success text-white fw-bold py-3"><i className="bi bi-clipboard2-check me-2"></i>3. Đã Khắc Phục Xong & Sẵn Sàng Trả Máy</div>
                      <div className="table-responsive">
                          <table className="table align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <SortHeader label="TICKET" sortKey="id" currentSort={warrantySort} onSort={handleSortWarranty} className="px-4" />
                                      <th>THIẾT BỊ</th>
                                      <th>KHÁCH HÀNG</th>
                                      <th>HƯỚNG GIẢI QUYẾT</th>
                                      <th className="text-end px-4 py-3">THAO TÁC</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {getFilteredWarranties(warranties.filter(w => w.status === "DONE")).map(w => (
                                      <tr key={w.id}>
                                          <td className="px-4 fw-bold">#W-{w.id}</td>
                                          <td>{w.product?.name}</td>
                                          <td>{w.user?.name}</td>
                                          <td className="small italic text-success">{w.resolution || "Đã xử lý tốt"}</td>
                                          <td className="text-end px-4">
                                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteWarranty(w.id)}><i className="bi bi-trash"></i> Xóa lịch sử</button>
                                          </td>
                                      </tr>
                                  ))}
                                  {warranties.filter(w => w.status === "DONE").length === 0 && <tr><td colSpan={5} className="text-center p-4 text-muted small">Chưa có máy nào sửa chữa hoàn tất.</td></tr>}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === "CONTACTS" && (
              <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="fw-bold mb-0"><i className="bi bi-chat-left-dots text-primary me-2"></i>Hộp Thư Liên Hệ Tư Vấn</h3>
                      <div className="d-flex gap-2">
                          <span className="small text-muted align-self-center me-2">Sắp xếp theo:</span>
                          <button className={`btn btn-sm ${contactSort.key === 'createdAt' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSortContact('createdAt')}>Mới nhất</button>
                          <button className={`btn btn-sm ${contactSort.key === 'name' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSortContact('name')}>Tên khách</button>
                      </div>
                  </div>
                  <div className="row g-4">
                      {getFilteredContacts(contacts).map((c: ContactMsg) => (
                          <div className="col-md-6" key={c.id}>
                              <div className={"card border-0 shadow-sm " + (c.isRead ? "opacity-75" : "border-start border-4 border-primary")}>
                                  <div className="card-body p-4">
                                      <div className="d-flex justify-content-between mb-3">
                                          <h5 className="fw-bold mb-0">{c.name}</h5>
                                          <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                      </div>
                                      <p className="small text-muted mb-3"><i className="bi bi-envelope me-1"></i>{c.email} • <i className="bi bi-telephone ms-2 me-1"></i>{c.phone || "N/A"}</p>
                                      <div className="bg-light p-3 rounded mb-3 small" style={{ minHeight: "80px" }}>{c.message}</div>
                                      {!c.isRead && <button className="btn btn-sm btn-primary w-100 fw-bold py-2" onClick={() => markContactRead(c.id)}>Xác Nhận Đã Đọc / Đã Tư Vấn</button>}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {selectedSale && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.55)", zIndex: 2000 }} onClick={() => setSelectedSale(null)}>
              <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: "min(900px, calc(100vw - 2rem))", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="text-muted small">Hóa đơn bán</div>
                    <h4 className="fw-bold mb-1">INV-{selectedSale.id}</h4>
                    <div className="text-muted small">{new Date(selectedSale.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                  <button className="btn btn-light" onClick={() => setSelectedSale(null)}>Đóng</button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <div className="fw-bold mb-2">Thông tin khách hàng</div>
                      <div className="fw-semibold">{formatCustomer(selectedSale).name}</div>
                      <div className="text-muted small">{formatCustomer(selectedSale).contact}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <div className="fw-bold mb-2">Tổng tiền</div>
                      <div className="fs-4 fw-bold text-primary">{selectedSale.total.toLocaleString()} đ</div>
                      <div className="text-muted small">Trạng thái: {selectedSale.status}</div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Thương hiệu</th>
                        <th className="text-center">Bảo hành</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formatSaleItems(selectedSale).map((item) => {
                        const lineTotal = item.quantity * item.price;
                        return (
                          <tr key={item.id}>
                            <td className="fw-semibold">{item.product?.name || "Sản phẩm đã xóa"}</td>
                            <td>{item.product?.brand || "-"}</td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark border">
                                {item.product?.warrantyMonths || 12} tháng
                              </span>
                              {selectedSale.status === "PAID" && (
                                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                  Hết hạn: {(() => {
                                    const d = new Date(selectedSale.createdAt);
                                    d.setMonth(d.getMonth() + (item.product?.warrantyMonths || 12));
                                    return d.toLocaleDateString('vi-VN');
                                  })()}
                                </div>
                              )}
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{item.price.toLocaleString()} đ</td>
                            <td className="text-end fw-bold">{lineTotal.toLocaleString()} đ</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Ghi chú nội bộ */}
                <div className="mt-4 p-3 border rounded-3 bg-warning bg-opacity-10 border-warning border-opacity-25">
                  <label className="form-label fw-bold text-dark"><i className="bi bi-journal-text me-2"></i>Ghi chú nội bộ (Chỉ nhân viên thấy)</label>
                  <textarea 
                    className="form-control border-warning border-opacity-50" 
                    rows={3} 
                    placeholder="Nhập ghi chú quan trọng về đơn hàng này..."
                    defaultValue={selectedSale.adminNotes || ""}
                    onBlur={(e) => setSelectedSale({...selectedSale, adminNotes: e.target.value})}
                  ></textarea>
                  <div className="text-end mt-2">
                    <button className="btn btn-warning btn-sm fw-bold px-4" onClick={() => saveAdminNote(selectedSale.id, 'sale', selectedSale.adminNotes || "")}>
                      <i className="bi bi-save me-1"></i> Lưu ghi chú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRental && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.55)", zIndex: 2000 }} onClick={() => setSelectedRental(null)}>
              <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: "min(900px, calc(100vw - 2rem))", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="text-muted small">Hợp đồng thuê</div>
                    <h4 className="fw-bold mb-1">RT-#{selectedRental.id}</h4>
                    <span className="badge bg-info text-dark">Thời hạn: {new Date(selectedRental.startDate).toLocaleDateString()} - {new Date(selectedRental.endDate).toLocaleDateString()}</span>
                  </div>
                  <button className="btn btn-light" onClick={() => setSelectedRental(null)}>Đóng</button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100 bg-light">
                      <div className="fw-bold mb-2">Thông tin khách thuê</div>
                      <div className="fw-semibold">{selectedRental.user?.companyName || selectedRental.user?.name || "N/A"}</div>
                      <div className="text-muted small">{selectedRental.user?.email} • {selectedRental.user?.phone || "—"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100 bg-primary bg-opacity-10 text-primary">
                      <div className="fw-bold mb-2 text-dark">Tài chính hợp đồng</div>
                      <div className="d-flex justify-content-between small"><span>Tiền cọc:</span> <b>{(selectedRental.deposit || 0).toLocaleString()} đ</b></div>
                      <div className="d-flex justify-content-between fs-4 fw-bold"><span>CƯỚC THUÊ:</span> <b>{(selectedRental.totalRental || 0).toLocaleString()} đ</b></div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Thiết bị cho thuê</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Đơn giá thuê/ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRental.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold">{item.product?.name || "Sản phẩm không xác định"}</td>
                          <td className="text-center fw-bold">{item.quantity}</td>
                          <td className="text-end">{(item.price || 0).toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ghi chú nội bộ */}
                <div className="mt-4 p-3 border rounded-3 bg-warning bg-opacity-10 border-warning border-opacity-25">
                  <label className="form-label fw-bold text-dark"><i className="bi bi-journal-text me-2"></i>Ghi chú nội bộ Hợp đồng (Chỉ nhân viên thấy)</label>
                  <textarea 
                    className="form-control border-warning border-opacity-50" 
                    rows={3} 
                    placeholder="Ghi chú về tình trạng máy mượn, cọc, VAT..."
                    defaultValue={selectedRental.adminNotes || ""}
                    onBlur={(e) => setSelectedRental({...selectedRental, adminNotes: e.target.value})}
                  ></textarea>
                  <div className="text-end mt-2">
                    <button className="btn btn-info btn-sm fw-bold px-4 text-white" onClick={() => saveAdminNote(selectedRental.id, 'rental', selectedRental.adminNotes || "")}>
                      <i className="bi bi-save me-1"></i> Lưu ghi chú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal TRẢ MÁY */}
          {returningRental && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.6)", zIndex: 3000 }}>
              <div className="bg-white rounded-4 shadow-lg p-4 slide-up" style={{ width: "min(500px, 95vw)" }}>
                <h4 className="fw-bold mb-3 text-dark"><i className="bi bi-check2-square text-primary me-2"></i>Quy trình Trả Máy & Hoàn Tất</h4>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Ngày trả thực thực tế</label>
                  <input type="date" className="form-control" value={returningRental.returnDate} onChange={e => setReturningRental({...returningRental, returnDate: e.target.value})} />
                </div>

                <div className="card bg-light border-0 mb-4 p-3 shadow-sm">
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="damageSwitch" checked={returningRental.hasIssue} onChange={e => setReturningRental({...returningRental, hasIssue: e.target.checked})}/>
                    <label className="form-check-label fw-bold text-danger" htmlFor="damageSwitch">Có xảy ra sự cố / hỏng hóc máy?</label>
                  </div>
                  
                  {returningRental.hasIssue && (
                    <div className="animate__animated animate__fadeIn">
                      <div className="mb-2">
                        <label className="form-label small fw-bold text-muted">Thiết bị gặp sự cố</label>
                        <select className="form-select form-select-sm" value={returningRental.issueProductId} onChange={e => setReturningRental({...returningRental, issueProductId: parseInt(e.target.value)})}>
                          {returningRental.items?.map((it: any) => (
                            <option key={it.productId} value={it.productId}>{it.product?.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label small fw-bold text-muted">Mô tả chi tiết hỏng hóc</label>
                        <textarea className="form-control" rows={3} placeholder="Ví dụ: Màn hình bị vỡ, không lên nguồn..." value={returningRental.returnNote} onChange={e => setReturningRental({...returningRental, returnNote: e.target.value})}></textarea>
                      </div>
                    </div>
                  )}
                  {!returningRental.hasIssue && (
                    <div className="mb-0">
                      <label className="form-label small fw-bold">Ghi nhận tình trạng (Optional)</label>
                      <input type="text" className="form-control form-control-sm" placeholder="Ví dụ: Máy tốt, đã vệ sinh..." value={returningRental.returnNote} onChange={e => setReturningRental({...returningRental, returnNote: e.target.value})} />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-light flex-fill fw-bold" onClick={() => setReturningRental(null)}>Hủy bỏ</button>
                  <button className="btn btn-primary flex-fill fw-bold" onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = '<span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...';
                    
                    try {
                        const notes = returningRental.hasIssue ? `[SỰ CỐ] ${returningRental.returnNote}` : returningRental.returnNote;
                        const res = await fetch("/api/admin/rentals", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: returningRental.id, status: "RETURNED", returnDate: returningRental.returnDate, returnNote: notes })
                        });
                        
                        if (!res.ok) throw new Error("Lỗi cập nhật hợp đồng");

                                if (returningRental.hasIssue) {
                                  await fetch("/api/admin/warranties", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ userId: returningRental.userId, productId: returningRental.issueProductId, issueDetail: returningRental.returnNote })
                                  });
                                  await loadWarranties();
                                }
                                
                                await loadRentals();
                                await loadStats();
                                setReturningRental(null);
                        alert("Đã xác nhận trả máy thành công!");
                    } catch (err: any) {
                        alert("Lỗi: " + err.message);
                        btn.disabled = false;
                        btn.innerHTML = 'Xác nhận Trả Máy & Hoàn Tất';
                    }
                  }}>Xác nhận Trả Máy & Hoàn Tất</button>
                </div>
              </div>
            </div>
          )}
            </div>

            {/* MINIMAL ADMIN FOOTER */}
            <footer className="mt-auto pt-5 pb-5 border-top border-light text-center flex-shrink-0">
               <p className="small text-muted mb-0 opacity-75 fw-bold">© 2026 Bản quyền thuộc về Hệ thống Quản trị ABC XYZ</p>
               <div className="x-small text-muted mt-1 opacity-50"><i className="bi bi-shield-lock-fill me-1"></i>Hệ thống bảo mật 256-bit chuẩn Doanh nghiệp</div>
            </footer>
            {/* SAFE SCROLLING AREA */}
            <div className="py-4"></div>
         </div>
      </div>
    </div>
  );
}
