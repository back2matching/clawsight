# CLAUDE.md — Clawsight

> Google Analytics + AdSense for AI agents. On-chain reputation + USDC ad marketplace on Base Sepolia.

## Deadline: Feb 8, 2026, 12:00 PM PST (3 days from Feb 5)

---

## What We're Building

Smart contract on Base Sepolia that:
1. **Agent Registry** — Agents register Moltbook handles on-chain
2. **Reputation Scoring** — Oracle pushes 0-1000 scores on-chain
3. **Ad Marketplace** — Agents list/buy ad slots with USDC (100% to seller, no platform fee)
4. **EAS Attestations** — Reputation snapshots on Ethereum Attestation Service
5. **OpenClaw Skill** — SKILL.md so agents interact via `/clawsight` commands

---

## Key Addresses (Base Sepolia — Chain ID 84532)

| What | Address |
|------|---------|
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (6 decimals) |
| EAS | `0x4200000000000000000000000000000000000021` |
| SchemaRegistry | `0x4200000000000000000000000000000000000020` |
| RPC | `https://sepolia.base.org` |
| Explorer | `https://sepolia.basescan.org` |
| USDC Faucet | `https://faucet.circle.com` |
| ETH Faucet | `https://www.alchemy.com/faucets/base-sepolia` |
| EAS Explorer | `https://base-sepolia.easscan.org` |

---

## Tech Stack

- **Solidity** ^0.8.20 + OpenZeppelin (Ownable, ReentrancyGuard, Pausable, SafeERC20)
- **Hardhat** + @nomicfoundation/hardhat-toolbox
- **ethers.js** v6
- **EAS SDK** (@ethereum-attestation-service/eas-sdk)
- **Node.js** 18+

---

## File Structure

```
clawsight/
├── contracts/
│   ├── Clawsight.sol          # Main contract
│   └── test/
│       └── MockERC20.sol      # Mock USDC for tests
├── scripts/
│   ├── deploy.js              # Deploy + verify on Basescan
│   ├── demo.js                # Demo txs (register, score, buy ad)
│   └── eas.js                 # Register EAS schema + create attestations
├── test/
│   └── Clawsight.test.js      # Full test suite
├── skill/
│   └── SKILL.md               # OpenClaw skill definition
├── hardhat.config.js
├── package.json
├── .env                       # DEPLOYER_PRIVATE_KEY, BASESCAN_API_KEY
└── README.md
```

---

## Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Inherits: Ownable, ReentrancyGuard, Pausable
// Uses: SafeERC20 for IERC20

// STRUCTS
struct Agent { string moltbookHandle; uint256 registeredAt; bool exists; }
struct AdSlot {
    uint256 id; address seller; uint256 priceUsdc; string description;
    bool active; bool sold; address buyer; uint256 createdAt; uint256 purchasedAt;
}

// STATE
IERC20 public usdc;
address public oracle;
mapping(address => Agent) public agents;
mapping(address => uint256) public scores;        // 0-1000
mapping(string => bool) public handleTaken;
address[] public agentList;
mapping(uint256 => AdSlot) public adSlots;
uint256 public nextSlotId;
mapping(address => uint256) public balances;      // claimable USDC

// CONSTRUCTOR
constructor(address _usdc, address _oracle)

// AGENT REGISTRY
function registerAgent(string calldata moltbookHandle) external
function getAgent(address wallet) external view returns (Agent memory)
function isRegistered(address wallet) external view returns (bool)
function getAgentCount() external view returns (uint256)

// REPUTATION (oracle only for writes)
function setScore(address agent, uint256 score) external
function batchSetScores(address[] calldata agents, uint256[] calldata newScores) external
function getScore(address agent) external view returns (uint256)
function getTopAgents(uint256 count) external view returns (address[] memory, uint256[] memory)

// AD MARKETPLACE
function listAdSlot(uint256 priceUsdc, string calldata description) external
function buyAdSlot(uint256 slotId) external nonReentrant    // CEI pattern, 100% to seller
function cancelAdSlot(uint256 slotId) external
function claimRevenue() external nonReentrant
function getAdSlot(uint256 slotId) external view returns (AdSlot memory)
function getActiveSlots() external view returns (AdSlot[] memory)
function getBalance(address agent) external view returns (uint256)

// ADMIN (owner only)
function setOracle(address newOracle) external
function pause() external
function unpause() external
```

### Critical Implementation Rules

- `buyAdSlot`: state updates BEFORE `safeTransferFrom` (CEI pattern)
- `claimRevenue`: zero balance BEFORE `safeTransfer` (CEI pattern)
- Handle validation: 3-50 chars, no duplicate handles, no duplicate wallets
- Score: max 1000, only oracle can set
- Price: must be > 0, description 1-500 chars
- Ad payment: 100% goes to seller (no platform fee)

---

## Revenue Split

```
Buyer pays USDC → Contract holds it → 100% credited to seller's balance (withdrawable)
```

---

## Score Tiers

| Range | Tier | Label |
|-------|------|-------|
| 0-99 | Bronze | New |
| 100-299 | Silver | Active |
| 300-599 | Gold | Contributor |
| 600-899 | Platinum | Influencer |
| 900-1000 | Diamond | Elite |

Formula (off-chain): `score = min(1000, karma*3 + followers*5 + posts*10 + comments*2)`

---

## EAS Schema

```
string agentName, address agentWallet, uint256 reputationScore, uint256 karma, uint256 followers, string platform
```

Register on SchemaRegistry (`0x4200...0020`), then create attestations per agent.
Browse at: `https://base-sepolia.easscan.org`

---

## Build Order

### Day 1 (Feb 5) — Contract
1. `npm init -y && npm i --save-dev hardhat @nomicfoundation/hardhat-toolbox && npm i @openzeppelin/contracts dotenv`
2. Write `hardhat.config.js` with base-sepolia network
3. Write `contracts/Clawsight.sol`
4. Write `contracts/test/MockERC20.sol`
5. Write `test/Clawsight.test.js` — run with `npx hardhat test`
6. Write `scripts/deploy.js` — deploy + verify
7. Write `scripts/demo.js` — register 3 agents, set scores, list ad, buy ad, claim revenue
8. **Collect all tx hashes for submission**

### Day 2 (Feb 6) — EAS + Skill + Submit
9. `npm i @ethereum-attestation-service/eas-sdk ethers`
10. Write `scripts/eas.js` — register schema, create attestations
11. Write `skill/SKILL.md` with deployed contract address
12. Push all code to GitHub (public repo)
13. Post Clawsight submission on Moltbook m/usdc (#USDCHackathon ProjectSubmission SmartContract)
14. Start voting on 5+ other projects per submission

### Day 3 (Feb 7-8) — Polish
15. Continue voting (10+ total)
16. Respond to comments
17. Verify all links work before noon PST deadline

---

## Minimum Viable Submission

If time runs out, bare minimum:
1. Contract deployed on Base Sepolia
2. At least 1 demo tx (registration)
3. Basescan link in submission post
4. 5 votes on other projects

---

## Env Vars Needed

```
DEPLOYER_PRIVATE_KEY=0x...     # Wallet with Base Sepolia ETH + USDC
BASESCAN_API_KEY=...           # For contract verification
```

---

## Events (must emit all of these)

```solidity
event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp);
event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
event AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description);
event AdSlotPurchased(uint256 indexed slotId, address indexed buyer, address indexed seller, uint256 priceUsdc);
event AdSlotCancelled(uint256 indexed slotId);
event RevenueClaimed(address indexed agent, uint256 amount);
event OracleUpdated(address indexed oldOracle, address indexed newOracle);
```

---

## Deployed Contract

| What | Value |
|------|-------|
| Contract | `0x497cA2E521887d250730EAeD777A3998CC74e21a` |
| Basescan | `https://sepolia.basescan.org/address/0x497cA2E521887d250730EAeD777A3998CC74e21a` |
| EAS Schema | `0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c` |
| GitHub | `https://github.com/back2matching/clawsight` |

Full submission post with all tx links is in `docs/SUBMISSIONS.md`.
