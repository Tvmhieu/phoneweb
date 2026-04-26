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
      email: 'admin@phonestore.com.vn',
      password: 'adminpassword',
      name: 'Quản trị viên PhoneStore',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'manager@phonestore.com.vn',
      password: 'managerpassword',
      name: 'Quản lý cửa hàng',
      role: 'MANAGER',
    },
  });

  await prisma.user.create({
    data: {
      email: '1@1',
      password: '1',
      name: 'Super Admin Test',
      role: 'ADMIN',
    },
  });

  // 2. Tạo 1 số Điện thoại mẫu
  await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 15 Pro Max 256GB Chính hãng VN/A',
        brand: 'Apple',
        category: 'IPHONE',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
        stock: 50,
        price: 30990000,
        warrantyMonths: 12,
      },
      {
        name: 'Samsung Galaxy S24 Ultra 12GB/256GB',
        brand: 'Samsung',
        category: 'SAMSUNG',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
        stock: 35,
        price: 28490000,
        warrantyMonths: 12,
      },
      {
        name: 'Xiaomi 14 Ultra 5G (16GB/512GB)',
        brand: 'Xiaomi',
        category: 'XIAOMI',
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351af963?auto=format&fit=crop&q=80&w=800',
        stock: 20,
        price: 22990000,
        warrantyMonths: 18,
      },
      {
        name: 'Oppo Find X7 Ultra 5G',
        brand: 'Oppo',
        category: 'OPPO',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
        stock: 15,
        price: 19990000,
        warrantyMonths: 12,
      },
      {
        name: 'iPad Pro M4 11-inch (2024) WiFi 256GB',
        brand: 'Apple',
        category: 'TABLET',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
        stock: 25,
        price: 26990000,
        warrantyMonths: 12,
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
        password: 'password123',
        name: 'Nguyễn Văn An',
        phone: '0901234567',
        address: '123 Lê Lợi, Quận 1, TP.HCM',
        role: 'CUSTOMER',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'khachhang2@gmail.com',
        password: 'password123',
        name: 'Trần Thị Bình',
        phone: '0987654321',
        address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        role: 'CUSTOMER',
      },
    });

    // 4. Tạo Đơn bán hàng (Sale Orders)
    await prisma.saleOrder.create({
      data: {
        userId: customer1.id,
        total: products[0].price * 1,
        status: 'DELIVERED',
        shippingAddress: '123 Lê Lợi, Quận 1, TP.HCM',
        adminNotes: 'Khách hàng thanh toán qua thẻ, giao hàng gấp',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
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
        shippingAddress: '456 Nguyễn Trãi, Hà Nội',
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

    // 4.5. Massive Historical Data for Revenue Chart
    console.log('Đang tạo dữ liệu lịch sử doanh thu cho 6 tháng gần nhất...');
    for (let i = 0; i < 6; i++) {
        const monthsAgo = i;
        const baseDate = new Date();
        baseDate.setMonth(baseDate.getMonth() - monthsAgo);

        // Tạo 5-8 đơn mỗi tháng cho đa dạng
        const ordersPerMonth = Math.floor(Math.random() * 4) + 5;
        for (let j = 0; j < ordersPerMonth; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomQty = Math.floor(Math.random() * 2) + 1;
            const orderDate = new Date(baseDate);
            orderDate.setDate(Math.floor(Math.random() * 28) + 1);

            await prisma.saleOrder.create({
                data: {
                    userId: j % 2 === 0 ? customer1.id : customer2.id,
                    total: randomProduct.price * randomQty,
                    status: 'DELIVERED',
                    shippingAddress: `Địa chỉ mẫu ${j + 1}, Khu vực ${i + 1}`,
                    createdAt: orderDate,
                    items: {
                        create: [{
                            productId: randomProduct.id,
                            quantity: randomQty,
                            price: randomProduct.price
                        }]
                    }
                }
            });
        }
    }

    // 5. Tạo Yêu cầu bảo hành (Warranty Claims)
    await prisma.warrantyClaim.create({
      data: {
        userId: customer1.id,
        productId: products[0].id,
        issueDetail: 'Màn hình bị sọc xanh sau khi cập nhật iOS mới',
        status: 'PENDING',
      }
    });

    await prisma.warrantyClaim.create({
      data: {
        userId: customer2.id,
        productId: products[4].id,
        issueDetail: 'Sạc không vào điện, có mùi khét nhẹ ở cổng sạc',
        resolution: 'Đổi mới combo sạc cáp và kiểm tra chân sạc máy',
        status: 'DONE',
        techNote: 'Vệ sinh máy và bàn giao cho khách',
      }
    });
  }

  console.log('Bơm dữ liệu thành công! Đã chuyển đổi sang hệ thống bán lẻ Điện thoại di động PhoneStore.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
