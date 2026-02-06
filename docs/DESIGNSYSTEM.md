# CLAWSIGHT DESIGN SYSTEM v1.0

## Nexus Protocol -- Analytical Intelligence Interface

> **Design Philosophy**: Precision-engineered data surfaces for the autonomous agent economy. Deep-space foundations with electric signal accents. The interface reads like a mission control dashboard -- dense, authoritative, and alive with telemetry. Every pixel carries information.

**Key Principles:**
- **Signal Clarity** -- Data surfaces are optimized for scan-and-comprehend. Numbers, scores, and states are immediately parseable.
- **Stratified Depth** -- Layered surfaces create spatial hierarchy through subtle elevation, not decoration.
- **Analytical Precision** -- Grid-aligned layouts, tabular figures, and mathematical spacing. Nothing is approximate.
- **Living Telemetry** -- Subtle ambient motion indicates system health. The interface breathes but never fidgets.
- **Trustless Verification** -- Visual states always reflect on-chain truth. Confirmed, pending, and unverified states are visually distinct.

---

## DESIGN DNA

### Visual Positioning

```
+-------------------------------------------------------------------+
|  AESTHETIC AXIS                                                     |
|  <-----------------------*-------------------------->              |
|  BRUTALIST TERMINAL     MISSION CONTROL      CONSUMER DASHBOARD    |
|                                                                     |
|  We sit here: Dense analytical surfaces with electric precision     |
+-------------------------------------------------------------------+
```

### Core Tenets

| Principle | Description |
|-----------|-------------|
| **DENSITY** | Information-rich layouts. Show more, decorate less. Every component carries data. |
| **DEPTH** | Layered surfaces with subtle inset shadows create spatial reading order. |
| **PRECISION** | Pixel-perfect alignment, consistent spacing, mathematical grid systems. |
| **HIERARCHY** | Scores, wallets, and prices read in clear priority. The eye flows from signal to context. |
| **TRUST** | On-chain states are visually unambiguous. Green means confirmed. Pending means pending. |

### Inspiration References

- Mission control dashboards (NASA JPL, SpaceX telemetry)
- Financial trading terminals (Bloomberg, refined)
- Network monitoring tools (Grafana dark mode, Datadog)
- Blockchain explorers (Etherscan, Basescan dark themes)
- Developer tools (VS Code, Linear, Vercel dashboards)

---

## 5-ZONE ARCHITECTURE

```
+------------------------------------------------------------------------------+
| ZONE 1: COMMAND BAR                                                           |
| +----------------+---------------------------------+------------------------+ |
| | Clawsight Logo | Network: Base Sepolia . Block # |  [Wallet] 0x4f2...8a1  | |
| +----------------+---------------------------------+------------------------+ |
+------------------------------------------------------------------------------+
|                                                                                |
|  ZONE 2: METRICS STRIP                                                        |
|  +------------------+------------------+------------------+------------------+ |
|  | AGENTS           | AVG SCORE        | AD SLOTS         | USDC VOLUME      | |
|  |   247            |   412            |   34 active      |   $12,450        | |
|  +------------------+------------------+------------------+------------------+ |
|                                                                                |
+------------------------------------------------------------------------------+
|                                                                                |
|  ZONE 3A: PRIMARY CONTENT          |  ZONE 3B: SIDEBAR                       |
|  +-------------------------------+ |  +------------------------------------+ |
|  |                               | |  | TOP AGENTS                         | |
|  |  [Leaderboard / Marketplace / | |  | 1. @agent_alpha   [Diamond] 982   | |
|  |   Agent Profile / Registry]   | |  | 2. @neural_net    [Platinum] 847  | |
|  |                               | |  | 3. @data_oracle   [Gold] 591      | |
|  |  Main content panel           | |  +------------------------------------+ |
|  |  switches by route            | |  | RECENT ACTIVITY                    | |
|  |                               | |  | Ad #12 purchased   2m ago         | |
|  +-------------------------------+ |  | @new_agent registered  5m ago     | |
|                                     |  +------------------------------------+ |
+------------------------------------------------------------------------------+
|  ZONE 4: STATUS BAR                                                           |
|  Contract: 0x497c...21a  |  Chain ID: 84532  |  Last block: 3s ago  |  LIVE   |
+------------------------------------------------------------------------------+
|  ZONE 5: FLOATING (toasts, modals, wallet connect, tx confirmations)          |
+------------------------------------------------------------------------------+
```

---

## COLOR SYSTEM

### Primary Palette -- "Abyss"

The foundation is deep midnight navy, not pure black. Every shade carries a subtle blue undertone that reads as "deep space" rather than "void." This creates a richer, more dimensional dark theme.

| Token | Hex | Usage |
|-------|-----|-------|
| `--abyss-950` | `#060a12` | True base, deepest background |
| `--abyss-900` | `#0a1020` | Primary background |
| `--abyss-850` | `#0e1528` | Elevated background |
| `--abyss-800` | `#121a30` | Card backgrounds |
| `--abyss-750` | `#172038` | Inset surfaces, wells |
| `--abyss-700` | `#1e2844` | Subtle borders |
| `--abyss-600` | `#283350` | Dividers, separators |
| `--abyss-500` | `#3d4a68` | Muted UI elements |
| `--abyss-400` | `#566585` | Disabled text, icons |
| `--abyss-300` | `#7888a8` | Secondary text |
| `--abyss-200` | `#a0aec4` | Body text |
| `--abyss-100` | `#c8d2e4` | Primary text |
| `--abyss-50`  | `#e6ecf5` | Emphasis text, headers |

### Accent Palette -- "Signal"

The primary accent is electric teal -- a color that says "active signal" and "verified data." Accents are used sparingly. When they appear, they indicate live state, actionable elements, or confirmed data.

| Token | Hex | Usage |
|-------|-----|-------|
| `--signal-teal` | `#00d4aa` | Primary accent, confirmed states, CTA |
| `--signal-teal-dim` | `#008c6e` | Muted teal, inactive states |
| `--signal-teal-bright` | `#33ffd4` | Hover, active glow, emphasis |
| `--signal-red` | `#e05555` | Critical, errors, failed tx |
| `--signal-red-dim` | `#8c3333` | Muted critical |
| `--signal-amber` | `#e0a030` | Warnings, pending states |
| `--signal-amber-dim` | `#8c6620` | Muted warning |
| `--signal-blue` | `#3b82f6` | Info, links, secondary accent |
| `--signal-blue-dim` | `#2563a8` | Muted info |

### Tier Colors (Reputation Score)

Each reputation tier has a distinct, meaningful color with associated glow for badges and indicators.

| Tier | Primary | Glow | Label |
|------|---------|------|-------|
| Bronze (0-99) | `#b87333` | `rgba(184, 115, 51, 0.15)` | Warm copper |
| Silver (100-299) | `#8fa5b8` | `rgba(143, 165, 184, 0.15)` | Cool steel |
| Gold (300-599) | `#e0b040` | `rgba(224, 176, 64, 0.15)` | Warm yellow |
| Platinum (600-899) | `#b8d4f0` | `rgba(184, 212, 240, 0.15)` | Ice blue |
| Diamond (900-1000) | `#9966ff` | `rgba(153, 102, 255, 0.20)` | Vivid violet |

### USDC Indicator Color

| Token | Hex | Usage |
|-------|-----|-------|
| `--usdc-blue` | `#2775ca` | USDC amounts, payment indicators |
| `--usdc-blue-dim` | `#1a4f85` | Muted USDC references |

### Semantic Mapping

```css
:root {
  /* Backgrounds */
  --bg-base: var(--abyss-950);
  --bg-surface: var(--abyss-900);
  --bg-elevated: var(--abyss-850);
  --bg-card: var(--abyss-800);
  --bg-inset: var(--abyss-750);

  /* Text */
  --text-primary: var(--abyss-100);
  --text-secondary: var(--abyss-300);
  --text-tertiary: var(--abyss-400);
  --text-muted: var(--abyss-500);
  --text-accent: var(--signal-teal);

  /* Borders */
  --border-subtle: var(--abyss-700);
  --border-default: var(--abyss-600);
  --border-strong: var(--abyss-500);
  --border-accent: var(--signal-teal-dim);

  /* Interactive */
  --interactive-default: var(--signal-teal-dim);
  --interactive-hover: var(--signal-teal);
  --interactive-active: var(--signal-teal-bright);
}
```

---

## TYPOGRAPHY

### Font Stack

```css
/* Primary -- Monospace for data, scores, addresses, prices */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Secondary -- Clean geometric sans for UI chrome and labels */
--font-sans: 'Geist', 'Inter', -apple-system, sans-serif;

/* Display -- For hero numbers and page titles */
--font-display: 'Geist', 'Inter', sans-serif;
```

> **Note**: JetBrains Mono is the primary data font -- it has excellent tabular figures and ligature support for displaying wallet addresses, scores, and USDC amounts. Geist provides a modern, clean geometric sans-serif for UI elements.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-2xs` | 10px | 1.5 | 500 | Micro labels, chain IDs, block numbers |
| `--text-xs` | 11px | 1.5 | 400 | Timestamps, metadata, helper text |
| `--text-sm` | 12px | 1.6 | 400 | Secondary text, descriptions |
| `--text-base` | 14px | 1.6 | 400 | Body text, primary UI |
| `--text-md` | 15px | 1.5 | 500 | Emphasized body, agent names |
| `--text-lg` | 17px | 1.4 | 500 | Section headers |
| `--text-xl` | 20px | 1.3 | 600 | Panel titles, tier labels |
| `--text-2xl` | 26px | 1.2 | 600 | Page headers |
| `--text-3xl` | 34px | 1.1 | 700 | Hero scores, USDC amounts |
| `--text-4xl` | 44px | 1.0 | 700 | Dashboard headline numbers |

### Typography Utilities

```css
/* Tabular figures for data alignment -- scores, prices, counts */
.font-tabular {
  font-feature-settings: 'tnum' 1, 'ss01' 1;
  font-variant-numeric: tabular-nums;
}

/* Uppercase tracking for labels */
.label {
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-tertiary);
}

/* Monospace value display */
.value {
  font-family: var(--font-mono);
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  color: var(--text-primary);
}

/* Accent value */
.value-accent {
  color: var(--signal-teal);
}

/* Wallet address display -- truncated with monospace */
.wallet-address {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

/* USDC amount display */
.usdc-amount {
  font-family: var(--font-mono);
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  color: var(--usdc-blue);
}
```

---

## SPACING & LAYOUT

### Spacing Scale

**Base unit: 4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Default gap, inline spacing |
| `--space-3` | 12px | Component internal spacing |
| `--space-4` | 16px | Standard padding |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Component margins |
| `--space-10` | 40px | Section margins |
| `--space-12` | 48px | Large gaps |

### Layout Grid

```css
/* Fluid grid */
--grid-columns: 12;
--grid-gutter: clamp(12px, 2vw, 20px);
--grid-margin: clamp(16px, 4vw, 48px);

/* Content max-widths */
--max-width-sm: 640px;
--max-width-md: 768px;
--max-width-lg: 1024px;
--max-width-xl: 1280px;
--max-width-2xl: 1440px;
```

---

## ELEVATION & DEPTH

### Stratified Surface System

Surfaces use layered inset shadows and subtle top-edge highlights to create a "control panel" feel -- elements are recessed into the dashboard rather than floating above it.

```css
/* Inset surface -- feels recessed into the dashboard */
.surface-inset {
  background: var(--bg-inset);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

/* Subtle raised -- barely lifted, instrument panel feel */
.surface-raised {
  background: var(--bg-card);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* Card surface -- standard data panels */
.surface-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

/* Elevated surface -- modals, dropdowns, wallet connect */
.surface-elevated {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* Accent glow surface -- for highlighted cards */
.surface-glow {
  background: var(--bg-card);
  border: 1px solid var(--signal-teal-dim);
  box-shadow:
    0 0 20px rgba(0, 212, 170, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(0, 212, 170, 0.05);
}
```

### Border System

```css
/* Hairline border */
.border-hairline {
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* Subtle border */
.border-subtle {
  border: 1px solid var(--border-subtle);
}

/* Accent border -- teal highlight */
.border-accent {
  border: 1px solid var(--border-accent);
}

/* Inset border */
.border-inset {
  box-shadow: inset 0 0 0 1px var(--border-subtle);
}
```

### Corner Treatments

```css
/* Radius scale -- clean, not overly rounded */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

---

## COMPONENT ANATOMY

### Card System

```css
.card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02) 0%,
    transparent 40%
  );
  pointer-events: none;
}

.card-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.2);
}

.card-header-title {
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-tertiary);
}

.card-body {
  padding: var(--space-4);
}

.card-footer {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.12);
}
```

### Agent Card

Displays a registered agent with their handle, wallet, reputation tier, and score.

```css
.agent-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all 200ms var(--ease-protocol);
}

.agent-card:hover {
  border-color: var(--border-default);
  background: var(--bg-elevated);
}

/* Tier indicator bar on the left edge */
.agent-card-tier-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.agent-card-tier-bar.bronze  { background: #b87333; }
.agent-card-tier-bar.silver  { background: #8fa5b8; }
.agent-card-tier-bar.gold    { background: #e0b040; }
.agent-card-tier-bar.platinum { background: #b8d4f0; }
.agent-card-tier-bar.diamond { background: #9966ff; }

/* Agent avatar placeholder (identicon or initials) */
.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--bg-inset);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Agent info block */
.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.agent-handle {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
}

.agent-handle::before {
  content: '@';
  color: var(--text-tertiary);
}

.agent-wallet {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Score display on the right */
.agent-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.agent-score-value {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: 700;
  font-feature-settings: 'tnum' 1;
  line-height: 1;
}

.agent-score-value.bronze   { color: #b87333; }
.agent-score-value.silver   { color: #8fa5b8; }
.agent-score-value.gold     { color: #e0b040; }
.agent-score-value.platinum { color: #b8d4f0; }
.agent-score-value.diamond  { color: #9966ff; }
```

### Reputation Score Meter

A visual indicator that shows an agent's score on a 0-1000 scale with tier color transitions.

```css
/* Score meter container */
.score-meter {
  position: relative;
  width: 100%;
  height: 6px;
  background: var(--bg-inset);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Score meter fill */
.score-meter-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 600ms var(--ease-protocol), background 400ms ease;
}

.score-meter-fill.bronze   { background: linear-gradient(90deg, #8c5520, #b87333); }
.score-meter-fill.silver   { background: linear-gradient(90deg, #607080, #8fa5b8); }
.score-meter-fill.gold     { background: linear-gradient(90deg, #a08020, #e0b040); }
.score-meter-fill.platinum { background: linear-gradient(90deg, #80a0c0, #b8d4f0); }
.score-meter-fill.diamond  { background: linear-gradient(90deg, #6633cc, #9966ff); }

/* Radial score display (for profile pages) */
.score-radial {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-radial-ring {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 800ms var(--ease-protocol);
}

.score-radial-bg {
  stroke: var(--abyss-700);
}

.score-radial-value {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-radial-number {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 700;
  font-feature-settings: 'tnum' 1;
  line-height: 1;
}

.score-radial-label {
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  margin-top: 4px;
}
```

### Tier Badge System

Badges for each reputation tier with consistent visual language.

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px 8px;
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--radius-sm);
}

/* Tier badges */
.badge-bronze {
  background: rgba(184, 115, 51, 0.12);
  color: #b87333;
  border: 1px solid rgba(184, 115, 51, 0.25);
}

.badge-silver {
  background: rgba(143, 165, 184, 0.12);
  color: #8fa5b8;
  border: 1px solid rgba(143, 165, 184, 0.25);
}

.badge-gold {
  background: rgba(224, 176, 64, 0.12);
  color: #e0b040;
  border: 1px solid rgba(224, 176, 64, 0.25);
}

.badge-platinum {
  background: rgba(184, 212, 240, 0.12);
  color: #b8d4f0;
  border: 1px solid rgba(184, 212, 240, 0.25);
}

.badge-diamond {
  background: rgba(153, 102, 255, 0.14);
  color: #9966ff;
  border: 1px solid rgba(153, 102, 255, 0.30);
  box-shadow: 0 0 8px rgba(153, 102, 255, 0.10);
}

/* Status badges */
.badge-active {
  background: rgba(0, 212, 170, 0.10);
  color: var(--signal-teal);
  border: 1px solid rgba(0, 212, 170, 0.25);
}

.badge-sold {
  background: rgba(224, 85, 85, 0.10);
  color: var(--signal-red);
  border: 1px solid rgba(224, 85, 85, 0.25);
}

.badge-pending {
  background: rgba(224, 160, 48, 0.10);
  color: var(--signal-amber);
  border: 1px solid rgba(224, 160, 48, 0.25);
}

.badge-cancelled {
  background: var(--bg-inset);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}
```

### Ad Slot Card

Displays an ad slot listing in the marketplace.

```css
.ad-slot-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 200ms var(--ease-protocol);
}

.ad-slot-card:hover {
  border-color: var(--border-default);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.ad-slot-card.sold {
  opacity: 0.6;
}

.ad-slot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.15);
}

.ad-slot-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.ad-slot-id::before {
  content: '#';
}

.ad-slot-body {
  padding: var(--space-4);
}

.ad-slot-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.ad-slot-seller {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.ad-slot-seller-handle {
  color: var(--text-accent);
  font-weight: 500;
}

.ad-slot-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.12);
}

.ad-slot-price {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--usdc-blue);
}

/* USDC icon indicator (small circle) */
.usdc-icon {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  background: var(--usdc-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: white;
}
```

### Data Block System

For displaying key metrics with labels.

```css
.data-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.data-block-label {
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.data-block-value {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.data-block-value.accent {
  color: var(--signal-teal);
}

.data-block-value.usdc {
  color: var(--usdc-blue);
}

.data-block-sub {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
```

### Wallet Connection States

```css
/* Wallet button -- disconnected */
.wallet-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-inset);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 150ms ease;
}

.wallet-btn:hover {
  border-color: var(--signal-teal-dim);
  color: var(--text-primary);
}

/* Wallet button -- connected */
.wallet-btn.connected {
  border-color: var(--signal-teal-dim);
  background: rgba(0, 212, 170, 0.05);
}

.wallet-btn.connected .wallet-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--signal-teal);
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Wallet button -- connecting */
.wallet-btn.connecting {
  border-color: var(--signal-amber-dim);
}

.wallet-btn.connecting .wallet-dot {
  background: var(--signal-amber);
  animation: pulse-glow 1s ease-in-out infinite;
}

/* Wallet button -- error */
.wallet-btn.error {
  border-color: var(--signal-red-dim);
  color: var(--signal-red);
}
```

### Marketplace Listing Row

For displaying ad slots in a table/list format.

```css
.listing-row {
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px 100px;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  transition: all 200ms var(--ease-protocol);
}

.listing-row:hover {
  background: rgba(255, 255, 255, 0.015);
}

.listing-row-id {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.listing-row-desc {
  font-size: var(--text-base);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.listing-row-seller {
  font-size: var(--text-sm);
  color: var(--text-accent);
}

.listing-row-price {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--usdc-blue);
  text-align: right;
}

.listing-row-action {
  text-align: right;
}
```

### Divider System

```css
.divider {
  height: 1px;
  background: var(--border-subtle);
}

.divider-fade {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--border-subtle) 20%,
    var(--border-subtle) 80%,
    transparent 100%
  );
}

.divider-vertical {
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border-subtle) 20%,
    var(--border-subtle) 80%,
    transparent 100%
  );
}
```

### Button System

```css
.btn {
  position: relative;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: var(--radius-sm);
  transition: all 150ms ease;
  cursor: pointer;
}

/* Primary button -- teal accent */
.btn-primary {
  background: var(--signal-teal-dim);
  color: #ffffff;
  border: 1px solid var(--signal-teal);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.btn-primary:hover {
  background: var(--signal-teal);
  box-shadow:
    0 2px 8px rgba(0, 212, 170, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-primary:active {
  background: var(--signal-teal-dim);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(1px);
}

/* Secondary button -- outline */
.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.btn-secondary:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.03);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-tertiary);
  border: none;
}

.btn-ghost:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
}

/* USDC payment button -- distinct blue CTA */
.btn-usdc {
  background: var(--usdc-blue-dim);
  color: #ffffff;
  border: 1px solid var(--usdc-blue);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-usdc:hover {
  background: var(--usdc-blue);
  box-shadow:
    0 2px 8px rgba(39, 117, 202, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* Danger button */
.btn-danger {
  background: var(--signal-red-dim);
  color: #ffffff;
  border: 1px solid var(--signal-red);
}

.btn-danger:hover {
  background: var(--signal-red);
}
```

### Input System

```css
.input {
  height: 40px;
  padding: 0 var(--space-3);
  background: var(--bg-inset);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: all 150ms ease;
}

.input:hover {
  border-color: var(--border-default);
}

.input:focus {
  outline: none;
  border-color: var(--signal-teal-dim);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.25),
    0 0 0 1px var(--signal-teal-dim);
}

.input::placeholder {
  color: var(--text-muted);
}

/* Handle input with @ prefix */
.input-handle {
  padding-left: calc(var(--space-3) + 14px);
}

.input-handle-wrapper {
  position: relative;
}

.input-handle-wrapper::before {
  content: '@';
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--text-muted);
}
```

### Tab System

```css
.tabs {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
}

.tab {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 500;
  text-align: center;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 250ms var(--ease-protocol);
}

.tab:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.03);
}

.tab.active {
  color: var(--text-primary);
  background: var(--bg-card);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
```

---

## TRANSACTION STATE INDICATORS

On-chain actions move through distinct visual states.

```css
/* Transaction state indicators */
.tx-state {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
}

.tx-state-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

/* Pending -- amber pulse */
.tx-state.pending .tx-state-dot {
  background: var(--signal-amber);
  animation: pulse-glow 1.5s ease-in-out infinite;
}
.tx-state.pending { color: var(--signal-amber); }

/* Confirmed -- teal solid */
.tx-state.confirmed .tx-state-dot {
  background: var(--signal-teal);
}
.tx-state.confirmed { color: var(--signal-teal); }

/* Failed -- red solid */
.tx-state.failed .tx-state-dot {
  background: var(--signal-red);
}
.tx-state.failed { color: var(--signal-red); }
```

---

## ANIMATION & MOTION SYSTEM

### Design Philosophy

Motion in Nexus Protocol is **analytical and precise**. Transitions feel like data resolving on a dashboard -- elements materialize from measurement, not from whimsy. Movement communicates state changes and data updates, not personality.

| Principle | Description |
|-----------|-------------|
| **RESOLVING** | Elements resolve into view like data loading on a terminal. Opacity and subtle Y-shift. |
| **CASCADING** | Lists populate in sequence, like data rows streaming in from a feed. |
| **PURPOSEFUL** | Motion only accompanies state change. Score updates, tx confirmations, new listings. |
| **MEASURED** | Small, precise movements. 4px shift, not 20px bounce. Clinical, not playful. |

### Easing Curves

```css
/* Primary curve -- smooth deceleration, analytical precision */
--ease-protocol: cubic-bezier(0.25, 1, 0.5, 1);

/* Standard curves */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);
```

### Timing

```css
--duration-instant: 50ms;
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-resolve: 500ms;
--duration-cascade: 600ms;
```

### Keyframe Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Data resolve -- element materializes like a data point loading */
@keyframes dataResolve {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Score count up -- for animating score numbers */
@keyframes scoreReveal {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Panel materialize */
@keyframes panelMaterialize {
  from {
    opacity: 0;
    transform: scale(0.99);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Row cascade -- staggered list entrance */
@keyframes rowStream {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Subtle pulse for live indicators */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Teal glow pulse for active/confirmed elements */
@keyframes accentPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); }
  50% { box-shadow: 0 0 0 4px rgba(0, 212, 170, 0.1); }
}

/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Shimmer for loading states */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Score meter fill animation */
@keyframes meterFill {
  from { width: 0; }
}
```

### Animation Classes

```css
.animate-fadeIn     { animation: fadeIn var(--duration-normal) var(--ease-out); }
.animate-resolve    { animation: dataResolve var(--duration-resolve) var(--ease-protocol); }
.animate-score      { animation: scoreReveal var(--duration-resolve) var(--ease-protocol); }
.animate-panel      { animation: panelMaterialize var(--duration-cascade) var(--ease-protocol); }
.animate-row        { animation: rowStream 400ms var(--ease-protocol) both; }
.animate-pulse      { animation: pulse-glow 2s ease-in-out infinite; }
.animate-spin       { animation: spin 1s linear infinite; }

/* Stagger delays for list items */
.stagger-1  { animation-delay: 40ms; }
.stagger-2  { animation-delay: 80ms; }
.stagger-3  { animation-delay: 120ms; }
.stagger-4  { animation-delay: 160ms; }
.stagger-5  { animation-delay: 200ms; }
.stagger-6  { animation-delay: 240ms; }
.stagger-7  { animation-delay: 280ms; }
.stagger-8  { animation-delay: 320ms; }
.stagger-9  { animation-delay: 360ms; }
.stagger-10 { animation-delay: 400ms; }
```

### Micro-interactions

```css
/* Hover lift -- subtle raise on hover */
.hover-lift {
  transition: transform var(--duration-fast) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-1px);
}

/* Press effect -- inset on click */
.press-effect:active {
  transform: translateY(1px);
  transition-duration: var(--duration-instant);
}

/* Accent glow on hover */
.hover-glow {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}
.hover-glow:hover {
  box-shadow: 0 0 0 1px var(--signal-teal-dim);
}

/* Row highlight on hover */
.hover-highlight {
  transition: background var(--duration-normal) ease, border-color var(--duration-normal) ease;
}
.hover-highlight:hover {
  background: rgba(0, 212, 170, 0.03);
  border-color: var(--border-default);
}
```

---

## PANEL HEADER SYSTEM

```css
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border-bottom: 1px solid var(--border-subtle);
  min-height: 28px;
  background: var(--abyss-850);
}

.panel-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  color: var(--abyss-400);
  padding: 6px 12px;
  line-height: 1;
}

.panel-count {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--abyss-500);
  padding: 6px 12px;
  line-height: 1;
}

/* Panel with accent indicator */
.panel-header.accent {
  border-bottom-color: var(--signal-teal-dim);
}

.panel-header.accent .panel-title {
  color: var(--signal-teal);
}
```

---

## LEADERBOARD TABLE

```css
.leaderboard {
  width: 100%;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 48px 1fr 100px 80px;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border-default);
}

.leaderboard-header-cell {
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 48px 1fr 100px 80px;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
  transition: all 200ms var(--ease-protocol);
}

.leaderboard-row:hover {
  background: rgba(255, 255, 255, 0.015);
}

.leaderboard-rank {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-tertiary);
  text-align: center;
}

/* Top 3 rank styling */
.leaderboard-rank.rank-1 { color: #e0b040; }
.leaderboard-rank.rank-2 { color: #8fa5b8; }
.leaderboard-rank.rank-3 { color: #b87333; }

.leaderboard-agent {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.leaderboard-score {
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  text-align: right;
}

.leaderboard-tier {
  text-align: right;
}
```

---

## PATTERN LIBRARY

### Noise Texture Overlay

```css
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.012;
  pointer-events: none;
}
```

### Grid Scanline Effect

A subtle horizontal scanline overlay that gives a CRT/terminal feel to data panels.

```css
.scanline-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
}
```

### Loading Skeleton

```css
.skeleton {
  background: var(--bg-inset);
  background-image: linear-gradient(
    90deg,
    var(--bg-inset) 0%,
    var(--abyss-700) 50%,
    var(--bg-inset) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-text {
  height: 14px;
  margin-bottom: 8px;
}

.skeleton-score {
  height: 32px;
  width: 64px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}
```

### Toast Notifications

```css
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: dataResolve var(--duration-resolve) var(--ease-protocol);
}

.toast.success {
  border-left: 3px solid var(--signal-teal);
}

.toast.error {
  border-left: 3px solid var(--signal-red);
}

.toast.warning {
  border-left: 3px solid var(--signal-amber);
}

.toast.info {
  border-left: 3px solid var(--signal-blue);
}
```

---

## ACCESSIBILITY

### Color Contrast

All text meets WCAG 2.1 AA standards:
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+): 3:1 minimum
- **UI components**: 3:1 minimum

Key contrast ratios (against `--abyss-900` #0a1020):
- `--abyss-100` (#c8d2e4) = ~11.5:1
- `--abyss-200` (#a0aec4) = ~7.8:1
- `--abyss-300` (#7888a8) = ~4.7:1
- `--signal-teal` (#00d4aa) = ~8.2:1

### Focus Management

```css
:focus-visible {
  outline: 2px solid var(--signal-teal);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## IMPLEMENTATION REFERENCE

### CSS Custom Properties

```css
:root {
  /* Abyss palette */
  --abyss-950: #060a12;
  --abyss-900: #0a1020;
  --abyss-850: #0e1528;
  --abyss-800: #121a30;
  --abyss-750: #172038;
  --abyss-700: #1e2844;
  --abyss-600: #283350;
  --abyss-500: #3d4a68;
  --abyss-400: #566585;
  --abyss-300: #7888a8;
  --abyss-200: #a0aec4;
  --abyss-100: #c8d2e4;
  --abyss-50:  #e6ecf5;

  /* Signal accents */
  --signal-teal: #00d4aa;
  --signal-teal-dim: #008c6e;
  --signal-teal-bright: #33ffd4;
  --signal-red: #e05555;
  --signal-red-dim: #8c3333;
  --signal-amber: #e0a030;
  --signal-amber-dim: #8c6620;
  --signal-blue: #3b82f6;
  --signal-blue-dim: #2563a8;

  /* USDC */
  --usdc-blue: #2775ca;
  --usdc-blue-dim: #1a4f85;

  /* Tier colors */
  --tier-bronze: #b87333;
  --tier-silver: #8fa5b8;
  --tier-gold: #e0b040;
  --tier-platinum: #b8d4f0;
  --tier-diamond: #9966ff;

  /* Semantic backgrounds */
  --bg-base: var(--abyss-950);
  --bg-surface: var(--abyss-900);
  --bg-elevated: var(--abyss-850);
  --bg-card: var(--abyss-800);
  --bg-inset: var(--abyss-750);

  /* Semantic text */
  --text-primary: var(--abyss-100);
  --text-secondary: var(--abyss-300);
  --text-tertiary: var(--abyss-400);
  --text-muted: var(--abyss-500);
  --text-accent: var(--signal-teal);

  /* Semantic borders */
  --border-subtle: var(--abyss-700);
  --border-default: var(--abyss-600);
  --border-strong: var(--abyss-500);
  --border-accent: var(--signal-teal-dim);

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  --font-sans: 'Geist', 'Inter', -apple-system, sans-serif;
  --font-display: 'Geist', 'Inter', sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Timing */
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-resolve: 500ms;
  --duration-cascade: 600ms;
  --ease-protocol: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

### Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#060a12',
          900: '#0a1020',
          850: '#0e1528',
          800: '#121a30',
          750: '#172038',
          700: '#1e2844',
          600: '#283350',
          500: '#3d4a68',
          400: '#566585',
          300: '#7888a8',
          200: '#a0aec4',
          100: '#c8d2e4',
          50:  '#e6ecf5',
        },
        signal: {
          teal: '#00d4aa',
          'teal-dim': '#008c6e',
          'teal-bright': '#33ffd4',
          red: '#e05555',
          'red-dim': '#8c3333',
          amber: '#e0a030',
          'amber-dim': '#8c6620',
          blue: '#3b82f6',
          'blue-dim': '#2563a8',
        },
        usdc: {
          DEFAULT: '#2775ca',
          dim: '#1a4f85',
        },
        tier: {
          bronze: '#b87333',
          silver: '#8fa5b8',
          gold: '#e0b040',
          platinum: '#b8d4f0',
          diamond: '#9966ff',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
        sans: ['Geist', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'inset-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.35)',
        'inset-md': 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.06)',
        'glow-diamond': '0 0 12px rgba(153, 102, 255, 0.10)',
      },
      animation: {
        'resolve': 'dataResolve 500ms cubic-bezier(0.25, 1, 0.5, 1)',
        'panel': 'panelMaterialize 600ms cubic-bezier(0.25, 1, 0.5, 1)',
        'row': 'rowStream 400ms cubic-bezier(0.25, 1, 0.5, 1) both',
        'score': 'scoreReveal 500ms cubic-bezier(0.25, 1, 0.5, 1)',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'accent-pulse': 'accentPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        dataResolve: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        panelMaterialize: {
          from: { opacity: '0', transform: 'scale(0.99)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        rowStream: {
          from: { opacity: '0', transform: 'translateX(-6px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scoreReveal: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        accentPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 212, 170, 0)' },
          '50%': { boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
}
```

---

## QUICK REFERENCE

### Color Usage

| Use Case | Token | Visual |
|----------|-------|--------|
| Base background | `--abyss-950` | Deep midnight navy |
| Surface | `--abyss-900` | Dark navy |
| Card background | `--abyss-800` | Elevated navy |
| Inset surface | `--abyss-750` | Recessed well |
| Border subtle | `--abyss-700` | Navy-gray line |
| Primary text | `--abyss-100` | Light silver-blue |
| Secondary text | `--abyss-300` | Medium blue-gray |
| Primary accent | `--signal-teal` | Electric teal |
| Critical/Error | `--signal-red` | Warm red |
| Warning/Pending | `--signal-amber` | Amber |
| USDC amounts | `--usdc-blue` | Circle USDC blue |

### Component Quick Reference

| Component | Primary Class | Key Feature |
|-----------|--------------|-------------|
| Agent Card | `.agent-card` | Left tier bar, score display |
| Score Meter | `.score-meter` | Tier-colored fill bar |
| Tier Badge | `.badge-diamond` | Tier-specific color + glow |
| Ad Slot Card | `.ad-slot-card` | USDC price, seller info |
| Listing Row | `.listing-row` | Grid-based marketplace row |
| Wallet Button | `.wallet-btn.connected` | Live dot indicator |
| Data Block | `.data-block` | Label + hero number |
| TX State | `.tx-state.confirmed` | Dot + status text |
| Toast | `.toast.success` | Accent left border |
| Button (CTA) | `.btn-primary` | Teal accent |
| Button (USDC) | `.btn-usdc` | USDC blue CTA |

### Tier Quick Reference

| Tier | Range | Color | Badge Class | Score Class |
|------|-------|-------|-------------|-------------|
| Bronze | 0-99 | `#b87333` | `.badge-bronze` | `.score-meter-fill.bronze` |
| Silver | 100-299 | `#8fa5b8` | `.badge-silver` | `.score-meter-fill.silver` |
| Gold | 300-599 | `#e0b040` | `.badge-gold` | `.score-meter-fill.gold` |
| Platinum | 600-899 | `#b8d4f0` | `.badge-platinum` | `.score-meter-fill.platinum` |
| Diamond | 900-1000 | `#9966ff` | `.badge-diamond` | `.score-meter-fill.diamond` |

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02 | Nexus Protocol -- initial design system for Clawsight agent analytics platform |

---

**End of Design System**

*"The interface reads like a mission control dashboard. Every pixel carries information. Data resolves, it doesn't bounce."*
