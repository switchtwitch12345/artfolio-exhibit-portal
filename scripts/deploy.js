
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  // Deploy the ArtAuction contract
  const ArtAuction = await hre.ethers.getContractFactory("ArtAuction");
  const artAuction = await ArtAuction.deploy();

  await artAuction.deployed();

  console.log("ArtAuction deployed to:", artAuction.address);
  
  // Store the contract address in a file to use in our frontend
  const fs = require("fs");
  const envContent = `VITE_CONTRACT_ADDRESS=${artAuction.address}`;
  
  fs.writeFileSync(".env.local", envContent);
  console.log("Contract address saved to .env.local");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
