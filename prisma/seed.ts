import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu làm sạch database cũ...');
  await prisma.saleOrderItem.deleteMany();
  await prisma.saleOrder.deleteMany();
  await prisma.warrantyClaim.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Đang tạo các tài khoản quản trị...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@phonestore.com.vn',
      password: 'adminpassword',
      name: 'Quản trị viên PhoneStore',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@phonestore.com.vn',
      password: 'managerpassword',
      name: 'Nguyễn Văn Quản Lý',
      role: 'MANAGER',
    },
  });

  const testAdmin = await prisma.user.create({
    data: {
      email: '1@1',
      password: '1',
      name: 'Test Admin',
      role: 'ADMIN',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'khachhang1@gmail.com',
      password: 'password123',
      name: 'Trần Thị Thu Hà',
      role: 'CUSTOMER',
    },
  });

  console.log('Đang tạo danh sách sản phẩm Smartphone & Tablet mới...');

  const productsData = [
    // APPLE IPHONE
    {
      name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên',
      brand: 'Apple',
      category: 'IPHONE',
      price: 34990000,
      stock: 15,
      warrantyMonths: 12,
      description: 'Chip Apple A17 Pro 3nm\nRAM 8GB, bộ nhớ 256GB\nCamera 48MP + 12MP + 12MP, zoom quang 5x\nPin 4422mAh, sạc MagSafe 15W\nMàn hình Super Retina XDR 6.7" ProMotion 120Hz\nKhung titan cấp hàng không vũ trụ, cổng USB-C USB 3.0',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'iPhone 15 Pro 128GB Titan Đen',
      brand: 'Apple',
      category: 'IPHONE',
      price: 27990000,
      stock: 20,
      warrantyMonths: 12,
      description: 'Chip Apple A17 Pro 3nm\nRAM 8GB, bộ nhớ 128GB\nCamera 48MP + 12MP + 12MP, zoom quang 3x\nPin 3274mAh, sạc nhanh USB-C 27W\nMàn hình 6.1" ProMotion 120Hz\nDynamic Island, cổng USB-C USB 3.0',
      imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'iPhone 15 Plus 256GB Hồng',
      brand: 'Apple',
      category: 'IPHONE',
      price: 24990000,
      stock: 12,
      warrantyMonths: 12,
      description: 'Chip Apple A16 Bionic\nRAM 6GB, bộ nhớ 256GB\nCamera 48MP + 12MP\nPin 4383mAh, sạc nhanh 20W\nMàn hình Super Retina XDR 6.7"\nHỗ trợ MagSafe, Dynamic Island',
      imageUrl: 'https://images.unsplash.com/photo-1695048064627-ef3933c46755?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'iPhone 15 128GB Xanh Lá',
      brand: 'Apple',
      category: 'IPHONE',
      price: 22990000,
      stock: 25,
      warrantyMonths: 12,
      description: 'Chip Apple A16 Bionic\nRAM 6GB, bộ nhớ 128GB\nCamera 48MP + 12MP\nPin 3349mAh, sạc nhanh 20W\nMàn hình 6.1" Super Retina XDR\nDynamic Island, cổng USB-C',
      imageUrl: 'https://images.unsplash.com/photo-1695048132832-73602526543b?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'iPhone 14 128GB Tím Lavender',
      brand: 'Apple',
      category: 'IPHONE',
      price: 17990000,
      stock: 8,
      warrantyMonths: 12,
      description: 'Chip Apple A15 Bionic\nRAM 6GB, bộ nhớ 128GB\nCamera 12MP + 12MP, chụp đêm tốt, Action Mode\nPin 3279mAh, sạc MagSafe 15W\nMàn hình 6.1" Super Retina XDR\nNotch, Lightning',
      imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=800'
    },

    // SAMSUNG
    {
      name: 'Samsung Galaxy S25 Ultra 256GB Titanium Black',
      brand: 'Samsung',
      category: 'SAMSUNG',
      price: 33990000,
      stock: 10,
      warrantyMonths: 12,
      description: 'Chip Snapdragon 8 Elite for Galaxy\nRAM 12GB, bộ nhớ 256GB\nCamera 200MP + 50MP + 10MP + 10MP\nPin 5000mAh, sạc nhanh 45W\nMàn hình Dynamic AMOLED 6.9" 120Hz\nTích hợp bút S Pen, Galaxy AI',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Samsung Galaxy Z Fold 6 256GB Silver Shadow',
      brand: 'Samsung',
      category: 'SAMSUNG',
      price: 44990000,
      stock: 5,
      warrantyMonths: 12,
      description: 'Chip Snapdragon 8 Gen 3\nRAM 12GB, bộ nhớ 256GB\nCamera 50MP + 10MP + 10MP\nPin 4400mAh, sạc nhanh 25W\nMàn hình trong gập 7.6" Dynamic AMOLED 120Hz\nMàn hình ngoài 6.3" 120Hz, điện thoại gập cao cấp',
      imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Samsung Galaxy A55 5G 128GB Awesome Lilac',
      brand: 'Samsung',
      category: 'SAMSUNG',
      price: 9990000,
      stock: 30,
      warrantyMonths: 12,
      description: 'Chip Exynos 1480\nRAM 8GB, bộ nhớ 128GB\nCamera 50MP + 12MP + 5MP\nPin 5000mAh, sạc nhanh 25W\nMàn hình Super AMOLED 6.6" 120Hz\nChống nước IP67',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800'
    },

    // XIAOMI
    {
      name: 'Xiaomi 14 Ultra 512GB Black',
      brand: 'Xiaomi',
      category: 'XIAOMI',
      price: 29990000,
      stock: 8,
      warrantyMonths: 12,
      description: 'Chip Snapdragon 8 Gen 3\nRAM 16GB, bộ nhớ 512GB\nCamera Leica 50MP (LYT-900) + 50MP + 50MP + 50MP\nPin 5000mAh, sạc nhanh 90W + không dây 80W\nMàn hình LTPO AMOLED 6.73" 120Hz\nCamera periscope zoom quang học 5x',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351af963?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+ 5G 256GB',
      brand: 'Xiaomi',
      category: 'XIAOMI',
      price: 9490000,
      stock: 25,
      warrantyMonths: 12,
      description: 'Chip Dimensity 7200 Ultra\nRAM 12GB, bộ nhớ 256GB\nCamera 200MP + 8MP + 2MP\nPin 5000mAh, sạc nhanh HyperCharge 120W\nMàn hình AMOLED 6.67" 120Hz\nChống nước IP68, sạc siêu nhanh',
      imageUrl: 'https://images.unsplash.com/photo-1605170439002-90f450c9515d?auto=format&fit=crop&q=80&w=800'
    },

    // OPPO
    {
      name: 'OPPO Find X8 Pro 256GB Midnight Black',
      brand: 'OPPO',
      category: 'OPPO',
      price: 28990000,
      stock: 7,
      warrantyMonths: 12,
      description: 'Chip Dimensity 9400\nRAM 16GB, bộ nhớ 256GB\nCamera Hasselblad 50MP + 50MP + 50MP\nPin 5910mAh, sạc nhanh 80W + không dây 50W\nMàn hình LTPO AMOLED 6.78" 120Hz\nChống nước IP68, AI camera hàng đầu',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
    },

    // TABLET
    {
      name: 'iPad Pro M4 11-inch (2024)',
      brand: 'Apple',
      category: 'TABLET',
      price: 26990000,
      stock: 25,
      warrantyMonths: 12,
      description: 'Chip Apple M4 cực mạnh\nMàn hình Ultra Retina XDR OLED\nSiêu mỏng chỉ 5.3mm\nHỗ trợ Apple Pencil Pro và Magic Keyboard mới',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      brand: 'Samsung',
      category: 'TABLET',
      price: 28990000,
      stock: 10,
      warrantyMonths: 12,
      description: 'Màn hình Dynamic AMOLED 2X 14.6 inch\nChip Snapdragon 8 Gen 2 for Galaxy\nBút S Pen đi kèm chống nước IP68\nDung lượng pin khủng 11.200 mAh',
      imageUrl: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        ...p,
        isVisible: true,
        isDeleted: false,
        images: {
          create: [{ url: p.imageUrl }]
        }
      }
    });
    createdProducts.push(product);
  }

  console.log('Đang tạo dữ liệu lịch sử doanh thu cho 6 tháng gần nhất...');
  const statuses = ['PAID', 'PENDING', 'CANCELLED'];
  const months = 6;
  const now = new Date();

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const orderCount = 5 + Math.floor(Math.random() * 10);

    for (let j = 0; j < orderCount; j++) {
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const status = j < 3 ? 'PENDING' : (j % 5 === 0 ? 'CANCELLED' : 'PAID');
      
      const order = await prisma.saleOrder.create({
        data: {
          userId: customer1.id,
          total: randomProduct.price || 0,
          status: status,
          shippingAddress: 'Địa chỉ nhận hàng mẫu tại Quận 1, TP.HCM',
          createdAt: date,
          items: {
            create: [
              {
                productId: randomProduct.id,
                quantity: 1,
                price: randomProduct.price || 0,
              },
            ],
          },
        },
      });

      // Tạo một số yêu cầu bảo hành cho các đơn đã thanh toán
      if (status === 'PAID' && j % 8 === 0) {
        await prisma.warrantyClaim.create({
          data: {
            userId: customer1.id,
            productId: randomProduct.id,
            issueDetail: 'Máy có hiện tượng nóng nhanh khi sạc.',
            status: 'PENDING',
          }
        });
      }
    }
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
