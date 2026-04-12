import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu bơm dữ liệu vào Database...');

  // Xóa trắng bảng Product để tránh lặp lội (nếu chạy nhiều lần)
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

  // 2. Tạo 1 số Thiết bị mẫu (Sản phẩm Bàn và Thuê)
  await prisma.product.createMany({
    data: [
      {
        name: 'Máy Chủ Dell PowerEdge R440',
        brand: 'Dell',
        category: 'SERVER',
        imageUrl: '/assets/server.jpg',
        stock: 5,
        price: 45000000,
        warrantyMonths: 36,
        isRentable: true,
        rentalPricePerDay: 500000,
      },
      {
        name: 'Máy In HP LaserJet Pro',
        brand: 'HP',
        category: 'PRINTER',
        imageUrl: '/assets/printer.jpg',
        stock: 12,
        price: 4200000,
        warrantyMonths: 12,
        isRentable: false, // Chỉ bán
      },
      {
        name: 'Switch Cisco Catalyst 2960',
        brand: 'Cisco',
        category: 'NETWORK',
        imageUrl: '/assets/switch.jpg',
        stock: 8,
        price: 9500000,
        warrantyMonths: 24,
        isRentable: true,
        rentalPricePerDay: 80000,
      },
      {
        name: 'Máy POS Quản Lý Bán Hàng Sunmi',
        brand: 'Sunmi',
        category: 'POS',
        imageUrl: '/assets/pos.jpg',
        stock: 15,
        price: 12000000,
        warrantyMonths: 12,
        isRentable: true,
        rentalPricePerDay: 150000,
      },
      {
        name: 'Laptop ThinkPad T14s',
        brand: 'Lenovo',
        category: 'LAPTOP',
        imageUrl: '/assets/laptop.jpg',
        stock: 20,
        price: 28000000,
        warrantyMonths: 24,
        isRentable: true,
        rentalPricePerDay: 250000,
      }
    ],
  });

  console.log('Bơm dữ liệu thành công! Đã thêm 1 Admin và 5 Thiết bị IT vào Hệ thống.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
