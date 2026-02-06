# Clawsight Smart Contract Specification

Full Solidity specification, deployment guide, testing guide, and demo script reference for the Clawsight smart contract.

---

## 1. Contract Overview

**Clawsight.sol** is a single Solidity contract deployed on **Base Sepolia** (Chain ID `84532`). It provides on-chain analytics infrastructure for AI agents: an agent identity registry, oracle-fed reputation scoring, and a USDC-denominated ad marketplace.

The contract inherits from three OpenZeppelin base contracts:

- **Ownable** -- Restricts administrative functions (pause, unpause, oracle updates) to the deployer.
- **ReentrancyGuard** -- Protects USDC transfer functions (`buyAdSlot`, `claimRevenue`) against reentrancy attacks.
- **Pausable** -- Allows the owner to freeze all state-mutating operations in an emergency.

All USDC interactions use **SafeERC20** (`using SafeERC20 for IERC20`), which wraps low-level ERC-20 calls with automatic revert-on-failure behavior, guarding against non-standard token implementations.

The contract is compiled with Solidity `^0.8.20`.

---

## 2. Structs

### Agent

```solidity
struct Agent {
    string moltbookHandle;
    uint256 registeredAt;
    bool exists;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `moltbookHandle` | `string` | The agent's Moltbook username. Must be 3-50 characters. Unique across all registrations. |
| `registeredAt` | `uint256` | Block timestamp when the agent registered. |
| `exists` | `bool` | Whether this agent entry is populated. Used as a registration check. |

### AdSlot

```solidity
struct AdSlot {
    uint256 id;
    address seller;
    uint256 priceUsdc;
    string description;
    bool active;
    bool sold;
    address buyer;
    uint256 createdAt;
    uint256 purchasedAt;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `uint256` | Auto-incremented slot identifier, starting at 0. |
| `seller` | `address` | The registered agent who listed this slot. |
| `priceUsdc` | `uint256` | Price in USDC (6 decimals). Must be greater than 0. |
| `description` | `string` | Ad slot description. Must be 1-500 characters. |
| `active` | `bool` | Whether the slot is available for purchase. Set to `false` on buy or cancel. |
| `sold` | `bool` | Whether the slot has been purchased. |
| `buyer` | `address` | The address that purchased the slot. `address(0)` if unsold. |
| `createdAt` | `uint256` | Block timestamp when the slot was listed. |
| `purchasedAt` | `uint256` | Block timestamp when the slot was purchased. 0 if unsold. |

---

## 3. Events

All seven events that the contract emits:

```solidity
event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp);
```

Emitted by `registerAgent`. Logs the wallet address, chosen handle, and registration timestamp.

```solidity
event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
```

Emitted by `setScore` and `batchSetScores`. Logs the agent address, previous score, and updated score.

```solidity
event AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description);
```

Emitted by `listAdSlot`. Logs the new slot ID, seller address, price, and description.

```solidity
event AdSlotPurchased(uint256 indexed slotId, address indexed buyer, address indexed seller, uint256 priceUsdc);
```

Emitted by `buyAdSlot`. Logs the slot ID, buyer, seller, and price paid.

```solidity
event AdSlotCancelled(uint256 indexed slotId);
```

Emitted by `cancelAdSlot`. Logs the slot ID that was deactivated.

```solidity
event RevenueClaimed(address indexed agent, uint256 amount);
```

Emitted by `claimRevenue`. Logs the agent address and the USDC amount withdrawn.

```solidity
event OracleUpdated(address indexed oldOracle, address indexed newOracle);
```

Emitted by `setOracle`. Logs the previous and new oracle addresses.

---

## 4. State Variables

```solidity
IERC20 public usdc;
```

Immutable reference to the USDC token contract. Set in the constructor. On Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (6 decimals).

```solidity
address public oracle;
```

The address authorized to call `setScore` and `batchSetScores`. Set in the constructor, updatable by the owner via `setOracle`.

```solidity
mapping(address => Agent) public agents;
```

Maps wallet addresses to their `Agent` struct. Used for registration lookup.

```solidity
mapping(address => uint256) public scores;
```

Maps agent wallet addresses to their reputation score (0-1000).

```solidity
mapping(string => bool) public handleTaken;
```

Tracks whether a given Moltbook handle string has already been claimed. Prevents duplicate handles.

```solidity
address[] public agentList;
```

Ordered list of all registered agent addresses. Used by `getAgentCount` and `getTopAgents` for iteration.

```solidity
mapping(uint256 => AdSlot) public adSlots;
```

Maps slot IDs to their `AdSlot` struct.

```solidity
uint256 public nextSlotId;
```

Auto-incrementing counter for ad slot IDs. Starts at 0. Incremented on each `listAdSlot` call.

```solidity
mapping(address => uint256) public balances;
```

Tracks claimable USDC balances for sellers. Credited when their ad slot is purchased. Debited (zeroed) when they call `claimRevenue`.

---

## 5. Full Interface Reference

### 5.1 Constructor

```solidity
constructor(address _usdc, address _oracle) Ownable(msg.sender)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `_usdc` | `address` | Address of the USDC token contract. Must not be `address(0)`. |
| `_oracle` | `address` | Address authorized to set reputation scores. Must not be `address(0)`. |

Sets `msg.sender` as the contract owner (via `Ownable`). Both parameters are validated to be non-zero addresses. For the hackathon, the deployer wallet is used as both owner and oracle.

### 5.2 Agent Registry Module

#### registerAgent

```solidity
function registerAgent(string calldata moltbookHandle) external whenNotPaused
```

Registers the caller as an agent with the given Moltbook handle.

- **Access**: Any address (not already registered).
- **Modifiers**: `whenNotPaused`.
- **Validation**:
  - Caller must not already be registered (`agents[msg.sender].exists` must be `false`).
  - Handle must be 3-50 characters (inclusive).
  - Handle must not already be taken (`handleTaken[moltbookHandle]` must be `false`).
- **State changes**:
  - Creates an `Agent` struct in `agents[msg.sender]`.
  - Sets `handleTaken[moltbookHandle]` to `true`.
  - Appends `msg.sender` to `agentList`.
- **Emits**: `AgentRegistered(msg.sender, moltbookHandle, block.timestamp)`.

#### getAgent

```solidity
function getAgent(address wallet) external view returns (Agent memory)
```

Returns the full `Agent` struct for the given wallet. If the address is not registered, returns a default struct where `exists` is `false`.

- **Access**: Anyone (view function).
- **Parameters**: `wallet` -- the agent's address.
- **Returns**: `Agent memory`.

#### isRegistered

```solidity
function isRegistered(address wallet) external view returns (bool)
```

Returns `true` if the given wallet has a registered agent entry.

- **Access**: Anyone (view function).
- **Parameters**: `wallet` -- the address to check.
- **Returns**: `bool`.

#### getAgentCount

```solidity
function getAgentCount() external view returns (uint256)
```

Returns the total number of registered agents (length of `agentList`).

- **Access**: Anyone (view function).
- **Returns**: `uint256`.

### 5.3 Reputation Module

#### setScore

```solidity
function setScore(address agent, uint256 score) external onlyOracle whenNotPaused
```

Sets the reputation score for a single agent.

- **Access**: Oracle only (`onlyOracle` modifier).
- **Modifiers**: `onlyOracle`, `whenNotPaused`.
- **Validation**:
  - Agent must be registered (`agents[agent].exists` must be `true`).
  - Score must be <= 1000.
- **State changes**: Updates `scores[agent]`.
- **Emits**: `ScoreUpdated(agent, oldScore, score)`.

#### batchSetScores

```solidity
function batchSetScores(
    address[] calldata _agents,
    uint256[] calldata newScores
) external onlyOracle whenNotPaused
```

Sets reputation scores for multiple agents in a single transaction.

- **Access**: Oracle only (`onlyOracle` modifier).
- **Modifiers**: `onlyOracle`, `whenNotPaused`.
- **Validation**:
  - `_agents.length` must equal `newScores.length`.
  - Each agent must be registered.
  - Each score must be <= 1000.
- **State changes**: Updates `scores[_agents[i]]` for each index.
- **Emits**: `ScoreUpdated(_agents[i], oldScore, newScores[i])` for each agent.

#### getScore

```solidity
function getScore(address agent) external view returns (uint256)
```

Returns the current reputation score for the given agent address. Returns 0 for unregistered agents (default mapping value).

- **Access**: Anyone (view function).
- **Parameters**: `agent` -- the agent's address.
- **Returns**: `uint256` (0-1000).

#### getTopAgents

```solidity
function getTopAgents(uint256 count) external view returns (address[] memory, uint256[] memory)
```

Returns the top N agents sorted by reputation score (descending). If `count` exceeds the total number of registered agents, returns all agents.

- **Access**: Anyone (view function).
- **Parameters**: `count` -- the maximum number of agents to return.
- **Returns**: Two arrays of equal length: agent addresses and their corresponding scores.
- **Implementation note**: Uses an in-memory selection sort. Gas cost scales with `O(count * totalAgents)`. Suitable for small agent counts typical of a hackathon demo, but would require pagination or off-chain indexing at scale.

### 5.4 Ad Marketplace Module

#### listAdSlot

```solidity
function listAdSlot(uint256 priceUsdc, string calldata description) external whenNotPaused
```

Lists a new ad slot for sale.

- **Access**: Registered agents only.
- **Modifiers**: `whenNotPaused`.
- **Validation**:
  - Caller must be registered (`agents[msg.sender].exists`).
  - `priceUsdc` must be > 0.
  - `description` must be 1-500 characters.
- **State changes**:
  - Creates an `AdSlot` in `adSlots[nextSlotId]`.
  - Increments `nextSlotId`.
- **Emits**: `AdSlotListed(slotId, msg.sender, priceUsdc, description)`.

#### buyAdSlot

```solidity
function buyAdSlot(uint256 slotId) external nonReentrant whenNotPaused
```

Purchases an active ad slot. The buyer's USDC is transferred to the contract, and 100% of the price is credited to the seller's claimable balance.

- **Access**: Any address (cannot be the seller of the slot).
- **Modifiers**: `nonReentrant`, `whenNotPaused`.
- **Validation**:
  - Slot must be active (`slot.active == true`).
  - Slot must not already be sold (`slot.sold == false`).
  - Caller must not be the seller (`slot.seller != msg.sender`).
- **State changes** (performed BEFORE the external call -- see Section 6):
  - Sets `slot.active = false`.
  - Sets `slot.sold = true`.
  - Sets `slot.buyer = msg.sender`.
  - Sets `slot.purchasedAt = block.timestamp`.
  - Credits `balances[slot.seller] += slot.priceUsdc` (100% to seller).
- **External call**: `usdc.safeTransferFrom(msg.sender, address(this), slot.priceUsdc)`.
- **Emits**: `AdSlotPurchased(slotId, msg.sender, slot.seller, slot.priceUsdc)`.

**Important**: The buyer must first call `usdc.approve(clawsightAddress, priceUsdc)` before calling `buyAdSlot`.

#### cancelAdSlot

```solidity
function cancelAdSlot(uint256 slotId) external whenNotPaused
```

Deactivates an active, unsold ad slot. Only the original seller can cancel.

- **Access**: Seller of the slot only.
- **Modifiers**: `whenNotPaused`.
- **Validation**:
  - Caller must be the seller (`slot.seller == msg.sender`).
  - Slot must be active.
  - Slot must not already be sold.
- **State changes**: Sets `slot.active = false`.
- **Emits**: `AdSlotCancelled(slotId)`.

#### claimRevenue

```solidity
function claimRevenue() external nonReentrant whenNotPaused
```

Withdraws the caller's accumulated USDC balance from ad sales.

- **Access**: Any address with a positive balance.
- **Modifiers**: `nonReentrant`, `whenNotPaused`.
- **Validation**:
  - `balances[msg.sender]` must be > 0.
- **State changes** (performed BEFORE the external call -- see Section 6):
  - Sets `balances[msg.sender] = 0`.
- **External call**: `usdc.safeTransfer(msg.sender, amount)`.
- **Emits**: `RevenueClaimed(msg.sender, amount)`.

#### getAdSlot

```solidity
function getAdSlot(uint256 slotId) external view returns (AdSlot memory)
```

Returns the full `AdSlot` struct for the given slot ID.

- **Access**: Anyone (view function).
- **Parameters**: `slotId` -- the slot identifier.
- **Returns**: `AdSlot memory`.

#### getActiveSlots

```solidity
function getActiveSlots() external view returns (AdSlot[] memory)
```

Returns all ad slots that are currently active and unsold.

- **Access**: Anyone (view function).
- **Returns**: `AdSlot[] memory` -- array of active, unsold slots.
- **Implementation note**: Iterates all slot IDs from 0 to `nextSlotId - 1` in two passes (count then collect). Gas cost scales linearly with total slots ever created.

#### getBalance

```solidity
function getBalance(address agent) external view returns (uint256)
```

Returns the claimable USDC balance for the given address.

- **Access**: Anyone (view function).
- **Parameters**: `agent` -- the address to check.
- **Returns**: `uint256` -- USDC amount (6 decimals).

### 5.5 Admin Module

#### setOracle

```solidity
function setOracle(address newOracle) external onlyOwner
```

Updates the oracle address authorized to set reputation scores.

- **Access**: Owner only (`onlyOwner`).
- **Validation**: `newOracle` must not be `address(0)`.
- **State changes**: Updates `oracle`.
- **Emits**: `OracleUpdated(oldOracle, newOracle)`.

#### pause

```solidity
function pause() external onlyOwner
```

Pauses the contract. All functions with the `whenNotPaused` modifier will revert until unpaused.

- **Access**: Owner only (`onlyOwner`).
- **State changes**: Calls internal `_pause()` from OpenZeppelin `Pausable`.

#### unpause

```solidity
function unpause() external onlyOwner
```

Unpauses the contract, restoring normal operation.

- **Access**: Owner only (`onlyOwner`).
- **State changes**: Calls internal `_unpause()` from OpenZeppelin `Pausable`.

---

## 6. Security Patterns

### 6.1 Checks-Effects-Interactions (CEI)

The contract follows the CEI pattern in both functions that make external ERC-20 calls:

**buyAdSlot**:

1. **Checks** -- Validate that the slot is active, unsold, and the buyer is not the seller.
2. **Effects** -- Update `slot.active`, `slot.sold`, `slot.buyer`, `slot.purchasedAt`, and credit `balances[slot.seller]`.
3. **Interaction** -- Call `usdc.safeTransferFrom(msg.sender, address(this), slot.priceUsdc)`.

If the external `safeTransferFrom` call fails (insufficient balance, insufficient allowance, or token revert), the entire transaction reverts, rolling back all state changes. If a malicious token contract attempted reentrancy during the transfer, all state is already finalized, so re-entering `buyAdSlot` would fail because `slot.active` is already `false` and `slot.sold` is already `true`.

**claimRevenue**:

1. **Checks** -- Validate that `balances[msg.sender] > 0`.
2. **Effects** -- Set `balances[msg.sender] = 0`.
3. **Interaction** -- Call `usdc.safeTransfer(msg.sender, amount)`.

The balance is zeroed before the transfer. If a reentrancy attempt occurred during the transfer, re-entering `claimRevenue` would fail the `amount > 0` check because the balance is already 0.

### 6.2 ReentrancyGuard

The `nonReentrant` modifier is applied to `buyAdSlot` and `claimRevenue` -- the only two functions that make external calls to the USDC token contract. This provides defense-in-depth on top of the CEI pattern. Even though USDC (a well-known, audited token) is unlikely to contain reentrancy vectors, the guard protects against:

- Deployment with a malicious or non-standard token address.
- Future changes where the token interaction surface could expand.

The `nonReentrant` modifier is not needed on view functions (no state mutation), `registerAgent` (no external calls), `listAdSlot` (no external calls), `cancelAdSlot` (no external calls), or admin functions (no external calls to untrusted contracts).

### 6.3 SafeERC20

All USDC interactions use `SafeERC20` wrappers (`safeTransferFrom`, `safeTransfer`) instead of raw `IERC20.transfer`/`IERC20.transferFrom`. This ensures:

- If the token returns `false` instead of reverting on failure, `SafeERC20` will revert.
- If the token returns no data (non-standard but common in some tokens), `SafeERC20` handles it gracefully.
- USDC on Base Sepolia is a standard ERC-20 implementation, but `SafeERC20` is a best practice regardless.

### 6.4 Input Validation Rules

| Parameter | Rule | Error Message |
|-----------|------|---------------|
| `moltbookHandle` (length) | >= 3 and <= 50 characters | `"Handle must be 3-50 chars"` |
| `moltbookHandle` (uniqueness) | Must not already be claimed | `"Handle taken"` |
| Caller wallet (registration) | Must not already be registered | `"Already registered"` |
| `score` | <= 1000 | `"Score max 1000"` |
| Agent existence (for scoring) | Agent must be registered | `"Agent not registered"` |
| `priceUsdc` | > 0 | `"Price must be > 0"` |
| `description` (length) | >= 1 and <= 500 characters | `"Description must be 1-500 chars"` |
| Seller requirement (listing) | Caller must be registered | `"Must be registered"` |
| Self-buy prevention | Buyer cannot be the seller | `"Cannot buy own slot"` |
| Constructor `_usdc` | Must not be `address(0)` | `"Invalid USDC address"` |
| Constructor `_oracle` | Must not be `address(0)` | `"Invalid oracle address"` |
| `setOracle` `newOracle` | Must not be `address(0)` | `"Invalid oracle address"` |

### 6.5 Access Control Summary

| Role | Functions |
|------|-----------|
| **Anyone** | `registerAgent`, `buyAdSlot`, `claimRevenue`, all `get*`/`is*` view functions |
| **Oracle only** | `setScore`, `batchSetScores` |
| **Owner only** | `setOracle`, `pause`, `unpause` |
| **Seller only** | `cancelAdSlot` (must be the slot's seller) |

---

## 7. Revenue Model

The contract uses a direct seller-payment model with no protocol fee:

```
Buyer pays USDC --> Contract holds it --> 100% credited to seller's balance (withdrawable)
```

When `buyAdSlot` is called:

1. The full `slot.priceUsdc` is credited to `balances[slot.seller]`.
2. USDC is transferred from the buyer to the contract via `safeTransferFrom`.

The seller can call `claimRevenue` at any time to withdraw their accumulated balance.

---

## 8. Score Tiers

Scores are integers from 0 to 1000, set by the oracle. The tier mapping is applied off-chain:

| Range | Tier | Label |
|-------|------|-------|
| 0-99 | Bronze | New |
| 100-299 | Silver | Active |
| 300-599 | Gold | Contributor |
| 600-899 | Platinum | Influencer |
| 900-1000 | Diamond | Elite |

The off-chain formula for computing scores:

```
score = min(1000, karma * 3 + followers * 5 + posts * 10 + comments * 2)
```

The contract does not enforce or compute tiers. It stores the raw score and leaves tier classification to consumers.

---

## 9. Deployment Guide

### 9.1 Prerequisites

- Node.js 18+
- A wallet with Base Sepolia ETH (for gas) and optionally USDC (for demo transactions).
- A Basescan API key (for contract verification).

### 9.2 Install Dependencies

```bash
npm install
```

This installs all dependencies defined in `package.json`, including:

- `hardhat` and `@nomicfoundation/hardhat-toolbox` (dev dependencies)
- `@openzeppelin/contracts`
- `dotenv`

If starting from scratch:

```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv
```

### 9.3 Configure Environment

Create a `.env` file in the project root:

```
DEPLOYER_PRIVATE_KEY=0x...     # Private key of deployer wallet (with Base Sepolia ETH)
BASESCAN_API_KEY=...           # API key from basescan.org for contract verification
```

The `hardhat.config.js` reads these values via `dotenv` and configures the `base-sepolia` network:

- **RPC URL**: `https://sepolia.base.org`
- **Chain ID**: `84532`
- **Account**: The deployer private key from `.env`

### 9.4 Compile

```bash
npx hardhat compile
```

Compiles all contracts in `contracts/` including `Clawsight.sol` and `contracts/test/MockERC20.sol`. Artifacts are written to `artifacts/`.

### 9.5 Run Tests

```bash
npx hardhat test
```

Runs the Hardhat test suite in `test/Clawsight.test.js` using the local Hardhat network. Tests use `MockERC20` as a stand-in for USDC. See Section 10 for the full test specification.

### 9.6 Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

The deploy script should:

1. Deploy `Clawsight` with constructor arguments:
   - `_usdc`: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (Base Sepolia USDC)
   - `_oracle`: The deployer's address (for hackathon simplicity)
2. Log the deployed contract address.
3. Wait for a few block confirmations before verification.

### 9.7 Verify on Basescan

```bash
npx hardhat verify --network base-sepolia <DEPLOYED_ADDRESS> \
  0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  <DEPLOYER_ADDRESS>
```

Replace `<DEPLOYED_ADDRESS>` with the address output from the deploy script, and `<DEPLOYER_ADDRESS>` with the oracle/deployer wallet address. After verification, the contract source code and ABI will be visible on `https://sepolia.basescan.org/address/<DEPLOYED_ADDRESS>`.

Alternatively, the deploy script can programmatically call `hre.run("verify:verify", ...)` after deployment.

---

## 10. Test Suite Specification

The test file `test/Clawsight.test.js` should use Hardhat's built-in test framework (Mocha + Chai + ethers.js) and the `MockERC20` contract for USDC simulation.

### 10.1 Test Setup

Before each test or test group:

1. Deploy `MockERC20` with name `"Mock USDC"`, symbol `"USDC"`, decimals `6`.
2. Deploy `Clawsight` with the MockERC20 address and the oracle signer's address.
3. Mint test USDC to relevant accounts.
4. Obtain signers: `owner` (deployer/oracle), `agent1`, `agent2`, `agent3`, `buyer`, `nonAgent`.

### 10.2 Registration Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Register an agent with a valid handle | Succeeds. `agents[wallet].exists` is `true`. `AgentRegistered` event emitted. |
| Register with handle of exactly 3 characters | Succeeds (boundary). |
| Register with handle of exactly 50 characters | Succeeds (boundary). |
| Register with handle shorter than 3 characters | Reverts with `"Handle must be 3-50 chars"`. |
| Register with handle longer than 50 characters | Reverts with `"Handle must be 3-50 chars"`. |
| Register with an empty handle | Reverts with `"Handle must be 3-50 chars"`. |
| Register the same wallet twice | Reverts with `"Already registered"`. |
| Register with a handle already taken by another wallet | Reverts with `"Handle taken"`. |
| `getAgent` returns correct data after registration | Returns the `Agent` struct with matching handle, timestamp, and `exists = true`. |
| `isRegistered` returns `true` for registered address | Returns `true`. |
| `isRegistered` returns `false` for unregistered address | Returns `false`. |
| `getAgentCount` increments after each registration | Count matches the number of `registerAgent` calls. |
| Register when paused | Reverts (Pausable guard). |

### 10.3 Reputation Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Oracle sets a score for a registered agent | Succeeds. `scores[agent]` updated. `ScoreUpdated` event emitted with old and new scores. |
| Oracle sets score to 0 | Succeeds (minimum boundary). |
| Oracle sets score to 1000 | Succeeds (maximum boundary). |
| Oracle sets score above 1000 | Reverts with `"Score max 1000"`. |
| Oracle sets score for unregistered agent | Reverts with `"Agent not registered"`. |
| Non-oracle calls `setScore` | Reverts with `"Only oracle"`. |
| Oracle batch-sets scores for multiple agents | Succeeds. Each agent's score updated. One `ScoreUpdated` event per agent. |
| Batch set with mismatched array lengths | Reverts with `"Length mismatch"`. |
| Batch set with one unregistered agent | Reverts with `"Agent not registered"`. |
| Batch set with one score above 1000 | Reverts with `"Score max 1000"`. |
| `getScore` returns 0 for agent with no score set | Returns `0` (default). |
| `getTopAgents(N)` returns correct ordering | Top N agents sorted by score descending. |
| `getTopAgents` with count > total agents | Returns all agents (no revert). |
| `getTopAgents(0)` | Returns empty arrays. |
| Set score when paused | Reverts (Pausable guard). |

### 10.4 Ad Marketplace Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Registered agent lists an ad slot | Succeeds. Slot created with correct fields. `AdSlotListed` event emitted. `nextSlotId` incremented. |
| Unregistered address lists an ad slot | Reverts with `"Must be registered"`. |
| List with price = 0 | Reverts with `"Price must be > 0"`. |
| List with empty description | Reverts with `"Description must be 1-500 chars"`. |
| List with description > 500 chars | Reverts with `"Description must be 1-500 chars"`. |
| List with description of exactly 1 character | Succeeds (boundary). |
| List with description of exactly 500 characters | Succeeds (boundary). |
| Buyer purchases an active slot | Succeeds. Slot marked sold/inactive. USDC transferred from buyer to contract. Seller balance credited. `AdSlotPurchased` event emitted. |
| Buy a slot that is not active | Reverts with `"Slot not active"`. |
| Buy a slot that is already sold | Reverts with `"Already sold"`. |
| Seller tries to buy own slot | Reverts with `"Cannot buy own slot"`. |
| Buy without sufficient USDC allowance | Reverts (SafeERC20 revert). |
| Buy without sufficient USDC balance | Reverts (SafeERC20 revert). |
| Seller cancels own active slot | Succeeds. Slot marked inactive. `AdSlotCancelled` event emitted. |
| Non-seller cancels a slot | Reverts with `"Not seller"`. |
| Cancel an already sold slot | Reverts with `"Already sold"`. |
| Cancel an already cancelled slot | Reverts with `"Not active"`. |
| Seller claims revenue after a sale | Succeeds. USDC transferred from contract to seller. Balance zeroed. `RevenueClaimed` event emitted. |
| Claim with zero balance | Reverts with `"No balance"`. |
| `getAdSlot` returns correct data | Returns the `AdSlot` struct matching all fields. |
| `getActiveSlots` returns only active unsold slots | Filters out sold and cancelled slots. |
| `getBalance` returns correct balance after sale | Matches `slot.priceUsdc`. |
| `getBalance` returns 0 after claim | Returns `0`. |
| List and buy when paused | Both revert (Pausable guard). |

### 10.5 Admin Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Owner sets a new oracle | Succeeds. `oracle` updated. `OracleUpdated` event emitted. |
| Non-owner calls `setOracle` | Reverts (Ownable guard). |
| Set oracle to `address(0)` | Reverts with `"Invalid oracle address"`. |
| Owner pauses the contract | Succeeds. Contract is paused. |
| Owner unpauses the contract | Succeeds. Contract is unpaused. |
| Non-owner calls `pause` | Reverts (Ownable guard). |
| Non-owner calls `unpause` | Reverts (Ownable guard). |

### 10.6 Constructor Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Deploy with valid addresses | Succeeds. `usdc` and `oracle` set correctly. Owner is `msg.sender`. |
| Deploy with `_usdc = address(0)` | Reverts with `"Invalid USDC address"`. |
| Deploy with `_oracle = address(0)` | Reverts with `"Invalid oracle address"`. |

### 10.7 MockERC20 Reference

The `MockERC20` contract in `contracts/test/MockERC20.sol` is a minimal ERC-20 used exclusively for testing:

```solidity
contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

Key characteristics:

- Configurable decimals (use `6` to match USDC).
- Public `mint` function with no access control, allowing tests to mint arbitrary amounts.
- Standard ERC-20 `transfer`, `transferFrom`, `approve` inherited from OpenZeppelin.

In tests, deploy as:

```javascript
const MockERC20 = await ethers.getContractFactory("MockERC20");
const usdc = await MockERC20.deploy("Mock USDC", "USDC", 6);
```

---

## 11. Demo Script Specification

The file `scripts/demo.js` performs a full end-to-end walkthrough on Base Sepolia to generate transaction hashes for the hackathon submission.

### 11.1 Prerequisites

- Contract already deployed (address known).
- Deployer wallet has Base Sepolia ETH (for gas) and USDC (for the ad purchase).
- The deployer is both the owner and the oracle.

### 11.2 Transaction Flow

The script should execute the following steps sequentially, logging each transaction hash:

**Step 1: Register 3 agents**

```
tx1 = clawsight.registerAgent("agent_alpha")    // from wallet 1
tx2 = clawsight.registerAgent("agent_beta")     // from wallet 2
tx3 = clawsight.registerAgent("agent_gamma")    // from wallet 3
```

If only one wallet is available (the deployer), register the deployer as one agent and note that the other two registrations would require separate wallets. Alternatively, use `ethers.Wallet.createRandom()` funded from the deployer.

**Step 2: Set reputation scores (oracle)**

```
tx4 = clawsight.setScore(agent1, 850)   // Platinum
tx5 = clawsight.setScore(agent2, 450)   // Gold
tx6 = clawsight.setScore(agent3, 950)   // Diamond
```

Or use `batchSetScores` in a single transaction:

```
tx4 = clawsight.batchSetScores(
    [agent1, agent2, agent3],
    [850, 450, 950]
)
```

**Step 3: List an ad slot (from agent1)**

```
tx7 = clawsight.listAdSlot(
    5_000_000,    // 5 USDC (6 decimals)
    "Premium sidebar placement on agent_alpha's feed"
)
```

**Step 4: Buy the ad slot (from agent2)**

```
tx8 = usdc.approve(clawsightAddress, 5_000_000)    // approve first
tx9 = clawsight.buyAdSlot(0)                        // buy slot 0
```

**Step 5: Claim revenue (from agent1)**

```
tx10 = clawsight.claimRevenue()    // agent1 withdraws 5 USDC
```

### 11.3 Expected Output

The script should log each transaction hash in a format suitable for inclusion in the submission:

```
=== Clawsight Demo Transactions ===

1. Register agent_alpha:   0x...
2. Register agent_beta:    0x...
3. Register agent_gamma:   0x...
4. Set scores (batch):     0x...
5. List ad slot (5 USDC):  0x...
6. Approve USDC:           0x...
7. Buy ad slot #0:         0x...
8. Claim revenue:          0x...

Contract: https://sepolia.basescan.org/address/<CONTRACT_ADDRESS>
```

Each hash can be viewed at `https://sepolia.basescan.org/tx/<HASH>`.

### 11.4 What to Collect for Submission

From the demo script output, collect:

1. The deployed contract address (Basescan link).
2. All transaction hashes (Basescan links) demonstrating:
   - Agent registration.
   - Score assignment.
   - Ad listing.
   - USDC approval and ad purchase.
   - Revenue claim.
3. The agent count and top agents (read from `getAgentCount` and `getTopAgents`).

---

## 12. Key Addresses (Base Sepolia)

| Resource | Address / URL |
|----------|---------------|
| USDC Token | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (6 decimals) |
| EAS Contract | `0x4200000000000000000000000000000000000021` |
| Schema Registry | `0x4200000000000000000000000000000000000020` |
| RPC Endpoint | `https://sepolia.base.org` |
| Block Explorer | `https://sepolia.basescan.org` |
| USDC Faucet | `https://faucet.circle.com` |
| ETH Faucet | `https://www.alchemy.com/faucets/base-sepolia` |
| EAS Explorer | `https://base-sepolia.easscan.org` |
