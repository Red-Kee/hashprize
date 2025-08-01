import { PrismaClient, Account, Drawing } from '@prisma/client'

const prisma = new PrismaClient();

export async function addAccount(newAddress: string, newBalance?: number): Promise<Account> {
  return await prisma.account.upsert({
    where: { address: newAddress },
    update: { 
      balance: newBalance ? parseFloat(newBalance.toFixed(4)) : 0
    },
    create: {
      address: newAddress,
      balance: newBalance ? parseFloat(newBalance.toFixed(4)) : 0,
      dateStakeActive: new Date()
    }
  });
}

export async function addDrawing(
  winnerAddress: string, 
  winnerBalance: number,
  totalPoolSize: number,
  totalParticipants: number,
  randomNumber: number,
  prizeAmount: number,
  date?: Date
): Promise<Drawing> {
  // Create the drawing
  const drawing = await prisma.drawing.create({
    data: {
      date: date || new Date(),
      winnerAddress: winnerAddress,
      winnerBalance: parseFloat(winnerBalance.toFixed(4)),
      totalPoolSize: parseFloat(totalPoolSize.toFixed(4)),
      totalParticipants: totalParticipants,
      randomNumber: randomNumber,
      prize: parseFloat(prizeAmount.toFixed(4))
    }
  });

  // Increment drawingsParticipated for all active accounts
  await incrementDrawingsParticipated();

  return drawing;
}

export async function incrementDrawingsParticipated(): Promise<void> {
  await prisma.account.updateMany({
    where: { isActive: true },
    data: {
      drawingsParticipated: {
        increment: 1
      }
    }
  });
}

export async function setAccountBalance(accountAddress: string, newBalance: number): Promise<Account | null> {
  try {
    return await prisma.account.update({
      where: { address: accountAddress },
      data: { 
        balance: parseFloat(newBalance.toFixed(4))
      }
    });
  } catch (error) {
    console.error('Account not found:', accountAddress);
    return null;
  }
}

export async function deactivateAccount(accountAddress: string): Promise<Account | null> {
  try {
    return await prisma.account.update({
      where: { address: accountAddress },
      data: { 
        isActive: false
      }
    });
  } catch (error) {
    console.error('Account not found:', accountAddress);
    return null;
  }
}

export async function getTotalAccounts(): Promise<number> {
  return await prisma.account.count({
    where: { isActive: true }
  });
}

export async function getTotalAccountBalances(): Promise<number> {
  const result = await prisma.account.aggregate({
    where: { isActive: true },
    _sum: { balance: true }
  });
  return Number(result._sum?.balance) || 0;
}

export async function getAllAccounts(): Promise<Account[]> {
  return await prisma.account.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });
}

export async function getLastDrawing(): Promise<Drawing> {
  const drawing = await prisma.drawing.findFirst({
    orderBy: { date: 'desc' }
  });
  if (!drawing) {
    throw new Error('No drawings found');
  }
  return drawing;
}

export async function getWinner(winningNumber: number): Promise<Account | null> {
  const accounts = await prisma.account.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });
  
  let sum = 0;
  for (const account of accounts) {
    sum += Number(account.balance);
    if (sum >= winningNumber) {
      console.log(`Winning account is ${account.address} for number ${winningNumber}`);
      return account;
    }
  }
  return null;
}

export async function getAccountStats(accountAddress: string): Promise<Account | null> {
  return await prisma.account.findUnique({
    where: { address: accountAddress },
    include: {
      drawingsWon: true
    }
  });
}

export async function resetDrawingsParticipated(): Promise<void> {
  await prisma.account.updateMany({
    data: {
      drawingsParticipated: 0
    }
  });
}
