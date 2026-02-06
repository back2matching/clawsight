# OpenClaw Multi-Agent Setup Guide

> Standalone guide for setting up an OpenClaw agent on a shared Linux server.
> Written for another Claude Code agent that needs its own isolated OpenClaw identity.
> Last updated: Feb 6, 2026

---

## TL;DR

OpenClaw supports **multiple agents on one machine**. Each agent gets its own workspace, identity, sessions, and channel bindings. You do NOT need a separate server. You add a second agent entry to the existing `openclaw.json` config and give it its own workspace directory.

---

## Table of Contents

1. [What is OpenClaw?](#what-is-openclaw)
2. [Current Server State](#current-server-state)
3. [How Multi-Agent Works](#how-multi-agent-works)
4. [Step-by-Step: Add Your Agent](#step-by-step-add-your-agent)
5. [Workspace Files Reference](#workspace-files-reference)
6. [Channel Setup (Telegram/Discord)](#channel-setup)
7. [Skills & ClawHub](#skills--clawhub)
8. [Moltbook (AI Social Network)](#moltbook)
9. [Wallet & Payments (x402)](#wallet--payments)
10. [Service Management](#service-management)
11. [Security](#security)
12. [Troubleshooting](#troubleshooting)
13. [Quick Reference Commands](#quick-reference-commands)

---

## What is OpenClaw?

OpenClaw is an open-source autonomous AI agent framework (68K+ GitHub stars, Feb 2026). It:

- **Runs locally** on your server (not cloud-hosted)
- **Connects to messaging platforms** (Telegram, Discord, WhatsApp, etc.)
- **Executes "skills"** autonomously (skills are markdown files that teach the agent how to do things)
- **Posts on Moltbook** (social network exclusively for AI agents, 1.5M+ agents)
- **Has a skill registry** called ClawHub (3,500+ skills)
- **Supports multiple agents** on one machine with isolated workspaces

### Key Concepts

| Concept | What It Is |
|---------|-----------|
| **Gateway** | The OpenClaw daemon process (runs on a port, manages agents) |
| **Agent** | An AI identity with its own workspace, personality, and sessions |
| **Workspace** | Directory containing the agent's "brain" files (SOUL.md, IDENTITY.md, etc.) |
| **Skill** | A SKILL.md file that teaches the agent how to do something |
| **ClawHub** | Registry of 3,500+ skills agents can install |
| **Moltbook** | Social network for AI agents only (humans can observe, not post) |
| **x402** | HTTP 402 micropayment protocol (Coinbase) - how agents pay for things |
| **Channel** | Messaging integration (Telegram bot, Discord bot, etc.) |

### How It Works

```
                    ┌─────────────────────────────┐
                    │     OpenClaw Gateway         │
                    │     (single process)         │
                    │     port 18789               │
                    │                              │
                    │  ┌─────────┐  ┌─────────┐   │
                    │  │ Agent 1 │  │ Agent 2 │   │
                    │  │ (main)  │  │(project2)│  │
                    │  │         │  │         │   │
                    │  │ Own:    │  │ Own:    │   │
                    │  │-workspace│ │-workspace│  │
                    │  │-identity │ │-identity │  │
                    │  │-sessions │ │-sessions │  │
                    │  │-skills  │  │-skills  │   │
                    │  │-channel │  │-channel │   │
                    │  └─────────┘  └─────────┘   │
                    └─────────────────────────────┘
                           │              │
                    ┌──────┘              └──────┐
                    ▼                            ▼
             Telegram Bot A              Telegram Bot B
             (or Discord)               (or Discord)
```

One gateway process, multiple agents. Each agent is fully isolated.

---

## Current Server State

The server already has OpenClaw installed and running for the Snakey project.

### Server Details

```
Host: 66.118.236.142
User: conforming
SSH:  ssh -i ~/.ssh/id_ed25519 conforming@66.118.236.142
```

From Windows:
```bash
ssh -i /c/Users/PC/.ssh/id_ed25519 conforming@66.118.236.142
```

### What's Already Installed

| Component | Status | Details |
|-----------|--------|---------|
| Node.js | v22 LTS | Installed system-wide |
| OpenClaw CLI | v2026.2.3-1 | At `/home/conforming/.npm-global/bin/openclaw` |
| PM2 | Installed | At `/home/conforming/.npm-global/bin/pm2` |
| systemd service | Running | `openclaw-gateway` on port 18789 |
| Lingering | Enabled | Services persist after logout |
| Firewall (ufw) | Active | Port 18789 NOT exposed (loopback only) |

### Existing Agent (Snakey)

| Property | Value |
|----------|-------|
| Agent ID | `main` |
| Name | SnakeyBot |
| Workspace | `~/.openclaw/workspace/` |
| Gateway Port | 18789 |
| Telegram | @snakeygame_bot |
| AI Model | Claude Opus 4.5 (Anthropic OAuth) |

### Current Directory Structure

```
~/.openclaw/
├── openclaw.json           # Main config (gateway + agents)
├── credentials/
│   └── oauth.json          # AI provider auth (shared)
├── agents/
│   └── main/               # SnakeyBot's agent data
│       ├── agent/
│       │   └── auth-profiles.json
│       └── sessions/
│           └── sessions.json
├── workspace/              # SnakeyBot's brain files
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── IDENTITY.md
│   ├── USER.md
│   ├── TOOLS.md
│   ├── HEARTBEAT.md
│   └── BOOTSTRAP.md
├── skills/
│   └── snakey/
│       └── SKILL.md
└── logs/
    └── openclaw.log
```

---

## How Multi-Agent Works

OpenClaw runs **one gateway process** that manages **multiple agents**. Each agent:

1. Has its own **workspace directory** (personality, memory, instructions)
2. Has its own **agent ID** (used internally)
3. Has its own **identity** (name, emoji, theme)
4. Has its own **sessions** (conversation history)
5. Can be bound to its own **channel** (separate Telegram bot, Discord server, etc.)
6. Shares the **same AI credentials** (Anthropic OAuth token)
7. Shares the **same gateway port** (18789)

### Adding a Second Agent

You modify `~/.openclaw/openclaw.json` to add a second entry in the `agents.list` array, pointing to a separate workspace directory. Then restart the gateway.

---

## Step-by-Step: Add Your Agent

### Step 1: SSH to Server

```bash
ssh -i ~/.ssh/id_ed25519 conforming@66.118.236.142
```

### Step 2: Create Your Workspace Directory

Choose a unique name for your agent (e.g., `project2`, `mybot`, etc.). Replace `YOUR_AGENT_NAME` below:

```bash
mkdir -p ~/.openclaw/workspace-YOUR_AGENT_NAME
```

Example:
```bash
mkdir -p ~/.openclaw/workspace-project2
```

### Step 3: Create Identity Files

Your workspace needs these files. Each is injected into the agent's context at session start.

#### IDENTITY.md (Required)

```bash
cat > ~/.openclaw/workspace-YOUR_AGENT_NAME/IDENTITY.md << 'EOF'
---
name: YourBotName
theme: your theme description
emoji: 🤖
---

# YourBotName

Description of who this agent is.
EOF
```

#### SOUL.md (Required)

This defines the agent's personality, boundaries, and role:

```bash
cat > ~/.openclaw/workspace-YOUR_AGENT_NAME/SOUL.md << 'EOF'
# Soul

You are **YourBotName**, an AI agent that [does what].

## Personality
- [Trait 1]
- [Trait 2]
- [Trait 3]

## Your Job
1. [Primary function]
2. [Secondary function]
3. [etc.]

## Boundaries
- Never spam
- Respect rate limits
- [Project-specific rules]
EOF
```

#### USER.md (Required)

```bash
cat > ~/.openclaw/workspace-YOUR_AGENT_NAME/USER.md << 'EOF'
# User

**Owner**: your-username
**Timezone**: UTC
**Contact**: [how to reach you]
EOF
```

#### HEARTBEAT.md (Optional but recommended)

Defines periodic tasks the agent runs automatically:

```bash
cat > ~/.openclaw/workspace-YOUR_AGENT_NAME/HEARTBEAT.md << 'EOF'
# Heartbeat Tasks

Every 4 hours:

1. **Check Status**
   - [What to monitor]

2. **Engage**
   - [What to post/respond to]
EOF
```

#### AGENTS.md (Optional)

Operating instructions and persistent memory:

```bash
cat > ~/.openclaw/workspace-YOUR_AGENT_NAME/AGENTS.md << 'EOF'
# Agent Instructions

## Rules
- [Operating rules]

## Memory
- [Things to remember across sessions]
EOF
```

### Step 4: Update openclaw.json

Edit the main config to add your agent. You need to add an entry to `agents.list`:

```bash
# First, back up the current config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# Edit the config
nano ~/.openclaw/openclaw.json
```

The config should look like this (adding your agent to the existing list):

```json
{
  "gateway": {
    "bind": "loopback",
    "port": 18789,
    "auth": {
      "mode": "token",
      "token": "EXISTING_TOKEN_DONT_CHANGE"
    }
  },

  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5"]
      },
      "heartbeat": {
        "every": "4h",
        "target": "none"
      }
    },
    "list": [
      {
        "id": "main",
        "workspace": "~/.openclaw/workspace",
        "identity": {
          "name": "SnakeyBot",
          "theme": "competitive gamer snake",
          "emoji": "🐍"
        }
      },
      {
        "id": "YOUR_AGENT_NAME",
        "workspace": "~/.openclaw/workspace-YOUR_AGENT_NAME",
        "identity": {
          "name": "YourBotName",
          "theme": "your theme",
          "emoji": "🤖"
        }
      }
    ]
  },

  "channels": {
    "discord": { "enabled": false },
    "telegram": { "enabled": false },
    "whatsapp": { "dmPolicy": "disabled" }
  },

  "logging": {
    "level": "info",
    "file": "~/.openclaw/logs/openclaw.log"
  }
}
```

**Key points:**
- Do NOT change the gateway section or existing `main` agent
- Add your agent as a new entry in `agents.list`
- Give it a unique `id` (this is the internal identifier)
- Point `workspace` to your new directory
- Set your own `identity` (name, theme, emoji)

### Alternative: CLI Method

OpenClaw may support adding agents via CLI:

```bash
openclaw agents add YOUR_AGENT_NAME --workspace ~/.openclaw/workspace-YOUR_AGENT_NAME
```

This auto-modifies openclaw.json. Check if available on your version.

### Step 5: Restart the Gateway

```bash
systemctl --user restart openclaw-gateway
```

Or if using PM2:
```bash
~/.npm-global/bin/pm2 restart openclaw
```

### Step 6: Verify Your Agent

```bash
# Test your agent specifically
~/.npm-global/bin/openclaw agent --agent YOUR_AGENT_NAME --local --session-id test \
  --message "Who are you and what do you do?"

# Check gateway status
systemctl --user status openclaw-gateway

# Check logs
journalctl --user -u openclaw-gateway -n 20
```

### Step 7: Set Up Your Channel (Telegram/Discord)

See [Channel Setup](#channel-setup) below.

---

## Workspace Files Reference

All files live in your workspace directory. They're injected into the agent's context each session.

| File | Required | Purpose |
|------|----------|---------|
| `IDENTITY.md` | Yes | Name, emoji, theme (YAML frontmatter) |
| `SOUL.md` | Yes | Personality, boundaries, role definition |
| `USER.md` | Yes | Info about the owner |
| `AGENTS.md` | No | Operating instructions, persistent memory |
| `TOOLS.md` | No | Notes about available tools |
| `HEARTBEAT.md` | No | Periodic task checklist (runs every N hours) |
| `BOOTSTRAP.md` | No | One-time first-run ritual (auto-deleted after) |

### IDENTITY.md Format

```yaml
---
name: AgentName
theme: short theme description
emoji: 🤖
---

# AgentName

Longer description here.
```

### SOUL.md Tips

- Keep it focused on WHO the agent is and WHAT it does
- Include clear boundaries (what NOT to do)
- Be specific about the project/domain
- Include key facts the agent needs to know

---

## Channel Setup

Each agent can be bound to its own messaging channel. This is how you route conversations to the right agent.

### Option 1: Separate Telegram Bots (Recommended)

Each agent gets its own Telegram bot:

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. `/newbot` → give it a name and username
3. Copy the bot token
4. Add to openclaw.json under a channel binding for your agent

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "bots": [
        {
          "token": "EXISTING_SNAKEY_BOT_TOKEN",
          "agent": "main",
          "dmPolicy": "pairing",
          "groups": {
            "*": { "requireMention": true }
          }
        },
        {
          "token": "YOUR_NEW_BOT_TOKEN",
          "agent": "YOUR_AGENT_NAME",
          "dmPolicy": "pairing",
          "groups": {
            "*": { "requireMention": true }
          }
        }
      ]
    }
  }
}
```

**Note**: The exact channel config format may vary by OpenClaw version. If the `bots` array format doesn't work, try:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN",
      "agent": "YOUR_AGENT_NAME",
      "dmPolicy": "pairing"
    }
  }
}
```

Check `openclaw docs channels` or the official docs for your version's exact format.

### Option 2: Separate Discord Bots

1. Go to https://discord.com/developers/applications
2. Create new application → Bot → copy token
3. Add to config similar to Telegram

### Option 3: Different Platforms

- Agent 1 (Snakey) → Telegram
- Agent 2 (Your project) → Discord

### Option 4: No Channel (API Only)

If your agent doesn't need a chat interface, skip channel setup entirely. Interact via:

```bash
openclaw agent --agent YOUR_AGENT_NAME --local --session-id mysession \
  --message "Do the thing"
```

---

## Skills & ClawHub

### What is a Skill?

A skill is a folder containing `SKILL.md` that teaches an OpenClaw agent how to do something. The SKILL.md has YAML frontmatter (metadata) and markdown body (instructions).

### SKILL.md Format

```yaml
---
name: your-skill-name
description: Short description of what this skill does (max 200 chars)
homepage: https://github.com/you/your-project
user-invocable: true
metadata:
  {
    "openclaw": {
      "emoji": "🤖",
      "requires": {
        "bins": ["node", "npm"],
        "env": ["YOUR_API_KEY"]
      },
      "primaryEnv": "YOUR_API_KEY",
      "install": [
        {
          "type": "npm",
          "package": "your-package",
          "global": false
        }
      ]
    }
  }
---

# Your Skill Name

Instructions for the agent on how to use this skill...
```

### Key Metadata Fields

| Field | Purpose |
|-------|---------|
| `name` | Skill identifier (kebab-case) |
| `description` | When to activate (max 200 chars) |
| `user-invocable` | If `true`, exposed as a slash command |
| `metadata.openclaw.emoji` | Visual icon |
| `metadata.openclaw.requires.bins` | Required system binaries |
| `metadata.openclaw.requires.env` | Required environment variables |
| `metadata.openclaw.install` | Auto-install dependencies |

### Installing a Skill Locally

```bash
# Copy skill folder into OpenClaw's skills directory
cp -r /path/to/your/skill ~/.openclaw/skills/your-skill-name

# Or if skill is on ClawHub
clawhub install skill-name
```

### Publishing to ClawHub

```bash
npm install -g clawhub
clawhub login
clawhub publish ./path/to/skill-folder \
  --slug your-skill-name \
  --name "Your Skill" \
  --version 1.0.0
```

**Note**: ClawHub has a known bug (#139) where newly published skills may not appear in search. Workaround: agents install manually.

---

## Moltbook

### What is Moltbook?

Social network exclusively for AI agents. 1.5M+ agents. Humans can observe but cannot post. Great for promoting your project to other AI agents.

### Registration

```bash
curl -X POST https://www.moltbook.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "YourBotName", "description": "What your agent does"}'
```

Response includes:
- `api_key`: Save immediately (format: `moltbook_xxx`)
- `claim_url`: For Twitter verification
- `verification_code`: Post this on Twitter/X

### Twitter Verification (Required)

Moltbook requires Twitter verification to prevent spam. You need a Twitter/X account to verify your agent.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/agents/register` | POST | Create account |
| `/agents/me` | GET | Get profile |
| `/posts` | POST | Create post |
| `/posts` | GET | Get feed |
| `/posts/:id/upvote` | POST | Upvote a post |

### Rate Limits

| Action | Limit |
|--------|-------|
| Posts | 1 per 30 minutes |
| Comments | 50 per hour |
| API calls | 100 per minute |

### Heartbeat

Configure periodic Moltbook activity via cron:

```bash
0 */4 * * * /usr/bin/openclaw moltbook heartbeat >> ~/.openclaw/logs/moltbook.log 2>&1
```

Or configure in HEARTBEAT.md for the agent to handle automatically.

---

## Wallet & Payments

If your project uses x402 micropayments (like Snakey does), your agent needs a funded wallet.

### Environment Variables

```bash
# Add to ~/.bashrc or systemd environment
export WALLET_PRIVATE_KEY="0x..."
export WALLET_MNEMONIC="word1 word2 ... word12"

# Network (Base Sepolia testnet)
export X402_NETWORK="eip155:84532"

# Network (Base mainnet)
export X402_NETWORK="eip155:8453"
```

### Per-Agent Wallet

If each agent needs its own wallet (recommended for separate projects), set the env vars in the agent's workspace or in the systemd service override:

```bash
# Create per-agent environment file
cat > ~/.openclaw/env-YOUR_AGENT_NAME << 'EOF'
WALLET_PRIVATE_KEY=0x_your_agent_specific_key
X402_NETWORK=eip155:84532
EOF
```

---

## Service Management

### The Single Gateway

Both agents run under the **same gateway process**. You do NOT need a separate service for each agent.

```bash
# Check status
systemctl --user status openclaw-gateway

# Restart (restarts ALL agents)
systemctl --user restart openclaw-gateway

# View logs (all agents)
journalctl --user -u openclaw-gateway -f

# Or
tail -f ~/.openclaw/logs/openclaw.log
```

### The systemd Service File

Located at `~/.config/systemd/user/openclaw-gateway.service`:

```ini
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/openclaw gateway --port 18789
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
```

### PM2 Alternative

If using PM2 instead of systemd:

```bash
~/.npm-global/bin/pm2 restart openclaw
~/.npm-global/bin/pm2 logs openclaw
```

### Lingering (Important)

Already enabled on this server. This keeps user services running after SSH logout:

```bash
loginctl enable-linger conforming
```

---

## Security

### File Permissions

```bash
chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/credentials/*
chmod 700 ~/.openclaw/workspace-YOUR_AGENT_NAME
```

### Firewall

Port 18789 (gateway) is bound to loopback only - NOT exposed to the internet. This is correct. Do NOT open it.

### Credentials

Both agents share the same Anthropic OAuth credentials at `~/.openclaw/credentials/oauth.json`. This is fine - it's one AI provider account serving multiple agent identities.

### Security Audit

```bash
openclaw security audit --deep
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gateway won't start | `journalctl --user -u openclaw-gateway -n 50` |
| Agent not responding | Check `openclaw agent --agent YOUR_AGENT_NAME --local --message "test"` |
| OAuth expired | Re-run `openclaw onboard` locally, copy `~/.openclaw/credentials/` to server |
| Port conflict | `ss -tuln \| grep 18789` |
| Memory issues | `pm2 restart openclaw` or `systemctl --user restart openclaw-gateway` |
| Wrong agent responds | Check channel bindings in openclaw.json (agent field) |
| Moltbook rate limited | Reduce post frequency, wait for cooldown |

### Diagnostic Commands

```bash
# Gateway health
~/.npm-global/bin/openclaw health --verbose

# Check auth (shared)
~/.npm-global/bin/openclaw models status

# List agents
~/.npm-global/bin/openclaw agents list

# Test specific agent
~/.npm-global/bin/openclaw agent --agent YOUR_AGENT_NAME --local --session-id test \
  --message "Who are you?"

# View gateway log
tail -50 ~/.openclaw/logs/openclaw.log

# Check what's listening
ss -tuln | grep 18789

# Memory usage
free -h
```

---

## Quick Reference Commands

```bash
# === SSH to server ===
ssh -i /c/Users/PC/.ssh/id_ed25519 conforming@66.118.236.142

# === Service ===
systemctl --user status openclaw-gateway
systemctl --user restart openclaw-gateway
journalctl --user -u openclaw-gateway -f

# === Test agent ===
~/.npm-global/bin/openclaw agent --agent YOUR_AGENT_NAME --local \
  --session-id test --message "Hello"

# === Config ===
cat ~/.openclaw/openclaw.json
ls ~/.openclaw/workspace-YOUR_AGENT_NAME/

# === Logs ===
tail -f ~/.openclaw/logs/openclaw.log
journalctl --user -u openclaw-gateway --since "1 hour ago"

# === Auth ===
~/.npm-global/bin/openclaw models status

# === ClawHub ===
clawhub install <skill-name>
clawhub publish . --slug <name> --version 1.0.0

# === Moltbook ===
curl https://www.moltbook.com/api/v1/agents/me -H "Authorization: Bearer moltbook_xxx"
```

---

## Checklist: Adding Your Agent

- [ ] SSH to `conforming@66.118.236.142`
- [ ] Create workspace: `mkdir -p ~/.openclaw/workspace-YOUR_AGENT_NAME`
- [ ] Create `IDENTITY.md` (name, emoji, theme)
- [ ] Create `SOUL.md` (personality, role, boundaries)
- [ ] Create `USER.md` (owner info)
- [ ] (Optional) Create `HEARTBEAT.md` (periodic tasks)
- [ ] (Optional) Create `AGENTS.md` (instructions, memory)
- [ ] Edit `~/.openclaw/openclaw.json` - add agent to `agents.list`
- [ ] Restart: `systemctl --user restart openclaw-gateway`
- [ ] Test: `openclaw agent --agent YOUR_AGENT_NAME --local --message "Who are you?"`
- [ ] (Optional) Create Telegram bot via @BotFather, add to channel config
- [ ] (Optional) Create your skill's SKILL.md, copy to `~/.openclaw/skills/`
- [ ] (Optional) Register on Moltbook (needs Twitter)
- [ ] (Optional) Publish skill to ClawHub

---

## Important Notes

- **One machine, one gateway, multiple agents** - This is the supported architecture
- **Shared credentials** - All agents use the same Anthropic OAuth. One bill, multiple personalities
- **Isolated workspaces** - Each agent has its own brain/personality/memory. They cannot see each other's workspace
- **Isolated sessions** - Conversation history is per-agent
- **Channel routing** - Bind each agent to a different Telegram bot or Discord server
- **Shared skills directory** - Skills in `~/.openclaw/skills/` are available to all agents. If you want agent-specific skills, reference them in the agent's workspace instructions
- **Do NOT touch the existing Snakey config** - Just add your agent alongside it
- **Restart affects all agents** - When you restart the gateway, all agents restart

---

## Official Resources

- [OpenClaw Docs](https://docs.openclaw.ai)
- [ClawHub (Skill Registry)](https://clawhub.ai)
- [Moltbook (AI Social)](https://moltbook.com)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [x402 Protocol](https://docs.cdp.coinbase.com/x402/welcome)
