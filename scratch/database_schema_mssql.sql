-- Bảng User (Người dùng)
CREATE TABLE [User] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,
    [name] NVARCHAR(255) NULL,
    [phone] NVARCHAR(50) NULL,
    [address] NVARCHAR(1000) NULL,
    [role] NVARCHAR(50) NOT NULL DEFAULT 'CUSTOMER', -- "ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [isDeleted] BIT NOT NULL DEFAULT 0
);

-- Bảng Product (Sản phẩm)
CREATE TABLE [Product] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [brand] NVARCHAR(255) NOT NULL,
    [category] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [imageUrl] NVARCHAR(MAX) NULL,
    [stock] INT NOT NULL DEFAULT 0,
    [price] INT NOT NULL,
    [warrantyMonths] INT NOT NULL DEFAULT 12,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [isDeleted] BIT NOT NULL DEFAULT 0,
    [isVisible] BIT NOT NULL DEFAULT 1
);

-- Bảng ProductImage (Hình ảnh sản phẩm)
CREATE TABLE [ProductImage] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [url] NVARCHAR(MAX) NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [FK_ProductImage_Product] FOREIGN KEY ([productId]) REFERENCES [Product]([id]) ON DELETE CASCADE
);

-- Bảng Promotion (Khuyến mãi)
CREATE TABLE [Promotion] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [code] NVARCHAR(50) NOT NULL UNIQUE,
    [discount] FLOAT NOT NULL,
    [type] NVARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
    [validUntil] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Bảng SaleOrder (Đơn hàng)
CREATE TABLE [SaleOrder] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [userId] INT NOT NULL,
    [total] FLOAT NOT NULL,
    [status] NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    [shippingAddress] NVARCHAR(1000) NULL,
    [adminNotes] NVARCHAR(1000) NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_SaleOrder_User] FOREIGN KEY ([userId]) REFERENCES [User]([id])
);

-- Bảng SaleOrderItem (Chi tiết đơn hàng)
CREATE TABLE [SaleOrderItem] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [orderId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] FLOAT NOT NULL,
    CONSTRAINT [FK_SaleOrderItem_SaleOrder] FOREIGN KEY ([orderId]) REFERENCES [SaleOrder]([id]),
    CONSTRAINT [FK_SaleOrderItem_Product] FOREIGN KEY ([productId]) REFERENCES [Product]([id])
);

-- Bảng WarrantyClaim (Yêu cầu bảo hành)
CREATE TABLE [WarrantyClaim] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [userId] INT NOT NULL,
    [productId] INT NOT NULL,
    [issueDetail] NVARCHAR(MAX) NOT NULL,
    [resolution] NVARCHAR(MAX) NULL,
    [techNote] NVARCHAR(MAX) NULL,
    [status] NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_WarrantyClaim_User] FOREIGN KEY ([userId]) REFERENCES [User]([id]),
    CONSTRAINT [FK_WarrantyClaim_Product] FOREIGN KEY ([productId]) REFERENCES [Product]([id])
);

-- Bảng ContactMessage (Tin nhắn liên hệ)
CREATE TABLE [ContactMessage] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [phone] NVARCHAR(50) NULL,
    [message] NVARCHAR(MAX) NOT NULL,
    [isRead] BIT NOT NULL DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Bảng Cart (Giỏ hàng)
CREATE TABLE [Cart] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [userId] INT NOT NULL UNIQUE,
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_Cart_User] FOREIGN KEY ([userId]) REFERENCES [User]([id])
);

-- Bảng CartItem (Chi tiết giỏ hàng)
CREATE TABLE [CartItem] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [cartId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    CONSTRAINT [FK_CartItem_Cart] FOREIGN KEY ([cartId]) REFERENCES [Cart]([id]),
    CONSTRAINT [FK_CartItem_Product] FOREIGN KEY ([productId]) REFERENCES [Product]([id])
);
