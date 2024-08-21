# Hashprize
The vision of Hashprize is to create a prize-linked staking protocol/no-loss lottery that allows participants the chance to win HBAR prize drawings. Hedera’s proxy staking feature is used to allow participants to retain full control and ownership of their HBAR and fund the prize pool by opting to proxy stake to the Hashprize account. Similar crypto protocols have the disadvantage of requiring participants to deposit into a pool usually controlled by smart contracts. Hashprize is unique because there is no smart contract risk, participants do not transfer or lock-up tokens and can opt out anytime by updating their staking choice.

## Setup
Clone the repo to your desired location

```shell
git clone https://github.com/Red-Kee/hashprize.git
```
1. Execute ```npm i```
2. Execute ```npm start``` to start the project

## Prerequisites

### Hedera Testnet account

Don't have one? Create one by going to [portal.hedera.com](https://portal.hedera.com/register).

### Hashpack Wallet
* Install the [Hashpack extension](https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk).  
* Import a Hedera ED25519 testnet account into Hashpack.

### Other WalletConnect compatible wallets may work but have not yet been tested and Metamask is not yet supported



## Links
* [Hashscan network explorer](https://hashscan.io/testnet/staking) can also be used to update the staking options of an account so that your wallet is no longer staked to Hashprize.
* This project used [Multi Wallet Hedera Transfer Dapp](https://github.com/hedera-dev/multi-wallet-hedera-transfer-dapp) as it starting point (completed branch, commit bcd57cdc2acaddf01f97918982168308c698cdb4)
* Another similar template: [The Hedera DApp CRA Template](https://github.com/hedera-dev/cra-hedera-dapp-template)
* Need to quickly create Hedera Testnet accounts to act as Sender/Receiver? Check out [Create Hedera Accounts with Tokens Helper](https://github.com/hedera-dev/hedera-create-account-and-token-helper)


## License
BSD 3-Clause License
