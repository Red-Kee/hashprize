import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create sample accounts
  const account1 = await prisma.account.upsert({
    where: { address: '0.0.example1' },
    update: {},
    create: {
      address: '0.0.example1',
      balance: 2018.5432,
      isActive: true,
      dateStakeActive: new Date('2024-08-15T10:00:00Z'),
    },
  })

  const account2 = await prisma.account.upsert({
    where: { address: '0.0.example2' },
    update: {},
    create: {
      address: '0.0.example2',
      balance: 404.1234,
      isActive: true,
      dateStakeActive: new Date('2024-08-16T14:30:00Z'),
    },
  })

  const account3 = await prisma.account.upsert({
    where: { address: '0.0.example3' },
    update: {},
    create: {
      address: '0.0.example3',
      balance: 1000.9876,
      isActive: true,
      dateStakeActive: new Date('2024-08-17T09:15:00Z'),
    },
  })

  // Create sample drawing
  const drawing1 = await prisma.drawing.upsert({
    where: { id: 1 },
    update: {},
    create: {
      date: new Date('2024-08-21T03:59:00Z'),
      winnerAddress: '0.0.example2',
      winnerBalance: 404.1234,
      totalPoolSize: 3423.6542, // Sum of all balances at time of drawing
      totalParticipants: 3,
      randomNumber: 2020,
      prize: 777.50,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Created accounts:', { account1, account2, account3 })
  console.log('Created drawing:', drawing1)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
