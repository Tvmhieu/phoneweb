import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu bơm dữ liệu vào Database...');

  // Xóa dữ liệu các bảng liên quan trước để tránh lỗi khóa ngoại
  await prisma.saleOrderItem.deleteMany();
  await prisma.saleOrder.deleteMany();
  await prisma.warrantyClaim.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  // Sau đó mới xóa Product và User
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Tạo Tài khoản Admin
  await prisma.user.create({
    data: {
      email: 'admin@nhanviet.com',
      password: 'hashed_password_mock',
      name: 'Giám Đốc Nhân Việt',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@pnl.com',
      password: 'admin123',
      name: 'Quản trị viên PNL',
      role: 'ADMIN',
    },
  });

  // 2. Tạo 1 số Thiết bị mẫu (Sản phẩm Bàn và Thuê)
  await prisma.product.createMany({
    data: [
      {
        name: 'Máy Chủ Dell PowerEdge R440',
        brand: 'Dell',
        category: 'SERVER',
        imageUrl: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Dell+Server',
        stock: 5,
        price: 45000000,
        warrantyMonths: 36,
      },
      {
        name: 'Máy In HP LaserJet Pro',
        brand: 'HP',
        category: 'PRINTER',
        imageUrl: 'https://placehold.co/600x400/222222/FFFFFF/png?text=HP+Printer',
        stock: 12,
        price: 4200000,
        warrantyMonths: 12,
      },
      {
        name: 'Switch Cisco Catalyst 2960',
        brand: 'Cisco',
        category: 'NETWORK',
        imageUrl: 'https://placehold.co/600x400/333333/FFFFFF/png?text=Cisco+Switch',
        stock: 8,
        price: 9500000,
        warrantyMonths: 24,
      },
      {
        name: 'Máy POS Quản Lý Bán Hàng Sunmi',
        brand: 'Sunmi',
        category: 'POS',
        imageUrl: 'https://placehold.co/600x400/444444/FFFFFF/png?text=POS+Sunmi',
        stock: 15,
        price: 12000000,
        warrantyMonths: 12,
      },
      {
        name: 'Laptop ThinkPad T14s',
        brand: 'Lenovo',
        category: 'LAPTOP',
        imageUrl: 'https://placehold.co/600x400/555555/FFFFFF/png?text=ThinkPad',
        stock: 20,
        price: 28000000,
        warrantyMonths: 24,
      }
    ],
  });

  // Lấy danh sách sản phẩm vừa tạo
  const products = await prisma.product.findMany();
  
  if (products.length > 0) {
    // 3. Tạo một số Khách hàng
    const customer1 = await prisma.user.create({
      data: {
        email: 'khachhang1@gmail.com',
        password: 'hashed_password_mock',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Lê Lợi, TP.HCM',
        role: 'CUSTOMER',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'khachhang2@gmail.com',
        password: 'hashed_password_mock',
        name: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Nguyễn Trãi, Hà Nội',
        role: 'CUSTOMER',
      },
    });

    // 4. Tạo Đơn bán hàng (Sale Orders)
    await prisma.saleOrder.create({
      data: {
        userId: customer1.id,
        total: products[0].price * 2,
        status: 'COMPLETED',
        adminNotes: 'Khách hàng VIP, giao hàng nhanh',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: products[0].price,
            }
          ]
        }
      }
    });

    await prisma.saleOrder.create({
      data: {
        userId: customer2.id,
        total: products[1].price * 1 + products[2].price * 1,
        status: 'PENDING',
        items: {
          create: [
            {
              productId: products[1].id,
              quantity: 1,
              price: products[1].price,
            },
            {
              productId: products[2].id,
              quantity: 1,
              price: products[2].price,
            }
          ]
        }
      }
    });

    await prisma.saleOrder.create({
      data: {
        userId: customer1.id,
        total: products[4].price * 1,
        status: 'SHIPPING',
        adminNotes: 'Đang giao hàng qua Giao Hàng Tiết Kiệm',
        items: {
          create: [
            {
              productId: products[4].id,
              quantity: 1,
              price: products[4].price,
            }
          ]
        }
      }
    });

    await prisma.saleOrder.create({
      data: {
        userId: customer2.id,
        total: products[0].price * 1 + products[3].price * 2,
        status: 'CANCELLED',
        adminNotes: 'Khách hàng đổi ý, yêu cầu hủy đơn',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price,
            },
            {
              productId: products[3].id,
              quantity: 2,
              price: products[3].price,
            }
          ]
        }
      }
    });

    await prisma.saleOrder.create({
      data: {
        userId: customer1.id,
        total: products[2].price * 3,
        status: 'PROCESSING',
        adminNotes: 'Đơn hàng số lượng lớn, cần kiểm tra kỹ trước khi xuất',
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 3,
              price: products[2].price,
            }
          ]
        }
      }
    });

    // 5. Tạo Yêu cầu bảo hành (Warranty Claims)
    await prisma.warrantyClaim.create({
      data: {
        userId: customer1.id,
        productId: products[3].id,
        issueDetail: 'Máy thỉnh thoảng tự khởi động lại khi đang sử dụng',
        status: 'PENDING',
      }
    });

    await prisma.warrantyClaim.create({
      data: {
        userId: customer2.id,
        productId: products[4].id,
        issueDetail: 'Màn hình bị sọc viền ở góc trái',
        resolution: 'Đổi màn hình mới theo chính sách BH',
        status: 'PROCESSING',
        techNote: 'Chờ linh kiện từ hãng gửi về',
      }
    });
  }

  console.log('Bơm dữ liệu thành công! Đã thêm Admin, Thiết bị, Khách hàng, Đơn mua hàng và Bảo hành vào Hệ thống.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
