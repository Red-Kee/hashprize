import { PrismaClient, Account, Drawing } from '@prisma/client'

//const prisma = new PrismaClient();
const simulatedAccounts: Account[] = [
    {"id":1, "address":"0.0.example1", "balance":2018, dateStakeActive:"true"},
    {"id":2, "address":"0.0.example2", "balance":404, dateStakeActive:"true"},
    {"id":3, "address":"0.0.example3", "balance":1000, dateStakeActive:"true"}
];
const simulatedDrawings: Drawing[] = [
    {"id":1, "date":"Wed, 21 Aug 2024 03:59:00 GMT", "address":"0.0.example2", "prize":777}
];

export async function addAccount(newAddress: string, newBalance?: number): Promise<Account> {
  const account: Account = {"id":(simulatedAccounts.length+1), "address":newAddress, "balance":newBalance?Math.floor(newBalance):0, "dateStakeActive":"true"};
  const existingIndex = simulatedAccounts.findIndex((acc) => newAddress === acc.address);
  if (existingIndex >= 0) {
    simulatedAccounts[existingIndex] = account; 
  } else {
    simulatedAccounts.push(account);
  }
  return account;
}

export async function addDrawing(winAddress: string, prizeAmount: number, date ?: string) {
  if (!date) {
    date = new Date().toUTCString();
  }
  const drawing: Drawing = {"id":(simulatedDrawings.length+1), "date":date, "address":winAddress, "prize":777};
  return drawing;
}

export async function setAccountBalance(accountAddress: string, newBalance: number): Promise<Account|undefined> {
  const account = simulatedAccounts.find(i => i.address === accountAddress);
  if (account) {
    account.balance = Math.floor(newBalance);
  }
  return account;
}

export async function getTotalAccounts(): Promise<number> {
    return simulatedAccounts.length;
}

export async function getTotalAccountBalances(): Promise<number> {
    return simulatedAccounts.reduce((n, {balance}) => n + balance, 0);
}

export async function getLastDrawing(): Promise<Drawing> {
    return simulatedDrawings[simulatedDrawings.length - 1];
}

export async function getWinner(winningNumber: number): Promise<Account|null> {
  let sum: number = 0;
  const totalAccounts = simulatedAccounts.length;
  console.log('totalAccounts:', totalAccounts);
  let winIndex = -1;
  for (let i=0; i < totalAccounts; i++) {
    sum += simulatedAccounts[i].balance;
    if(sum >= winningNumber) {
        winIndex = i;
        break;
    }
  }
  if (winIndex >= 0) {
    const winAccount = simulatedAccounts[winIndex];
    console.log("Winning account:", winAccount.address);
    return winAccount;
  } else {
    return null;
  }
}
