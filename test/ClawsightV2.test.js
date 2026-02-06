const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ClawsightV2", function () {
  let clawsight;
  let usdc;
  let owner, oracle, seller, buyer, other;

  const USDC_DECIMALS = 6;
  const ONE_USDC = ethers.parseUnits("1", USDC_DECIMALS);
  const TEN_USDC = ethers.parseUnits("10", USDC_DECIMALS);

  const DELIVERY_WINDOW = 7 * 24 * 60 * 60; // 7 days
  const DISPUTE_WINDOW = 3 * 24 * 60 * 60;  // 3 days

  beforeEach(async function () {
    [owner, oracle, seller, buyer, other] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdc = await MockERC20.deploy("USD Coin", "USDC", USDC_DECIMALS);

    // Deploy ClawsightV2
    const ClawsightV2 = await ethers.getContractFactory("ClawsightV2");
    clawsight = await ClawsightV2.deploy(await usdc.getAddress(), oracle.address);

    // Setup: mint USDC to buyer, approve contract
    await usdc.mint(buyer.address, ethers.parseUnits("1000", USDC_DECIMALS));
    await usdc.connect(buyer).approve(await clawsight.getAddress(), ethers.MaxUint256);

    // Register seller as agent
    await clawsight.connect(seller).registerAgent("seller_agent");
  });

  describe("Ad Slot Listing", function () {
    it("allows registered agents to list ad slots with placement and duration", async function () {
      await clawsight.connect(seller).listAdSlot(
        TEN_USDC,
        "Featured in my Moltbook posts",
        "moltbook",
        168 // 7 days
      );

      const slot = await clawsight.getAdSlot(0);
      expect(slot.seller).to.equal(seller.address);
      expect(slot.priceUsdc).to.equal(TEN_USDC);
      expect(slot.description).to.equal("Featured in my Moltbook posts");
      expect(slot.placement).to.equal("moltbook");
      expect(slot.durationHours).to.equal(168);
      expect(slot.active).to.be.true;
    });

    it("rejects unregistered agents", async function () {
      await expect(
        clawsight.connect(other).listAdSlot(TEN_USDC, "test", "moltbook", 24)
      ).to.be.revertedWith("Must be registered");
    });

    it("rejects invalid duration (0 or >720 hours)", async function () {
      await expect(
        clawsight.connect(seller).listAdSlot(TEN_USDC, "test", "moltbook", 0)
      ).to.be.revertedWith("Duration must be 1-720 hours");

      await expect(
        clawsight.connect(seller).listAdSlot(TEN_USDC, "test", "moltbook", 721)
      ).to.be.revertedWith("Duration must be 1-720 hours");
    });

    it("emits AdSlotListed with all fields", async function () {
      await expect(
        clawsight.connect(seller).listAdSlot(TEN_USDC, "desc", "chatr.ai", 48)
      ).to.emit(clawsight, "AdSlotListed")
        .withArgs(0, seller.address, TEN_USDC, "desc", "chatr.ai", 48);
    });
  });

  describe("Buying Ad Slots with Content", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Featured post", "moltbook", 168);
    });

    it("allows buyer to purchase with ad content", async function () {
      await clawsight.connect(buyer).buyAdSlot(
        0,
        "https://example.com/ad.png",
        "https://mysite.com",
        "Check out our product!"
      );

      const purchase = await clawsight.getPurchase(0);
      expect(purchase.id).to.equal(0);
      expect(purchase.buyer).to.equal(buyer.address);
      expect(purchase.seller).to.equal(seller.address);
      expect(purchase.priceUsdc).to.equal(TEN_USDC);
      expect(purchase.content.imageUrl).to.equal("https://example.com/ad.png");
      expect(purchase.content.clickUrl).to.equal("https://mysite.com");
      expect(purchase.content.text).to.equal("Check out our product!");
      expect(purchase.status).to.equal(0); // Pending
      expect(purchase.deliveredAt).to.equal(0); // Not delivered yet
    });

    it("locks funds in escrow", async function () {
      const buyerBalanceBefore = await usdc.balanceOf(buyer.address);

      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");

      expect(await clawsight.getEscrow(0)).to.equal(TEN_USDC);
      expect(await usdc.balanceOf(buyer.address)).to.equal(buyerBalanceBefore - TEN_USDC);
    });

    it("deactivates slot after purchase", async function () {
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");

      const slot = await clawsight.getAdSlot(0);
      expect(slot.active).to.be.false;
    });

    it("rejects buying an already-purchased slot", async function () {
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");

      // Mint USDC for other buyer
      await usdc.mint(other.address, TEN_USDC);
      await usdc.connect(other).approve(await clawsight.getAddress(), ethers.MaxUint256);

      await expect(
        clawsight.connect(other).buyAdSlot(0, "https://img.com/b.png", "https://b.com", "Ad 2")
      ).to.be.revertedWith("Slot not active");
    });

    it("rejects empty image URL", async function () {
      await expect(
        clawsight.connect(buyer).buyAdSlot(0, "", "https://a.com", "Ad")
      ).to.be.revertedWith("Invalid image URL");
    });

    it("rejects text over 280 chars", async function () {
      const longText = "a".repeat(281);
      await expect(
        clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", longText)
      ).to.be.revertedWith("Text too long");
    });

    it("rejects buying own slot", async function () {
      await expect(
        clawsight.connect(seller).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad")
      ).to.be.revertedWith("Cannot buy own slot");
    });

    it("emits AdPurchased event", async function () {
      await expect(
        clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad")
      ).to.emit(clawsight, "AdPurchased")
        .withArgs(0, 0, buyer.address, seller.address, TEN_USDC);
    });
  });

  describe("Delivery Flow", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Featured post", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");
    });

    it("seller can mark as delivered", async function () {
      await clawsight.connect(seller).markDelivered(0);

      const purchase = await clawsight.getPurchase(0);
      expect(purchase.status).to.equal(1); // Delivered
      expect(purchase.deliveredAt).to.be.gt(0);
    });

    it("only seller can mark delivered", async function () {
      await expect(
        clawsight.connect(buyer).markDelivered(0)
      ).to.be.revertedWith("Not seller");
    });

    it("rejects invalid purchase ID", async function () {
      await expect(
        clawsight.connect(seller).markDelivered(999)
      ).to.be.revertedWith("Invalid purchase ID");
    });

    it("buyer can confirm delivery (releases funds)", async function () {
      await clawsight.connect(seller).markDelivered(0);
      await clawsight.connect(buyer).confirmDelivery(0);

      const purchase = await clawsight.getPurchase(0);
      expect(purchase.status).to.equal(2); // Confirmed
      expect(await clawsight.getBalance(seller.address)).to.equal(TEN_USDC);
      expect(await clawsight.getEscrow(0)).to.equal(0);
    });

    it("buyer can confirm even if not marked delivered (early release)", async function () {
      await clawsight.connect(buyer).confirmDelivery(0);

      const purchase = await clawsight.getPurchase(0);
      expect(purchase.status).to.equal(2); // Confirmed
      expect(await clawsight.getBalance(seller.address)).to.equal(TEN_USDC);
    });

    it("emits AdDelivered and AdConfirmed events", async function () {
      await expect(clawsight.connect(seller).markDelivered(0))
        .to.emit(clawsight, "AdDelivered")
        .withArgs(0, seller.address);

      await expect(clawsight.connect(buyer).confirmDelivery(0))
        .to.emit(clawsight, "AdConfirmed")
        .withArgs(0, buyer.address);
    });
  });

  describe("Dispute Flow", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Featured post", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");
      await clawsight.connect(seller).markDelivered(0);
    });

    it("buyer can dispute within window", async function () {
      await clawsight.connect(buyer).disputeDelivery(0, "Ad was not displayed");

      const purchase = await clawsight.getPurchase(0);
      expect(purchase.status).to.equal(3); // Disputed
    });

    it("cannot dispute after dispute window (3 days from delivery)", async function () {
      await time.increase(DISPUTE_WINDOW + 1);

      await expect(
        clawsight.connect(buyer).disputeDelivery(0, "Too late")
      ).to.be.revertedWith("Dispute window passed");
    });

    it("dispute window is relative to delivery time, not purchase time", async function () {
      // Advance to day 6 (still within delivery window), then seller delivers
      await time.increase(6 * 24 * 60 * 60);

      // Create a new slot+purchase to test timing
      await clawsight.connect(seller).listAdSlot(ONE_USDC, "Late delivery test", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(1, "https://img.com/b.png", "https://b.com", "Ad 2");
      await clawsight.connect(seller).markDelivered(1);

      // 2 days after delivery — should still be within dispute window
      await time.increase(2 * 24 * 60 * 60);
      await clawsight.connect(buyer).disputeDelivery(1, "Still within window");

      const purchase = await clawsight.getPurchase(1);
      expect(purchase.status).to.equal(3); // Disputed
    });

    it("oracle can resolve dispute for buyer (refund)", async function () {
      await clawsight.connect(buyer).disputeDelivery(0, "Not delivered");

      const buyerBalanceBefore = await usdc.balanceOf(buyer.address);
      await clawsight.connect(oracle).resolveDisputeForBuyer(0);

      expect(await usdc.balanceOf(buyer.address)).to.equal(buyerBalanceBefore + TEN_USDC);
      expect(await clawsight.getPurchase(0).then(p => p.status)).to.equal(4); // Refunded
    });

    it("oracle can resolve dispute for seller", async function () {
      await clawsight.connect(buyer).disputeDelivery(0, "Fake dispute");
      await clawsight.connect(oracle).resolveDisputeForSeller(0);

      expect(await clawsight.getBalance(seller.address)).to.equal(TEN_USDC);
      expect(await clawsight.getPurchase(0).then(p => p.status)).to.equal(5); // Completed
    });

    it("only oracle can resolve disputes", async function () {
      await clawsight.connect(buyer).disputeDelivery(0, "Not delivered");

      await expect(
        clawsight.connect(other).resolveDisputeForBuyer(0)
      ).to.be.revertedWith("Only oracle");
    });

    it("rejects invalid purchase ID for dispute resolution", async function () {
      await expect(
        clawsight.connect(oracle).resolveDisputeForBuyer(999)
      ).to.be.revertedWith("Invalid purchase ID");
    });

    it("emits AdDisputed and AdRefunded events", async function () {
      await expect(
        clawsight.connect(buyer).disputeDelivery(0, "Bad delivery")
      ).to.emit(clawsight, "AdDisputed")
        .withArgs(0, buyer.address, "Bad delivery");

      await expect(
        clawsight.connect(oracle).resolveDisputeForBuyer(0)
      ).to.emit(clawsight, "AdRefunded")
        .withArgs(0, buyer.address, TEN_USDC);
    });
  });

  describe("Auto-Complete and Auto-Refund", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Featured post", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");
    });

    it("auto-completes after dispute window passes from delivery (not purchase)", async function () {
      await clawsight.connect(seller).markDelivered(0);
      // Dispute window = 3 days from delivery
      await time.increase(DISPUTE_WINDOW + 1);

      await clawsight.autoComplete(0);

      expect(await clawsight.getBalance(seller.address)).to.equal(TEN_USDC);
      expect(await clawsight.getPurchase(0).then(p => p.status)).to.equal(5); // Completed
    });

    it("cannot auto-complete before dispute window passes", async function () {
      await clawsight.connect(seller).markDelivered(0);

      await expect(
        clawsight.autoComplete(0)
      ).to.be.revertedWith("Dispute window not passed");
    });

    it("auto-refunds if seller doesn't deliver in time", async function () {
      await time.increase(DELIVERY_WINDOW + 1);

      const buyerBalanceBefore = await usdc.balanceOf(buyer.address);
      await clawsight.autoRefund(0);

      expect(await usdc.balanceOf(buyer.address)).to.equal(buyerBalanceBefore + TEN_USDC);
      expect(await clawsight.getPurchase(0).then(p => p.status)).to.equal(4); // Refunded
    });

    it("cannot auto-refund before delivery deadline", async function () {
      await expect(
        clawsight.autoRefund(0)
      ).to.be.revertedWith("Delivery deadline not passed");
    });

    it("rejects invalid purchase ID", async function () {
      await expect(
        clawsight.autoComplete(999)
      ).to.be.revertedWith("Invalid purchase ID");

      await expect(
        clawsight.autoRefund(999)
      ).to.be.revertedWith("Invalid purchase ID");
    });

    it("emits AdCompleted event", async function () {
      await clawsight.connect(seller).markDelivered(0);
      await time.increase(DISPUTE_WINDOW + 1);

      await expect(clawsight.autoComplete(0))
        .to.emit(clawsight, "AdCompleted")
        .withArgs(0);
    });
  });

  describe("Slot Deactivation", function () {
    it("slot is removed from active slots after purchase", async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Slot 1", "moltbook", 168);
      await clawsight.connect(seller).listAdSlot(ONE_USDC, "Slot 2", "chatr.ai", 24);

      let active = await clawsight.getActiveSlots();
      expect(active.length).to.equal(2);

      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");

      active = await clawsight.getActiveSlots();
      expect(active.length).to.equal(1);
      expect(active[0].id).to.equal(1); // Only slot 1 remains
    });

    it("seller can cancel and relist after purchase", async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Original", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");

      // Seller can list a new slot
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "New listing", "moltbook", 168);
      const slot = await clawsight.getAdSlot(1);
      expect(slot.active).to.be.true;
      expect(slot.description).to.equal("New listing");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Slot 1", "moltbook", 168);
      await clawsight.connect(seller).listAdSlot(ONE_USDC, "Slot 2", "chatr.ai", 24);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad 1");
    });

    it("getActiveSlots returns only active slots", async function () {
      const slots = await clawsight.getActiveSlots();
      expect(slots.length).to.equal(1); // Slot 0 deactivated after purchase
    });

    it("getPurchasesByBuyer returns buyer's purchases with correct ID", async function () {
      const purchases = await clawsight.getPurchasesByBuyer(buyer.address);
      expect(purchases.length).to.equal(1);
      expect(purchases[0].buyer).to.equal(buyer.address);
      expect(purchases[0].id).to.equal(0);
    });

    it("getPurchasesBySeller returns seller's purchases with correct ID", async function () {
      const purchases = await clawsight.getPurchasesBySeller(seller.address);
      expect(purchases.length).to.equal(1);
      expect(purchases[0].seller).to.equal(seller.address);
      expect(purchases[0].id).to.equal(0);
    });
  });

  describe("Revenue Claiming", function () {
    beforeEach(async function () {
      await clawsight.connect(seller).listAdSlot(TEN_USDC, "Featured post", "moltbook", 168);
      await clawsight.connect(buyer).buyAdSlot(0, "https://img.com/a.png", "https://a.com", "Ad");
      await clawsight.connect(buyer).confirmDelivery(0);
    });

    it("seller can claim revenue", async function () {
      const sellerBalanceBefore = await usdc.balanceOf(seller.address);

      await clawsight.connect(seller).claimRevenue();

      expect(await usdc.balanceOf(seller.address)).to.equal(sellerBalanceBefore + TEN_USDC);
      expect(await clawsight.getBalance(seller.address)).to.equal(0);
    });

    it("emits RevenueClaimed event", async function () {
      await expect(clawsight.connect(seller).claimRevenue())
        .to.emit(clawsight, "RevenueClaimed")
        .withArgs(seller.address, TEN_USDC);
    });

    it("reverts if no balance", async function () {
      await clawsight.connect(seller).claimRevenue();

      await expect(
        clawsight.connect(seller).claimRevenue()
      ).to.be.revertedWith("No balance");
    });
  });

  // Include all original tests for Agent Registry, Reputation, Admin
  describe("Agent Registry (inherited)", function () {
    it("registers agent with handle", async function () {
      await clawsight.connect(other).registerAgent("new_agent");
      const agent = await clawsight.getAgent(other.address);
      expect(agent.moltbookHandle).to.equal("new_agent");
      expect(agent.exists).to.be.true;
    });

    it("rejects duplicate registration", async function () {
      await expect(
        clawsight.connect(seller).registerAgent("duplicate")
      ).to.be.revertedWith("Already registered");
    });

    it("rejects taken handle", async function () {
      await expect(
        clawsight.connect(other).registerAgent("seller_agent")
      ).to.be.revertedWith("Handle taken");
    });
  });

  describe("Reputation (inherited)", function () {
    it("oracle can set score", async function () {
      await clawsight.connect(oracle).setScore(seller.address, 750);
      expect(await clawsight.getScore(seller.address)).to.equal(750);
    });

    it("only oracle can set score", async function () {
      await expect(
        clawsight.connect(other).setScore(seller.address, 500)
      ).to.be.revertedWith("Only oracle");
    });

    it("score max is 1000", async function () {
      await expect(
        clawsight.connect(oracle).setScore(seller.address, 1001)
      ).to.be.revertedWith("Score max 1000");
    });
  });

  describe("Admin (inherited)", function () {
    it("owner can pause", async function () {
      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(other).registerAgent("blocked")
      ).to.be.reverted;
    });

    it("owner can update oracle", async function () {
      await clawsight.connect(owner).setOracle(other.address);
      expect(await clawsight.oracle()).to.equal(other.address);
    });
  });
});
