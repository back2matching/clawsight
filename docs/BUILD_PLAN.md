# Clawsight Build Plan

Deadline: Feb 8, 2026, 12:00 PM PST
Start date: Feb 5, 2026
Total working time: ~3 days

---

## Current Status (as of Feb 5)

### Done

- [x] `contracts/Clawsight.sol` -- 290 lines, fully implemented (Agent Registry, Reputation, Ad Marketplace, Admin)
- [x] `contracts/test/MockERC20.sol` -- mock USDC with configurable decimals and public mint
- [x] `hardhat.config.js` -- Solidity 0.8.20, optimizer enabled, Base Sepolia network configured, Basescan verification configured
- [x] `package.json` -- all dependencies defined (hardhat, hardhat-toolbox, openzeppelin, eas-sdk, ethers, dotenv)
- [x] `CLAUDE.md` -- complete project specification
- [x] `.env.example` -- template with DEPLOYER_PRIVATE_KEY and BASESCAN_API_KEY

### Not Done

- [ ] `npm install` -- node_modules do not exist yet
- [ ] `test/Clawsight.test.js` -- not yet written
- [ ] `scripts/deploy.js` -- not yet written
- [ ] `scripts/demo.js` -- not yet written
- [ ] `scripts/eas.js` -- not yet written
- [ ] `skill/SKILL.md` -- not yet written
- [ ] Contract deployment to Base Sepolia
- [ ] Basescan verification
- [ ] EAS schema registration and attestations
- [ ] Moltbook submission post
- [ ] Voting on other projects (need 5+ minimum, target 10+)

### Contract Architecture Notes

The deployed contract (`Clawsight.sol`) uses:
- 100% of ad payment goes to seller (no protocol fee, no `protocolBalance` variable)
- CEI pattern in `buyAdSlot` and `claimRevenue`
- `SafeERC20` for all USDC transfers
- `whenNotPaused` on all state-changing functions
- `onlyOracle` modifier for score-setting functions
- USDC address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (6 decimals on Base Sepolia)

---

## Day 1 (Feb 5-6) -- Contract Compilation, Tests, Deploy, Demo

### Step 1: Install Dependencies

```bash
cd C:\Users\PC\Documents\GitHub\clawsight
npm install
```

Verify installation succeeded:

```bash
npx hardhat --version
```

### Step 2: Compile Contracts

```bash
npx hardhat compile
```

- [ ] Compilation succeeds with no errors
- [ ] Artifacts generated in `artifacts/` directory

### Step 3: Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- [ ] `DEPLOYER_PRIVATE_KEY` -- private key of a wallet with Base Sepolia ETH and USDC
- [ ] `BASESCAN_API_KEY` -- API key from basescan.org for contract verification

Fund the deployer wallet if needed:
- ETH faucet: https://www.alchemy.com/faucets/base-sepolia
- USDC faucet: https://faucet.circle.com

### Step 4: Write test/Clawsight.test.js

Create `test/Clawsight.test.js`. The test suite must cover:

**Agent Registry tests:**
- [ ] Register an agent with a valid handle (3-50 chars)
- [ ] Reject duplicate wallet registration
- [ ] Reject duplicate handle registration
- [ ] Reject handle shorter than 3 chars
- [ ] Reject handle longer than 50 chars
- [ ] `getAgent` returns correct struct
- [ ] `isRegistered` returns true after registration, false before
- [ ] `getAgentCount` increments correctly
- [ ] `AgentRegistered` event emitted with correct args

**Reputation tests:**
- [ ] Oracle can set a score (0-1000) for a registered agent
- [ ] Oracle cannot set score > 1000
- [ ] Non-oracle cannot set score
- [ ] Cannot set score for unregistered agent
- [ ] `batchSetScores` works for multiple agents
- [ ] `batchSetScores` reverts on length mismatch
- [ ] `getScore` returns correct value
- [ ] `getTopAgents` returns sorted results
- [ ] `ScoreUpdated` event emitted with old and new score

**Ad Marketplace tests:**
- [ ] Registered agent can list an ad slot with price > 0 and description 1-500 chars
- [ ] Unregistered agent cannot list
- [ ] Price of 0 rejected
- [ ] Empty description rejected
- [ ] Description over 500 chars rejected
- [ ] Buyer can purchase active slot (requires USDC approval)
- [ ] Seller cannot buy own slot
- [ ] Cannot buy already-sold slot
- [ ] Cannot buy cancelled slot
- [ ] After purchase: 100% credited to seller balance
- [ ] Seller can claim revenue via `claimRevenue`
- [ ] `claimRevenue` reverts if balance is 0
- [ ] Seller can cancel unsold slot
- [ ] Cannot cancel already-sold slot
- [ ] `getActiveSlots` returns only active, unsold slots
- [ ] All events emitted correctly: `AdSlotListed`, `AdSlotPurchased`, `AdSlotCancelled`, `RevenueClaimed`

**Admin tests:**
- [ ] Owner can set new oracle
- [ ] Non-owner cannot set oracle
- [ ] Cannot set oracle to zero address
- [ ] Owner can pause/unpause
- [ ] State-changing functions revert when paused
- [ ] `OracleUpdated` event emitted

**Test setup:**
- Deploy `MockERC20` as fake USDC (6 decimals)
- Deploy `Clawsight` with mock USDC address and deployer as oracle
- Mint mock USDC to test accounts as needed

### Step 5: Run Tests

```bash
npx hardhat test
```

- [ ] All tests pass
- [ ] No warnings or deprecation notices

### Step 6: Write scripts/deploy.js

The deploy script must:
1. Deploy `Clawsight` with constructor args: `(USDC_ADDRESS, DEPLOYER_ADDRESS)`
   - USDC on Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
   - Oracle = deployer wallet address
2. Print deployed contract address
3. Wait for a few block confirmations (e.g., 5 blocks)
4. Verify on Basescan using `hre.run("verify:verify", { ... })`
5. Print Basescan link

### Step 7: Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

- [ ] Deployment transaction confirmed
- [ ] Contract address recorded: `_____________________________`
- [ ] Basescan verification succeeded
- [ ] Contract visible at: `https://sepolia.basescan.org/address/<ADDRESS>`

If Basescan verification fails, try manual verification:

```bash
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> "0x036CbD53842c5426634e7929541eC2318f3dCF7e" "<DEPLOYER_ADDRESS>"
```

### Step 8: Write scripts/demo.js

The demo script must execute these transactions on Base Sepolia using the deployed contract:

1. Register 3 agents with Moltbook handles (e.g., "agent_alpha", "agent_beta", "agent_gamma")
2. Set reputation scores for all 3 agents (e.g., 950, 720, 350)
3. List an ad slot (e.g., 1 USDC = 1000000 units, description: "Premium sidebar ad")
4. Buy the ad slot from a different account (requires USDC approval first)
5. Claim revenue as the seller
6. Print all transaction hashes and Basescan links

Note: Steps 4-5 require a second funded wallet, or the script can use the deployer
for steps 1-3 and note the limitation for steps 4-5 (cannot buy own slot).
Alternative: Register 2 agents from 2 different signers if hardhat config has multiple accounts.

### Step 9: Run Demo

```bash
npx hardhat run scripts/demo.js --network base-sepolia
```

- [ ] All demo transactions succeeded
- [ ] Transaction hashes collected:
  - Register agent 1: `_____________________________`
  - Register agent 2: `_____________________________`
  - Register agent 3: `_____________________________`
  - Set scores: `_____________________________`
  - List ad slot: `_____________________________`
  - Buy ad slot: `_____________________________`
  - Claim revenue: `_____________________________`

---

## Day 2 (Feb 6-7) -- EAS, Skill, GitHub, Submission

### Step 10: Write scripts/eas.js

The EAS script must:

1. Connect to Base Sepolia EAS contracts:
   - EAS: `0x4200000000000000000000000000000000000021`
   - SchemaRegistry: `0x4200000000000000000000000000000000000020`
2. Register the schema string:
   ```
   string agentName, address agentWallet, uint256 reputationScore, uint256 karma, uint256 followers, string platform
   ```
3. Print the schema UID
4. Create attestations for each demo agent with their scores and metadata
5. Print attestation UIDs and easscan.org links

```bash
node scripts/eas.js
```

- [ ] Schema registered on Base Sepolia
- [ ] Schema UID: `_____________________________`
- [ ] Schema visible at: `https://base-sepolia.easscan.org/schema/view/<SCHEMA_UID>`
- [ ] Attestation 1 UID: `_____________________________`
- [ ] Attestation 2 UID: `_____________________________`
- [ ] Attestation 3 UID: `_____________________________`

### Step 11: Write skill/SKILL.md

Create the OpenClaw skill definition file with:
- Skill name and description
- Deployed contract address (fill in after deploy)
- Available commands: `/clawsight register`, `/clawsight score`, `/clawsight ads`, etc.
- Base Sepolia chain details
- USDC address

### Step 12: Push to GitHub

```bash
git add -A
git commit -m "Clawsight v1.0 - Agent analytics + ad marketplace on Base Sepolia"
git push origin main
```

- [ ] All code pushed to public GitHub repo
- [ ] Repository URL: `_____________________________`

### Step 13: Post Clawsight Submission on Moltbook

Post to m/usdc with hashtags: `#USDCHackathon ProjectSubmission SmartContract`

Content template (fill in addresses and links):

```
#USDCHackathon ProjectSubmission SmartContract

CLAWSIGHT -- Insight for the Autonomous Web

On-chain analytics and ad monetization for AI agents on Moltbook.

1. AGENT REGISTRY -- Register Moltbook handle on-chain. Verifiable identity.
2. REPUTATION SCORING -- Oracle-fed scores (0-1000). Bronze to Diamond tiers.
3. AD MARKETPLACE -- List/buy ad slots with USDC. 100% to seller.
4. EAS ATTESTATIONS -- Verifiable reputation snapshots on base-sepolia.easscan.org

USDC FLOW: Buyer approves + pays USDC -> 100% to seller -> seller withdraws anytime.

DEMO TXS: [Basescan links]
CONTRACT: https://sepolia.basescan.org/address/<ADDRESS>
SOURCE: <GitHub URL>
SKILL: <GitHub skill link>
EAS: https://base-sepolia.easscan.org/schema/view/<SCHEMA_UID>
```

- [ ] Submission posted on Moltbook m/usdc

### Step 14: Start Voting

- [ ] Vote on project 1: `_____________________________`
- [ ] Vote on project 2: `_____________________________`
- [ ] Vote on project 3: `_____________________________`
- [ ] Vote on project 4: `_____________________________`
- [ ] Vote on project 5: `_____________________________`

---

## Day 3 (Feb 7-8) -- Polish and Vote

### Step 15: Continue Voting (Target 10+)

- [ ] Vote on project 6: `_____________________________`
- [ ] Vote on project 7: `_____________________________`
- [ ] Vote on project 8: `_____________________________`
- [ ] Vote on project 9: `_____________________________`
- [ ] Vote on project 10: `_____________________________`

### Step 16: Respond to Comments

- [ ] Check Moltbook submission for comments
- [ ] Reply to all questions/feedback

### Step 17: Final Verification Checklist

Before noon PST on Feb 8:

- [ ] Contract is deployed and verified on Basescan
- [ ] All demo transaction links work
- [ ] GitHub repo is public and accessible
- [ ] EAS schema and attestations visible on easscan.org
- [ ] Moltbook submission post has all correct links
- [ ] skill/SKILL.md is in the repo with correct contract address
- [ ] At least 5 votes cast on other projects (10+ preferred)

---

## Minimum Viable Path (If Behind Schedule)

If time is running short, execute in this priority order. Each level builds on the previous.

### Priority 1: Deploy Contract + 1 Demo Tx (MINIMUM for submission)

```bash
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-sepolia
```

Then manually register one agent via Basescan "Write Contract" UI:
- Call `registerAgent("clawsight_demo")`
- Copy the tx hash

This alone is enough to submit with a Basescan link.

### Priority 2: Demo Script With All Flows

```bash
npx hardhat run scripts/demo.js --network base-sepolia
```

Gives multiple tx hashes showing the full lifecycle.

### Priority 3: EAS Attestations

```bash
node scripts/eas.js
```

Adds verifiable reputation data on EAS Explorer.

### Priority 4: SKILL.md

Write and push `skill/SKILL.md` to show agent integration capability.

### Priority 5: Tests and Polish

```bash
npx hardhat test
```

Tests are important for code quality but not strictly required for the hackathon submission.

---

## Risk Mitigation

### RPC Issues

The default RPC is `https://sepolia.base.org` (public, rate-limited).

Backup plan:
- Sign up for Alchemy: https://www.alchemy.com/ -- get a Base Sepolia RPC URL
- Sign up for Infura: https://www.infura.io/ -- get a Base Sepolia RPC URL
- Update `hardhat.config.js` network URL to use the new RPC endpoint

### Faucet Issues (No Testnet ETH or USDC)

- Have a second wallet with Base Sepolia ETH as backup
- ETH faucet alternatives: Alchemy faucet, Chainlink faucet, QuickNode faucet
- USDC faucet: Circle faucet at https://faucet.circle.com is the primary source
- If USDC faucet is down: deploy the contract and run registration demos only (no ad purchase demos). Registration does not require USDC.

### Basescan Verification Fails

- Verification is cosmetic. The contract still works without it.
- Common failure causes: wrong compiler version, wrong optimizer settings, API key issue
- Try the manual verify command with explicit constructor args
- If still failing: submit without verification. Include the source code in the GitHub repo as proof.

### EAS SDK Issues

- EAS attestations are a bonus feature, not required for minimum submission
- If the SDK has breaking changes or the EAS contracts are unreachable, skip attestations
- The core submission (contract + demo txs + source code) stands on its own

### Compilation Errors

- OpenZeppelin v5.x changed import paths (e.g., `Ownable(msg.sender)` constructor pattern)
- The contract already uses v5.x patterns, so this should not be an issue
- If `@openzeppelin/contracts` version conflicts arise, pin to `^5.0.0` in package.json (already set)

### Gas Estimation Failures on Testnet

- Base Sepolia can occasionally return flaky gas estimates
- Add explicit gas limits in scripts if needed: `{ gasLimit: 500000 }`
- Wait and retry if the RPC returns transient errors

---

## Key Question: Is It Buildable in 3 Days?

YES.

The hardest part -- the Solidity contract -- is already written and complete (290 lines). The remaining work is:

| Task | Estimated Time | Difficulty |
|------|---------------|------------|
| npm install + compile | 5 minutes | Trivial |
| Write test suite | 1-2 hours | Medium |
| Write deploy script | 15 minutes | Easy |
| Deploy + verify | 10 minutes | Easy |
| Write demo script | 30 minutes | Easy |
| Run demo on testnet | 10 minutes | Easy |
| Write EAS script | 45 minutes | Medium |
| Run EAS on testnet | 10 minutes | Easy |
| Write SKILL.md | 20 minutes | Easy |
| Push to GitHub | 5 minutes | Trivial |
| Write submission post | 15 minutes | Easy |
| Vote on 10 projects | 30 minutes | Easy |

**Total estimated time: 4-5 hours of actual work**, spread across 3 days. This is very achievable.

The critical path is: install -> compile -> deploy -> demo -> submit. Everything else is polish.
