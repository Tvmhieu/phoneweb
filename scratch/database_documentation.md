# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU (KHỚP 100% DIAGRAM)

Hệ thống bao gồm 9 bảng chính được thiết kế đồng bộ để quản lý việc bán hàng và bảo hành điện thoại.

---

### 1. Bảng User (Người dùng)
- Chức năng: Lưu trữ thông tin tài khoản, thông tin cá nhân và phân quyền cho người dùng.
- Các cột:
    - id: INT (PK): Khóa chính tự tăng.
    - email: NVARCHAR(255): Email đăng nhập.
    - password: NVARCHAR(255): Mật khẩu mã hóa.
    - name: NVARCHAR(255): Họ tên người dùng.
    - phone: NVARCHAR(50): Số điện thoại.
    - address: NVARCHAR(1000): Địa chỉ.
    - role: NVARCHAR(50): Vai trò (ADMIN, CUSTOMER...).
    - createdAt / updatedAt: DATETIME2: Thời gian tạo/cập nhật.
    - isDeleted: BIT: Trạng thái xóa.

---

### 2. Bảng Product (Sản phẩm)
- Chức năng: Quản lý thông tin chi tiết các sản phẩm điện thoại.
- Các cột:
    - id: INT (PK): Khóa chính tự tăng.
    - name: NVARCHAR(255): Tên sản phẩm.
    - brand: NVARCHAR(255): Thương hiệu.
    - category: NVARCHAR(255): Danh mục.
    - description: NVARCHAR(MAX): Mô tả chi tiết.
    - imageUrl: NVARCHAR(MAX): Ảnh đại diện.
    - stock: INT: Số lượng tồn kho.
    - price: INT: Giá bán.
    - warrantyMonths: INT: Số tháng bảo hành.
    - createdAt / updatedAt: DATETIME2: Thời gian tạo/cập nhật.
    - isDeleted: BIT: Trạng thái xóa.
    - isVisible: BIT: Trạng thái hiển thị trên web.

---

### 3. Bảng ProductImage (Hình ảnh sản phẩm)
- Chức năng: Lưu trữ album ảnh chi tiết cho từng sản phẩm.
- Các cột:
    - id: INT (PK): Khóa chính.
    - url: NVARCHAR(MAX): Đường dẫn ảnh.
    - productId: INT (FK): Liên kết tới bảng Product.

---

### 4. Bảng SaleOrder (Đơn hàng)
- Chức năng: Quản lý thông tin chung của các đơn hàng.
- Các cột:
    - id: INT (PK): Khóa chính, mã đơn hàng.
    - userId: INT (FK): Người mua hàng.
    - total: FLOAT: Tổng tiền đơn hàng.
    - status: NVARCHAR(50): Trạng thái (PENDING, DONE...).
    - shippingAddress: NVARCHAR(1000): Địa chỉ giao hàng.
    - adminNotes: NVARCHAR(1000): Ghi chú nội bộ.
    - createdAt / updatedAt: DATETIME2: Thời gian tạo/cập nhật.

---

### 5. Bảng SaleOrderItem (Chi tiết đơn hàng)
- Chức năng: Lưu các sản phẩm cụ thể có trong đơn hàng.
- Các cột:
    - id: INT (PK): Khóa chính.
    - orderId: INT (FK): Mã đơn hàng cha.
    - productId: INT (FK): Mã sản phẩm mua.
    - quantity: INT: Số lượng mua.
    - price: FLOAT: Giá tại thời điểm mua.

---

### 6. Bảng WarrantyClaim (Yêu cầu bảo hành)
- Chức năng: Quản lý yêu cầu sửa chữa, bảo hành sản phẩm.
- Các cột:
    - id: INT (PK): Khóa chính.
    - userId: INT (FK): Người yêu cầu.
    - productId: INT (FK): Sản phẩm cần bảo hành.
    - issueDetail: NVARCHAR(MAX): Mô tả lỗi từ khách.
    - resolution: NVARCHAR(MAX): Hướng giải quyết.
    - techNote: NVARCHAR(MAX): Ghi chú của kỹ thuật viên.
    - status: NVARCHAR(50): Trạng thái bảo hành.
    - createdAt / updatedAt: DATETIME2: Thời gian tạo/cập nhật.

---

### 7. Bảng ContactMessage (Tin nhắn liên hệ)
- Chức năng: Lưu tin nhắn từ khách hàng qua form liên hệ.
- Các cột:
    - id: INT (PK): Khóa chính.
    - name: NVARCHAR(255): Tên khách gửi.
    - email / phone: NVARCHAR: Thông tin liên lạc.
    - message: NVARCHAR(MAX): Nội dung nhắn.
    - isRead: BIT: Đã đọc hay chưa.
    - createdAt: DATETIME2: Ngày gửi.

---

### 8. Bảng Cart (Giỏ hàng)
- Chức năng: Quản lý giỏ hàng của từng cá nhân.
- Các cột:
    - id: INT (PK): Khóa chính.
    - userId: INT (FK): Chủ sở hữu giỏ hàng.
    - updatedAt: DATETIME2: Thời điểm cập nhật cuối.

---

### 9. Bảng CartItem (Chi tiết giỏ hàng)
- Chức năng: Lưu danh sách các món đồ đang nằm trong giỏ.
- Các cột:
    - id: INT (PK): Khóa chính.
    - cartId: INT (FK): Mã giỏ hàng.
    - productId: INT (FK): Mã sản phẩm.
    - quantity: INT: Số lượng.
