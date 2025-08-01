'use client'

import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { useEffect, useState } from "react";
import { AccountId, Hbar, HbarUnit } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

const UNSELECTED_SERIAL_NUMBER = -1;

export default function Home() {
  const { walletInterface, accountId } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<MirrorNodeAccountTokenBalanceWithInfo[]>([]);
  const [stakedAccount, setStakedAccount] = useState("");
  const [connectedAccountBalance, setConnectedAccountBalance] = useState<number>();
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<number>(UNSELECTED_SERIAL_NUMBER);
  const [totalAccounts, setTotalAccounts] = useState<number>();
  const [totalStaked, setTotalStaked] = useState<number>();
  const [stakePercent, setStakePercent] = useState("");
  const [previousWinner, setPreviousWinner] = useState("");
  const [drawRandomNumber, setRandomNumber] = useState<number>();
  const [simText, setSimText] = useState("");
  const prizeAccount = "0.0.4353168";

  // Purpose: Get the account token balances with token info for the current account and set them to state
  useEffect(() => {
    if (accountId === null) {
      return;
    }
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    
    mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId)).then((tokens) => {
      setAvailableTokens(tokens);
      console.log(tokens);
    }).catch((error) => {
      console.error(error);
    });
    
    mirrorNodeClient.getAccountInfo(AccountId.fromString(accountId)).then((accountInfoJson) => {
      console.log(accountInfoJson);
      console.log("staked ID:", accountInfoJson.staked_account_id);
      console.log("balance:", Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
      setStakedAccount(accountInfoJson.staked_account_id);
      setConnectedAccountBalance(Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
    }).catch((error) => {
      console.error(error);
    });
  }, [accountId])

  // reset amount and serial number when token id changes
  useEffect(() => {
    setAmount(0);
    setSerialNumber(UNSELECTED_SERIAL_NUMBER);
  }, [selectedTokenId]);

  useEffect(() => {
    const fetchDBState = async () => {
      try {
        // Call API endpoints instead of direct database functions
        const accountsResponse = await fetch('/api/accounts');
        const accounts = await accountsResponse.json();
        
        const statsResponse = await fetch('/api/stats');
        const stats = await statsResponse.json();
        
        const drawingsResponse = await fetch('/api/drawings/latest');
        const lastDrawing = await drawingsResponse.json();

        setTotalStaked(stats.totalStaked);
        setTotalAccounts(stats.totalAccounts);
        setPreviousWinner(lastDrawing.winnerAddress || 'No previous winner');

        if((stakedAccount === prizeAccount) && connectedAccountBalance) {
          // Add current account to database
          await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: stakedAccount,
              balance: connectedAccountBalance
            })
          });
        }

        if((stakedAccount === prizeAccount) && connectedAccountBalance && stats.totalStaked) {
          setStakePercent((connectedAccountBalance*100/stats.totalStaked).toFixed(5));
        }
      } catch (error) {
        console.error('Error fetching database state:', error);
        setPreviousWinner('No previous winner');
      }
    };
    
    fetchDBState();
  }, [stakedAccount, totalStaked, totalAccounts, previousWinner, connectedAccountBalance]);

  useEffect(() => {
    if(drawRandomNumber) {
      let doSim = async () => {
        try {
          const accountsResponse = await fetch('/api/accounts');
          const accounts = await accountsResponse.json();
          
          let resultText = "Account balances:\\n";
          accounts.forEach((acc: any) => 
            resultText += `${acc.address} - ${Number(acc.balance)}\\n`
          );
          
          resultText += `\\nRandom Number: ${drawRandomNumber}\\n`;
          
          // Find winner
          const winnerResponse = await fetch(`/api/winner?randomNumber=${drawRandomNumber}`);
          const winner = await winnerResponse.json();
          
          if (winner) {
            resultText += `Winner: ${winner.address}`;
          }
          
          setSimText(resultText);
        } catch (error) {
          console.error('Error in simulation:', error);
          setSimText('Error in simulation');
        }
      }
      doSim();
    }
  }, [drawRandomNumber]);

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography
        variant="h4"
        color="#000080"
      >
        Hashprize<br/>
      </Typography>
      Pool staking rewards with others for a chance to win!
      
      <Stack
        direction='row'
        gap={8}
        alignItems='center'
        justifyContent='space-evenly'
      >
        <Typography color="#000080">
          Total Amount Staked: {totalStaked}
          <br/>
          Accounts: {totalAccounts}
          <br/>
          Previous Winner: {previousWinner}
          <br/>
          Next Drawing: TBD
        </Typography>
      </Stack>
      
      {walletInterface !== null ? (
        <>
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
          >
            {stakedAccount === prizeAccount ? 
              <Typography color="#000080">
                Your account is staked to Hashprize. Thanks!
                <br/>
                Your amount is {connectedAccountBalance?.toFixed(4)}ℏ
                <br/>
                Your share of the pool: {stakePercent}%
              </Typography>
             :
            <>
              <Typography color="#000080">
                To join press this button:
              </Typography>
              <Button
                variant='contained'
                onClick={async () => {
                  await walletInterface.updateAccountStaking(AccountId.fromString(prizeAccount)).then(() => {
                    setTimeout(() => {
                      const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
                      mirrorNodeClient.getAccountInfo(AccountId.fromString(accountId)).then((accountInfoJson) => {
                        console.log("staked ID:", accountInfoJson.staked_account_id);
                        setStakedAccount(accountInfoJson.staked_account_id);
                      }).catch((error) => {
                        console.error(error);
                      });
                    }, 7000);
                  }).catch((error) => {
                    console.error(error);
                  });
                }}
              >
                Stake to Hashprize
              </Button>
            </>
            }
          </Stack>
          <Stack
            direction='column'
            gap={2}
            alignItems='center'
          >
            <Button
              variant='contained'
              onClick={async () => {
                if(totalStaked) {
                  await walletInterface.getHederaRandomNumber(totalStaked).then((randomNumber) => {
                    setRandomNumber(randomNumber);
                    console.log("Random Number", randomNumber);
                  });
                } else { 
                  setSimText("Error in simulation:\\nTotal Amount Staked is unknown.");
                }
              }}
            >
              Simulate Drawing
            </Button>
            <TextField
              id="sim_text"
              multiline
              rows={10}
              defaultValue={simText}
              variant="filled"
              InputProps={{
                style: { color: '#000080' }
              }}
            />
          </Stack>
        </>
      ) : 
        <>
          <Typography
            variant="h5"
            color="#000080"
          >
          <br/><br/>Connect wallet to view more options &#x21D7;
          </Typography>
        </>}
    </Stack>
  )
}
