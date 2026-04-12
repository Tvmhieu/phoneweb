import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import ImageGallery from "@/components/ImageGallery";

// Dữ liệu sản phẩm đầy đủ thông số kỹ thuật
const fallbackProducts = [
  { 
    id: 1, name: "Máy Chủ Dell PowerEdge R440", brand: "Dell", category: "SERVER", 
    price: 45000000, rentalPricePerDay: 500000, isRentable: true, stock: 5, 
    imageUrl: "/assets/server.jpg", warrantyMonths: 36,
    specs: {
      cpu: "2x Intel Xeon Silver 4210R (10 nhân, 2.4GHz - 3.2GHz)",
      ram: "32GB DDR4-2933 ECC RDIMM (Tối đa 1TB)",
      storage: "2x 480GB SSD SATA + 2x 2TB HDD SAS 12Gbps",
      raid: "PERC H730P (2GB NV Cache) - RAID 0,1,5,6,10,50,60",
      network: "2x 1GbE LOM + 1x iDRAC9 Dedicated",
      psu: "2x 550W Hot-Plug Redundant PSU (80 Plus Platinum)",
      formFactor: "1U Rack Mount 19 inch",
      os: "Hỗ trợ Windows Server 2022, VMware ESXi 8.0, Ubuntu Server",
      management: "iDRAC9 Enterprise - Quản lý từ xa qua Web/IPMI",
      dimensions: "48.24 x 434 x 624.6 mm | 15.5 kg"
    },
    description: "Dell PowerEdge R440 là dòng máy chủ rack 1U mạnh mẽ, thiết kế tối ưu cho các doanh nghiệp vừa và nhỏ.\n\nVới khả năng hỗ trợ đến 2 bộ vi xử lý Intel Xeon Scalable thế hệ 2, R440 mang đến hiệu suất vượt trội cho các tải công việc ảo hóa (VMware, Hyper-V), cơ sở dữ liệu SQL Server, ERP, và hạ tầng IT nội bộ.\n\nHệ thống lưu trữ linh hoạt hỗ trợ tối đa 4 ổ cứng 3.5 inch hoặc 10 ổ 2.5 inch, kết hợp SSD và HDD cho hiệu suất tối ưu. RAID controller PERC H730P với 2GB NV Cache đảm bảo an toàn dữ liệu.\n\nTính năng quản lý từ xa iDRAC9 Enterprise cho phép giám sát, cấu hình và khắc phục sự cố server mà không cần đến phòng máy. Nguồn điện kép Hot-Plug đảm bảo hoạt động liên tục 24/7.\n\nBảo hành ProSupport 36 tháng tại chỗ trên toàn quốc, kỹ thuật viên Dell đến trong 4 giờ làm việc."
  },
  { 
    id: 2, name: "Máy In HP LaserJet Pro MFP M428fdw", brand: "HP", category: "PRINTER", 
    price: 4200000, rentalPricePerDay: null, isRentable: false, stock: 12, 
    imageUrl: "/assets/printer.jpg", warrantyMonths: 12,
    specs: {
      printSpeed: "Tốc độ in: 38 trang/phút (A4 đen trắng)",
      resolution: "Độ phân giải in: 1200 x 1200 dpi",
      duplex: "In 2 mặt tự động (Auto Duplex)",
      scan: "Scan phẳng + ADF 50 tờ, Scan 2 mặt tự động",
      copy: "Photocopy 38 trang/phút, phóng to/thu nhỏ 25%-400%",
      fax: "Fax modem 33.6Kbps, bộ nhớ 500 trang",
      paperTray: "Khay 1: 100 tờ đa năng | Khay 2: 250 tờ | Tổng: 350 tờ",
      connectivity: "USB 2.0, Ethernet 10/100, WiFi 802.11b/g/n, WiFi Direct",
      monthlyDuty: "Chu kỳ in hàng tháng: Tối đa 80.000 trang",
      dimensions: "381 x 412 x 334 mm | 11.6 kg"
    },
    description: "HP LaserJet Pro MFP M428fdw là máy in đa chức năng 4-in-1 (In - Scan - Copy - Fax) dành cho văn phòng chuyên nghiệp.\n\nTốc độ in nhanh 38 trang/phút giúp xử lý khối lượng công việc lớn hiệu quả. In 2 mặt tự động tiết kiệm 50% giấy. Độ phân giải 1200 x 1200 dpi cho bản in sắc nét.\n\nKhay nạp tài liệu ADF 50 tờ cho phép scan và copy hàng loạt. Scan 2 mặt tự động giảm thời gian xử lý tài liệu. Hỗ trợ scan sang Email, USB, thư mục mạng.\n\nKết nối đa dạng: WiFi, WiFi Direct, Ethernet, USB. In từ điện thoại qua ứng dụng HP Smart. Tương thích Apple AirPrint, Google Cloud Print, Mopria.\n\nBảo mật nâng cao với HP Smart Device Services, mã PIN bảo vệ bản in. Mực HP 59A (CF259A) cho 3.000 trang, HP 59X (CF259X) cho 10.000 trang."
  },
  { 
    id: 3, name: "Switch Cisco Catalyst 2960-X 24 Port", brand: "Cisco", category: "NETWORK", 
    price: 9500000, rentalPricePerDay: 80000, isRentable: true, stock: 8, 
    imageUrl: "/assets/switch.jpg", warrantyMonths: 24,
    specs: {
      ports: "24x Gigabit Ethernet (10/100/1000 Mbps) + 4x SFP 1Gbps Uplink",
      switching: "Bandwidth: 216 Gbps | Forwarding Rate: 95.23 Mpps",
      vlan: "Hỗ trợ tối đa 1.023 VLAN, 802.1Q Trunking",
      routing: "Static Routing, RIP, Inter-VLAN Routing (Layer 3 Lite)",
      security: "802.1X, Port Security, DHCP Snooping, DAI, ACL L2/L3/L4",
      qos: "8 hàng đợi phần cứng, WRR/SRR, 802.1p CoS, DSCP",
      management: "SSH, Telnet, SNMP v1/v2c/v3, RSPAN, NetFlow-Lite",
      poe: "Không PoE (Phiên bản WS-C2960X-24TS-L)",
      power: "Công suất tiêu thụ: 28W | Không quạt (Fanless)",
      dimensions: "445 x 299 x 44 mm (1U Rack) | 3.6 kg"
    },
    description: "Cisco Catalyst 2960-X là dòng switch truy cập quản lý Layer 2+ phổ biến nhất thế giới dành cho hạ tầng mạng doanh nghiệp.\n\n24 cổng Gigabit Ethernet tốc độ cao kết hợp 4 cổng SFP uplink cho phép kết nối đến server farm hoặc switch phân phối qua cáp quang. Tổng bandwidth lên đến 216 Gbps đảm bảo không nghẽn cổ chai.\n\nHỗ trợ đầy đủ VLAN, Spanning Tree (RSTP/MSTP), EtherChannel (LACP/PAgP) cho thiết kế mạng redundant và phân đoạn lưu lượng. Tính năng bảo mật 802.1X kết hợp RADIUS/TACACS+ kiểm soát truy cập mạng chặt chẽ.\n\nCisco EnergyWise quản lý điện năng thông minh, giảm chi phí vận hành. Thiết kế Fanless hoạt động hoàn toàn im lặng, phù hợp lắp đặt tại văn phòng, phòng họp.\n\nQuản lý tập trung qua Cisco DNA Center hoặc CLI truyền thống. Hỗ trợ NetFlow-Lite giám sát lưu lượng mạng real-time."
  },
  { 
    id: 4, name: "Máy POS Quản Lý Bán Hàng Sunmi T2", brand: "Sunmi", category: "POS", 
    price: 12000000, rentalPricePerDay: 150000, isRentable: true, stock: 15, 
    imageUrl: "/assets/pos.jpg", warrantyMonths: 12,
    specs: {
      display: "Màn hình chính: 15.6 inch IPS Full HD (1920 x 1080) cảm ứng đa điểm",
      displayCustomer: "Màn hình phụ khách hàng: 10.1 inch IPS HD (không cảm ứng)",
      processor: "Qualcomm Snapdragon 625 Octa-Core 2.0 GHz",
      ram: "2GB LPDDR3",
      storage: "16GB eMMC (Hỗ trợ thẻ TF mở rộng đến 64GB)",
      os: "Android 7.1 (Tùy chỉnh Sunmi OS)",
      printer: "Máy in hóa đơn nhiệt tích hợp: 80mm, tốc độ 200mm/s, cắt giấy tự động",
      connectivity: "WiFi 802.11 a/b/g/n (2.4GHz & 5GHz), Bluetooth 4.2, Ethernet 100M",
      io: "3x USB 2.0, 1x USB-C, 1x RJ45, 1x RJ11 (Cash Drawer), Audio Jack",
      dimensions: "380 x 215 x 382 mm | 4.2 kg"
    },
    description: "Sunmi T2 là giải pháp POS thông minh all-in-one tiên tiến nhất dành cho ngành F&B và bán lẻ.\n\nMàn hình kép: Màn hình chính 15.6 inch Full HD cảm ứng đa điểm mượt mà cho nhân viên thao tác, kết hợp màn hình phụ 10.1 inch hiển thị thông tin đơn hàng cho khách hàng. Giao diện trực quan, dễ sử dụng.\n\nMáy in hóa đơn nhiệt 80mm tích hợp sẵn bên trong thân máy, tốc độ in 200mm/s với chức năng cắt giấy tự động. Không cần mua thêm máy in ngoài, tiết kiệm không gian quầy thu ngân.\n\nChạy trên nền tảng Android, tương thích hàng nghìn ứng dụng quản lý bán hàng: KiotViet, Sapo, iPOS, CukCuk. Hỗ trợ quét mã QR và NFC thanh toán điện tử (MoMo, ZaloPay, VNPay).\n\nKết nối WiFi băng tần kép + Ethernet đảm bảo hoạt động ổn định ngay cả khi mạng WiFi yếu. Cổng Cash Drawer RJ11 điều khiển ngăn kéo tiền tự động."
  },
  { 
    id: 5, name: "Laptop Lenovo ThinkPad T14s Gen 5", brand: "Lenovo", category: "LAPTOP", 
    price: 28000000, rentalPricePerDay: 250000, isRentable: true, stock: 20, 
    imageUrl: "/assets/laptop.jpg", warrantyMonths: 12,
    specs: {
      cpu: "Intel Core Ultra 7 155H (16 nhân, 22 luồng, 1.4GHz - 4.8GHz, 24MB Cache)",
      ram: "16GB LPDDR5x-6400MHz (Onboard, không nâng cấp)",
      storage: "512GB SSD M.2 2242 PCIe Gen4 NVMe (Đọc 3500MB/s)",
      display: "14 inch 2.8K OLED (2880 x 1800), 120Hz, 100% DCI-P3, 400 nits, HDR True Black",
      gpu: "Intel Arc Graphics (Tích hợp trong CPU)",
      battery: "58Wh, sạc nhanh 65W USB-C (0-80% trong 60 phút)",
      keyboard: "Bàn phím TrackPoint đèn nền, TrackPad kính 120mm, nút giữa chuột",
      webcam: "FHD 1080p IR + TOF Sensor (Nhận diện khuôn mặt Windows Hello)",
      security: "Vân tay tích hợp nút nguồn, TPM 2.0, Lenovo ThinkShield",
      connectivity: "WiFi 7 (BE200), Bluetooth 5.3, 2x USB-C Thunderbolt 4, 1x USB-A 3.2, HDMI 2.1",
      weight: "1.24 kg | 316.9 x 226.2 x 16.9 mm",
      os: "Windows 11 Pro bản quyền"
    },
    description: "Lenovo ThinkPad T14s Gen 5 là laptop doanh nhân cao cấp hàng đầu thế giới, được thiết kế cho môi trường doanh nghiệp khắt khe nhất.\n\nVi xử lý Intel Core Ultra 7 155H thế hệ mới nhất với kiến trúc hybrid (Performance + Efficiency + Low Power), tích hợp NPU xử lý AI on-device. Hiệu năng đa nhiệm vượt trội cho công việc văn phòng, lập trình, thiết kế đồ họa nhẹ.\n\nMàn hình 14 inch 2.8K OLED 120Hz là điểm nhấn ấn tượng: màu sắc chuẩn 100% DCI-P3, độ tương phản vô hạn, HDR True Black cho hình ảnh sống động chân thực. Phù hợp cho người dùng xem báo cáo tài chính, thiết kế slide thuyết trình.\n\nThân máy chỉ nặng 1.24 kg và mỏng 16.9mm, vỏ nhôm tái chế bền bỉ đạt chuẩn quân sự MIL-STD-810H (chịu va đập, rung lắc, nhiệt độ khắc nghiệt). Pin 58Wh sử dụng lên đến 11-13 giờ, sạc nhanh 65W USB-C.\n\nBảo mật ThinkShield toàn diện: vân tay, nhận diện khuôn mặt IR, TPM 2.0, Privacy Screen tùy chọn. WiFi 7 tốc độ siêu nhanh, Thunderbolt 4 xuất 2 màn hình 4K cùng lúc.\n\nBảo hành Lenovo Premier Support 12 tháng tại chỗ, hỗ trợ kỹ thuật 24/7."
  },
];

// Hàm render bảng thông số kỹ thuật từ object specs
function renderSpecs(specs: Record<string, string>) {
  const labelMap: Record<string, string> = {
    cpu: "Vi xử lý (CPU)", ram: "Bộ nhớ (RAM)", storage: "Lưu trữ", 
    raid: "RAID Controller", network: "Mạng (LAN)", psu: "Nguồn điện",
    formFactor: "Kiểu dáng", os: "Hệ điều hành", management: "Quản lý từ xa",
    dimensions: "Kích thước / Trọng lượng", display: "Màn hình", gpu: "Card đồ họa",
    battery: "Pin / Sạc", keyboard: "Bàn phím", webcam: "Camera",
    security: "Bảo mật", connectivity: "Kết nối", weight: "Trọng lượng",
    printSpeed: "Tốc độ in", resolution: "Độ phân giải", duplex: "In 2 mặt",
    scan: "Scan", copy: "Photocopy", fax: "Fax", paperTray: "Khay giấy",
    monthlyDuty: "Chu kỳ in/tháng", ports: "Cổng kết nối", switching: "Hiệu năng chuyển mạch",
    vlan: "VLAN", routing: "Định tuyến", qos: "Chất lượng dịch vụ (QoS)",
    poe: "PoE", power: "Công suất", processor: "Bộ xử lý",
    displayCustomer: "Màn hình phụ (Khách)", printer: "Máy in tích hợp",
    io: "Cổng I/O"
  };

  return Object.entries(specs).map(([key, value]) => (
    <tr key={key}>
      <td className="text-muted fw-bold" style={{ width: "40%", verticalAlign: "top", padding: "10px 12px" }}>
        {labelMap[key] || key}
      </td>
      <td style={{ padding: "10px 12px" }}>{value}</td>
    </tr>
  ));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });
  } catch (error) {
    console.warn("Lỗi MS SQL, dùng fallback tĩnh");
  }

  if (!product) {
    product = fallbackProducts.find((p) => p.id === parseInt(id));
  }

  if (!product) return notFound();

  // Lấy danh sách link ảnh từ bảng ProductImage
  const allImages = product.images?.map((img: any) => img.url) || [];

  // Lấy specs từ fallback (vì DB chưa có cột specs)
  const fallback = fallbackProducts.find((p) => p.id === product.id);
  const specs = (fallback as any)?.specs || {};
  const description = product.description || (fallback as any)?.description || "";

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
        {/* CỘT TRÁI: ẢNH SẢN PHẨM (Sử dụng Gallery mới) */}
        <div className="col-md-5 mb-4">
          <ImageGallery 
            mainImage={product.imageUrl} 
            allImages={allImages} 
            productName={product.name} 
            productId={product.id} 
          />
        </div>
        
        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="col-md-7">
          <span className="badge bg-primary mb-2">{product.category}</span>
          <h2 className="fw-bold mb-2 text-dark" style={{ lineHeight: 1.3 }}>{product.name}</h2>
          
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span className="text-secondary"><i className="bi bi-building me-1"></i>Thương hiệu: <b className="text-dark">{product.brand}</b></span>
            <span className="text-secondary"><i className="bi bi-shield-check me-1"></i>Bảo hành: <b className="text-success">{product.warrantyMonths} Tháng</b></span>
            <span className="text-secondary"><i className="bi bi-box-seam me-1"></i>Kho: <b className="text-dark">{product.stock} máy</b></span>
          </div>

          <hr />
          
          {/* GIÁ BÁN */}
          <div className="mb-4 p-3 bg-white border rounded">
            <div className="text-muted small mb-1">Giá bán lẻ đề xuất</div>
            <h3 className="text-danger fw-bold mb-0" style={{ fontSize: "2rem" }}>{product.price?.toLocaleString("vi-VN")} VNĐ</h3>
            
            {product.isRentable && (
               <div className="mt-3 p-2 border-start border-4 border-warning bg-light">
                 <span className="text-muted small d-block">Giá hỗ trợ dự án / thuê mượn sự kiện:</span>
                 <strong className="text-dark">{product.rentalPricePerDay?.toLocaleString("vi-VN")} đ / Ngày</strong>
               </div>
            )}
          </div>

          {/* NÚT MUA / THUÊ */}
          <AddToCart product={product as any} />
        </div>
      </div>

      {/* ====== PHẦN DƯỚI: THÔNG SỐ KỸ THUẬT CHI TIẾT ====== */}
      {Object.keys(specs).length > 0 && (
        <div className="mt-5">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white fw-bold py-3" style={{ background: "linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%)" }}>
              <i className="bi bi-cpu me-2"></i> Thông Số Kỹ Thuật Chi Tiết — {product.name}
            </div>
            <div className="card-body p-0">
              <table className="table table-striped table-hover mb-0">
                <tbody>
                  {renderSpecs(specs)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====== MÔ TẢ SẢN PHẨM ====== */}
      {description && (
        <div className="mt-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light fw-bold py-3">
              <i className="bi bi-file-text me-2"></i> Mô tả sản phẩm
            </div>
            <div className="card-body" style={{ textAlign: "justify", lineHeight: 1.9, whiteSpace: "pre-line", color: "#495057" }}>
              {description}
            </div>
          </div>
        </div>
      )}

      {/* ====== CAM KẾT DỊCH VỤ ====== */}
      <div className="mt-4 mb-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light fw-bold py-3">
            <i className="bi bi-patch-check me-2"></i> Cam Kết Dịch Vụ B2B — Công ty Nhân Việt
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-shield-check text-success fs-3 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Hàng chính hãng</h6>
                    <small className="text-muted">Nhập khẩu trực tiếp, đầy đủ giấy tờ CO/CQ, VAT xuất hóa đơn đỏ.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-tools text-primary fs-3 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Hỗ trợ kỹ thuật 24/7</h6>
                    <small className="text-muted">Xử lý sự cố tại chỗ toàn quốc trong vòng 4-24 giờ làm việc.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-arrow-repeat text-warning fs-3 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Đổi bù thiết bị</h6>
                    <small className="text-muted">Cho phép đổi bù thiết bị tương đương nếu gặp lỗi nghiêm trọng khi thuê.</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-telephone text-danger fs-3 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Hotline tư vấn</h6>
                    <small className="text-muted">Liên hệ: <b>0909 123 456</b> (Hỗ trợ B2B doanh nghiệp, báo giá dự án)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
