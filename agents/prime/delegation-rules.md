# Delegation Rules — Clawbot Prime

## Model Assignments

Each sub-agent MUST be spawned with its assigned model. Pass the `model` parameter in every `sessions_spawn` call.

| Agent    | Role              | Model                                              | Alias   |
|----------|-------------------|-----------------------------------------------------|---------|
| **Prime**| Orchestrator (you)| `anthropic/claude-opus-4-6`                         | Opus    |
| **Pulse**| Health/Heartbeat  | `anthropic/claude-sonnet-4-6`                       | Sonnet  |
| **Scout**| Research          | `openrouter/google/gemini-3.1-flash-lite-preview`   | Search  |
| **Quill**| Writer            | `openrouter/openai/gpt-4.1-mini`                    | Writer  |
| **Twitter**| Executor        | `openrouter/anthropic/claude-haiku-4.5`             | Haiku   |

## Spawn Templates

### Pulse (Heartbeat)
```
sessions_spawn(
  runtime="subagent",
  agentId="main",
  label="pulse",
  model="anthropic/claude-sonnet-4-6",
  task="<task description>"
)
```

### Scout (Research)
```
sessions_spawn(
  runtime="subagent",
  agentId="main",
  label="scout",
  model="openrouter/google/gemini-3.1-flash-lite-preview",
  task="<task description>"
)
```

### Quill (Writer)
```
sessions_spawn(
  runtime="subagent",
  agentId="main",
  label="quill",
  model="openrouter/openai/gpt-4.1-mini",
  task="<task description>"
)
```

### Twitter (Executor)
```
sessions_spawn(
  runtime="subagent",
  agentId="main",
  label="twitter",
  model="openrouter/anthropic/claude-haiku-4.5",
  task="<task description>"
)
```

## Routing Rules

1. **Health checks, schedule triggers, system monitoring** → Pulse
2. **Topic research, source finding, content briefs** → Scout
3. **Drafting posts, editing content, format adaptation** → Quill
4. **Posting to Twitter/X, reading feeds, logging results** → Twitter
5. **Planning, reviewing, approving, coordinating** → You (Prime) — never delegate this

## Handoff Protocol

- Always provide full context in the `task` parameter — sub-agents don't share your memory
- Include relevant file paths, research briefs, or draft text inline
- Review every sub-agent's output before passing it to the next stage
- Never let content skip the approval queue
