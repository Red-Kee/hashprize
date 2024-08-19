import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

const UNSELECTED_SERIAL_NUMBER = -1;

export default function Home() {
  const { walletInterface, accountId } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<MirrorNodeAccountTokenBalanceWithInfo[]>([]);
  const [stakedAccount, setStakedAccount] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<number>(UNSELECTED_SERIAL_NUMBER);

  const [tokenIdToAssociate, setTokenIdToAssociate] = useState("");
  //const prizeAccount = process.env.REACT_APP_STAKE_ACCOUNT_ID;
  const prizeAccount = "0.0.4353168";
  console.log("Hashprize ID:", prizeAccount);

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
      setStakedAccount(accountInfoJson.staked_account_id);
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
            Total Amount Staked:
            <br/>
            Accounts:
            <br/>
            Previous Winner:
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
                Your share of the stake:
              </Typography>
             :
            <>
              <Typography>
                To join press this button:
              </Typography>
              <Button
                variant='contained'
                onClick={async () => {
                  await walletInterface.updateAccountStaking(AccountId.fromString(prizeAccount));
                }}
              >
                Stake to Hashprize
              </Button>
            </>
            }
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