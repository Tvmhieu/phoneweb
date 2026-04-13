import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { id: 'asc' }
  });
  fs.writeFileSync('scratch/full_paths.json', JSON.stringify(products, null, 2), 'utf8');
}

main().finally(() => prisma.$disconnect());
