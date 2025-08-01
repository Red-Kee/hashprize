// Mock database actions for browser compatibility
// Replace with actual API calls to your backend

interface MockAccount {
  id: number;
  address: string;
  dateStakeActive: Date;
  balance: number;
  isActive: boolean;
  lastUpdated: Date;
  drawingsParticipated: number;
}

interface MockDrawing {
  id: number;
  date: Date;
  winnerAddress: string;
  winnerBalance: number;
  totalPoolSize: number;
  totalParticipants: number;
  randomNumber: number;
  prize: number;
}

// Mock data
let mockAccounts: MockAccount[] = [
  {
    id: 1,
    address: "0.0.example1",
    dateStakeActive: new Date("2024-08-15T10:00:00Z"),
    balance: 2018.5432,
    isActive: true,
    lastUpdated: new Date(),
    drawingsParticipated: 0
  },
  {
    id: 2,
    address: "0.0.example2", 
    dateStakeActive: new Date("2024-08-16T14:30:00Z"),
    balance: 404.1234,
    isActive: true,
    lastUpdated: new Date(),
    drawingsParticipated: 0
  },
  {
    id: 3,
    address: "0.0.example3",
    dateStakeActive: new Date("2024-08-17T09:15:00Z"),
    balance: 1000.9876,
    isActive: true,
    lastUpdated: new Date(),
    drawingsParticipated: 0
  }
];

let mockDrawings: MockDrawing[] = [
  {
    id: 1,
    date: new Date("2024-08-21T03:59:00Z"),
    winnerAddress: "0.0.example2",
    winnerBalance: 404.1234,
    totalPoolSize: 3423.6542,
    totalParticipants: 3,
    randomNumber: 2020,
    prize: 777.5
  }
];

export async function addAccount(newAddress: string, newBalance?: number): Promise<MockAccount> {
  const account: MockAccount = {
    id: mockAccounts.length + 1,
    address: newAddress,
    dateStakeActive: new Date(),
    balance: newBalance ? parseFloat(newBalance.toFixed(4)) : 0,
    isActive: true,
    lastUpdated: new Date(),
    drawingsParticipated: 0
  };
  
  const existingIndex = mockAccounts.findIndex(acc => acc.address === newAddress);
  if (existingIndex >= 0) {
    mockAccounts[existingIndex] = { ...mockAccounts[existingIndex], ...account };
    return mockAccounts[existingIndex];
  } else {
    mockAccounts.push(account);
    return account;
  }
}

export async function getTotalAccounts(): Promise<number> {
  return mockAccounts.filter(acc => acc.isActive).length;
}

export async function getTotalAccountBalances(): Promise<number> {
  return mockAccounts
    .filter(acc => acc.isActive)
    .reduce((sum, acc) => sum + acc.balance, 0);
}

export async function getAllAccounts(): Promise<MockAccount[]> {
  return mockAccounts.filter(acc => acc.isActive);
}

export async function getLastDrawing(): Promise<MockDrawing> {
  if (mockDrawings.length === 0) {
    throw new Error('No drawings found');
  }
  return mockDrawings[mockDrawings.length - 1];
}

export async function getWinner(winningNumber: number): Promise<MockAccount | null> {
  const accounts = mockAccounts.filter(acc => acc.isActive);
  
  let sum = 0;
  for (const account of accounts) {
    sum += account.balance;
    if (sum >= winningNumber) {
      console.log(`Winning account is ${account.address} for number ${winningNumber}`);
      return account;
    }
  }
  return null;
}

export async function addDrawing(
  winnerAddress: string,
  winnerBalance: number,
  totalPoolSize: number,
  totalParticipants: number,
  randomNumber: number,
  prizeAmount: number,
  date?: Date
): Promise<MockDrawing> {
  const drawing: MockDrawing = {
    id: mockDrawings.length + 1,
    date: date || new Date(),
    winnerAddress,
    winnerBalance: parseFloat(winnerBalance.toFixed(4)),
    totalPoolSize: parseFloat(totalPoolSize.toFixed(4)),
    totalParticipants,
    randomNumber,
    prize: parseFloat(prizeAmount.toFixed(4))
  };
  
  mockDrawings.push(drawing);
  
  // Increment participation for all active accounts
  mockAccounts = mockAccounts.map(acc => 
    acc.isActive ? { ...acc, drawingsParticipated: acc.drawingsParticipated + 1 } : acc
  );
  
  return drawing;
}
