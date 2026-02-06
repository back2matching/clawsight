// scripts/demo.js — Demo transactions for Clawsight on Base Sepolia
// Usage: npx hardhat run scripts/demo.js --network base-sepolia
//
// Required env vars:
//   DEPLOYER_PRIVATE_KEY  — wallet with Base Sepolia ETH + USDC
//   CONTRACT_ADDRESS      — deployed Clawsight contract address

const hre = require("hardhat");
const { ethers } = hre;

const BASESCAN = "https://sepolia.basescan.org";
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// Update this after deploying, or set CONTRACT_ADDRESS env var
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xYOUR_CONTRACT_ADDRESS_HERE";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(60));
  console.log("CLAWSIGHT DEMO — Base Sepolia");
  console.log("=".repeat(60));
  console.log("Deployer / Oracle:", deployer.address);
  console.log("Contract:", CONTRACT_ADDRESS);
  console.log();

  // Attach to deployed contract
  const Clawsight = await ethers.getContractFactory("Clawsight");
  const contract = Clawsight.attach(CONTRACT_ADDRESS);

  // Attach to USDC for approval if needed later
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  const txHashes = [];

  function logTx(label, receipt) {
    console.log(`${label}: ${receipt.hash}`);
    console.log(`  ${BASESCAN}/tx/${receipt.hash}`);
    console.log();
    txHashes.push({ label, hash: receipt.hash });
  }

  // -------------------------------------------------------
  // 1. Register Agent
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("1. REGISTER AGENT");
  console.log("-".repeat(60));

  const isRegistered = await contract.isRegistered(deployer.address);
  if (isRegistered) {
    const agent = await contract.getAgent(deployer.address);
    console.log(`Already registered as "${agent.moltbookHandle}", skipping.`);
    console.log();
  } else {
    const tx = await contract.registerAgent("agent_alpha");
    const receipt = await tx.wait();
    logTx("registerAgent('agent_alpha')", receipt);
  }

  // -------------------------------------------------------
  // 2. Set Reputation Score (deployer is oracle)
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("2. SET REPUTATION SCORE");
  console.log("-".repeat(60));

  {
    const tx = await contract.setScore(deployer.address, 750);
    const receipt = await tx.wait();
    logTx("setScore(deployer, 750) — Platinum tier", receipt);
  }

  // Verify score
  const score = await contract.getScore(deployer.address);
  console.log(`  Verified on-chain score: ${score}`);
  console.log(`  Tier: ${getTier(Number(score))}`);
  console.log();

  // -------------------------------------------------------
  // 3. List an Ad Slot (0.10 USDC)
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("3. LIST AD SLOT");
  console.log("-".repeat(60));

  const adPrice = ethers.parseUnits("0.10", 6); // 100000 (6 decimals)
  const adDescription = "Promoted: Alpha Agent Analytics Dashboard";

  {
    const tx = await contract.listAdSlot(adPrice, adDescription);
    const receipt = await tx.wait();
    logTx(`listAdSlot(${ethers.formatUnits(adPrice, 6)} USDC, "${adDescription}")`, receipt);
  }

  // -------------------------------------------------------
  // 4. Query Active Slots
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("4. ACTIVE AD SLOTS");
  console.log("-".repeat(60));

  const activeSlots = await contract.getActiveSlots();
  console.log(`Found ${activeSlots.length} active slot(s):`);
  for (const slot of activeSlots) {
    console.log(`  Slot #${slot.id}: ${ethers.formatUnits(slot.priceUsdc, 6)} USDC — "${slot.description}"`);
    console.log(`    Seller: ${slot.seller}`);
  }
  console.log();

  // -------------------------------------------------------
  // 5. Query Top Agents
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("5. TOP AGENTS");
  console.log("-".repeat(60));

  const [topAddrs, topScores] = await contract.getTopAgents(5);
  console.log(`Top ${topAddrs.length} agent(s):`);
  for (let i = 0; i < topAddrs.length; i++) {
    const agentInfo = await contract.getAgent(topAddrs[i]);
    console.log(`  #${i + 1}: ${agentInfo.moltbookHandle} (${topAddrs[i]}) — Score: ${topScores[i]} (${getTier(Number(topScores[i]))})`);
  }
  console.log();

  // -------------------------------------------------------
  // 6. Query Contract State
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("6. CONTRACT STATE");
  console.log("-".repeat(60));

  const agentCount = await contract.getAgentCount();
  const nextSlotId = await contract.nextSlotId();
  const oracleAddr = await contract.oracle();
  const balance = await contract.getBalance(deployer.address);

  console.log(`  Total agents:    ${agentCount}`);
  console.log(`  Total ad slots:  ${nextSlotId}`);
  console.log(`  Oracle:          ${oracleAddr}`);
  console.log(`  Deployer USDC balance (claimable): ${ethers.formatUnits(balance, 6)} USDC`);
  console.log();

  // -------------------------------------------------------
  // Summary
  // -------------------------------------------------------
  console.log("=".repeat(60));
  console.log("DEMO COMPLETE — Transaction Hashes");
  console.log("=".repeat(60));
  for (const { label, hash } of txHashes) {
    console.log(`  ${label}`);
    console.log(`    ${BASESCAN}/tx/${hash}`);
  }
  console.log();
  console.log(`Contract: ${BASESCAN}/address/${CONTRACT_ADDRESS}`);
  console.log("=".repeat(60));
}

function getTier(score) {
  if (score >= 900) return "Diamond";
  if (score >= 600) return "Platinum";
  if (score >= 300) return "Gold";
  if (score >= 100) return "Silver";
  return "Bronze";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Demo failed:", error);
    process.exit(1);
  });
