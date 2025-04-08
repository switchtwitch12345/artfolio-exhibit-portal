
# Art Gallery dApp - Setup Instructions

This application has been transformed into a decentralized application (dApp) allowing users to create and participate in auctions for artwork using cryptocurrency via MetaMask or other Ethereum wallets.

## Prerequisites

Before you start, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension

## Setting Up the Blockchain Environment

1. **Install dependencies**
   ```
   npm install
   ```

2. **Start a local Ethereum blockchain**
   ```
   npx hardhat node
   ```
   This will start a local blockchain at http://127.0.0.1:8545 with several pre-funded accounts.

3. **Deploy the smart contract**
   In a new terminal, run:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```
   This will deploy the ArtAuction contract to your local blockchain and save the contract address in `.env.local`.

4. **Start the application**
   ```
   npm run dev
   ```

## Connecting MetaMask to Your Local Blockchain

1. Open MetaMask and click on the network dropdown at the top.
2. Select "Add Network" > "Add a network manually".
3. Enter the following details:
   - Network Name: Hardhat Local
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH
4. Click "Save"

5. Import one of the accounts from Hardhat:
   - Copy one of the private keys from the terminal where you ran `npx hardhat node`
   - In MetaMask, click on your account icon > "Import Account"
   - Paste the private key and click "Import"

## Using the dApp

### Creating an Auction
1. Browse to the Gallery page
2. Connect your MetaMask wallet
3. Select an artwork and click "Sell as Auction"
4. Set your starting price and auction duration
5. Confirm the transaction in MetaMask

### Bidding on an Auction
1. Browse to the Auctions page
2. Connect your MetaMask wallet
3. Click on an auction you're interested in
4. Enter your bid amount (must be higher than the current highest bid)
5. Confirm the transaction in MetaMask

### Viewing Your Auctions
1. On the Auctions page, you'll see indicators for auctions where you're the seller or highest bidder

### Ending an Auction
1. If you're the seller, you can end an auction early by clicking "End Auction Now"
2. Otherwise, auctions end automatically after their duration expires

## Troubleshooting

- **MetaMask Transaction Failing**: Make sure you have enough ETH in your account to cover the transaction and gas fees.
- **Contract Not Found**: Ensure you've deployed the contract and the contract address is correctly set in `.env.local`.
- **Network Issues**: Verify you're connected to the correct network in MetaMask (Hardhat Local).

## Development Notes

- The smart contract is in `contracts/ArtAuction.sol`
- Blockchain configuration is in `hardhat.config.js`
- Web3 integration is managed through `src/context/Web3Context.tsx`
- Auction functionality is in `src/hooks/useAuction.tsx`
