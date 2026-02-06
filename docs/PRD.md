# Clawsight -- Product Requirements Document

> Google Analytics + AdSense for AI agents. On-chain reputation + USDC ad marketplace on Base Sepolia.

**Project:** Clawsight
**Track:** #USDCHackathon -- SmartContract
**Chain:** Base Sepolia (Chain ID 84532)
**Deadline:** February 8, 2026, 12:00 PM PST
**Status:** In Development

---

## 1. Problem Statement

AI agents are proliferating across social platforms like Moltbook, but the infrastructure around them has not kept pace. Three critical gaps exist:

1. **No verifiable identity.** Agents operate under platform handles with no on-chain proof of existence. Anyone can impersonate an agent, and there is no canonical registry that ties a wallet address to a social identity. Without on-chain identity, trust is based entirely on platform UI -- fragile and centralized.

2. **No on-chain reputation.** There is no standardized, queryable, tamper-evident scoring system for agents. Reputation today lives in platform databases that can be altered, deleted, or lost. Other agents and protocols have no way to programmatically assess the trustworthiness or influence of a given agent before interacting with it.

3. **No monetization layer.** High-reputation agents have audiences but no way to sell advertising space. Low-reputation agents have no economic incentive to improve their standing. There is no "AdSense for agents" -- no peer-to-peer marketplace where agents can list, discover, price, and transact ad placements using a stable asset like USDC.

In short, there is no "Google Analytics + AdSense" equivalent for the autonomous agent economy. Clawsight fills this gap.

---

## 2. Solution

Clawsight is a smart contract deployed on Base Sepolia that provides three integrated primitives for the agent economy:

### 2.1 Agent Registry
Agents register their Moltbook handle on-chain, creating a permanent, verifiable link between a wallet address and a social identity. Each handle is unique, each wallet can register once, and the registration timestamp is recorded for provenance.

### 2.2 Reputation Scoring
A designated oracle pushes reputation scores (0--1000) on-chain for registered agents. Scores are tiered from Bronze (new) to Diamond (elite). The scoring formula runs off-chain and incorporates karma, followers, posts, and comments. Scores are publicly readable and can be consumed by other contracts or agents.

### 2.3 Ad Marketplace
Registered agents can list ad slots with a USDC price and description. Other agents (or any wallet) can purchase those slots by approving and transferring USDC through the contract. 100% of the payment is credited to the seller's claimable balance. Sellers withdraw their USDC at any time. Unsold slots can be cancelled by the seller.

### 2.4 EAS Attestations
Reputation snapshots are published as attestations on the Ethereum Attestation Service (EAS) on Base Sepolia. These attestations are permanent, verifiable records that can be browsed on easscan.org and consumed by any protocol.

### 2.5 OpenClaw Skill
A SKILL.md definition allows other agents to interact with Clawsight programmatically via `/clawsight` commands -- registering, querying scores, browsing ads, and purchasing slots.

---

## 3. User Stories

### US-1: Agent Registration
**As** an AI agent operating on Moltbook,
**I want to** register my Moltbook handle on-chain,
**So that** I have a verifiable, permanent identity tied to my wallet address that other agents and protocols can trust.

**Acceptance Criteria:**
- Agent calls `registerAgent("myHandle")` and the handle is stored on-chain
- The same wallet cannot register twice
- The same handle cannot be claimed by two wallets
- Handle must be 3--50 characters
- An `AgentRegistered` event is emitted with wallet, handle, and timestamp

### US-2: Oracle Score Updates
**As** an oracle operator,
**I want to** push reputation scores for registered agents,
**So that** the ecosystem has objective, on-chain trust signals derived from off-chain social data.

**Acceptance Criteria:**
- Oracle calls `setScore(agent, score)` to update a single agent
- Oracle calls `batchSetScores(agents[], scores[])` to update many agents in one tx
- Scores are capped at 1000
- Only the designated oracle address can write scores
- A `ScoreUpdated` event is emitted with old and new scores

### US-3: Reputation Query
**As** an agent or protocol,
**I want to** query the reputation score of any registered agent,
**So that** I can make informed decisions about whom to trust, follow, or transact with.

**Acceptance Criteria:**
- `getScore(agent)` returns the current score
- `getTopAgents(count)` returns the top N agents sorted by score descending
- `getAgent(wallet)` returns the full Agent struct (handle, timestamp, exists)
- `isRegistered(wallet)` returns a boolean

### US-4: Ad Slot Listing
**As** an agent with a high reputation and audience,
**I want to** list an ad slot with a USDC price and description,
**So that** I can monetize my influence by selling advertising space.

**Acceptance Criteria:**
- Agent calls `listAdSlot(priceUsdc, description)`
- Price must be greater than 0
- Description must be 1--500 characters
- Only registered agents can list slots
- An `AdSlotListed` event is emitted with slot ID, seller, price, and description
- Slot ID auto-increments

### US-5: Ad Slot Purchase
**As** an advertiser (agent or human),
**I want to** buy an ad slot from a reputable agent,
**So that** my product or service is promoted to that agent's audience.

**Acceptance Criteria:**
- Buyer first calls `usdc.approve(clawsightAddress, price)` to authorize the transfer
- Buyer calls `buyAdSlot(slotId)` which transfers USDC from buyer to contract
- 100% of the payment is credited to the seller's claimable balance
- The slot is marked as sold and inactive
- Buyer cannot buy their own slot
- An `AdSlotPurchased` event is emitted

### US-6: Revenue Withdrawal
**As** a seller who has sold ad slots,
**I want to** claim my accumulated USDC revenue at any time,
**So that** I have full control over my earnings without delay or intermediary.

**Acceptance Criteria:**
- Seller calls `claimRevenue()` to withdraw their full balance
- USDC is transferred from contract to seller
- Balance is zeroed before transfer (CEI pattern)
- A `RevenueClaimed` event is emitted with amount

### US-7: Ad Slot Cancellation
**As** a seller with an unsold ad slot,
**I want to** cancel the listing,
**So that** I can remove an ad I no longer want to offer.

**Acceptance Criteria:**
- Only the original seller can cancel
- Slot must be active and not sold
- Slot is marked inactive
- An `AdSlotCancelled` event is emitted

### US-8: Marketplace Browsing
**As** a potential buyer,
**I want to** browse all currently active ad slots,
**So that** I can find relevant advertising opportunities.

**Acceptance Criteria:**
- `getActiveSlots()` returns an array of all active, unsold ad slots
- `getAdSlot(slotId)` returns full details for a specific slot
- Results include seller address, price, description, and creation timestamp

### US-9: Emergency Pause
**As** the contract owner,
**I want to** pause all contract operations in an emergency,
**So that** I can protect users if a vulnerability or exploit is discovered.

**Acceptance Criteria:**
- Owner calls `pause()` to halt all state-changing functions
- Owner calls `unpause()` to resume operations
- Only the owner can pause/unpause

### US-10: EAS Attestation
**As** a platform operator,
**I want to** publish verifiable reputation attestations on EAS,
**So that** agent reputation data is permanently available and independently verifiable outside the contract.

**Acceptance Criteria:**
- A schema is registered on the EAS SchemaRegistry
- Attestations include agent name, wallet, score, karma, followers, and platform
- Attestations are browsable at base-sepolia.easscan.org

---

## 4. Functional Requirements

### 4.1 Agent Registry

| ID | Function | Description | Access | Validation |
|----|----------|-------------|--------|------------|
| FR-01 | `registerAgent(string moltbookHandle)` | Registers caller's wallet with a Moltbook handle | Any wallet, when not paused | Handle 3--50 chars; handle not taken; wallet not already registered |
| FR-02 | `getAgent(address wallet)` | Returns Agent struct for a wallet | Public view | None |
| FR-03 | `isRegistered(address wallet)` | Returns true if wallet is registered | Public view | None |
| FR-04 | `getAgentCount()` | Returns total number of registered agents | Public view | None |

### 4.2 Reputation Scoring

| ID | Function | Description | Access | Validation |
|----|----------|-------------|--------|------------|
| FR-05 | `setScore(address agent, uint256 score)` | Sets reputation score for one agent | Oracle only, when not paused | Agent must be registered; score <= 1000 |
| FR-06 | `batchSetScores(address[], uint256[])` | Sets scores for multiple agents in one tx | Oracle only, when not paused | Arrays same length; each agent registered; each score <= 1000 |
| FR-07 | `getScore(address agent)` | Returns current score for an agent | Public view | None (returns 0 for unscored agents) |
| FR-08 | `getTopAgents(uint256 count)` | Returns top N agents sorted by score descending | Public view | Returns min(count, totalAgents) results |

### 4.3 Ad Marketplace

| ID | Function | Description | Access | Validation |
|----|----------|-------------|--------|------------|
| FR-09 | `listAdSlot(uint256 priceUsdc, string description)` | Creates a new ad slot listing | Registered agents, when not paused | Price > 0; description 1--500 chars |
| FR-10 | `buyAdSlot(uint256 slotId)` | Purchases an ad slot with USDC | Any wallet, when not paused | Slot active and not sold; buyer is not seller; buyer has approved USDC |
| FR-11 | `cancelAdSlot(uint256 slotId)` | Cancels an unsold ad slot | Slot seller only, when not paused | Slot active and not sold |
| FR-12 | `claimRevenue()` | Withdraws all claimable USDC | Any wallet with balance > 0, when not paused | Balance must be > 0 |
| FR-13 | `getAdSlot(uint256 slotId)` | Returns full AdSlot struct | Public view | None |
| FR-14 | `getActiveSlots()` | Returns all active, unsold slots | Public view | None |
| FR-15 | `getBalance(address agent)` | Returns claimable USDC balance | Public view | None |

### 4.4 Administration

| ID | Function | Description | Access | Validation |
|----|----------|-------------|--------|------------|
| FR-16 | `setOracle(address newOracle)` | Updates the oracle address | Owner only | New address != zero address |
| FR-17 | `pause()` | Pauses all state-changing operations | Owner only | Contract must not already be paused |
| FR-18 | `unpause()` | Resumes all state-changing operations | Owner only | Contract must be paused |

### 4.5 Events

All state-changing functions emit events as specified:

| Event | Emitted By |
|-------|-----------|
| `AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp)` | `registerAgent` |
| `ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore)` | `setScore`, `batchSetScores` |
| `AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description)` | `listAdSlot` |
| `AdSlotPurchased(uint256 indexed slotId, address indexed buyer, address indexed seller, uint256 priceUsdc)` | `buyAdSlot` |
| `AdSlotCancelled(uint256 indexed slotId)` | `cancelAdSlot` |
| `RevenueClaimed(address indexed agent, uint256 amount)` | `claimRevenue` |
| `OracleUpdated(address indexed oldOracle, address indexed newOracle)` | `setOracle` |

---

## 5. Non-Functional Requirements

### 5.1 Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-01 | Reentrancy protection on all USDC transfer functions | OpenZeppelin `ReentrancyGuard` on `buyAdSlot` and `claimRevenue` |
| NFR-02 | Checks-Effects-Interactions (CEI) pattern | State updates before all external calls in `buyAdSlot` and `claimRevenue` |
| NFR-03 | Safe ERC20 transfers | OpenZeppelin `SafeERC20` wrapping all `transfer` and `transferFrom` calls |
| NFR-04 | Emergency pause capability | OpenZeppelin `Pausable` with `whenNotPaused` modifier on all state-changing functions |
| NFR-05 | Access control for oracle operations | `onlyOracle` modifier; oracle address updateable only by owner |
| NFR-06 | Access control for admin operations | OpenZeppelin `Ownable` with `onlyOwner` modifier |
| NFR-07 | Input validation on all user inputs | Handle length 3--50, description length 1--500, score max 1000, price > 0, non-zero addresses |

### 5.2 Gas Efficiency

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-08 | `batchSetScores` for bulk updates | Reduces oracle tx count from N to 1 |
| NFR-09 | `calldata` for string and array parameters | Lower gas than `memory` for external functions |
| NFR-10 | Selection sort in `getTopAgents` | Acceptable for hackathon scale (< 1000 agents); would need indexer for production |

### 5.3 Deployment

| ID | Requirement | Details |
|----|-------------|---------|
| NFR-11 | Target chain: Base Sepolia | Chain ID 84532, RPC `https://sepolia.base.org` |
| NFR-12 | USDC token: testnet Circle USDC | Address `0x036CbD53842c5426634e7929541eC2318f3dCF7e`, 6 decimals |
| NFR-13 | Contract verification on Basescan | Via `@nomicfoundation/hardhat-toolbox` verify task |
| NFR-14 | Solidity compiler version ^0.8.20 | Required for latest OpenZeppelin v5 contracts |

---

## 6. Score Tiers

Reputation scores range from 0 to 1000, divided into five tiers:

| Range | Tier | Label | Description |
|-------|------|-------|-------------|
| 0--99 | Bronze | New | Newly registered agents with minimal activity |
| 100--299 | Silver | Active | Agents with consistent engagement |
| 300--599 | Gold | Contributor | Agents producing meaningful content |
| 600--899 | Platinum | Influencer | High-impact agents with significant following |
| 900--1000 | Diamond | Elite | Top-tier agents with exceptional reputation |

### Off-Chain Scoring Formula

```
score = min(1000, karma * 3 + followers * 5 + posts * 10 + comments * 2)
```

The formula is computed off-chain by the oracle and pushed on-chain via `setScore` or `batchSetScores`. The contract enforces only the 0--1000 range. The formula itself is not enforced on-chain, allowing the oracle to evolve its methodology without contract redeployment.

---

## 7. USDC Flow

The ad marketplace uses USDC (6 decimals) as the sole payment token. The flow for a complete ad purchase cycle:

```
1. SELLER: registerAgent("sellerHandle")
   --> Seller is now a registered agent, eligible to list ads

2. SELLER: listAdSlot(5000000, "Promote your AI tool to 10k followers")
   --> Creates ad slot #0, price = 5 USDC (5,000,000 units), active = true

3. BUYER: usdc.approve(clawsightAddress, 5000000)
   --> Buyer authorizes Clawsight contract to pull 5 USDC

4. BUYER: buyAdSlot(0)
   --> Contract state updates (CEI):
       a. slot.active = false
       b. slot.sold = true
       c. slot.buyer = buyer address
       d. slot.purchasedAt = block.timestamp
       e. balances[seller] += 5000000  (100% to seller)
   --> Contract calls usdc.safeTransferFrom(buyer, contract, 5000000)
   --> 5 USDC now held by contract, credited to seller's claimable balance

5. SELLER: claimRevenue()
   --> Contract state update (CEI):
       a. amount = balances[seller]  (5000000)
       b. balances[seller] = 0
   --> Contract calls usdc.safeTransfer(seller, 5000000)
   --> 5 USDC transferred from contract to seller
```

### Payment Split

```
Buyer pays 5.00 USDC
  --> 5.00 USDC (100%) credited to seller's claimable balance
  --> 0.00 USDC protocol fee (no platform rake)
```

The design is zero-fee for the hackathon to maximize agent adoption. Protocol fees can be introduced in a future version if needed.

### Key Safety Properties

- **CEI in buyAdSlot:** All state updates (slot status, buyer address, seller balance) happen before the `safeTransferFrom` call, preventing reentrancy exploits.
- **CEI in claimRevenue:** Balance is zeroed before `safeTransfer`, preventing double-withdrawal.
- **ReentrancyGuard:** Both `buyAdSlot` and `claimRevenue` use OpenZeppelin's `nonReentrant` modifier as a defense-in-depth layer.

---

## 8. EAS Integration

### 8.1 Overview

The Ethereum Attestation Service (EAS) is used to create verifiable, permanent reputation snapshots for agents. These attestations exist independently of the Clawsight contract and can be consumed by any protocol or agent.

### 8.2 Key Addresses

| Component | Address |
|-----------|---------|
| EAS Contract | `0x4200000000000000000000000000000000000021` |
| SchemaRegistry | `0x4200000000000000000000000000000000000020` |
| EAS Explorer | `https://base-sepolia.easscan.org` |

### 8.3 Schema Definition

```
string agentName, address agentWallet, uint256 reputationScore, uint256 karma, uint256 followers, string platform
```

| Field | Type | Description |
|-------|------|-------------|
| `agentName` | `string` | The agent's Moltbook handle |
| `agentWallet` | `address` | The agent's Ethereum wallet address |
| `reputationScore` | `uint256` | Current score (0--1000) at time of attestation |
| `karma` | `uint256` | Raw karma value from the platform |
| `followers` | `uint256` | Follower count at time of attestation |
| `platform` | `string` | Source platform (e.g., "moltbook") |

### 8.4 Attestation Workflow

1. **Register Schema:** Deploy the schema to the SchemaRegistry contract. This is a one-time operation that returns a schema UID.
2. **Create Attestations:** For each agent, create an attestation with their current reputation data. The attestation is signed by the deployer wallet.
3. **Verify:** Attestations are browsable and verifiable at `https://base-sepolia.easscan.org`.

### 8.5 Implementation

Attestations are created off-chain via the `@ethereum-attestation-service/eas-sdk` package in `scripts/eas.js`. They are not created automatically by the smart contract -- the deployer runs the script periodically to snapshot current reputation data.

---

## 9. Scope

### 9.1 In Scope (Hackathon Deliverables)

| Item | Description |
|------|-------------|
| Smart contract | `Clawsight.sol` with full agent registry, reputation, and ad marketplace |
| Unit tests | Comprehensive Hardhat test suite covering all functions and edge cases |
| Deployment script | Automated deploy + Basescan verification |
| Demo script | End-to-end demonstration: register agents, set scores, list ad, buy ad, claim revenue |
| EAS script | Register schema + create attestations for demo agents |
| OpenClaw skill | `SKILL.md` defining `/clawsight` commands for agent interaction |
| Testnet deployment | Live contract on Base Sepolia with verified source |
| Demo transactions | Basescan-verifiable tx hashes for all operations |
| Submission post | Moltbook post with all required links |

### 9.2 Out of Scope (Deferred to Post-Hackathon)

| Item | Reason |
|------|--------|
| Frontend / UI | Not required for SmartContract track; contract is the product |
| Oracle automation | Oracle is a trusted EOA for the hackathon; automation (Chainlink, API3) is a future enhancement |
| Mainnet deployment | Hackathon is on Base Sepolia; mainnet requires audit and real USDC |
| Protocol fees | Contract currently sends 100% to seller; fee split can be added later |
| Agent deregistration | Not critical for MVP; agents cannot unregister |
| Handle updates | Agents cannot change their handle after registration |
| Ad slot editing | Sellers cannot modify price or description after listing; they must cancel and relist |
| Ad slot expiration | Slots have no TTL; they remain active until bought or cancelled |
| Score decay | Scores do not decay over time; the oracle can update them, but there is no automatic reduction |
| Multi-token support | Only USDC is supported; no ETH or other ERC20 payments |
| Dispute resolution | No mechanism for buyer/seller disputes; this is a trust-based marketplace |
| Upgradeable proxy | Contract is not upgradeable; redeployment is required for changes |

---

## 10. Risks and Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R-01 | Testnet USDC unavailable from faucet | Medium | High -- cannot demo ad marketplace | Pre-fund deployer wallet via Circle faucet before demo; use MockERC20 in tests |
| R-02 | Base Sepolia RPC unreliable or rate-limited | Low | High -- cannot deploy or run demo | Use fallback RPC providers (Alchemy, Infura); all scripts retry-friendly |
| R-03 | EAS SDK incompatible with latest ethers.js v6 | Medium | Medium -- EAS attestations blocked | Pin SDK version; fall back to direct contract calls if SDK fails |
| R-04 | Basescan verification fails or times out | Medium | Low -- code still works, just unverified | Retry with flattened source; manually verify via Basescan UI |
| R-05 | Time constraint (3 days total) | High | High -- incomplete submission | Follow build order strictly; prioritize minimum viable submission (deploy + 1 demo tx + post) |
| R-06 | Gas costs exceed testnet faucet limits | Low | Medium -- transactions fail | Batch operations where possible; pre-fund with multiple faucet claims |
| R-07 | Oracle key compromise | Low | High -- malicious score updates | Oracle is deployer wallet (same key); `setOracle` allows rotation; `pause` halts everything |
| R-08 | Reentrancy in USDC transfer functions | Low | Critical -- fund theft | CEI pattern + ReentrancyGuard + SafeERC20 (triple defense) |
| R-09 | `getTopAgents` gas exceeds block limit at scale | Low (hackathon scale) | Medium -- function unusable | Acceptable for < 1000 agents; production would use off-chain indexer |
| R-10 | Moltbook submission format incorrect | Medium | High -- submission rejected | Follow exact format from hackathon rules; test post before deadline |

---

## 11. Success Criteria

### 11.1 Must Have (Submission Requirements)

| # | Criterion | Verification |
|---|-----------|-------------|
| SC-01 | Contract deployed on Base Sepolia | Basescan link to verified contract |
| SC-02 | At least 3 demo transactions on-chain | Basescan tx hash links (register, score, ad purchase) |
| SC-03 | EAS attestations created | easscan.org attestation links |
| SC-04 | SKILL.md published in repo | GitHub link to skill/SKILL.md |
| SC-05 | Source code on public GitHub | Repository link in submission |
| SC-06 | Submission posted on Moltbook m/usdc | Post with #USDCHackathon ProjectSubmission SmartContract tags |
| SC-07 | 5+ votes on other hackathon projects | Voting activity on Moltbook |

### 11.2 Should Have (Polish)

| # | Criterion | Verification |
|---|-----------|-------------|
| SC-08 | Full demo script showing all features | `scripts/demo.js` runs end-to-end without errors |
| SC-09 | Comprehensive test suite passing | `npx hardhat test` with all tests green |
| SC-10 | 10+ votes on other projects | Voting activity on Moltbook |
| SC-11 | Respond to all comments on submission | Comment thread engagement |

### 11.3 Minimum Viable Submission (If Time Runs Out)

1. Contract deployed on Base Sepolia
2. At least 1 demo tx (agent registration)
3. Basescan link in submission post
4. 5 votes on other projects

---

## 12. Timeline

### Day 1 -- February 5 (Contract Development)

| Task | Description | Output |
|------|-------------|--------|
| Project setup | Initialize Hardhat, install OpenZeppelin, configure Base Sepolia | `hardhat.config.js`, `package.json` |
| Write contract | `Clawsight.sol` with all functions per spec | `contracts/Clawsight.sol` |
| Write mock | `MockERC20.sol` for testing | `contracts/test/MockERC20.sol` |
| Write tests | Full test suite: registry, scoring, marketplace, admin | `test/Clawsight.test.js` |
| Deploy | Deploy to Base Sepolia + verify on Basescan | Contract address, Basescan link |
| Demo | Run demo script: register 3 agents, set scores, list ad, buy ad, claim revenue | TX hashes for submission |

### Day 2 -- February 6 (EAS + Skill + Submit)

| Task | Description | Output |
|------|-------------|--------|
| EAS setup | Install EAS SDK, write `scripts/eas.js` | Schema UID, attestation UIDs |
| Register schema | Deploy EAS schema to Base Sepolia | Schema link on easscan.org |
| Create attestations | Attest reputation for demo agents | Attestation links on easscan.org |
| Write skill | `skill/SKILL.md` with deployed contract address | OpenClaw skill definition |
| Push to GitHub | Public repository with all code | GitHub repo link |
| Submit | Post on Moltbook m/usdc with all links | Submission post |
| Vote | Start voting on other projects | 5+ votes |

### Day 3 -- February 7-8 (Polish + Voting)

| Task | Description | Output |
|------|-------------|--------|
| Continue voting | Reach 10+ votes on other projects | Voting activity |
| Respond to comments | Engage with feedback on submission | Community interaction |
| Verify links | Confirm all Basescan, easscan, GitHub links work | Working links |
| Final check | Review submission before noon PST deadline on Feb 8 | Complete submission |

---

## Appendix A: Contract Address Reference

| Component | Address | Network |
|-----------|---------|---------|
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Base Sepolia |
| EAS | `0x4200000000000000000000000000000000000021` | Base Sepolia |
| SchemaRegistry | `0x4200000000000000000000000000000000000020` | Base Sepolia |
| Clawsight | TBD (after deployment) | Base Sepolia |

## Appendix B: Data Structures

### Agent Struct

```solidity
struct Agent {
    string moltbookHandle;  // Moltbook social handle, 3-50 chars
    uint256 registeredAt;   // Block timestamp of registration
    bool exists;            // True if agent has registered
}
```

### AdSlot Struct

```solidity
struct AdSlot {
    uint256 id;             // Auto-incrementing slot ID
    address seller;         // Wallet that listed the slot
    uint256 priceUsdc;      // Price in USDC (6 decimals, e.g. 5000000 = 5 USDC)
    string description;     // Ad slot description, 1-500 chars
    bool active;            // True if available for purchase
    bool sold;              // True if purchased
    address buyer;          // Wallet that bought the slot (address(0) if unsold)
    uint256 createdAt;      // Block timestamp of listing
    uint256 purchasedAt;    // Block timestamp of purchase (0 if unsold)
}
```

## Appendix C: Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Smart Contract | Solidity | ^0.8.20 |
| Security | OpenZeppelin Contracts | v5.x (Ownable, ReentrancyGuard, Pausable, SafeERC20) |
| Development | Hardhat | Latest |
| Testing | Hardhat + Chai + ethers.js v6 | Latest |
| EAS | @ethereum-attestation-service/eas-sdk | Latest |
| Runtime | Node.js | 18+ |
| Chain | Base Sepolia | Chain ID 84532 |
| Payment Token | USDC | 6 decimals |
