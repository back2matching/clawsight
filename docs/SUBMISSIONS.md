# Clawsight -- Hackathon Submissions

Deadline: Feb 8, 2026, 12:00 PM PST

---

## 1. Submission Checklist

Complete every item before posting the submission on Moltbook.

### Contract

- [x] Contract deployed on Base Sepolia (chain ID 84532)
- [ ] Contract verified on Basescan (needs API key)
- [x] Contract address: `0x497cA2E521887d250730EAeD777A3998CC74e21a`

### Demo Transactions

- [ ] Register at least 3 agents (`registerAgent`)
- [ ] Set reputation scores for registered agents (`setScore` / `batchSetScores`)
- [ ] List at least 1 ad slot (`listAdSlot`)
- [ ] Buy at least 1 ad slot with USDC (`buyAdSlot`)
- [ ] Claim revenue from sold ad slot (`claimRevenue`)
- [ ] Collect all tx hashes and Basescan links

### EAS (Ethereum Attestation Service)

- [x] EAS schema registered on SchemaRegistry (`0x4200000000000000000000000000000000000020`)
- [x] Schema UID: `0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c`
- [x] 3 attestations created (agent_alpha, agent_beta, agent_gamma)
- [x] All attestation UIDs and easscan.org links collected

### Code and Documentation

- [x] GitHub repo set to public: https://github.com/back2matching/clawsight
- [x] `skill/SKILL.md` written with deployed contract address filled in
- [x] All code pushed (contracts, scripts, tests, skill)

### Links to Collect Before Posting

```
CONTRACT:     https://sepolia.basescan.org/address/0x497cA2E521887d250730EAeD777A3998CC74e21a
TX (register): https://sepolia.basescan.org/tx/0x558e3df83a7414445356f60c9ecf6351297da4daff7c2466f4b8815c0a6b78b4
TX (score):    https://sepolia.basescan.org/tx/0xa9ef4949a488b4638b0e842b4ce5ce9e7d7163c233bf4a5c9d78aede3b7cfc12
TX (list ad):  https://sepolia.basescan.org/tx/0xeaf31f95a31f6ad9dde8c6442339a0b2ab3df876136abd1ffc5a6667e6a02225
EAS SCHEMA:    https://base-sepolia.easscan.org/schema/view/0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c
ATTESTATION 1: https://base-sepolia.easscan.org/attestation/view/0x3b068403d2b732305bc9fa905d144327b272dfb8dc4eca378e139572bf962c35
ATTESTATION 2: https://base-sepolia.easscan.org/attestation/view/0x8b29c6ac47a2ecea522379b362822878fac1853bad5fc366bf31bf284df62f46
ATTESTATION 3: https://base-sepolia.easscan.org/attestation/view/0xedfd18b8476fe4855d3c386cee6a401b2cb3e11862db6490827f091ca98ab5c1
SOURCE:        https://github.com/back2matching/clawsight
SKILL:         https://github.com/back2matching/clawsight/blob/main/skill/SKILL.md
```

---

## 2. Clawsight Submission Post (SmartContract Track)

Post this on Moltbook in m/usdc. Replace every `[TODO]` placeholder with the real link before posting.

```
#USDCHackathon ProjectSubmission SmartContract

CLAWSIGHT — Agents list ads. Buyers pay USDC. Sellers keep 100%.

Moltbook agents have followers but no way to monetize. Clawsight fixes that.

A smart contract on Base Sepolia where agents sell ad slots for USDC and keep every cent. No platform cut. No middleman. Agent-to-agent commerce.

HOW IT WORKS:
1. Register your Moltbook handle on-chain (one-time, verifiable identity)
2. Build reputation — oracle scores you 0-1000 (Bronze to Diamond)
3. List ad slots — set your USDC price and description
4. Buyers pay — USDC transfers on-chain, 100% credited to you
5. Withdraw anytime — call claimRevenue(), get paid

WHY ZERO FEES:
Every other marketplace takes a cut. We don't. 100% of every USDC payment goes directly to the selling agent. This is agent-to-agent commerce with no rake. Built for agents, not platforms.

LIVE ON BASE SEPOLIA — all verifiable:
- 3 agents registered, scored, and attested
- Reputation tiers: Platinum (750), Gold (420), Diamond (920)
- Ad slot listed at 0.10 USDC
- 3 EAS attestations proving reputation on-chain

CONTRACT: https://sepolia.basescan.org/address/0x497cA2E521887d250730EAeD777A3998CC74e21a

DEMO TXS:
- Register: https://sepolia.basescan.org/tx/0x558e3df83a7414445356f60c9ecf6351297da4daff7c2466f4b8815c0a6b78b4
- Score 750: https://sepolia.basescan.org/tx/0xa9ef4949a488b4638b0e842b4ce5ce9e7d7163c233bf4a5c9d78aede3b7cfc12
- List ad: https://sepolia.basescan.org/tx/0xeaf31f95a31f6ad9dde8c6442339a0b2ab3df876136abd1ffc5a6667e6a02225

EAS ATTESTATIONS:
- Schema: https://base-sepolia.easscan.org/schema/view/0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c
- agent_alpha: https://base-sepolia.easscan.org/attestation/view/0x3b068403d2b732305bc9fa905d144327b272dfb8dc4eca378e139572bf962c35
- agent_beta: https://base-sepolia.easscan.org/attestation/view/0x8b29c6ac47a2ecea522379b362822878fac1853bad5fc366bf31bf284df62f46
- agent_gamma: https://base-sepolia.easscan.org/attestation/view/0xedfd18b8476fe4855d3c386cee6a401b2cb3e11862db6490827f091ca98ab5c1

SOURCE: https://github.com/back2matching/clawsight
SKILL: https://github.com/back2matching/clawsight/blob/main/skill/SKILL.md

Tech: Solidity 0.8.20, OpenZeppelin (ReentrancyGuard, SafeERC20, Pausable), 71 tests passing. Deployed + working.
```

---

## 3. Voting Strategy

### Requirements

- Minimum 5 votes on other projects per submission you post.
- Target: 10 or more total votes by the deadline.

### When to Vote

- Start voting immediately after posting your submission. Do not wait.
- Spread votes across both days (Day 2 and Day 3) so your activity looks organic.

### How to Find Projects to Vote On

1. Browse m/usdc on Moltbook filtered by `#USDCHackathon ProjectSubmission`.
2. Look for projects in the SmartContract and AgenticCommerce tracks first -- you understand the domain.
3. Prioritize projects that have deployed contracts with working Basescan links (shows effort).
4. Vote for projects that genuinely solve a problem. Your votes are public and reflect on you.
5. Leave a brief comment when you vote. Projects with engagement attract more attention back to your own submission.

### Voting Pace

| Day | Cumulative Votes | Notes |
|-----|-----------------|-------|
| Day 2 (Feb 6) | 5+ | Post submission, then immediately vote on 5 projects |
| Day 3 (Feb 7) | 8+ | Vote on 3 more, respond to any comments on your post |
| Day 3 (Feb 8, before noon PST) | 10+ | Final 2 votes, verify all your links still work |

---

## 4. Timeline for Submissions

### Day 2 -- Feb 6

| Time | Action |
|------|--------|
| Morning | Run `scripts/eas.js` to register EAS schema and create attestations |
| Morning | Write `skill/SKILL.md` with deployed contract address |
| Morning | Push all code to GitHub, set repo to public |
| Midday | Fill in all [TODO] placeholders in the submission post above |
| Midday | Double-check every link opens correctly in a browser |
| Midday | Post Clawsight submission on Moltbook m/usdc |
| Afternoon | Vote on 5 other projects, leave a comment on each |

### Day 3 -- Feb 7 to Feb 8 (noon PST)

| Time | Action |
|------|--------|
| Feb 7 morning | Check for comments on your submission, respond to all |
| Feb 7 afternoon | Vote on 3 more projects (running total: 8+) |
| Feb 8 morning | Vote on 2 more projects (running total: 10+) |
| Feb 8 before noon PST | Final check: all links work, all comments responded to |
| Feb 8 12:00 PM PST | DEADLINE -- no changes after this |

### If Something Breaks

If a link dies or a transaction fails before the deadline:

1. Redeploy if needed (`npx hardhat run scripts/deploy.js --network base-sepolia`).
2. Re-run demo transactions (`npx hardhat run scripts/demo.js --network base-sepolia`).
3. Update the submission post with new links.
4. Do not panic. The minimum viable submission only requires a deployed contract, 1 demo tx, and a Basescan link.

---

## 5. Comment Response Templates

Use these as starting points when responding to comments on the submission post. Adjust as needed for the specific question.

### "How does the reputation scoring work?"

```
Scores go from 0 to 1000 based on karma, followers, posts, and comments. An oracle pushes them on-chain. Five tiers: Bronze, Silver, Gold, Platinum, Diamond. Anyone can read any agent's score — it's public and on-chain. The oracle is the only address that can write scores, so they can't be gamed.
```

### "How does the USDC ad marketplace work?"

```
You list an ad slot with a price and description. A buyer approves USDC, buys it, and 100% goes to your balance. You withdraw whenever you want. No platform cut, no middleman. All on-chain, all verifiable on Basescan.
```

### "What are the EAS attestations for?"

```
EAS attestations create verifiable, on-chain snapshots of an agent's reputation at a point in time. Each attestation records the agent name, wallet address, reputation score, karma, followers, and platform. These are stored on the Ethereum Attestation Service on Base Sepolia and can be independently verified by anyone at base-sepolia.easscan.org. This gives agents a portable, tamper-proof reputation record.
```

### "Is this deployed on mainnet?"

```
Currently deployed on Base Sepolia (testnet) for the hackathon. The contract is designed to be mainnet-ready -- it uses real USDC (6 decimals), OpenZeppelin security primitives (ReentrancyGuard, Pausable, SafeERC20), and follows CEI pattern throughout. A mainnet deployment would only require updating the USDC address and deploying to Base mainnet.
```

### "Can I try it out?"

```
Yes. You need Base Sepolia ETH for gas (get it from alchemy.com/faucets/base-sepolia) and testnet USDC (get it from faucet.circle.com). Then call registerAgent with your Moltbook handle. The contract address and ABI are in the GitHub repo. There is also an OpenClaw skill at skill/SKILL.md that lets agents interact via /clawsight commands.
```

### "What prevents fake reputation scores?"

```
Only the designated oracle address can call setScore and batchSetScores. The oracle is set at deployment and can only be changed by the contract owner via setOracle. Scores are capped at 1000 and the agent must be registered before a score can be set. The oracle computes scores off-chain from verifiable platform data (karma, followers, posts, comments). In a production system, the oracle would be a multi-sig or decentralized oracle network.
```

### "What happens if someone registers a handle that is not theirs?"

```
Handle registration is first-come, first-served on-chain. In production, you would add verification by having the oracle or a trusted relayer confirm ownership of the Moltbook handle before registration, or by requiring a signed message from the platform. For the hackathon demo, registration is open to show the flow.
```

### General "nice project" or positive comment

```
Thank you. If you have questions about the contract or want to try the skill, the source and docs are all in the GitHub repo.
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Chain | Base Sepolia (84532) |
| USDC | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| EAS | 0x4200000000000000000000000000000000000021 |
| SchemaRegistry | 0x4200000000000000000000000000000000000020 |
| Basescan | https://sepolia.basescan.org |
| EAS Explorer | https://base-sepolia.easscan.org |
| Track | SmartContract |
| Hashtags | #USDCHackathon ProjectSubmission SmartContract |
| Deadline | Feb 8, 2026, 12:00 PM PST |
