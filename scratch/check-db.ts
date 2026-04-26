import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('List of users in database:');
  users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
