const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Clawsight", function () {
  let clawsight, mockUsdc;
  let owner, oracle, agent1, agent2, agent3, nonAgent;

  const USDC_DECIMALS = 6;
  const parseUsdc = (amount) => ethers.parseUnits(amount.toString(), USDC_DECIMALS);

  beforeEach(async function () {
    [owner, oracle, agent1, agent2, agent3, nonAgent] = await ethers.getSigners();

    // Deploy MockERC20 (USDC)
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUsdc = await MockERC20.deploy("USD Coin", "USDC", USDC_DECIMALS);
    await mockUsdc.waitForDeployment();

    // Deploy Clawsight
    const Clawsight = await ethers.getContractFactory("Clawsight");
    clawsight = await Clawsight.deploy(mockUsdc.target, oracle.address);
    await clawsight.waitForDeployment();

    // Mint USDC to test accounts
    await mockUsdc.mint(agent1.address, parseUsdc(1000));
    await mockUsdc.mint(agent2.address, parseUsdc(1000));
    await mockUsdc.mint(agent3.address, parseUsdc(1000));
  });

  // =========================================================================
  // Agent Registry
  // =========================================================================

  describe("Agent Registry", function () {
    it("registers agent with valid handle", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      const agent = await clawsight.getAgent(agent1.address);
      expect(agent.moltbookHandle).to.equal("alice");
      expect(agent.exists).to.be.true;
    });

    it("emits AgentRegistered event", async function () {
      await expect(clawsight.connect(agent1).registerAgent("alice"))
        .to.emit(clawsight, "AgentRegistered")
        .withArgs(agent1.address, "alice", (ts) => ts > 0n);
    });

    it("rejects duplicate wallet registration", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await expect(
        clawsight.connect(agent1).registerAgent("alice2")
      ).to.be.revertedWith("Already registered");
    });

    it("rejects duplicate handle", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await expect(
        clawsight.connect(agent2).registerAgent("alice")
      ).to.be.revertedWith("Handle taken");
    });

    it("rejects handle < 3 chars", async function () {
      await expect(
        clawsight.connect(agent1).registerAgent("ab")
      ).to.be.revertedWith("Handle must be 3-50 chars");
    });

    it("rejects handle > 50 chars", async function () {
      const longHandle = "a".repeat(51);
      await expect(
        clawsight.connect(agent1).registerAgent(longHandle)
      ).to.be.revertedWith("Handle must be 3-50 chars");
    });

    it("accepts handle at exactly 3 chars", async function () {
      await clawsight.connect(agent1).registerAgent("abc");
      const agent = await clawsight.getAgent(agent1.address);
      expect(agent.exists).to.be.true;
    });

    it("accepts handle at exactly 50 chars", async function () {
      const handle50 = "a".repeat(50);
      await clawsight.connect(agent1).registerAgent(handle50);
      const agent = await clawsight.getAgent(agent1.address);
      expect(agent.exists).to.be.true;
    });

    it("getAgent returns correct data", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      const agent = await clawsight.getAgent(agent1.address);
      expect(agent.moltbookHandle).to.equal("alice");
      expect(agent.registeredAt).to.be.greaterThan(0n);
      expect(agent.exists).to.be.true;
    });

    it("getAgent returns empty for unregistered address", async function () {
      const agent = await clawsight.getAgent(nonAgent.address);
      expect(agent.exists).to.be.false;
      expect(agent.moltbookHandle).to.equal("");
    });

    it("isRegistered returns true for registered agent", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      expect(await clawsight.isRegistered(agent1.address)).to.be.true;
    });

    it("isRegistered returns false for unregistered address", async function () {
      expect(await clawsight.isRegistered(nonAgent.address)).to.be.false;
    });

    it("getAgentCount increments", async function () {
      expect(await clawsight.getAgentCount()).to.equal(0);

      await clawsight.connect(agent1).registerAgent("alice");
      expect(await clawsight.getAgentCount()).to.equal(1);

      await clawsight.connect(agent2).registerAgent("bob");
      expect(await clawsight.getAgentCount()).to.equal(2);
    });
  });

  // =========================================================================
  // Reputation
  // =========================================================================

  describe("Reputation", function () {
    beforeEach(async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(agent2).registerAgent("bob");
      await clawsight.connect(agent3).registerAgent("charlie");
    });

    it("oracle can setScore", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 500);
      expect(await clawsight.getScore(agent1.address)).to.equal(500);
    });

    it("non-oracle cannot setScore", async function () {
      await expect(
        clawsight.connect(agent1).setScore(agent1.address, 500)
      ).to.be.revertedWith("Only oracle");
    });

    it("rejects score > 1000", async function () {
      await expect(
        clawsight.connect(oracle).setScore(agent1.address, 1001)
      ).to.be.revertedWith("Score max 1000");
    });

    it("accepts score of exactly 1000", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 1000);
      expect(await clawsight.getScore(agent1.address)).to.equal(1000);
    });

    it("accepts score of 0", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 0);
      expect(await clawsight.getScore(agent1.address)).to.equal(0);
    });

    it("rejects unregistered agent", async function () {
      await expect(
        clawsight.connect(oracle).setScore(nonAgent.address, 500)
      ).to.be.revertedWith("Agent not registered");
    });

    it("emits ScoreUpdated event with old and new scores", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 300);

      await expect(clawsight.connect(oracle).setScore(agent1.address, 700))
        .to.emit(clawsight, "ScoreUpdated")
        .withArgs(agent1.address, 300, 700);
    });

    it("emits ScoreUpdated with 0 as old score on first set", async function () {
      await expect(clawsight.connect(oracle).setScore(agent1.address, 500))
        .to.emit(clawsight, "ScoreUpdated")
        .withArgs(agent1.address, 0, 500);
    });

    it("batchSetScores works", async function () {
      await clawsight.connect(oracle).batchSetScores(
        [agent1.address, agent2.address, agent3.address],
        [100, 200, 300]
      );
      expect(await clawsight.getScore(agent1.address)).to.equal(100);
      expect(await clawsight.getScore(agent2.address)).to.equal(200);
      expect(await clawsight.getScore(agent3.address)).to.equal(300);
    });

    it("batchSetScores rejects length mismatch", async function () {
      await expect(
        clawsight.connect(oracle).batchSetScores(
          [agent1.address, agent2.address],
          [100]
        )
      ).to.be.revertedWith("Length mismatch");
    });

    it("batchSetScores rejects if any agent is unregistered", async function () {
      await expect(
        clawsight.connect(oracle).batchSetScores(
          [agent1.address, nonAgent.address],
          [100, 200]
        )
      ).to.be.revertedWith("Agent not registered");
    });

    it("batchSetScores rejects if any score > 1000", async function () {
      await expect(
        clawsight.connect(oracle).batchSetScores(
          [agent1.address, agent2.address],
          [500, 1001]
        )
      ).to.be.revertedWith("Score max 1000");
    });

    it("non-oracle cannot batchSetScores", async function () {
      await expect(
        clawsight.connect(agent1).batchSetScores(
          [agent1.address],
          [100]
        )
      ).to.be.revertedWith("Only oracle");
    });

    it("getTopAgents returns correct order", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 300);
      await clawsight.connect(oracle).setScore(agent2.address, 900);
      await clawsight.connect(oracle).setScore(agent3.address, 600);

      const [addrs, topScores] = await clawsight.getTopAgents(3);
      expect(addrs[0]).to.equal(agent2.address);
      expect(topScores[0]).to.equal(900);
      expect(addrs[1]).to.equal(agent3.address);
      expect(topScores[1]).to.equal(600);
      expect(addrs[2]).to.equal(agent1.address);
      expect(topScores[2]).to.equal(300);
    });

    it("getTopAgents with count > total agents returns all", async function () {
      await clawsight.connect(oracle).setScore(agent1.address, 500);
      await clawsight.connect(oracle).setScore(agent2.address, 800);

      const [addrs, topScores] = await clawsight.getTopAgents(10);
      expect(addrs.length).to.equal(3);
      expect(topScores.length).to.equal(3);
    });

    it("getTopAgents with count = 0 returns empty", async function () {
      const [addrs, topScores] = await clawsight.getTopAgents(0);
      expect(addrs.length).to.equal(0);
      expect(topScores.length).to.equal(0);
    });
  });

  // =========================================================================
  // Ad Marketplace
  // =========================================================================

  describe("Ad Marketplace", function () {
    const adPrice = parseUsdc(50);
    const adDescription = "Promote your AI agent on my feed";

    beforeEach(async function () {
      // Register agents
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(agent2).registerAgent("bob");
    });

    it("registered agent can listAdSlot", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      const slot = await clawsight.getAdSlot(0);
      expect(slot.seller).to.equal(agent1.address);
      expect(slot.priceUsdc).to.equal(adPrice);
      expect(slot.description).to.equal(adDescription);
      expect(slot.active).to.be.true;
      expect(slot.sold).to.be.false;
      expect(slot.buyer).to.equal(ethers.ZeroAddress);
    });

    it("unregistered cannot listAdSlot", async function () {
      await expect(
        clawsight.connect(nonAgent).listAdSlot(adPrice, adDescription)
      ).to.be.revertedWith("Must be registered");
    });

    it("rejects price = 0", async function () {
      await expect(
        clawsight.connect(agent1).listAdSlot(0, adDescription)
      ).to.be.revertedWith("Price must be > 0");
    });

    it("rejects description > 500 chars", async function () {
      const longDesc = "a".repeat(501);
      await expect(
        clawsight.connect(agent1).listAdSlot(adPrice, longDesc)
      ).to.be.revertedWith("Description must be 1-500 chars");
    });

    it("rejects empty description", async function () {
      await expect(
        clawsight.connect(agent1).listAdSlot(adPrice, "")
      ).to.be.revertedWith("Description must be 1-500 chars");
    });

    it("accepts description at exactly 500 chars", async function () {
      const desc500 = "a".repeat(500);
      await clawsight.connect(agent1).listAdSlot(adPrice, desc500);
      const slot = await clawsight.getAdSlot(0);
      expect(slot.active).to.be.true;
    });

    it("accepts description at exactly 1 char", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, "x");
      const slot = await clawsight.getAdSlot(0);
      expect(slot.active).to.be.true;
    });

    it("increments nextSlotId", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 1");
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 2");
      expect(await clawsight.nextSlotId()).to.equal(2);
    });

    it("emits AdSlotListed event", async function () {
      await expect(clawsight.connect(agent1).listAdSlot(adPrice, adDescription))
        .to.emit(clawsight, "AdSlotListed")
        .withArgs(0, agent1.address, adPrice, adDescription);
    });

    it("buyAdSlot transfers USDC and credits seller 100%", async function () {
      // agent1 lists, agent2 buys
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);

      // Approve USDC
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);

      // Buy
      await clawsight.connect(agent2).buyAdSlot(0);

      // Check slot state
      const slot = await clawsight.getAdSlot(0);
      expect(slot.sold).to.be.true;
      expect(slot.active).to.be.false;
      expect(slot.buyer).to.equal(agent2.address);

      // 100% goes to seller balance
      expect(await clawsight.getBalance(agent1.address)).to.equal(adPrice);

      // Buyer's USDC decreased
      expect(await mockUsdc.balanceOf(agent2.address)).to.equal(parseUsdc(950));

      // Contract holds the USDC
      expect(await mockUsdc.balanceOf(clawsight.target)).to.equal(adPrice);
    });

    it("buyAdSlot reverts if buyer is seller", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent1).approve(clawsight.target, adPrice);
      await expect(
        clawsight.connect(agent1).buyAdSlot(0)
      ).to.be.revertedWith("Cannot buy own slot");
    });

    it("buyAdSlot reverts on inactive slot", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await clawsight.connect(agent1).cancelAdSlot(0);

      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await expect(
        clawsight.connect(agent2).buyAdSlot(0)
      ).to.be.revertedWith("Slot not active");
    });

    it("buyAdSlot reverts on already sold slot", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await clawsight.connect(agent2).buyAdSlot(0);

      // agent3 tries to buy same slot - active is set to false on purchase,
      // so the first require (slot.active) triggers before the sold check
      await clawsight.connect(agent3).registerAgent("charlie");
      await mockUsdc.connect(agent3).approve(clawsight.target, adPrice);
      await expect(
        clawsight.connect(agent3).buyAdSlot(0)
      ).to.be.revertedWith("Slot not active");
    });

    it("emits AdSlotPurchased event", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);

      await expect(clawsight.connect(agent2).buyAdSlot(0))
        .to.emit(clawsight, "AdSlotPurchased")
        .withArgs(0, agent2.address, agent1.address, adPrice);
    });

    it("cancelAdSlot works for seller", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await clawsight.connect(agent1).cancelAdSlot(0);

      const slot = await clawsight.getAdSlot(0);
      expect(slot.active).to.be.false;
      expect(slot.sold).to.be.false;
    });

    it("cancelAdSlot reverts for non-seller", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await expect(
        clawsight.connect(agent2).cancelAdSlot(0)
      ).to.be.revertedWith("Not seller");
    });

    it("cancelAdSlot reverts on already cancelled slot", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await clawsight.connect(agent1).cancelAdSlot(0);
      await expect(
        clawsight.connect(agent1).cancelAdSlot(0)
      ).to.be.revertedWith("Not active");
    });

    it("cancelAdSlot reverts on already sold slot", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await clawsight.connect(agent2).buyAdSlot(0);

      await expect(
        clawsight.connect(agent1).cancelAdSlot(0)
      ).to.be.revertedWith("Not active");
    });

    it("emits AdSlotCancelled event", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await expect(clawsight.connect(agent1).cancelAdSlot(0))
        .to.emit(clawsight, "AdSlotCancelled")
        .withArgs(0);
    });

    it("claimRevenue transfers USDC to seller", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await clawsight.connect(agent2).buyAdSlot(0);

      const sellerBalBefore = await mockUsdc.balanceOf(agent1.address);
      await clawsight.connect(agent1).claimRevenue();
      const sellerBalAfter = await mockUsdc.balanceOf(agent1.address);

      expect(sellerBalAfter - sellerBalBefore).to.equal(adPrice);
      expect(await clawsight.getBalance(agent1.address)).to.equal(0);
    });

    it("claimRevenue reverts with zero balance", async function () {
      await expect(
        clawsight.connect(agent1).claimRevenue()
      ).to.be.revertedWith("No balance");
    });

    it("emits RevenueClaimed event", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, adDescription);
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await clawsight.connect(agent2).buyAdSlot(0);

      await expect(clawsight.connect(agent1).claimRevenue())
        .to.emit(clawsight, "RevenueClaimed")
        .withArgs(agent1.address, adPrice);
    });

    it("getActiveSlots returns only active unsold slots", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 1");
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 2");
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 3");

      // Cancel slot 0
      await clawsight.connect(agent1).cancelAdSlot(0);

      // Buy slot 1
      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice);
      await clawsight.connect(agent2).buyAdSlot(1);

      // Only slot 2 should be active
      const active = await clawsight.getActiveSlots();
      expect(active.length).to.equal(1);
      expect(active[0].id).to.equal(2);
      expect(active[0].description).to.equal("Ad 3");
    });

    it("getActiveSlots returns empty when no slots", async function () {
      const active = await clawsight.getActiveSlots();
      expect(active.length).to.equal(0);
    });

    it("multiple purchases accumulate seller balance", async function () {
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 1");
      await clawsight.connect(agent1).listAdSlot(adPrice, "Ad 2");

      await mockUsdc.connect(agent2).approve(clawsight.target, adPrice * 2n);
      await clawsight.connect(agent2).buyAdSlot(0);
      await clawsight.connect(agent2).buyAdSlot(1);

      expect(await clawsight.getBalance(agent1.address)).to.equal(adPrice * 2n);
    });
  });

  // =========================================================================
  // Admin
  // =========================================================================

  describe("Admin", function () {
    it("owner can setOracle", async function () {
      await clawsight.connect(owner).setOracle(agent1.address);
      expect(await clawsight.oracle()).to.equal(agent1.address);
    });

    it("non-owner cannot setOracle", async function () {
      await expect(
        clawsight.connect(agent1).setOracle(agent2.address)
      ).to.be.revertedWithCustomError(clawsight, "OwnableUnauthorizedAccount");
    });

    it("rejects zero address oracle", async function () {
      await expect(
        clawsight.connect(owner).setOracle(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid oracle address");
    });

    it("emits OracleUpdated event", async function () {
      await expect(clawsight.connect(owner).setOracle(agent1.address))
        .to.emit(clawsight, "OracleUpdated")
        .withArgs(oracle.address, agent1.address);
    });

    it("owner can pause", async function () {
      await clawsight.connect(owner).pause();
      expect(await clawsight.paused()).to.be.true;
    });

    it("owner can unpause", async function () {
      await clawsight.connect(owner).pause();
      await clawsight.connect(owner).unpause();
      expect(await clawsight.paused()).to.be.false;
    });

    it("non-owner cannot pause", async function () {
      await expect(
        clawsight.connect(agent1).pause()
      ).to.be.revertedWithCustomError(clawsight, "OwnableUnauthorizedAccount");
    });

    it("non-owner cannot unpause", async function () {
      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(agent1).unpause()
      ).to.be.revertedWithCustomError(clawsight, "OwnableUnauthorizedAccount");
    });

    it("registerAgent reverts when paused", async function () {
      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(agent1).registerAgent("alice")
      ).to.be.revertedWithCustomError(clawsight, "EnforcedPause");
    });

    it("setScore reverts when paused", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(oracle).setScore(agent1.address, 500)
      ).to.be.revertedWithCustomError(clawsight, "EnforcedPause");
    });

    it("listAdSlot reverts when paused", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(agent1).listAdSlot(parseUsdc(10), "Ad")
      ).to.be.revertedWithCustomError(clawsight, "EnforcedPause");
    });

    it("buyAdSlot reverts when paused", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(agent1).listAdSlot(parseUsdc(10), "Ad slot");
      await clawsight.connect(owner).pause();

      await mockUsdc.connect(agent2).approve(clawsight.target, parseUsdc(10));
      await expect(
        clawsight.connect(agent2).buyAdSlot(0)
      ).to.be.revertedWithCustomError(clawsight, "EnforcedPause");
    });

    it("claimRevenue reverts when paused", async function () {
      await clawsight.connect(agent1).registerAgent("alice");
      await clawsight.connect(agent2).registerAgent("bob");
      await clawsight.connect(agent1).listAdSlot(parseUsdc(10), "Ad slot");
      await mockUsdc.connect(agent2).approve(clawsight.target, parseUsdc(10));
      await clawsight.connect(agent2).buyAdSlot(0);

      await clawsight.connect(owner).pause();
      await expect(
        clawsight.connect(agent1).claimRevenue()
      ).to.be.revertedWithCustomError(clawsight, "EnforcedPause");
    });

    it("functions work again after unpause", async function () {
      await clawsight.connect(owner).pause();
      await clawsight.connect(owner).unpause();
      await clawsight.connect(agent1).registerAgent("alice");
      expect(await clawsight.isRegistered(agent1.address)).to.be.true;
    });
  });

  // =========================================================================
  // Constructor
  // =========================================================================

  describe("Constructor", function () {
    it("rejects zero address for USDC", async function () {
      const Clawsight = await ethers.getContractFactory("Clawsight");
      await expect(
        Clawsight.deploy(ethers.ZeroAddress, oracle.address)
      ).to.be.revertedWith("Invalid USDC address");
    });

    it("rejects zero address for oracle", async function () {
      const Clawsight = await ethers.getContractFactory("Clawsight");
      await expect(
        Clawsight.deploy(mockUsdc.target, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid oracle address");
    });

    it("sets correct initial state", async function () {
      expect(await clawsight.usdc()).to.equal(mockUsdc.target);
      expect(await clawsight.oracle()).to.equal(oracle.address);
      expect(await clawsight.owner()).to.equal(owner.address);
      expect(await clawsight.nextSlotId()).to.equal(0);
      expect(await clawsight.getAgentCount()).to.equal(0);
    });
  });
});
