import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany({
    select: { id: true, productId: true, url: true }
  });
  fs.writeFileSync('scratch/product_images.json', JSON.stringify(images, null, 2), 'utf8');
}

main().finally(() => prisma.$disconnect());
