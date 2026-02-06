const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying ClawsightV2 with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Base Sepolia USDC address
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  // Oracle = deployer for demo
  const ORACLE_ADDRESS = deployer.address;

  const ClawsightV2 = await hre.ethers.getContractFactory("ClawsightV2");
  const clawsight = await ClawsightV2.deploy(USDC_ADDRESS, ORACLE_ADDRESS);

  await clawsight.waitForDeployment();

  const address = await clawsight.getAddress();
  console.log("ClawsightV2 deployed to:", address);
  console.log("");
  console.log("Verify with:");
  console.log(`npx hardhat verify --network base-sepolia ${address} ${USDC_ADDRESS} ${ORACLE_ADDRESS}`);
  
  return address;
}

main()
  .then((address) => {
    console.log("\n✅ Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
