const { ethers, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const ORACLE_ADDRESS = deployer.address; // deployer acts as oracle for hackathon

  const Clawsight = await ethers.getContractFactory("Clawsight");
  const clawsight = await Clawsight.deploy(USDC_ADDRESS, ORACLE_ADDRESS);
  await clawsight.waitForDeployment();

  const contractAddress = await clawsight.getAddress();
  console.log("Clawsight deployed to:", contractAddress);
  console.log("Explorer:", `https://sepolia.basescan.org/address/${contractAddress}`);

  // Wait for a few block confirmations before verifying
  console.log("Waiting for block confirmations...");
  await clawsight.deploymentTransaction().wait(5);

  // Verify on Basescan
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [USDC_ADDRESS, ORACLE_ADDRESS],
    });
    console.log("Contract verified on Basescan!");
  } catch (err) {
    if (err.message.includes("Already Verified") || err.message.includes("already verified")) {
      console.log("Contract already verified.");
    } else {
      console.error("Verification failed:", err.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
