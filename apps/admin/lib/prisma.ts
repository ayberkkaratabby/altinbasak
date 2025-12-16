import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of PrismaClient in development
declare const global: {
  prisma?: PrismaClient;
};

// Create Prisma Client with connection pooling for Vercel
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
export { prisma };

