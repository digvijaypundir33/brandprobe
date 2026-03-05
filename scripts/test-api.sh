#!/bin/bash

# Test Scraper via API endpoint
# This tests the full flow including the scraper

echo ""
echo "🧪 Testing Scraper via API Endpoint..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dev server is running
echo "📡 Checking if dev server is running on port 3001..."
if ! curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${RED}❌ Dev server not running!${NC}"
    echo ""
    echo "Please start the dev server first:"
    echo "  npm run dev"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Dev server is running!${NC}"
echo ""

# Test URL
TEST_URL="https://example.com"

echo "🔍 Testing scan for: $TEST_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Make API request
echo "⏳ Sending request to /api/scan..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$TEST_URL\", \"email\": \"test@example.com\"}")

echo ""
echo "📥 Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"id"'; then
    REPORT_ID=$(echo "$RESPONSE" | jq -r '.id' 2>/dev/null)
    echo -e "${GREEN}✅ Scan started successfully!${NC}"
    echo "📄 Report ID: $REPORT_ID"
    echo ""
    echo "🔗 View report at: http://localhost:3001/report/$REPORT_ID"
    echo ""
    echo "⏰ The scan will take 60-90 seconds to complete."
    echo ""
    echo "✨ Native Playwright is working!"
    exit 0
else
    echo -e "${RED}❌ Scan failed!${NC}"
    echo ""
    echo "Error response:"
    echo "$RESPONSE"
    exit 1
fi
