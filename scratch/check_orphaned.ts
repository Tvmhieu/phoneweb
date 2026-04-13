import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true } });
  const productIds = products.map(p => p.id.toString());
  
  const productsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  if (fs.existsSync(productsDir)) {
    const folders = fs.readdirSync(productsDir);
    for (const folder of folders) {
      if (folder !== 'temp' && !productIds.includes(folder)) {
        console.log(`Thu mục dư thừa (không có trong DB): products/${folder}`);
        // Tạm thời chỉ liệt kê, nếu chắc chắn có thể xóa:
        // fs.rmSync(path.join(productsDir, folder), { recursive: true, force: true });
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
