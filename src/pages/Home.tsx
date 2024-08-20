import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { AccountId, TokenId, Hbar, HbarUnit } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import { addAccount, getLastDrawing, getTotalAccountBalances, getTotalAccounts } from "../services/databaseActions";

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
      // set to state
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

  // Filter out tokens with a balance of 0
  const tokensWithNonZeroBalance = availableTokens.filter((token) => token.balance > 0);
  // Get the selected token balance with info
  const selectedTokenBalanceWithInfo = availableTokens.find((token) => token.token_id === selectedTokenId);

  // reset amount and serial number when token id changes
  useEffect(() => {
    setAmount(0);
    setSerialNumber(UNSELECTED_SERIAL_NUMBER);
  }, [selectedTokenId]);

  useEffect(() => {
    if(stakedAccount === prizeAccount) {
      addAccount(stakedAccount,connectedAccountBalance);
    }
    const fetchDBState = async () => {
      setTotalStaked(await getTotalAccountBalances());
      setTotalAccounts(await getTotalAccounts());
      setPreviousWinner((await getLastDrawing()).address);
      if((stakedAccount === prizeAccount) && connectedAccountBalance && totalStaked) {
        setStakePercent((connectedAccountBalance*100/totalStaked).toFixed(5));
      }
    };
    fetchDBState();
  }, [stakedAccount]);

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography
        variant="h4"
        color="white"
      >
        Hashprize<br/>
      </Typography>
      <Stack
            direction='row'
            gap={8}
            alignItems='center'
            justifyContent='space-evenly'
      >
        <Typography>
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
              <Typography>
                Your account is staked to Hashprize. Thanks!
                <br/>
                Your share of the stake: {stakePercent}%
              </Typography>
             :
            <>
              <Typography>
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
                        //addAccount(accountId,Hbar.fromTinybars(accountInfoJson.balance.balance).to(HbarUnit.Hbar).toNumber());
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
                    })
                  } else {
                    console.log("Error in simulation. Total Amount Staked is unknown.");
                  }
                }}
              >
                Simulate Drawing
            </Button>
            <TextField
              id="filled-multiline-static"
              multiline
              rows={4}
              defaultValue=""
              variant="filled"
            />
          </Stack>
        </>
      ) : 
        <>
          <Typography
            variant="h5"
            color="white"
          >
          <br/><br/>Connect wallet to view more options &#x21D7;
          </Typography>
        </>}
    </Stack>
  )
}