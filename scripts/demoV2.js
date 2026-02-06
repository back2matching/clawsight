const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const V2_ADDRESS = "0xed550675235625872bbF02DbE7851C35Cc4aD501";
  const ONE_USDC = hre.ethers.parseUnits("1", 6);
  const EXPLORER = "https://sepolia.basescan.org";
  const txHashes = {};

  console.log("=== ClawsightV2 Demo ===\n");
  console.log("Deployer/Seller:", deployer.address);

  const contract = await hre.ethers.getContractAt("ClawsightV2", V2_ADDRESS);
  const usdc = await hre.ethers.getContractAt("IERC20", USDC_ADDRESS);

  // Get current fee data and boost it to avoid "replacement transaction underpriced"
  const feeData = await hre.ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * 3n;
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * 3n;
  const gasOverrides = { maxFeePerGas, maxPriorityFeePerGas };
  console.log("Gas overrides: maxFee=" + hre.ethers.formatUnits(maxFeePerGas, "gwei") + " gwei");

  // Get deployer nonce explicitly
  let deployerNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "pending");
  console.log("Starting deployer nonce:", deployerNonce);

  // Create a buyer wallet
  const buyerWallet = hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
  console.log("Buyer wallet:", buyerWallet.address);

  // Fund buyer with ETH for gas
  console.log("\n--- Funding buyer with ETH ---");
  const fundTx = await deployer.sendTransaction({
    to: buyerWallet.address,
    value: hre.ethers.parseEther("0.000015"),
    nonce: deployerNonce,
    ...gasOverrides,
  });
  await fundTx.wait();
  console.log("Fund ETH tx:", fundTx.hash);
  deployerNonce++;

  // Fund buyer with USDC
  console.log("\n--- Transferring 1 USDC to buyer ---");
  const usdcTx = await usdc.transfer(buyerWallet.address, ONE_USDC, { nonce: deployerNonce, ...gasOverrides });
  await usdcTx.wait();
  console.log("Transfer USDC tx:", usdcTx.hash);
  deployerNonce++;

  // 1. Register seller agent (skip if already registered)
  console.log("\n--- 1. Register seller agent ---");
  const sellerRegistered = await contract.isRegistered(deployer.address);
  if (sellerRegistered) {
    console.log("Seller already registered, skipping");
    txHashes.register = "(already registered)";
  } else {
    const regTx = await contract.registerAgent("clawsight_v2_seller", { nonce: deployerNonce, ...gasOverrides });
    await regTx.wait();
    console.log("Register tx:", regTx.hash);
    txHashes.register = regTx.hash;
    deployerNonce++;
  }

  // 2. Set seller score (deployer = oracle)
  console.log("\n--- 2. Set seller score to 750 (Platinum) ---");
  const scoreTx = await contract.setScore(deployer.address, 750, { nonce: deployerNonce, ...gasOverrides });
  await scoreTx.wait();
  console.log("Score tx:", scoreTx.hash);
  txHashes.score = scoreTx.hash;
  deployerNonce++;

  // 3. List ad slot
  const slotIdBefore = await contract.nextSlotId();
  console.log("\n--- 3. List ad slot (1 USDC, slot #" + slotIdBefore + ") ---");
  const listTx = await contract.listAdSlot(
    ONE_USDC,
    "Featured mention in Moltbook posts for 7 days",
    "moltbook",
    168,
    { nonce: deployerNonce, ...gasOverrides }
  );
  await listTx.wait();
  console.log("List ad tx:", listTx.hash);
  txHashes.listAd = listTx.hash;
  deployerNonce++;
  const slotId = slotIdBefore;

  // 4. Buyer registers
  console.log("\n--- 4. Register buyer agent ---");
  const buyerContract = contract.connect(buyerWallet);
  let buyerNonce = 0;
  const buyerRegTx = await buyerContract.registerAgent("v2buyer_" + Date.now(), { nonce: buyerNonce, ...gasOverrides });
  await buyerRegTx.wait();
  console.log("Buyer register tx:", buyerRegTx.hash);
  txHashes.buyerRegister = buyerRegTx.hash;
  buyerNonce++;

  // 5. Buyer approves USDC
  console.log("\n--- 5. Buyer approves USDC ---");
  const buyerUsdc = usdc.connect(buyerWallet);
  const approveTx = await buyerUsdc.approve(V2_ADDRESS, ONE_USDC, { nonce: buyerNonce, ...gasOverrides });
  await approveTx.wait();
  console.log("Approve tx:", approveTx.hash);
  txHashes.approve = approveTx.hash;
  buyerNonce++;

  // 6. Buyer buys ad slot with content
  const purchaseIdBefore = await contract.nextPurchaseId();
  console.log("\n--- 6. Buyer purchases ad slot #" + slotId + " ---");
  const buyTx = await buyerContract.buyAdSlot(
    slotId,
    "https://clawsight.xyz/ad-banner.png",
    "https://clawsight.xyz",
    "Clawsight: Zero-fee ad marketplace for AI agents",
    { nonce: buyerNonce, ...gasOverrides }
  );
  await buyTx.wait();
  console.log("Buy ad tx:", buyTx.hash);
  txHashes.buyAd = buyTx.hash;
  buyerNonce++;
  const purchaseId = purchaseIdBefore;

  // 7. Seller marks delivered
  console.log("\n--- 7. Seller marks delivered (purchase #" + purchaseId + ") ---");
  const deliverTx = await contract.markDelivered(purchaseId, { nonce: deployerNonce, ...gasOverrides });
  await deliverTx.wait();
  console.log("Mark delivered tx:", deliverTx.hash);
  txHashes.deliver = deliverTx.hash;
  deployerNonce++;

  // 8. Buyer confirms delivery
  console.log("\n--- 8. Buyer confirms delivery ---");
  const confirmTx = await buyerContract.confirmDelivery(purchaseId, { nonce: buyerNonce, ...gasOverrides });
  await confirmTx.wait();
  console.log("Confirm delivery tx:", confirmTx.hash);
  txHashes.confirm = confirmTx.hash;

  // 9. Seller claims revenue
  console.log("\n--- 9. Seller claims revenue ---");
  const claimTx = await contract.claimRevenue({ nonce: deployerNonce, ...gasOverrides });
  await claimTx.wait();
  console.log("Claim revenue tx:", claimTx.hash);
  txHashes.claim = claimTx.hash;

  // Summary
  console.log("\n\n=== DEMO COMPLETE ===\n");
  console.log("V2 Contract:", `${EXPLORER}/address/${V2_ADDRESS}`);
  console.log("");
  console.log("Transaction Links:");
  const link = (h) => h.startsWith("0x") ? `${EXPLORER}/tx/${h}` : h;
  console.log(`  Register seller:    ${link(txHashes.register)}`);
  console.log(`  Set score 750:      ${link(txHashes.score)}`);
  console.log(`  List ad slot:       ${link(txHashes.listAd)}`);
  console.log(`  Register buyer:     ${link(txHashes.buyerRegister)}`);
  console.log(`  Approve USDC:       ${link(txHashes.approve)}`);
  console.log(`  Buy ad (w/ content):${link(txHashes.buyAd)}`);
  console.log(`  Mark delivered:     ${link(txHashes.deliver)}`);
  console.log(`  Confirm delivery:   ${link(txHashes.confirm)}`);
  console.log(`  Claim revenue:      ${link(txHashes.claim)}`);
}

main()
  .then(() => {
    console.log("\nAll V2 demo transactions successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
