import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { useEffect, useState } from "react";
import { AccountId, Hbar, HbarUnit } from "@hiero-ledger/sdk";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import { addAccount, getAllAccounts, getLastDrawing, getTotalAccountBalances, getTotalAccounts, getWinner } from "../services/mockDatabaseActions";

export default function Home() {
  const { walletInterface, accountId } = useWalletInterface();
  const [stakedAccount, setStakedAccount] = useState("");
  const [connectedAccountBalance, setConnectedAccountBalance] = useState<number>();
  const [totalAccounts, setTotalAccounts] = useState<number>();
  const [totalStaked, setTotalStaked] = useState<number>();
  const [stakePercent, setStakePercent] = useState("");
  const [previousWinner, setPreviousWinner] = useState("");
  const [drawRandomNumber, setRandomNumber] = useState<number>();
  const [simText, setSimText] = useState("");
  //const prizeAccount = process.env.REACT_APP_STAKE_ACCOUNT_ID;
  const prizeAccount = "0.0.4353168";

  // Purpose: Get the account token balances with token info for the current account and set them to state
  useEffect(() => {
    if (accountId === null) {
      return;
    }
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    // Get token balance with token info for the current account
    mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId)).then((tokens) => {
      console.log(tokens);
    }).catch((error: unknown) => {
      console.error(error);
    });
    mirrorNodeClient.getAccountInfo(AccountId.fromString(accountId)).then((accountInfoJson) => {
      console.log(accountInfoJson);
      console.log("staked ID:", accountInfoJson.staked_account_id);
      console.log("balance:", Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
      setStakedAccount(accountInfoJson.staked_account_id);
      setConnectedAccountBalance(Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
    }).catch((error: unknown) => {
      console.error(error);
    });
  }, [accountId])

  useEffect(() => {
    if(stakedAccount === prizeAccount) {
      addAccount(stakedAccount,connectedAccountBalance);
    }
    const fetchDBState = async () => {
      try {
        setTotalStaked(await getTotalAccountBalances());
        setTotalAccounts(await getTotalAccounts());
        const lastDrawing = await getLastDrawing();
        const winnerAddress = (lastDrawing as any).winnerAddress || 'Unknown';
        setPreviousWinner(winnerAddress);
        if((stakedAccount === prizeAccount) && connectedAccountBalance && totalStaked) {
          setStakePercent((connectedAccountBalance*100/totalStaked).toFixed(4));
        }
      } catch (error) {
        console.error('Error fetching database state:', error);
        setPreviousWinner('No previous winner');
      }
    };
    fetchDBState();
  }, [stakedAccount,totalStaked,totalAccounts,previousWinner,connectedAccountBalance]);

  useEffect(() => {
    if(drawRandomNumber) {
      let doSim = async () => {
        let resultText = await printAccounts();
        resultText = resultText.concat(`\nRandom Number: ${drawRandomNumber}\n`);                   
        if(drawRandomNumber) {
          const winner = await getWinner(drawRandomNumber);
          resultText = resultText.concat(`Winner: ${winner?.address}`);
        }
        setSimText(resultText);
      }
      doSim();
    }
  }, [drawRandomNumber]);

  const printAccounts = async function() {
    const accounts = await getAllAccounts();
    let accountString = "Account balances:\n"
    accounts.forEach((acc) => accountString = accountString.concat(`${acc.address} - ${Number(acc.balance)}\n`));
    return accountString;
  }

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography
        variant="h4"
        color="#000080" // Navy blue
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
                      if (accountId === null) {
                        console.error('Account ID is null, cannot get account info');
                        return;
                      }
                      const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
                      mirrorNodeClient.getAccountInfo(AccountId.fromString(accountId!)).then((accountInfoJson) => {
                        console.log("staked ID:", accountInfoJson.staked_account_id);
                        setStakedAccount(accountInfoJson.staked_account_id);
                        //addAccount(accountId,Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
                      }).catch((error: unknown) => {
                        console.error(error);
                      });
                    }, 7000);
                  }).catch((error: unknown) => {
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
                    await walletInterface.getHederaRandomNumber(totalStaked).then((randomNumber: any) => {
                      setRandomNumber(randomNumber);
                      console.log("Random Number", randomNumber);
                    });
                    /*let resultText = await printAccounts();
                    resultText = resultText.concat(`\nRandom Number: ${drawRandomNumber}\n`);                   
                    if(drawRandomNumber) {
                      const winner = await getWinner(drawRandomNumber);
                      resultText = resultText.concat(`Winner: ${winner?.address}`);
                    }
                    setSimText(resultText);*/
                  } else { 
                    setSimText("Error in simulation:\nTotal Amount Staked is unknown.");
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
                style: { color: '#000080' } // Navy blue text color
              }}
            />
          </Stack>
        </>
      ) : 
        <>
          <Typography
            variant="h5"
            color="#000080" // Navy blue
          >
          <br/><br/>Connect wallet to view more options &#x21D7;
          </Typography>
        </>}
    </Stack>
  )
}