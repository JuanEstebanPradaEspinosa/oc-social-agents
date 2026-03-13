# Multi-Agent Architecture

## Overview

5-agent system for social media automation with clear separation of concerns.

## Agents

### Prime (Main Orchestrator)
- **Role:** Plans, delegates, routes, reviews
- **Never:** Touches APIs, writes content, searches topics
- **Location:** Main session (you're talking to Prime now)

### Pulse (Heartbeat)
- **Role:** Health checks, scheduled triggers
- **Schedule:** Runs periodically, triggers Prime on Mondays
- **Checks:** Agents present, APIs reachable, disk space, no stuck tasks
- **Spawn:** `sessions_spawn(runtime="subagent", agentId="main", label="pulse")`

### Scout (Research)
- **Role:** Finds content leads
- **Process:** Checks curated links → searches ICP news/events/crypto/AI/startup
- **Output:** Structured research brief (not post copy)
- **Spawn:** `sessions_spawn(runtime="subagent", agentId="main", label="scout")`

### Quill (Writer)
- **Role:** Turns research briefs → polished drafts
- **Output:** Tweets, threads, event promos
- **Owns:** Brand voice, formatting
- **Never:** Decides what to post (only how)
- **Spawn:** `sessions_spawn(runtime="subagent", agentId="main", label="quill")`

### Twitter (Executor)
- **Role:** Publishing machine
- **Process:** Approved text → posts → logs → confirms
- **Never:** Makes content decisions
- **Spawn:** `sessions_spawn(runtime="subagent", agentId="main", label="twitter")`

## Pipeline Flow

```
Heartbeat triggers → Prime plans → Scout researches → Prime reviews → 
Quill drafts → Human approves → Twitter posts
```

## Directory Structure

```
agents/
├── prime/       # Orchestrator config (SOUL.md, delegation logic)
├── pulse/       # Heartbeat config (health checks, schedules)
├── scout/       # Research config (curated links, search patterns)
├── quill/       # Writer config (brand voice, templates)
└── twitter/     # Executor config (API setup, posting logic)

runtime/
├── queues/      # Task queues (research requests, draft queue, publish queue)
├── drafts/      # Work-in-progress content
├── logs/        # Agent activity logs
└── state/       # Live state (last run times, health status)
```

## Repo vs Runtime Split

- **GitHub (agents/):** Definitions, templates, policies, SOUL.md files
- **Runtime (runtime/):** Live state, queues, drafts, logs, secrets (gitignored)
