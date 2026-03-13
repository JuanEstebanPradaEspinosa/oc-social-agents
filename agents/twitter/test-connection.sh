#!/usr/bin/env bash
# Test Twitter API connection
set -euo pipefail

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

source .env

# Check if credentials are set
if [ -z "${TWITTER_ACCESS_TOKEN:-}" ] || [ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]; then
    echo "Error: Missing ACCESS_TOKEN or ACCESS_TOKEN_SECRET"
    exit 1
fi

echo "Testing Twitter API connection..."
echo "Using Access Token: ${TWITTER_ACCESS_TOKEN:0:20}..."

# Test with Twitter API v2 - Get authenticated user
response=$(curl -s -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}")

echo ""
echo "Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"

if echo "$response" | jq -e '.data.username' >/dev/null 2>&1; then
    username=$(echo "$response" | jq -r '.data.username')
    echo ""
    echo "✓ Connection successful!"
    echo "✓ Authenticated as: @$username"
else
    echo ""
    echo "✗ Connection failed"
    echo "Check your credentials in .env"
    exit 1
fi
