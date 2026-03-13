# Twitter Agent Log Format

## Log Location

`/home/trader/.openclaw/workspace/runtime/logs/twitter.log`

## Format

```
[TIMESTAMP] [LEVEL] [ACTION] details
```

## Log Levels

- `INFO` - Normal operation
- `WARN` - Recoverable issues
- `ERROR` - Failures requiring attention
- `DEBUG` - Detailed API traces (optional)

## Example Entries

```
[2026-03-13T03:08:00Z] INFO POST_TWEET_START draft_id=abc123 chars=145
[2026-03-13T03:08:01Z] INFO POST_TWEET_SUCCESS tweet_id=1234567890 url=https://twitter.com/user/status/1234567890
[2026-03-13T03:08:05Z] ERROR POST_TWEET_FAILED draft_id=xyz789 status=401 error="Invalid credentials"
[2026-03-13T03:09:00Z] WARN RATE_LIMIT_APPROACHING used=15/17 resets_at=2026-03-14T00:00:00Z
```

## Structured Data

Each log line should include:
- Timestamp (ISO 8601 UTC)
- Level
- Action type
- Draft ID (for traceability)
- Result (tweet_id, url, or error details)
- API response time (optional)

## Rotation

- Max size: 10MB per file
- Keep last 7 days
- Compress older logs
