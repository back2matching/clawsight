# SNAKEY DESIGN SYSTEM v4.0

## Obsidian Luxe — Premium Digital Interface

> **Design Philosophy**: High-end digital surfaces with subtle depth. Monochrome sophistication with precision accents. Forms cut into the screen rather than sitting on top. The interface feels machined, not painted.

**Key Principles:**
- **Embossed Depth** — Surfaces feel inset into the screen through subtle inner shadows
- **Negative Space** — Shapes defined by what's removed, not added
- **Chamfered Edges** — Precision cuts instead of rounded corners
- **Monochrome Foundation** — Near-black palette with strategic accent moments
- **Readable Refinement** — Clean typography optimized for long sessions

---

## DESIGN DNA

### Visual Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  AESTHETIC AXIS                                                  │
│  ◄─────────────────────────●────────────────────►               │
│  BRUTALIST MINIMAL          LUXURY DIGITAL          NEON MAXIMAL │
│                                                                  │
│  We sit here: Premium surfaces with machined precision           │
└─────────────────────────────────────────────────────────────────┘
```

### Core Tenets

| Principle | Description |
|-----------|-------------|
| **RESTRAINT** | Every element earns its place. Visual silence is a feature. |
| **DEPTH** | Surfaces feel carved into the screen through inset shadows and subtle bevels. |
| **PRECISION** | Chamfered corners, exact alignments, mathematical spacing. |
| **HIERARCHY** | Data reads in clear priority. Eyes flow naturally. |
| **PREMIUM** | High-end feel through subtlety, not complexity. Less, but better. |

### Inspiration References

- Luxury car dashboard interfaces (Porsche, Bentley digital clusters)
- High-end audio equipment (Bang & Olufsen, Teenage Engineering)
- Premium watch faces (TAG Heuer Connected, Apple Watch Hermès)
- Trading terminal aesthetics (Bloomberg Terminal, refined)
- Gaming peripheral software (Logitech G Hub dark mode)

---

## 6-ZONE ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ZONE 1: HEADER BAR                                                           │
│ ╭──────────────┬──────────────────────────────┬────────────────────────────╮ │
│ │ Logo + LIVE  │ Round • Active • Players     │ Connection Status          │ │
│ ╰──────────────┴──────────────────────────────┴────────────────────────────╯ │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ZONE 2                         ZONE 3                                       │
│  ╭────────────────────────╮     ╭────────────────────────────────────────╮  │
│  │                        │     │ ZONE 3A: LIVE FEED                     │  │
│  │    GAME BOARD          │     │ ┌─────────────────────────────────────┐│  │
│  │    (1:1 aspect)        │     │ │ [Events] [Leaderboard]              ││  │
│  │                        │     │ └─────────────────────────────────────┘│  │
│  │    25x25 Grid          │     ├────────────────────────────────────────┤  │
│  │                        │     │ ZONE 3B: INFORMATION                   │  │
│  │                        │     │ ┌─────────────────────────────────────┐│  │
│  ╰────────────────────────╯     │ │ [How to Play] [Games] [Rankings]    ││  │
│                                 │ └─────────────────────────────────────┘│  │
│                                 ╰────────────────────────────────────────╯  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ZONE 4                                    ZONE 5                            │
│  ╭──────────────────────────────╮          ╭──────────────────────────────╮ │
│  │ ACTIVE PLAYERS   5/8 active  │          │ NEXT GAME             0 / 25 │ │
│  ╰──────────────────────────────╯          ╰──────────────────────────────╯ │
├──────────────────────────────────────────────────────────────────────────────┤
│ ZONE JACKPOT: Pool + MINI/MEGA/ULTRA tiers + Fee split                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ ZONE 6: FLOATING (toasts, modals, game over)                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## COLOR SYSTEM

### Primary Palette — "Obsidian"

The foundation is near-black with carefully calibrated gray steps. No pure black, no pure white — everything has subtle warmth.

| Token | Hex | Usage |
|-------|-----|-------|
| `--obsidian-950` | `#050506` | True base, deepest background |
| `--obsidian-900` | `#0a0a0c` | Primary background |
| `--obsidian-850` | `#0f0f12` | Elevated background |
| `--obsidian-800` | `#141418` | Card backgrounds |
| `--obsidian-750` | `#1a1a1f` | Inset surfaces |
| `--obsidian-700` | `#222228` | Subtle borders |
| `--obsidian-600` | `#2a2a32` | Dividers, separators |
| `--obsidian-500` | `#404048` | Muted UI elements |
| `--obsidian-400` | `#5a5a65` | Disabled text, icons |
| `--obsidian-300` | `#808090` | Secondary text |
| `--obsidian-200` | `#a0a0b0` | Body text |
| `--obsidian-100` | `#c8c8d4` | Primary text |
| `--obsidian-50` | `#e8e8f0` | Emphasis text, headers |

### Accent Palette — "Signal"

Accents are used sparingly. When they appear, they matter.

| Token | Hex | Usage |
|-------|-----|-------|
| `--signal-gold` | `#b09040` | Primary accent, jackpot, success |
| `--signal-gold-dim` | `#7a6430` | Muted gold, inactive states |
| `--signal-gold-bright` | `#d4aa50` | Hover, emphasis |
| `--signal-red` | `#a04040` | Critical, errors, live indicators |
| `--signal-red-dim` | `#702828` | Muted critical |
| `--signal-green` | `#40a060` | Success, positive changes |
| `--signal-green-dim` | `#286040` | Muted success |
| `--signal-blue` | `#4080b0` | Info, links, secondary accent |

### Tier Colors (Jackpot)

| Tier | Primary | Glow |
|------|---------|------|
| MINI | `#b09040` | `rgba(176, 144, 64, 0.15)` |
| MEGA | `#b06030` | `rgba(176, 96, 48, 0.15)` |
| ULTRA | `#8040b0` | `rgba(128, 64, 176, 0.15)` |

### Semantic Mapping

```css
:root {
  /* Backgrounds */
  --bg-base: var(--obsidian-950);
  --bg-surface: var(--obsidian-900);
  --bg-elevated: var(--obsidian-850);
  --bg-card: var(--obsidian-800);
  --bg-inset: var(--obsidian-750);

  /* Text */
  --text-primary: var(--obsidian-100);
  --text-secondary: var(--obsidian-300);
  --text-tertiary: var(--obsidian-400);
  --text-muted: var(--obsidian-500);
  --text-accent: var(--signal-gold);

  /* Borders */
  --border-subtle: var(--obsidian-700);
  --border-default: var(--obsidian-600);
  --border-strong: var(--obsidian-500);
  --border-accent: var(--signal-gold-dim);

  /* Interactive */
  --interactive-default: var(--signal-gold-dim);
  --interactive-hover: var(--signal-gold);
  --interactive-active: var(--signal-gold-bright);
}
```

---

## TYPOGRAPHY

### Font Stack

```css
/* Primary — Monospace for data-dense interfaces */
--font-mono: 'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', monospace;

/* Secondary — Clean sans for UI chrome */
--font-sans: 'Inter', 'SF Pro Display', -apple-system, sans-serif;

/* Display — For dramatic headlines */
--font-display: 'Inter', 'SF Pro Display', sans-serif;
```

> **Note**: IBM Plex Mono offers a premium, readable feel while remaining technical. Avoid decorative fonts — let the interface architecture carry the design.

### Type Scale

Optimized for readability with generous line heights.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-2xs` | 10px | 1.5 | 500 | Micro labels, badges |
| `--text-xs` | 11px | 1.5 | 400 | Captions, metadata |
| `--text-sm` | 12px | 1.6 | 400 | Secondary text, timestamps |
| `--text-base` | 14px | 1.6 | 400 | Body text, primary UI |
| `--text-md` | 15px | 1.5 | 500 | Emphasized body |
| `--text-lg` | 17px | 1.4 | 500 | Section headers |
| `--text-xl` | 20px | 1.3 | 600 | Panel titles |
| `--text-2xl` | 26px | 1.2 | 600 | Page headers |
| `--text-3xl` | 34px | 1.1 | 700 | Hero numbers |
| `--text-4xl` | 44px | 1.0 | 700 | Dramatic displays |

### Typography Utilities

```css
/* Tabular figures for data alignment */
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

/* Value display */
.value {
  font-family: var(--font-mono);
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  color: var(--text-primary);
}

/* Accent value */
.value-accent {
  color: var(--signal-gold);
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

### Embossed/Debossed System

Instead of box-shadows that lift elements up, we use **inset shadows** that carve elements into the surface.

```css
/* Inset surface — feels carved into background */
.surface-inset {
  background: var(--bg-inset);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(0, 0, 0, 0.2);
}

/* Subtle raised — barely lifted, premium feel */
.surface-raised {
  background: var(--bg-card);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

/* Card surface — standard panels */
.surface-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

/* Elevated surface — modals, dropdowns */
.surface-elevated {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
```

### Border System

Borders define edges through subtle contrast, not bold lines.

```css
/* Hairline border — barely visible separation */
.border-hairline {
  border: 1px solid rgba(255, 255, 255, 0.03);
}

/* Subtle border — standard definition */
.border-subtle {
  border: 1px solid var(--border-subtle);
}

/* Accent border — draws attention */
.border-accent {
  border: 1px solid var(--border-accent);
}

/* Inset border — appears carved in */
.border-inset {
  box-shadow: inset 0 0 0 1px var(--border-subtle);
}
```

### Corner Treatments

Chamfered corners create a machined, precision feel.

```css
/* Chamfer using clip-path */
--chamfer-sm: 4px;
--chamfer-md: 6px;
--chamfer-lg: 10px;

.chamfer-sm {
  clip-path: polygon(
    var(--chamfer-sm) 0,
    calc(100% - var(--chamfer-sm)) 0,
    100% var(--chamfer-sm),
    100% calc(100% - var(--chamfer-sm)),
    calc(100% - var(--chamfer-sm)) 100%,
    var(--chamfer-sm) 100%,
    0 calc(100% - var(--chamfer-sm)),
    0 var(--chamfer-sm)
  );
}

/* Standard radius for softer elements */
--radius-sm: 3px;
--radius-md: 4px;
--radius-lg: 6px;
--radius-full: 9999px;
```

---

## COMPONENT ANATOMY

### Card System

Cards use layered depth with inset effects.

```css
.card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

/* Card with chamfered appearance using pseudo-elements */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.02) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.card-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.15);
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
  background: rgba(0, 0, 0, 0.1);
}
```

### Data Block System

For displaying key values with labels.

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
  color: var(--signal-gold);
}

.data-block-sub {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
```

### Divider System

Dividers are subtle separations, not bold lines.

```css
/* Horizontal divider */
.divider {
  height: 1px;
  background: var(--border-subtle);
}

/* Divider with fade effect */
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

/* Vertical divider */
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

/* Dot divider */
.divider-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.divider-dots::before,
.divider-dots::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}

.divider-dot {
  width: 3px;
  height: 3px;
  background: var(--obsidian-500);
  border-radius: 50%;
}
```

### Button System

Buttons feel inset when pressed, raised when idle.

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

/* Primary button */
.btn-primary {
  background: var(--signal-gold-dim);
  color: var(--obsidian-950);
  border: 1px solid var(--signal-gold);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-primary:hover {
  background: var(--signal-gold);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-primary:active {
  background: var(--signal-gold-dim);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(1px);
}

/* Secondary button */
.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.btn-secondary:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
  background: rgba(255, 255, 255, 0.02);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--text-tertiary);
  border: none;
}

.btn-ghost:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.03);
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
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 150ms ease;
}

.input:hover {
  border-color: var(--border-default);
}

.input:focus {
  outline: none;
  border-color: var(--signal-gold-dim);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.2),
    0 0 0 1px var(--signal-gold-dim);
}

.input::placeholder {
  color: var(--text-muted);
}
```

### Badge System

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px 8px;
  font-size: var(--text-2xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--radius-sm);
}

.badge-default {
  background: var(--bg-inset);
  color: var(--text-tertiary);
  border: 1px solid var(--border-subtle);
}

.badge-gold {
  background: rgba(176, 144, 64, 0.12);
  color: var(--signal-gold);
  border: 1px solid rgba(176, 144, 64, 0.25);
}

.badge-red {
  background: rgba(160, 64, 64, 0.12);
  color: var(--signal-red);
  border: 1px solid rgba(160, 64, 64, 0.25);
}

.badge-green {
  background: rgba(64, 160, 96, 0.12);
  color: var(--signal-green);
  border: 1px solid rgba(64, 160, 96, 0.25);
}

/* Tier badges */
.badge-mini {
  background: rgba(176, 144, 64, 0.1);
  color: #b09040;
  border: 1px solid rgba(176, 144, 64, 0.2);
}

.badge-mega {
  background: rgba(176, 96, 48, 0.1);
  color: #b06030;
  border: 1px solid rgba(176, 96, 48, 0.2);
}

.badge-ultra {
  background: rgba(128, 64, 176, 0.1);
  color: #8040b0;
  border: 1px solid rgba(128, 64, 176, 0.2);
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
  transition: all 150ms ease;
}

.tab:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.02);
}

.tab.active {
  color: var(--text-primary);
  background: var(--bg-card);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}
```

---

## ANIMATION & MOTION SYSTEM

### Design Philosophy

Motion in Obsidian Luxe is **deliberate and unhurried**. Transitions should feel like precision machinery — smooth, weighted, and intentional. Nothing snaps; everything glides.

| Principle | Description |
|-----------|-------------|
| **WEIGHTED** | Elements have mass. They accelerate gently and decelerate slowly. |
| **STAGGERED** | Lists cascade in sequence, not all at once. Cards dealt, not dumped. |
| **PURPOSEFUL** | Motion communicates state change. If nothing changed, nothing moves. |
| **RESTRAINED** | Subtle over dramatic. 3px slide > 20px bounce. |

### Easing Curves

```css
/* Primary curve — slow deceleration, premium feel */
--ease-luxe: cubic-bezier(0.22, 1, 0.36, 1);

/* Standard curves */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

> **Note**: `--ease-luxe` is the new default for panel transitions. It has a longer deceleration tail than `--ease-out`, creating a more deliberate, high-end feel.

### Timing & Easing

```css
/* Easing functions */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Durations */
--duration-instant: 50ms;
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Keyframe Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up and fade */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Subtle pulse for status indicators */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Cursor blink */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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
```

### Animation Classes

```css
.animate-fadeIn { animation: fadeIn var(--duration-normal) var(--ease-out); }
.animate-slideUp { animation: slideUp var(--duration-slow) var(--ease-out); }
.animate-scaleIn { animation: scaleIn var(--duration-normal) var(--ease-spring); }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-spin { animation: spin 1s linear infinite; }

/* Stagger delays */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }
```

### Micro-interactions

```css
/* Hover lift — subtle raise on hover */
.hover-lift {
  transition: transform var(--duration-fast) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-1px);
}

/* Press effect — inset on click */
.press-effect:active {
  transform: translateY(1px);
  transition-duration: var(--duration-instant);
}

/* Glow on hover — subtle accent reveal */
.hover-glow {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}
.hover-glow:hover {
  box-shadow: 0 0 0 1px var(--signal-gold-dim);
}
```

### Luxe Motion Patterns (v4.2)

These patterns create the premium, weighted motion feel across the interface.

```css
/* Tab content cross-fade — smooth swap between tab panes */
@keyframes tabReveal {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.tab-content-enter {
  animation: tabReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Row cascade — staggered entrance for list items */
@keyframes rowCascade {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.row-cascade {
  animation: rowCascade 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
/* nth-child delays: 0.03s increments up to 12 items */

/* Panel materialize — surfaces resolve on page load */
@keyframes materialize {
  from { opacity: 0; transform: scale(0.985); }
  to { opacity: 1; transform: scale(1); }
}
.panel {
  animation: materialize 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
/* Stagger panels with animation-delay: 0.08s, 0.15s, 0.22s, 0.28s, 0.35s */

/* Hover slide — interactive rows shift right on hover */
.hover-slide {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.hover-slide:hover {
  transform: translateX(3px);
}

/* Sliding inline filters — emerge from behind header badge */
.info-filters-slide .info-filter {
  transform: translateX(-20px);
  opacity: 0;
  transition: transform 0.5s ease-in-out, opacity 0.4s ease;
}
.info-filters-slide.visible .info-filter:nth-child(1) {
  transform: translateX(0); opacity: 1;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.6s ease 0.05s;
  transition-delay: 0.1s;
}
.info-filters-slide.visible .info-filter:nth-child(2) {
  transform: translateX(0); opacity: 1;
  transition-delay: 0.22s;
}
```

### Tab Transitions

Tabs use a slower 0.3–0.35s transition for the active state background fill, creating a deliberate "settling" feel rather than an instant snap.

```css
.tab {
  transition: color 0.3s ease,
              background 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.35s ease;
}
```

---

## DATA VISUALIZATION

### Game Board Grid

```css
.game-grid {
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  gap: 1px;
  background: var(--obsidian-700);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  aspect-ratio: 1;
}

.grid-cell {
  aspect-ratio: 1;
  background: var(--bg-surface);
  transition: background var(--duration-fast) var(--ease-out);
}

.grid-cell.active {
  box-shadow: inset 0 0 0 1px currentColor;
}

/* Snake segment opacity gradient */
.segment-head { opacity: 1; }
.segment-1 { opacity: 0.85; }
.segment-2 { opacity: 0.7; }
.segment-3 { opacity: 0.55; }
.segment-tail { opacity: 0.4; }
```

### Player Colors (25 Distinct)

Desaturated for premium feel, but still distinguishable.

```css
--player-1: #c05050;   /* Red */
--player-2: #c07040;   /* Orange */
--player-3: #b09040;   /* Gold */
--player-4: #a0a040;   /* Yellow */
--player-5: #60a040;   /* Lime */
--player-6: #40a060;   /* Green */
--player-7: #40a090;   /* Emerald */
--player-8: #40a0a0;   /* Teal */
--player-9: #4090a0;   /* Cyan */
--player-10: #4080a0;  /* Sky */
--player-11: #4060a0;  /* Blue */
--player-12: #5050a0;  /* Indigo */
--player-13: #7050a0;  /* Violet */
--player-14: #8050a0;  /* Purple */
--player-15: #a050a0;  /* Fuchsia */
--player-16: #a05080;  /* Pink */
--player-17: #a05060;  /* Rose */
--player-18: #707070;  /* Stone */
--player-19: #b0a050;  /* Bright Gold */
--player-20: #c08050;  /* Light Orange */
--player-21: #60b060;  /* Light Green */
--player-22: #50a0a0;  /* Light Teal */
--player-23: #5090c0;  /* Light Blue */
--player-24: #9060c0;  /* Light Purple */
--player-25: #c06090;  /* Light Pink */
```

### Progress Indicators

```css
/* Linear progress */
.progress-bar {
  height: 3px;
  background: var(--bg-inset);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--signal-gold-dim);
  transition: width var(--duration-slow) var(--ease-out);
}

.progress-fill.active {
  background: var(--signal-gold);
}
```

---

## PATTERN LIBRARY

### Structured Panel Layout

```css
/* Split panel with divider */
.panel-split {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
}

.panel-split-left,
.panel-split-right {
  padding: var(--space-5);
}

.panel-split-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) 0;
  gap: var(--space-3);
}

.panel-split-divider-line {
  width: 1px;
  flex: 1;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border-subtle) 20%,
    var(--border-subtle) 80%,
    transparent 100%
  );
}

.panel-split-divider-dot {
  width: 4px;
  height: 4px;
  background: var(--obsidian-500);
  border-radius: 50%;
}
```

### Tier Row Layout

```css
.tier-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border-subtle);
  transition: all 150ms ease;
}

.tier-row:hover {
  background: rgba(255, 255, 255, 0.02);
  border-color: var(--border-default);
}

.tier-row-indicator {
  width: 3px;
  height: 24px;
  border-radius: var(--radius-sm);
}

.tier-row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tier-row-name {
  font-size: var(--text-sm);
  font-weight: 600;
}

.tier-row-meta {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.tier-row-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
```

### Noise Texture Overlay

```css
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.015;
  pointer-events: none;
}
```

### Vignette Effect

```css
.vignette::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
}
```

---

## ACCESSIBILITY

### Color Contrast

All text meets WCAG 2.1 AA standards:
- **Normal text**: 4.5:1 minimum
- **Large text** (18px+): 3:1 minimum
- **UI components**: 3:1 minimum

### Focus Management

```css
:focus-visible {
  outline: 2px solid var(--signal-gold);
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
  /* Obsidian palette */
  --obsidian-950: #050506;
  --obsidian-900: #0a0a0c;
  --obsidian-850: #0f0f12;
  --obsidian-800: #141418;
  --obsidian-750: #1a1a1f;
  --obsidian-700: #222228;
  --obsidian-600: #2a2a32;
  --obsidian-500: #404048;
  --obsidian-400: #5a5a65;
  --obsidian-300: #808090;
  --obsidian-200: #a0a0b0;
  --obsidian-100: #c8c8d4;
  --obsidian-50: #e8e8f0;

  /* Signal accents */
  --signal-gold: #b09040;
  --signal-gold-dim: #7a6430;
  --signal-gold-bright: #d4aa50;
  --signal-red: #a04040;
  --signal-red-dim: #702828;
  --signal-green: #40a060;
  --signal-green-dim: #286040;
  --signal-blue: #4080b0;

  /* Semantic */
  --bg-base: var(--obsidian-950);
  --bg-surface: var(--obsidian-900);
  --bg-elevated: var(--obsidian-850);
  --bg-card: var(--obsidian-800);
  --bg-inset: var(--obsidian-750);

  --text-primary: var(--obsidian-100);
  --text-secondary: var(--obsidian-300);
  --text-tertiary: var(--obsidian-400);
  --text-muted: var(--obsidian-500);
  --text-accent: var(--signal-gold);

  --border-subtle: var(--obsidian-700);
  --border-default: var(--obsidian-600);
  --border-strong: var(--obsidian-500);
  --border-accent: var(--signal-gold-dim);

  /* Typography */
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Timing */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Radius */
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;
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
        obsidian: {
          950: '#050506',
          900: '#0a0a0c',
          850: '#0f0f12',
          800: '#141418',
          750: '#1a1a1f',
          700: '#222228',
          600: '#2a2a32',
          500: '#404048',
          400: '#5a5a65',
          300: '#808090',
          200: '#a0a0b0',
          100: '#c8c8d4',
          50: '#e8e8f0',
        },
        signal: {
          gold: '#b09040',
          'gold-dim': '#7a6430',
          'gold-bright': '#d4aa50',
          red: '#a04040',
          'red-dim': '#702828',
          green: '#40a060',
          'green-dim': '#286040',
          blue: '#4080b0',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'inset-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
        'inset-md': 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
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
| Base background | `--obsidian-950` | ⬛ Near black |
| Surface | `--obsidian-900` | ⬛ Dark |
| Card background | `--obsidian-800` | ⬛ Elevated |
| Inset surface | `--obsidian-750` | ⬛ Recessed |
| Border subtle | `--obsidian-700` | Gray line |
| Primary text | `--obsidian-100` | ⬜ Light gray |
| Secondary text | `--obsidian-300` | ⬜ Medium gray |
| Accent | `--signal-gold` | 🟡 Muted gold |
| Critical | `--signal-red` | 🔴 Muted red |

### Component Quick Reference

| Component | Primary Class | Key Feature |
|-----------|--------------|-------------|
| Card | `.surface-card` | Inset top highlight |
| Button | `.btn-primary` | Press effect |
| Input | `.input` | Inset shadow |
| Badge | `.badge-gold` | Subtle glow border |
| Tab | `.tab.active` | Raised surface |
| Divider | `.divider-fade` | Gradient edges |

---

## PANEL HEADER SYSTEM

Panel headers use a subtle bar style with titles on the left and optional right-side elements.

```css
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border-bottom: 1px solid var(--border-subtle);
  min-height: 24px;
  background: var(--obsidian-850);
}

.panel-title {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--obsidian-400);
  padding: 6px 10px;
  line-height: 1;
}

.panel-count {
  font-size: 9px;
  font-family: var(--font-mono);
  color: var(--obsidian-500);
  padding: 6px 10px;
  line-height: 1;
}
```

---

## JACKPOT PANEL SYSTEM

The jackpot panel uses a 3-column grid layout with embossed corner badges.

### Structure

```
┌────────────────┬───────────────────────────────┬──────────────────┐
│ [GAMES]        │  Round $30 · 1st $9 · 2nd $6  │       [JACKPOTS] │
│     50         │          3rd $4.50            │          0       │
├────────────────┼───────────────────────────────┼──────────────────┤
│ [TICKETS]      │        ┌─────────────┐        │ MINI · 10%       │
│     1          │        │ JACKPOT POOL│        │     $0.59        │
├────────────────┤        └─────────────┘        ├──────────────────┤
│ [PLAYERS]      │          $5.90                │ MEGA · 1%        │
│     1          │                               │     $1.95        │
├────────────────┤    ┌────────────────────┐     ├──────────────────┤
│ [ENTRY]        │    │ NO JACKPOTS HIT YET│     │ ULTRA · 0.1%     │
│   $3.00        │    └────────────────────┘     │     $5.31        │
└────────────────┴───────────────────────────────┴──────────────────┘
```

### Tier Badges

Tier labels use consistent neutral styling with readable percentages:

```css
/* Tier percentage - large readable text */
.tier-pct {
  color: var(--obsidian-50);
  font-weight: 700;
  font-size: 12px;
}
```

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 4.2.0 | 2026-02 | Luxe Motion System — panel materialize, row cascade, tab cross-fade, sliding filters, hover-slide |
| 4.1.0 | 2026-02 | Simplified panel headers, readable tier percentages |
| 4.0.0 | 2026-02 | Obsidian Luxe redesign — premium digital interface |
| 3.0.0 | 2026-01 | Crimson Terminal theme |
| 2.0.0 | 2025 | Original design |

---

**End of Design System**

*"The interface should feel machined, not painted. Every element earns its place."*
