# Twitter Posting Rules

## Input Format

Task files should contain:
```json
{
  "action": "post_tweet",
  "text": "Tweet content here",
  "reply_to": "optional_tweet_id",
  "thread": false,
  "draft_id": "unique_identifier"
}
```

## Character Limits

- **Single tweet**: 280 characters max
- **Extended tweet**: Up to 25k characters (Twitter Blue/Premium only)
- **URLs**: Count as 23 characters (auto-shortened)
- **Media**: Can add 4 images, 1 video, or 1 GIF per tweet

## Thread Handling

For threads:
1. Post first tweet
2. Store tweet ID
3. Reply with each subsequent tweet using `reply_to`
4. Log thread structure

## Error Handling

- **429 Rate Limit**: Wait and retry after rate limit reset
- **401 Unauthorized**: Log error, alert main agent immediately
- **403 Forbidden**: Content policy violation, escalate to operator
- **400 Bad Request**: Invalid input, log details and block task
- **5xx Server Error**: Retry once after 30 seconds

## Retry Logic

- Retry once on: network errors, 5xx errors
- Do NOT retry on: 4xx errors (except 429)
- Log every attempt

## Logging Format

```
[2026-03-13T03:08:00Z] POST_TWEET_START draft_id=abc123
[2026-03-13T03:08:01Z] POST_TWEET_SUCCESS tweet_id=1234567890 draft_id=abc123 url=https://twitter.com/user/status/1234567890
```

## Safety Checks

Before posting:
- ✅ Task file exists and is approved
- ✅ Text is not empty
- ✅ Character count is valid
- ✅ No banned words/phrases (maintain blocklist)
- ✅ Credentials are loaded

## Rate Limit Management

Track:
- Tweets posted in last 24h
- Last API call timestamp
- Remaining quota (from API headers)

Stop posting if:
- Daily limit reached
- Rate limit hit
- API errors exceed threshold (3 in 10 minutes)
