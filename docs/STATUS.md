# Clawsight -- Project Status

> Last updated: Feb 6, 2026 (Day 2 of 3)
> Deadline: Feb 8, 2026, 12:00 PM PST

---

## Where We Are

**Phase 1 (Code) -- COMPLETE. Phase 2 (Deploy + Submit) -- NEXT.**

```
Phase 1: Code          [##########] 100%  DONE
Phase 2: Deploy        [          ]   0%  NEXT <-- YOU ARE HERE
Phase 3: EAS           [          ]   0%  After deploy
Phase 4: Submit        [          ]   0%  After EAS
Phase 5: Vote + Polish [          ]   0%  After submit
```

---

## Phase 1: Code (COMPLETE)

Everything is written, compiled, and tested.

| File | Status | Details |
|------|--------|---------|
| `contracts/Clawsight.sol` | DONE | 290 lines, all modules implemented |
| `contracts/test/MockERC20.sol` | DONE | Mock USDC with mint + configurable decimals |
| `test/Clawsight.test.js` | DONE | **71/71 tests passing** (3 seconds) |
| `scripts/deploy.js` | DONE | Deploy + Basescan verification |
| `scripts/demo.js` | DONE | Register agent, set score, list ad, query |
| `scripts/eas.js` | DONE | Schema registration + 3 attestations |
| `skill/SKILL.md` | DONE | 10 /clawsight commands defined |
| `hardhat.config.js` | DONE | Base Sepolia + Basescan configured |
| `package.json` | DONE | All deps installed (node_modules exists) |
| `.env.example` | DONE | Template for keys |

### Test Results

```
Clawsight
  Agent Registry .............. 13 passing
  Reputation .................. 15 passing
  Ad Marketplace .............. 22 passing
  Admin ....................... 11 passing
  Constructor .................  3 passing

71 passing (3s)
```

---

## Phase 2: Deploy to Base Sepolia (NEXT)

**Prerequisites:**
- [ ] `.env` file has `DEPLOYER_PRIVATE_KEY` (wallet with Base Sepolia ETH)
- [ ] `.env` file has `BASESCAN_API_KEY` (for contract verification)
- [ ] Wallet has Base Sepolia ETH (get from https://www.alchemy.com/faucets/base-sepolia)
- [ ] Wallet has Base Sepolia USDC (get from https://faucet.circle.com)

**Commands:**
```bash
# 1. Deploy contract
npx hardhat run scripts/deploy.js --network base-sepolia

# 2. Note the contract address from output
# 3. Run demo transactions
CONTRACT_ADDRESS=0x... npx hardhat run scripts/demo.js --network base-sepolia
```

**What you get:**
- Contract address on Basescan
- Verified source code on Basescan
- Demo tx hashes (register, score, list ad)

---

## Phase 3: EAS Attestations

**After deploying, run:**
```bash
node scripts/eas.js
```

**What you get:**
- Schema UID registered on Base Sepolia EAS
- 3 attestation UIDs for demo agents
- Links to base-sepolia.easscan.org

---

## Phase 4: Submit on Moltbook

**After EAS, do:**
- [ ] Push code to GitHub (new public repo)
- [ ] Fill in contract address in `skill/SKILL.md`
- [ ] Post submission on Moltbook m/usdc (pre-written in `hackathon/SUBMISSIONS.md`)
- [ ] Fill in all [TODO] links with actual Basescan/EAS/GitHub URLs

---

## Phase 5: Vote + Polish (Feb 7-8)

- [ ] Vote on 5+ other projects (Day 2)
- [ ] Vote on 5 more (Day 3, target 10+)
- [ ] Respond to comments on submission
- [ ] Verify all links work before noon PST deadline

---

## File Map

```
clawsight/
├── contracts/
│   ├── Clawsight.sol              # Main contract (DONE)
│   └── test/MockERC20.sol         # Mock USDC (DONE)
├── test/
│   └── Clawsight.test.js          # 71 tests (DONE)
├── scripts/
│   ├── deploy.js                  # Deploy + verify (DONE, not yet run)
│   ├── demo.js                    # Demo txs (DONE, not yet run)
│   └── eas.js                     # EAS attestations (DONE, not yet run)
├── skill/
│   └── SKILL.md                   # OpenClaw skill (DONE, needs contract addr)
├── hackathon/
│   ├── README.md                  # Project overview + brand guide
│   ├── PRD.md                     # Product requirements (10 stories, 18 reqs)
│   ├── ARCHITECTURE.md            # System design + data flows
│   ├── SMART_CONTRACT.md          # Full Solidity spec (911 lines)
│   ├── ECONOMICS.md               # Scoring formula + revenue model
│   ├── SKILL_SPEC.md              # Skill specification
│   ├── SUBMISSIONS.md             # Pre-written Moltbook posts + templates
│   └── BUILD_PLAN.md              # Original build plan (Day 1 items done)
├── CLAUDE.md                      # Project spec for AI assistants
├── README.md                      # Public-facing readme
├── STATUS.md                      # THIS FILE
├── hardhat.config.js              # Base Sepolia config
├── package.json                   # Dependencies
├── .env.example                   # Key template
└── .gitignore                     # Hardhat project ignores
```

---

## Contract Summary

| Feature | Status | Functions |
|---------|--------|-----------|
| Agent Registry | DONE | registerAgent, getAgent, isRegistered, getAgentCount |
| Reputation | DONE | setScore, batchSetScores, getScore, getTopAgents |
| Ad Marketplace | DONE | listAdSlot, buyAdSlot, cancelAdSlot, claimRevenue, getAdSlot, getActiveSlots, getBalance |
| Admin | DONE | setOracle, pause, unpause |

**Revenue model:** 100% to seller, no platform fee
**Security:** CEI pattern, ReentrancyGuard, SafeERC20, Pausable, input validation
**Network:** Base Sepolia (Chain ID 84532)
**USDC:** 0x036CbD53842c5426634e7929541eC2318f3dCF7e (6 decimals)

---

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Protocol fee | None (100% to seller) | Simpler, encourages adoption, can add later |
| Oracle | Deployer wallet | Single key for hackathon, real oracle is out of scope |
| Frontend | None | Smart contract track, not needed for submission |
| Upgradability | None | Not needed for hackathon, reduces complexity |
| Score computation | Off-chain | Keep contract simple, oracle pushes results |
| Git history | Fresh init | Repo was forked from Snakey, re-initialized clean |

---

## Risk Register

| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Contract bugs | High | 71 tests passing, security audit clean | Mitigated |
| Deploy failure | Medium | Script handles errors, can retry | Ready |
| Basescan verify fails | Low | Not required for submission | Acceptable |
| EAS SDK issues | Low | Attestations are bonus, not required | Acceptable |
| RPC rate limits | Low | Delays built into EAS script | Mitigated |
| Insufficient testnet ETH | Medium | Get from Alchemy faucet before deploy | Action needed |
| Insufficient testnet USDC | Medium | Get from Circle faucet before demo | Action needed |
| Time pressure | Medium | All code done, just deploy + submit left | Mitigated |

---

## Minimum Viable Submission (if everything goes wrong)

1. Deploy contract (1 command)
2. Register 1 agent (1 tx)
3. Post Basescan link on Moltbook
4. Vote on 5 projects

**That's it. Everything else is bonus.**
