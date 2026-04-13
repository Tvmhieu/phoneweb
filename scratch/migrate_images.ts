import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const NEW_PRODUCTS_DIR = path.join(UPLOADS_DIR, 'products');

async function main() {
  console.log('--- Bắt đầu tối ưu hóa thư mục ảnh ---');

  // 1. Đảm bảo thư mục public/uploads/products tồn tại
  if (!fs.existsSync(NEW_PRODUCTS_DIR)) {
    console.log(`Tạo thư mục mới: ${NEW_PRODUCTS_DIR}`);
    fs.mkdirSync(NEW_PRODUCTS_DIR, { recursive: true });
  }

  // 2. Lấy danh sách các thư mục cũ product_* trong uploads
  const oldFolders = fs.readdirSync(UPLOADS_DIR).filter(f => f.startsWith('product_'));

  for (const oldFolder of oldFolders) {
    const productId = oldFolder.replace('product_', '');
    const oldPath = path.join(UPLOADS_DIR, oldFolder);
    const newPath = path.join(NEW_PRODUCTS_DIR, productId);

    console.log(`Đang xử lý thư mục: ${oldFolder} -> products/${productId}`);

    // Kiểm tra xem đã tồn tại thư mục đích chưa
    if (fs.existsSync(newPath)) {
      console.log(`  Cảnh báo: Thư mục ${newPath} đã tồn tại. Đang gộp file...`);
      const files = fs.readdirSync(oldPath);
      for (const file of files) {
        fs.renameSync(path.join(oldPath, file), path.join(newPath, file));
      }
      fs.rmdirSync(oldPath);
    } else {
      fs.renameSync(oldPath, newPath);
    }

    // 3. Cập nhật Database
    const oldPrefix = `/uploads/${oldFolder}/`;
    const newPrefix = `/uploads/products/${productId}/`;

    // Cập nhật Product.imageUrl
    const productsToUpdate = await prisma.product.findMany({
      where: { imageUrl: { startsWith: oldPrefix } }
    });

    for (const prod of productsToUpdate) {
      if (prod.imageUrl) {
        const newUrl = prod.imageUrl.replace(oldPrefix, newPrefix);
        await prisma.product.update({
          where: { id: prod.id },
          data: { imageUrl: newUrl }
        });
        console.log(`  Đã cập nhật imageUrl cho sản phẩm ID ${prod.id}`);
      }
    }

    // Cập nhật ProductImage.url
    const imagesToUpdate = await prisma.productImage.findMany({
      where: { url: { startsWith: oldPrefix } }
    });

    for (const img of imagesToUpdate) {
      const newUrl = img.url.replace(oldPrefix, newPrefix);
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl }
      });
      console.log(`  Đã cập nhật url cho ProductImage ID ${img.id}`);
    }
  }

  console.log('--- Hoàn tất tối ưu hóa ---');
}

main()
  .catch(e => {
    console.error('Lỗi khi thực hiện migrate:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
