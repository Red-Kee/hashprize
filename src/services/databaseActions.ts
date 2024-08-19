import { PrismaClient, Account } from '@prisma/client'

const prisma = new PrismaClient()

export async function addAccount(newAddress: string, newBalance?: number): Promise<Account> {
  const account = await prisma.account.create({
    data: {
      address: newAddress,
      dateStakeActive: "TBD",
      balance: newBalance ? newBalance : 0,
    },
  })
  return account;
}

export async function addDrawing(winAddress: string, prizeAmount: number, date ?: string) {
  if (!date) {
    date = new Date().toUTCString();
  }
  const account = await prisma.drawing.create({
    data: {
      address: winAddress,
      prize: prizeAmount,
      date: date,
    },
  })
  return account;
}

export async function setAccountBalance(accountAddress: string, newBalance: number): Promise<Account> {
  const account = await prisma.account.update({
    where: {
      address: accountAddress,
    },
    data: {
      balance: newBalance,
    },
  })
  return account;
}

export async function getWinner(winningNumber: number): Promise<Account|null> {
  let i: number = 0;
  let result: number = 0;
  const totalAccounts = await prisma.account.count();
  console.log('totalAccounts:', totalAccounts);
  do {
    i++;
    const aggregations = await prisma.account.aggregate({
      _sum: {
        balance: true,
      },
      take: i,
    })
    result = aggregations._sum.balance === null ? 0 : aggregations._sum.balance;
    console.log('sum:', result);
  } while (i < totalAccounts && result < winningNumber);

  console.log("Winning position:", i)
  const winAccount = await prisma.account.findFirst({skip:i-1,})
  return winAccount;
}
