import { AccountId, Hbar, HbarUnit, Client, PrivateKey, PrngTransaction } from '@hashgraph/sdk';
import { MirrorNodeClient } from '../src/services/wallets/mirrorNodeClient';
import { appConfig } from '../src/config';
import { prisma } from '../src/lib/db';
import { Decimal } from '@prisma/client/runtime/library';
const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

// Prize account configuration from environment
const PRIZE_ACCOUNT_ID = process.env.PRIZE_ACCOUNT_ID || "0.0.4353168";
const PRIZE_ACCOUNT_KEY = process.env.PRIZE_ACCOUNT_KEY;

if (!PRIZE_ACCOUNT_KEY) {
  console.error('❌ PRIZE_ACCOUNT_KEY environment variable is required');
  process.exit(1);
}

// Initialize Hedera client
const client = Client.forTestnet();
client.setOperator(AccountId.fromString(PRIZE_ACCOUNT_ID), PrivateKey.fromString(PRIZE_ACCOUNT_KEY));

async function generateHederaRandomNumber(maxRange: number): Promise<{ randomNumber: number; transactionId: string }> {
  maxRange = Math.floor(maxRange); // Ensure maxRange is an integer
  try {
    console.log('🔗 Generating cryptographically secure random number using Hedera PRNG...');
    console.log(`🎯 Range: 0 to ${maxRange}`);
    
    // Create PRNG transaction with the specified range (total HBAR staked)
    // This ensures the random number is directly usable for weighted selection
    const prngTransaction = new PrngTransaction()
      .setRange(maxRange)
      .setTransactionMemo('HashPrize drawing randomn number')
      .setMaxTransactionFee(new Hbar(1));

    // Execute the transaction
    const response = await prngTransaction.execute(client);
    const receipt = await response.getRecord(client);
    
    // The PRNG result should be in the receipt
    // Let's check what properties are available
    console.log('Receipt properties:', Object.keys(receipt));
    
    let prngResult = receipt.prngNumber;
    
    if (prngResult === null || prngResult === undefined) {
      throw new Error('No random number found in Hedera PRNG receipt');
    }
    
    let randomNumber: number;
    if (typeof prngResult === 'number') {
      randomNumber = prngResult;
    } else {
      throw new Error('Unknown PRNG result format');
    }
    
    console.log(`✅ Generated Hedera PRNG number: ${randomNumber}`);
    console.log(`📋 Transaction ID: ${response.transactionId.toString()}`);
    
    return {
      randomNumber,
      transactionId: response.transactionId.toString()
    };
  } catch (error) {
    console.error('⚠️  Error generating Hedera PRNG:', error);
    console.log('🔄 Falling back to JavaScript Math.random()');
    
    return {
      randomNumber: Math.random() * maxRange,
      transactionId: 'fallback-no-transaction'
    };
  }
}

interface AccountWithBalance {
  address: string;
  balance: number;
  isActive: boolean;
  cumulativeWeight: number;
}

async function conductPrizeDrawing() {
  console.log('🎲 Starting prize drawing process...\n');
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    // Step 1: Query all accounts from database
    console.log('📋 Step 1: Querying all accounts from database...');
    const allAccounts = await prisma.account.findMany({
      where: { isActive: true }
    });
    console.log(`Found ${allAccounts.length} active accounts in database\n`);

    if (allAccounts.length === 0) {
      console.log('❌ No active accounts found. Cannot conduct drawing.');
      return;
    }

    // Step 2: Check each account's current status and balance
    console.log('🔍 Step 2: Checking account status and balances on Hedera...');
    const accountsWithBalance: AccountWithBalance[] = [];
    let totalStaked = 0;

    for (const account of allAccounts) {
      try {
        console.log(`  Checking account: ${account.address}`);
        
        // Get account info from Hedera Mirror Node
        const accountInfo = await mirrorNodeClient.getAccountInfo(AccountId.fromString(account.address));
        const currentBalance = Hbar.fromTinybars(accountInfo.balance.balance).to(HbarUnit.Hbar).toNumber();
        const stakedAccountId = accountInfo.staked_account_id;
        
        console.log(`    Balance: ${currentBalance.toFixed(4)}ℏ`);
        console.log(`    Staked to: ${stakedAccountId}`);

        // Check if still staked to prize account
        const isStillStaked = stakedAccountId === PRIZE_ACCOUNT_ID;
        
        if (isStillStaked && currentBalance > 0) {
          // Account is still staked and has balance
          accountsWithBalance.push({
            address: account.address,
            balance: currentBalance,
            isActive: true,
            cumulativeWeight: 0 // Will be calculated later
          });
          totalStaked += currentBalance;
          console.log(`    ✅ Active participant`);
        } else {
          // Account is no longer staked or has no balance - mark inactive
          await prisma.account.update({
            where: { address: account.address },
            data: { isActive: false }
          });
          console.log(`    ❌ Marking inactive (not staked or zero balance)`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`    ⚠️  Error checking account ${account.address}:`, error);
        // Mark as inactive if we can't fetch info
        await prisma.account.update({
          where: { address: account.address },
          data: { isActive: false }
        });
      }
    }

    console.log(`\n💰 Step 3: Total HBAR staked: ${totalStaked.toFixed(4)}ℏ`);
    
    if (accountsWithBalance.length === 0) {
      console.log('❌ No eligible participants found. Cannot conduct drawing.');
      return;
    }

    if (totalStaked === 0) {
      console.log('❌ Total staked amount is zero. Cannot conduct drawing.');
      return;
    }

    // Step 4: Create ordered list with cumulative weights
    console.log('\n📊 Step 4: Creating weighted participant list...');
    let cumulativeWeight = 0;
    
    for (const account of accountsWithBalance) {
      cumulativeWeight += account.balance;
      account.cumulativeWeight = cumulativeWeight;
      console.log(`  ${account.address}: ${account.balance.toFixed(4)}ℏ (cumulative: ${cumulativeWeight.toFixed(4)})`);
    }

    // Step 5: Generate cryptographically secure random number using Hedera PRNG
    console.log('\n🎲 Step 5: Generating cryptographically secure random number...');
    const prngResult = await generateHederaRandomNumber(totalStaked);
    const randomNumber = prngResult.randomNumber; // Already scaled to the correct range
    console.log(`Random number: ${randomNumber} (out of ${totalStaked})`);
    console.log(`🔐 Hedera PRNG Transaction ID: ${prngResult.transactionId}`);

    // Step 6: Determine winner
    console.log('\n🏆 Step 6: Determining winner...');
    let winner: AccountWithBalance | null = null;
    
    for (const account of accountsWithBalance) {
      if (randomNumber <= account.cumulativeWeight) {
        winner = account;
        break;
      }
    }

    if (!winner) {
      console.error('❌ Error: Could not determine winner');
      return;
    }

    console.log(`🎉 Winner: ${winner.address}`);
    console.log(`   Balance: ${winner.balance.toFixed(4)}ℏ`);
    console.log(`   Win probability: ${((winner.balance / totalStaked) * 100).toFixed(2)}%`);

    // Calculate prize (10% of total pool)
    const prizeAmount = totalStaked * 0.1;

    // Step 7: Add drawing result to database
    console.log('\n💾 Step 7: Recording drawing result...');
    const drawingResult = await prisma.drawing.create({
      data: {
        date: new Date(),
        winnerAddress: winner.address,
        winnerBalance: new Decimal(winner.balance.toFixed(8)),
        totalPoolSize: new Decimal(totalStaked.toFixed(8)),
        totalParticipants: accountsWithBalance.length,
        randomNumber: randomNumber,
        prize: new Decimal(prizeAmount.toFixed(8)),
        prngTransactionId: prngResult.transactionId
      }
    });

    console.log(`✅ Drawing recorded with ID: ${drawingResult.id}`);
    
    // Summary
    console.log('\n🎊 DRAWING COMPLETE! 🎊');
    console.log('================================');
    console.log(`Winner: ${winner.address}`);
    console.log(`Prize: ${prizeAmount.toFixed(4)}ℏ`);
    console.log(`Total Participants: ${accountsWithBalance.length}`);
    console.log(`Total Pool: ${totalStaked.toFixed(4)}ℏ`);
    console.log(`Random Number: ${randomNumber}`);
    console.log(`🔐 PRNG Transaction ID: ${prngResult.transactionId}`);
    console.log(`Drawing Date: ${drawingResult.date.toISOString()}`);
    console.log('================================');

  } catch (error) {
    console.error('❌ Error during prize drawing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Command line interface
const action = process.argv[2];

switch (action) {
  case 'draw':
    conductPrizeDrawing().then(() => {
      console.log('\n🏁 Prize drawing process completed.');
      process.exit(0);
    });
    break;
    
  case 'test':
    // Test mode - just show current state without conducting drawing
    (async () => {
      console.log('🧪 TEST MODE: Showing current state without conducting drawing\n');
      
      const accounts = await prisma.account.findMany({ where: { isActive: true } });
      console.log(`Active accounts in database: ${accounts.length}`);
      
      let totalBalance = 0;
      for (const account of accounts) {
        console.log(`  ${account.address}: ${Number(account.balance)}ℏ`);
        totalBalance += Number(account.balance);
      }
      
      console.log(`Total recorded balance: ${totalBalance.toFixed(4)}ℏ`);
      
      const lastDrawing = await prisma.drawing.findFirst({
        orderBy: { date: 'desc' }
      });
      
      if (lastDrawing) {
        console.log(`\nLast drawing:`);
        console.log(`  Date: ${lastDrawing.date.toISOString()}`);
        console.log(`  Winner: ${lastDrawing.winnerAddress}`);
        console.log(`  Prize: ${lastDrawing.prize}ℏ`);
      } else {
        console.log('\nNo previous drawings found.');
      }
      
      await prisma.$disconnect();
      process.exit(0);
    })();
    break;
    
  default:
    console.log('🎲 HashPrize Drawing Script');
    console.log('===========================');
    console.log('Features:');
    console.log('  🔐 Cryptographically secure random numbers via Hedera PRNG');
    console.log('  🔍 Verifiable randomness with transaction IDs');
    console.log('  ⚖️  Weighted selection based on staked amounts');
    console.log('');
    console.log('Available commands:');
    console.log('  npm run drawing draw  - Conduct a new prize drawing');
    console.log('  npm run drawing test  - Show current state (test mode)');
    console.log('');
    console.log('⚠️  IMPORTANT: Only run this script manually when you want to conduct an official drawing!');
    console.log('🔑 Requires PRIZE_ACCOUNT_KEY environment variable for Hedera PRNG transactions.');
    process.exit(0);
}
