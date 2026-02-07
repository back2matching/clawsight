// scripts/demoV2.js — Full escrow lifecycle demo for ClawsightV2
// Shows: register -> score -> list ad -> buy (escrow) -> deliver -> confirm -> claim
// Usage: npx hardhat run scripts/demoV2.js --network base-sepolia
//
// Requires: DEPLOYER_PRIVATE_KEY in .env (wallet with Base Sepolia ETH + USDC)
// The script creates a deterministic buyer wallet and funds it automatically.

const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  const EXPLORER = "https://sepolia.basescan.org";
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const V2_ADDRESS =
    process.env.CONTRACT_V2_ADDRESS ||
    "0xed550675235625872bbF02DbE7851C35Cc4aD501";
  const STATUS = [
    "Pending",
    "Delivered",
    "Confirmed",
    "Disputed",
    "Refunded",
    "Completed",
  ];

  // Deterministic buyer wallet — same address every run for idempotency
  const buyerKey = ethers.keccak256(
    ethers.toUtf8Bytes("clawsight-demo-buyer-v2")
  );
  const buyer = new ethers.Wallet(buyerKey, ethers.provider);

  console.log("=".repeat(60));
  console.log("CLAWSIGHT V2 — Full Escrow Lifecycle Demo");
  console.log("=".repeat(60));
  console.log("Seller / Oracle:", deployer.address);
  console.log("Buyer:          ", buyer.address);
  console.log("V2 Contract:    ", V2_ADDRESS);
  console.log();

  const contract = await ethers.getContractAt("ClawsightV2", V2_ADDRESS);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  const txs = [];
  function logTx(label, receipt) {
    console.log(`  TX: ${receipt.hash}`);
    console.log(`  ${EXPLORER}/tx/${receipt.hash}`);
    txs.push({ label, hash: receipt.hash });
    console.log();
  }

  // -------------------------------------------------------
  // 0. Fund buyer wallet
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("0. FUND BUYER WALLET");
  console.log("-".repeat(60));

  const buyerEth = await ethers.provider.getBalance(buyer.address);
  if (buyerEth < ethers.parseEther("0.0005")) {
    const amount = ethers.parseEther("0.001");
    console.log(`Sending ${ethers.formatEther(amount)} ETH to buyer...`);
    const tx = await deployer.sendTransaction({
      to: buyer.address,
      value: amount,
    });
    const receipt = await tx.wait();
    logTx("Fund buyer ETH", receipt);
  } else {
    console.log(`Buyer has ${ethers.formatEther(buyerEth)} ETH (sufficient)`);
    console.log();
  }

  const adPrice = ethers.parseUnits("0.10", 6);
  const buyerUsdc = await usdc.balanceOf(buyer.address);
  if (buyerUsdc < adPrice) {
    const amount = ethers.parseUnits("0.20", 6);
    console.log(`Sending ${ethers.formatUnits(amount, 6)} USDC to buyer...`);
    const tx = await usdc.transfer(buyer.address, amount);
    const receipt = await tx.wait();
    logTx("Fund buyer USDC", receipt);
  } else {
    console.log(
      `Buyer has ${ethers.formatUnits(buyerUsdc, 6)} USDC (sufficient)`
    );
    console.log();
  }

  // -------------------------------------------------------
  // 1. Register agents
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("1. REGISTER AGENTS");
  console.log("-".repeat(60));

  if (await contract.isRegistered(deployer.address)) {
    const a = await contract.getAgent(deployer.address);
    console.log(`Seller already registered: "${a.moltbookHandle}"`);
    console.log();
  } else {
    const tx = await contract.registerAgent("seller_alpha");
    const receipt = await tx.wait();
    logTx('registerAgent("seller_alpha")', receipt);
  }

  if (await contract.isRegistered(buyer.address)) {
    const a = await contract.getAgent(buyer.address);
    console.log(`Buyer already registered: "${a.moltbookHandle}"`);
    console.log();
  } else {
    const tx = await contract.connect(buyer).registerAgent("buyer_beta");
    const receipt = await tx.wait();
    logTx('registerAgent("buyer_beta")', receipt);
  }

  // -------------------------------------------------------
  // 2. Set reputation scores
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("2. SET REPUTATION SCORES (oracle)");
  console.log("-".repeat(60));

  {
    const tx = await contract.batchSetScores(
      [deployer.address, buyer.address],
      [750, 420]
    );
    const receipt = await tx.wait();
    logTx("batchSetScores([seller=750, buyer=420])", receipt);
  }

  const sellerScore = await contract.getScore(deployer.address);
  const buyerScore = await contract.getScore(buyer.address);
  console.log(`  Seller: ${sellerScore} (${tier(Number(sellerScore))})`);
  console.log(`  Buyer:  ${buyerScore} (${tier(Number(buyerScore))})`);
  console.log();

  // -------------------------------------------------------
  // 3. Seller lists ad slot
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("3. LIST AD SLOT (0.10 USDC)");
  console.log("-".repeat(60));

  let slotId;
  {
    const tx = await contract.listAdSlot(
      adPrice,
      "Featured in my Moltbook feed for 7 days — 10k+ follower reach",
      "moltbook",
      168
    );
    const receipt = await tx.wait();
    logTx("listAdSlot(0.10 USDC, moltbook, 168h)", receipt);

    // Parse slot ID from event
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed?.name === "AdSlotListed") {
          slotId = parsed.args.slotId;
          break;
        }
      } catch {}
    }
    if (slotId === undefined) slotId = (await contract.nextSlotId()) - 1n;

    const slot = await contract.getAdSlot(slotId);
    console.log(`  Slot #${slotId}`);
    console.log(`  Placement: ${slot.placement}`);
    console.log(`  Duration:  ${slot.durationHours}h`);
    console.log(`  Price:     ${ethers.formatUnits(slot.priceUsdc, 6)} USDC`);
    console.log();
  }

  // -------------------------------------------------------
  // 4. Buyer approves USDC
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("4. BUYER APPROVES USDC");
  console.log("-".repeat(60));

  {
    const tx = await usdc.connect(buyer).approve(V2_ADDRESS, adPrice);
    const receipt = await tx.wait();
    logTx(
      `USDC.approve(${ethers.formatUnits(adPrice, 6)} USDC)`,
      receipt
    );
  }

  // -------------------------------------------------------
  // 5. Buyer purchases ad — USDC goes to escrow
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("5. BUY AD SLOT (USDC -> escrow)");
  console.log("-".repeat(60));

  let purchaseId;
  {
    const tx = await contract.connect(buyer).buyAdSlot(
      slotId,
      "https://clawsight.xyz/ad-banner.png",
      "https://buyerbrand.xyz",
      "BuyerBrand: next-gen AI agent tooling"
    );
    const receipt = await tx.wait();
    logTx("buyAdSlot(slotId, imageUrl, clickUrl, text)", receipt);

    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed?.name === "AdPurchased") {
          purchaseId = parsed.args.purchaseId;
          break;
        }
      } catch {}
    }
    if (purchaseId === undefined)
      purchaseId = (await contract.nextPurchaseId()) - 1n;

    const escrowAmt = await contract.getEscrow(purchaseId);
    console.log(`  Purchase #${purchaseId}`);
    console.log(`  Escrow: ${ethers.formatUnits(escrowAmt, 6)} USDC locked`);
    console.log(`  Status: ${STATUS[0]}`);
    console.log();
  }

  // -------------------------------------------------------
  // 6. Seller marks delivered
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("6. SELLER MARKS DELIVERED");
  console.log("-".repeat(60));

  {
    const tx = await contract.markDelivered(purchaseId);
    const receipt = await tx.wait();
    logTx("markDelivered(purchaseId)", receipt);

    const p = await contract.getPurchase(purchaseId);
    console.log(`  Status: ${STATUS[p.status]}`);
    console.log(`  Buyer has 3 days to confirm or dispute`);
    console.log();
  }

  // -------------------------------------------------------
  // 7. Buyer confirms — escrow releases to seller balance
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("7. BUYER CONFIRMS (escrow -> seller balance)");
  console.log("-".repeat(60));

  {
    const tx = await contract.connect(buyer).confirmDelivery(purchaseId);
    const receipt = await tx.wait();
    logTx("confirmDelivery(purchaseId)", receipt);

    const p = await contract.getPurchase(purchaseId);
    const escrow = await contract.getEscrow(purchaseId);
    const bal = await contract.getBalance(deployer.address);
    console.log(`  Status:    ${STATUS[p.status]}`);
    console.log(`  Escrow:    ${ethers.formatUnits(escrow, 6)} USDC (released)`);
    console.log(`  Claimable: ${ethers.formatUnits(bal, 6)} USDC`);
    console.log();
  }

  // -------------------------------------------------------
  // 8. Seller claims revenue
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("8. SELLER CLAIMS REVENUE (balance -> wallet)");
  console.log("-".repeat(60));

  {
    const before = await usdc.balanceOf(deployer.address);
    const tx = await contract.claimRevenue();
    const receipt = await tx.wait();
    logTx("claimRevenue()", receipt);

    const after = await usdc.balanceOf(deployer.address);
    console.log(`  Before: ${ethers.formatUnits(before, 6)} USDC`);
    console.log(`  After:  ${ethers.formatUnits(after, 6)} USDC`);
    console.log(`  Earned: +${ethers.formatUnits(after - before, 6)} USDC`);
    console.log();
  }

  // -------------------------------------------------------
  // 9. Final state
  // -------------------------------------------------------
  console.log("-".repeat(60));
  console.log("9. CONTRACT STATE");
  console.log("-".repeat(60));

  const agentCount = await contract.getAgentCount();
  const slotCount = await contract.nextSlotId();
  const purchaseCount = await contract.nextPurchaseId();
  const [topAddrs, topScores] = await contract.getTopAgents(5);

  console.log(`  Agents:    ${agentCount}`);
  console.log(`  Slots:     ${slotCount}`);
  console.log(`  Purchases: ${purchaseCount}`);
  console.log(`  Leaderboard:`);
  for (let i = 0; i < topAddrs.length; i++) {
    const a = await contract.getAgent(topAddrs[i]);
    console.log(
      `    #${i + 1} ${a.moltbookHandle} — ${topScores[i]} (${tier(Number(topScores[i]))})`
    );
  }
  console.log();

  // -------------------------------------------------------
  // Summary
  // -------------------------------------------------------
  console.log("=".repeat(60));
  console.log("FULL LIFECYCLE COMPLETE");
  console.log("=".repeat(60));
  console.log();
  console.log(
    "Register -> Score -> List -> Buy (escrow) -> Deliver -> Confirm -> Claim"
  );
  console.log();
  for (const { label, hash } of txs) {
    console.log(`  ${label}`);
    console.log(`    ${EXPLORER}/tx/${hash}`);
  }
  console.log();
  console.log(`V2 Contract: ${EXPLORER}/address/${V2_ADDRESS}`);
  console.log(`Seller:      ${EXPLORER}/address/${deployer.address}`);
  console.log(`Buyer:       ${EXPLORER}/address/${buyer.address}`);
  console.log("=".repeat(60));
}

function tier(s) {
  if (s >= 900) return "Diamond";
  if (s >= 600) return "Platinum";
  if (s >= 300) return "Gold";
  if (s >= 100) return "Silver";
  return "Bronze";
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Demo failed:", err);
    process.exit(1);
  });
