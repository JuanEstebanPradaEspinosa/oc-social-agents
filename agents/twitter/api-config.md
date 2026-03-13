# Twitter API Configuration

## Credentials Location

Credentials are stored in: `/home/trader/.openclaw/workspace/.env`

**Never commit this file to git** (already in `.gitignore`)

## Setup Steps

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Twitter Developer credentials:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret
   - Bearer Token (optional)

3. Test the connection (see testing section below)

## Required Permissions

Your Twitter app needs these permissions:
- ✅ Read and Write (to post tweets)
- ✅ Direct Messages (if you want DM support later)

## API Endpoints Used

- **POST /2/tweets** - Create tweets
- **DELETE /2/tweets/:id** - Delete tweets
- **GET /2/tweets/:id** - Read tweet details
- **GET /2/users/me** - Verify credentials

## Rate Limits (Twitter API v2 Free Tier)

- **Tweet creation**: 17 tweets per 24 hours
- **Tweet reads**: 10,000 per month
- **User lookup**: 300 per 15 minutes

Plan accordingly for your posting schedule.

## Using the API from the Twitter Agent

The Twitter agent should:
1. Load credentials from `.env`
2. Use Twitter API v2 endpoints
3. Always log API responses
4. Handle rate limits gracefully
5. Retry once on transient failures

## Security Notes

- Never log full credentials
- Never pass credentials to sub-agents unnecessarily
- Rotate tokens if compromised
- Use read-only bearer token when possible
