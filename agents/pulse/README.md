# Pulse - Heartbeat Agent

**Role:** Health monitoring and scheduled triggers.

## Schedule
- Runs periodically via cron or OpenClaw heartbeat
- Triggers Prime every Monday morning

## Health Checks
1. Are all agents reachable?
2. Are APIs accessible?
3. Is disk space OK? (&gt;10% free)
4. Are there stuck tasks? (drafts older than 48h)
5. Are queues healthy? (not overflowing)

## Files
- `SOUL.md` - Pulse's personality (minimal, utilitarian)
- `health-checks.md` - Checklist of what to monitor
- `trigger-schedule.md` - When to wake up Prime
