// scripts/deployV2.js — Deploy ClawsightV2 to Base Sepolia
// Usage: npx hardhat run scripts/deployV2.js --network base-sepolia

const { ethers, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ClawsightV2 with:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const ORACLE_ADDRESS = deployer.address; // deployer acts as oracle for hackathon

  const ClawsightV2 = await ethers.getContractFactory("ClawsightV2");
  const contract = await ClawsightV2.deploy(USDC_ADDRESS, ORACLE_ADDRESS);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("ClawsightV2 deployed to:", contractAddress);
  console.log(
    "Explorer:",
    `https://sepolia.basescan.org/address/${contractAddress}`
  );

  // Wait for block confirmations before verifying
  console.log("Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);

  // Verify on Basescan
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [USDC_ADDRESS, ORACLE_ADDRESS],
    });
    console.log("Contract verified on Basescan!");
  } catch (err) {
    if (
      err.message.includes("Already Verified") ||
      err.message.includes("already verified")
    ) {
      console.log("Contract already verified.");
    } else {
      console.error("Verification failed:", err.message);
    }
  }

  console.log("\nAdd to .env:");
  console.log(`CONTRACT_V2_ADDRESS=${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
