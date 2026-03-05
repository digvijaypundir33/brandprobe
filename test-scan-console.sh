#!/bin/bash

# Test Scan with Console Link (Development Mode)

echo ""
echo "🧪 Testing Scan with Console Link..."
echo ""

# Test URL
TEST_URL="https://example.com"
TEST_EMAIL="test@example.com"

echo "📍 URL: $TEST_URL"
echo "📧 Email: $TEST_EMAIL"
echo ""
echo "⏳ Sending scan request..."
echo ""

# Make API request
RESPONSE=$(curl -s -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$TEST_URL\", \"email\": \"$TEST_EMAIL\"}")

echo "📥 API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract magic link if present
MAGIC_LINK=$(echo "$RESPONSE" | jq -r '.magicLink' 2>/dev/null)

if [ "$MAGIC_LINK" != "null" ] && [ ! -z "$MAGIC_LINK" ]; then
    echo "✅ Magic link generated!"
    echo ""
    echo "🔗 Click this link to verify and start scan:"
    echo "$MAGIC_LINK"
    echo ""
    echo "Or copy and paste into your browser:"
    echo "$MAGIC_LINK"
    echo ""
    echo "📝 The link is also shown in your dev server console above."
    echo ""
else
    echo "⚠️  No magic link in response. Check the response above."
fi
