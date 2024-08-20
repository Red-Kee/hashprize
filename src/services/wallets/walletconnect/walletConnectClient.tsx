import { WalletConnectContext } from "../../../contexts/WalletConnectContext";
import { useCallback, useContext, useEffect } from 'react';
import { WalletInterface } from "../walletInterface";
import { AccountId, ContractExecuteTransaction, ContractId, LedgerId, TokenAssociateTransaction, TokenId, Transaction, TransactionId, TransferTransaction, Client, AccountUpdateTransaction, PrngTransaction, TransactionRecordQuery } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "../contractFunctionParameterBuilder";
import { appConfig } from "../../../config";
import { SignClientTypes } from "@walletconnect/types";
import { DAppConnector, HederaJsonRpcMethod, HederaSessionEvent, HederaChainId, SignAndExecuteTransactionParams, transactionToBase64String, queryToBase64String, SignAndExecuteQueryParams } from "@hashgraph/hedera-wallet-connect";
import EventEmitter from "events";
import { MirrorNodeClient } from "../mirrorNodeClient";

// Created refreshEvent because `dappConnector.walletConnectClient.on(eventName, syncWithWalletConnectContext)` would not call syncWithWalletConnectContext
// Reference usage from walletconnect implementation https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/lib/dapp/index.ts#L120C1-L124C9
const refreshEvent = new EventEmitter();

// Create a new project in walletconnect cloud to generate a project id
const walletConnectProjectId = "377d75bb6f86a2ffd427d032ff6ea7d3";
const currentNetworkConfig = appConfig.networks.testnet;
const hederaNetwork = currentNetworkConfig.network;
const hederaClient = Client.forName(hederaNetwork);

// Adapted from walletconnect dapp example:
// https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/examples/typescript/dapp/main.ts#L87C1-L101C4
const metadata: SignClientTypes.Metadata = {
  name: "Hashprize",
  description: "Hashprize transaction",
  url: window.location.origin,
  icons: [window.location.origin + "/logo192.png"],
}
const dappConnector = new DAppConnector(
  metadata,
  LedgerId.fromString(hederaNetwork),
  walletConnectProjectId,
  Object.values(HederaJsonRpcMethod),
  [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
  [HederaChainId.Testnet],
);

// ensure walletconnect is initialized only once
let walletConnectInitPromise: Promise<void> | undefined = undefined;
const initializeWalletConnect = async () => {
  if (walletConnectInitPromise === undefined) {
    walletConnectInitPromise = dappConnector.init();
  }
  await walletConnectInitPromise;
};

export const openWalletConnectModal = async () => {
  await initializeWalletConnect();
  await dappConnector.openModal().then((x) => {
    refreshEvent.emit("sync");
  });
};

class WalletConnectWallet implements WalletInterface {
  // set to true to use Math.random() instead of requesting one from Hedera network
  readonly useMathRandom: boolean = true;

  private accountId() {
    // Need to convert from walletconnect's AccountId to hashgraph/sdk's AccountId because walletconnect's AccountId and hashgraph/sdk's AccountId are not the same!
    return AccountId.fromString(dappConnector.signers[0].getAccountId().toString());
  }

  // can be replaced when walletconnect provides a signer that satisfies Transaction.executeWithSigner
  private async signAndExecuteTransaction(transaction: Transaction) {
    const params: SignAndExecuteTransactionParams = {
      signerAccountId: `::${this.accountId().toString()}`, // dApps seem to expect two colons in front of the signerAccountId, I'm not sure why. Hoping this gets cleaned up by wallets and walletconnect.
      transactionList: transactionToBase64String(transaction)
    };
    /**
     * this is not working as expected according to walletconnect's type definitions for dappConnector.signAndExecuteTransaction
     * 
     * For HashPack, needed to put in try-catch because hashpack was throwing execptions in dappConnector.signAndExecuteTransaction
     * For Blade, dappConnector.signAndExecuteTransaction does not throw, but result.result is always undefined. So everywhere that this result is used, I had to add something like `txResult ? txResult.transactionId : null`
     * Basically for either wallet, the transactionId is not usable.
     */
    try {
      const result = await dappConnector.signAndExecuteTransaction(params);
      return result.result;
    } catch {
      return null;
    }
  }

  // can be replaced when walletconnect provides a signer that satisfies Transaction.freezeWithSigner
  private freezeTx(transaction: Transaction) {
    const nodeAccountIds = hederaClient._network.getNodeAccountIdsForExecute();
    return transaction
      .setTransactionId(TransactionId.generate(this.accountId()))
      .setNodeAccountIds(nodeAccountIds)
      .freeze();
  }

  async transferHBAR(toAddress: AccountId, amount: number) {
    const transferHBARTransaction = new TransferTransaction()
      .addHbarTransfer(this.accountId(), -amount)
      .addHbarTransfer(toAddress, amount);

    const frozenTx = this.freezeTx(transferHBARTransaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    return txResult ? txResult.transactionId : null;
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addTokenTransfer(tokenId, this.accountId(), -amount)
      .addTokenTransfer(tokenId, toAddress.toString(), amount);

    const frozenTx = this.freezeTx(transferTokenTransaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    return txResult ? txResult.transactionId : null;
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, this.accountId(), toAddress);

    const frozenTx = this.freezeTx(transferTokenTransaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    return txResult ? txResult.transactionId : null;
  }

  async associateToken(tokenId: TokenId) {
    const associateTokenTransaction = new TokenAssociateTransaction()
      .setAccountId(this.accountId())
      .setTokenIds([tokenId]);

    const frozenTx = this.freezeTx(associateTokenTransaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    return txResult ? txResult.transactionId : null;
  }

  async updateAccountStaking(toAddress: AccountId) {
    const accountUpdateTransaction = new AccountUpdateTransaction()
      .setAccountId(this.accountId())
      .setStakedAccountId(toAddress)
      .setDeclineStakingReward(false);

    const frozenTx = this.freezeTx(accountUpdateTransaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    return txResult ? txResult.transactionId : null;
  }

  async getHederaRandomNumber(range: number) {
    let randomNumber = -1;
    if (this.useMathRandom) {
      randomNumber = Math.floor(Math.random() * range);
    } else {
    // Attempt to request a random number from Hedera network
    const transaction = new PrngTransaction()
      .setRange(range);

    const frozenTx = this.freezeTx(transaction);
    const txResult = await this.signAndExecuteTransaction(frozenTx);
    // Using mirror node to get the completed transaction ID since WalletConnect doesn't seem to give it
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    const lastTxResponse = await mirrorNodeClient.getLastTransaction(this.accountId(),"UTILPRNG");

    console.log(lastTxResponse);
    console.log(lastTxResponse.transactions[0].transaction_id);
    console.log("frozenTx ID:", frozenTx.transactionId);
    const txId : string = lastTxResponse.transactions[0].transaction_id;
    const transactionId = txId.replace("-","@").replace("-",".");
    console.log("Formatted ID:", transactionId);
    // Query the transaction record to get the random number
    if (transactionId) {
      const recordQuery = new TransactionRecordQuery()
        .setTransactionId(transactionId.toString());
      const params: SignAndExecuteQueryParams = {
          signerAccountId: `::${this.accountId().toString()}`, // dApps seem to expect two colons in front of the signerAccountId, I'm not sure why. Hoping this gets cleaned up by wallets and walletconnect.
          query: queryToBase64String(recordQuery)
        };
      try {
        const result = await dappConnector.signAndExecuteQuery(params);
        console.log("result: ", result.result);
      } catch {
        console.log("failed");
        return -1;
      }
      // TODO: never assigned random number since the above did not work
    }
    }
    return randomNumber;
  }

  // Purpose: build contract execute transaction and send to wallet for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(gasLimit)
      .setFunction(functionName, functionParameters.buildHAPIParams());

    const frozenTx = this.freezeTx(tx);
    const txResult = await this.signAndExecuteTransaction(frozenTx);

    // in order to read the contract call results, you will need to query the contract call's results form a mirror node using the transaction id
    // after getting the contract call results, use ethers and abi.decode to decode the call_result
    return txResult ? txResult.transactionId : null;
  }
  disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit("sync");
    });
  }
};
export const walletConnectWallet = new WalletConnectWallet();

// this component will sync the walletconnect state with the context
export const WalletConnectClient = () => {
  // use the HashpackContext to keep track of the hashpack account and connection
  const { setAccountId, setIsConnected } = useContext(WalletConnectContext);

  // sync the walletconnect state with the context
  const syncWithWalletConnectContext = useCallback(() => {
    const accountId = dappConnector.signers[0]?.getAccountId()?.toString();
    if (accountId) {
      setAccountId(accountId);
      setIsConnected(true);
    } else {
      setAccountId('');
      setIsConnected(false);
    }
  }, [setAccountId, setIsConnected]);

  useEffect(() => {
    // Sync after walletconnect finishes initializing
    refreshEvent.addListener("sync", syncWithWalletConnectContext);

    initializeWalletConnect().then(() => {
      syncWithWalletConnectContext();
    });

    return () => {
      refreshEvent.removeListener("sync", syncWithWalletConnectContext);
    }
  }, [syncWithWalletConnectContext]);
  return null;
};
