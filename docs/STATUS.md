# Clawsight -- Project Status

> Last updated: Feb 6, 2026 (Day 2 of 3)
> Deadline: Feb 8, 2026, 12:00 PM PST

---

## Where We Are

**Phases 1-3 COMPLETE. V2 DEPLOYED. Phase 4 (Submit) -- NEXT.**

```
Phase 1: Code          [##########] 100%  DONE
Phase 2: Deploy        [##########] 100%  DONE (V1 + V2)
Phase 3: EAS           [##########] 100%  DONE
Phase 4: Submit        [######    ]  60%  IN PROGRESS <-- YOU ARE HERE
Phase 5: Vote + Polish [          ]   0%  After submit
```

---

## Deployed Addresses

| What | Address / Link |
|------|----------------|
| V1 Contract | `0x497cA2E521887d250730EAeD777A3998CC74e21a` |
| V1 Basescan | https://sepolia.basescan.org/address/0x497cA2E521887d250730EAeD777A3998CC74e21a |
| V2 Contract | `0xed550675235625872bbF02DbE7851C35Cc4aD501` |
| V2 Basescan | https://sepolia.basescan.org/address/0xed550675235625872bbF02DbE7851C35Cc4aD501 |
| Deployer/Oracle | `0xc91dDCEfBd6e3C9527c9c7baF126C8fBD9Eb13d1` |
| EAS Schema | `0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c` |
| EAS Schema URL | https://base-sepolia.easscan.org/schema/view/0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c |
| GitHub | https://github.com/back2matching/clawsight |

---

## Demo Transaction Hashes (V1)

| TX | Hash | Link |
|----|------|------|
| Register agent_alpha | `0x558e3df8...` | https://sepolia.basescan.org/tx/0x558e3df83a7414445356f60c9ecf6351297da4daff7c2466f4b8815c0a6b78b4 |
| Set score 750 (Platinum) | `0xa9ef4949...` | https://sepolia.basescan.org/tx/0xa9ef4949a488b4638b0e842b4ce5ce9e7d7163c233bf4a5c9d78aede3b7cfc12 |
| List ad slot (0.10 USDC) | `0xeaf31f95...` | https://sepolia.basescan.org/tx/0xeaf31f95a31f6ad9dde8c6442339a0b2ab3df876136abd1ffc5a6667e6a02225 |

## Demo Transaction Hashes (V2)

Full escrow flow: seller registers, lists ad, buyer registers, buys ad with content, seller delivers, buyer confirms, seller claims revenue.

| TX | Hash | Link |
|----|------|------|
| Set score 750 (Platinum) | `0x5890c4b9...` | https://sepolia.basescan.org/tx/0x5890c4b9ea68433b0d44828df86cf066c2652803227a0c2786dcda8b76cd010e |
| List ad slot (1 USDC) | `0x524976a3...` | https://sepolia.basescan.org/tx/0x524976a39d890862f9bd3f11b2d46f6271f6569e5ba67ae03f0a68d941152c4b |
| Register buyer | `0x52ffc51b...` | https://sepolia.basescan.org/tx/0x52ffc51bab355f286379e2f4b74fb4378ed672752a1c73b76f514c1d8dbb4444 |
| Buy ad (w/ content) | `0x027b5c90...` | https://sepolia.basescan.org/tx/0x027b5c9018ac79574bf08aab30b14a8d797e14fb2ac6023b112e0fcb222ffe84 |
| Mark delivered | `0xdf3fc583...` | https://sepolia.basescan.org/tx/0xdf3fc583b7bf59283fcad613e1e4ec73a04e2222638187309a15bf7c4905f7fa |
| Confirm delivery | `0xd42ed5c9...` | https://sepolia.basescan.org/tx/0xd42ed5c9e5163c48ef67647a05f2a981e0e515c3ceaa4647c96f50773cdb0ce9 |
| Claim revenue | `0x83958b7a...` | https://sepolia.basescan.org/tx/0x83958b7a60988d7877e2f6655546746b7d4fa9de682a1a225b4bdd991ff5691c |

---

## EAS Attestations

| Agent | Score | Attestation |
|-------|-------|-------------|
| agent_alpha | 750 (Platinum) | https://base-sepolia.easscan.org/attestation/view/0x3b068403d2b732305bc9fa905d144327b272dfb8dc4eca378e139572bf962c35 |
| agent_beta | 420 (Gold) | https://base-sepolia.easscan.org/attestation/view/0x8b29c6ac47a2ecea522379b362822878fac1853bad5fc366bf31bf284df62f46 |
| agent_gamma | 920 (Diamond) | https://base-sepolia.easscan.org/attestation/view/0xedfd18b8476fe4855d3c386cee6a401b2cb3e11862db6490827f091ca98ab5c1 |

---

## Phase 1: Code (COMPLETE)

### V1 Contract

| File | Status | Details |
|------|--------|---------|
| `contracts/Clawsight.sol` | DONE | 290 lines, all modules implemented |
| `contracts/test/MockERC20.sol` | DONE | Mock USDC with mint + configurable decimals |
| `test/Clawsight.test.js` | DONE | **71/71 tests passing** |
| `scripts/deploy.js` | DONE | Deploy + Basescan verification |
| `scripts/demo.js` | DONE | Register agent, set score, list ad, query |
| `scripts/eas.js` | DONE | Schema registration + 3 attestations |
| `skill/SKILL.md` | DONE | 10 /clawsight commands, contract address filled in |

### V2 Contract

| File | Status | Details |
|------|--------|---------|
| `contracts/ClawsightV2.sol` | DONE | 570 lines, security-audited, all fixes applied |
| `test/ClawsightV2.test.js` | DONE | **48/48 tests passing** |
| `scripts/deployV2.js` | DONE | Deploy to Base Sepolia |
| `frontend/src/lib/contractsV2.ts` | DONE | ABI + deployed address |

### V2 Security Audit (Applied)

| Issue | Severity | Fix |
|-------|----------|-----|
| Slots not deactivated after purchase | CRITICAL | `slot.active = false` after buy |
| Dispute window from purchasedAt | HIGH | Uses `deliveredAt + DISPUTE_WINDOW` now |
| Missing deliveredAt timestamp | HIGH | Added to Purchase struct |
| No purchaseId in struct | MEDIUM | Added `id` field |
| Missing bounds checks | MEDIUM | `require(purchaseId < nextPurchaseId)` |
| No nonReentrant on oracle funcs | MEDIUM | Added to resolveDisputeForBuyer/Seller |

### Frontend (SvelteKit)

| Page | Status | Description |
|------|--------|-------------|
| `/` | DONE | Dashboard with agent stats, top agents, EAS info |
| `/marketplace-v2` | DONE | Browse and buy ad slots with content submission |
| `/sell` | DONE | Create ad slot listings |
| `/dashboard` | DONE | Track purchases, deliveries, disputes, revenue |
| `/agents` | DONE | Agent registry with tier badges |
| `/leaderboard` | DONE | Ranked leaderboard with score bars |
| `/agent/[address]` | DONE | Individual agent profile |

### Test Results

```
V1: 71 passing
V2: 48 passing
Total: 119 passing (3s)
```

---

## Phase 2: Deploy (COMPLETE)

- [x] V1 deployed: `0x497cA2E521887d250730EAeD777A3998CC74e21a`
- [x] V2 deployed: `0xed550675235625872bbF02DbE7851C35Cc4aD501`
- [ ] Basescan verification (needs API key -- not required for submission)
- [x] V1 demo txs: register, setScore, listAdSlot all confirmed
- [x] V2 demo txs: full escrow flow (register, score, list, buy, deliver, confirm, claim) all confirmed

---

## Phase 3: EAS (COMPLETE)

- [x] Schema registered: `0x56846ffe3472c0e2215fd4851fdb839eee46c123d5924936481203bbf3e5d11c`
- [x] 3 attestations created (agent_alpha, agent_beta, agent_gamma)
- [x] All links verified on easscan.org

---

## Phase 4: Submit on Moltbook (IN PROGRESS)

- [x] Push code to GitHub
- [x] Contract address filled in `skill/SKILL.md`
- [x] V2 deployed and frontend address updated
- [x] V2 demo transactions complete (full escrow flow)
- [x] All links filled in SUBMISSIONS.md
- [ ] Post submission on Moltbook m/usdc

---

## Phase 5: Vote + Polish (Feb 7-8)

- [ ] Vote on 5+ other projects (Day 2)
- [ ] Vote on 5 more (Day 3, target 10+)
- [ ] Respond to comments on submission
- [ ] Verify all links work before noon PST deadline

---

## Contract Summary

### V1 (Clawsight.sol)
| Feature | Functions |
|---------|-----------|
| Agent Registry | registerAgent, getAgent, isRegistered, getAgentCount |
| Reputation | setScore, batchSetScores, getScore, getTopAgents |
| Ad Marketplace | listAdSlot, buyAdSlot, cancelAdSlot, claimRevenue, getAdSlot, getActiveSlots, getBalance |
| Admin | setOracle, pause, unpause |

### V2 (ClawsightV2.sol) -- adds escrow + delivery
| Feature | Functions |
|---------|-----------|
| All V1 features | Same as above |
| Ad Content | buyAdSlot(slotId, imageUrl, clickUrl, text) |
| Delivery | markDelivered, confirmDelivery |
| Disputes | disputeDelivery, resolveDisputeForBuyer, resolveDisputeForSeller |
| Auto-Resolution | autoComplete, autoRefund |
| Escrow | getEscrow, getPurchase, getPurchasesByBuyer, getPurchasesBySeller |

**Revenue model:** 100% to seller, no platform fee
**Security:** CEI pattern, ReentrancyGuard, SafeERC20, Pausable, input validation, bounds checks
**Network:** Base Sepolia (Chain ID 84532)
**USDC:** 0x036CbD53842c5426634e7929541eC2318f3dCF7e (6 decimals)
