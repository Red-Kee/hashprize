import { PrismaClient, Prisma } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Environment-aware Prisma client configuration
const prismaConfig: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as Prisma.LogLevel[]
    : ['error'] as Prisma.LogLevel[],
}

// For production, make sure we're using the correct DATABASE_URL for production
if (process.env.NODE_ENV === 'production') {
  // Verify we have the correct DATABASE_URL for production
  if (!process.env.DATABASE_URL?.includes('sqlserver://')) {
    console.warn('Warning: Production environment should use SQL Server DATABASE_URL')
  }
  console.log('🔗 Using Azure SQL Database for production')
} else {
  console.log('🔧 Using SQLite for development')
}

// Prevent multiple instances during development
const prisma = globalThis.__prisma || new PrismaClient(prismaConfig)

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export { prisma }
export default prisma
