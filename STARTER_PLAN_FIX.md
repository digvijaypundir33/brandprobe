# Starter Plan Section Locking Bug Fix

## Problem
Starter users were seeing locked sections on their purchased reports, even though they paid $9 to unlock all 10 sections for that specific report.

## Root Cause
The `one_time_purchase_id` field in the database was storing the **PayPal transaction ID** (e.g., `60P03694A2948591W`) instead of the **report ID** (e.g., `3ade8bab-1960-4f6d-82fa-68f7eb80328d`).

The access logic in `src/app/api/report/[id]/route.ts` checks:
```typescript
const hasFullAccess =
  subscriptionStatus === 'active' ||
  (subscriptionStatus === 'starter' && oneTimePurchaseId === id);
```

Since the PayPal transaction ID never matches the report ID, the second condition always failed, keeping sections locked.

## Debug Output
```
=== Report Access Debug ===
Report ID: 3ade8bab-1960-4f6d-82fa-68f7eb80328d
User Email: test@gmail.com
Subscription Status: starter
One Time Purchase ID: 60P03694A2948591W  ❌ (Wrong - this is PayPal transaction ID)
IDs Match: false  ❌
Has Full Access: false  ❌
=========================
```

## Solution

### Code Changes

1. **src/app/api/paypal/success/route.ts** (Line 40)
   - **Before:** `oneTimePurchaseId: capture.captureId`
   - **After:** `oneTimePurchaseId: reportId`

2. **src/app/api/paypal/capture/route.ts** (Line 33)
   - **Before:** `oneTimePurchaseId: capture.captureId`
   - **After:** `oneTimePurchaseId: reportId`

3. **src/app/api/paypal/webhook/route.ts** (Line 40)
   - **Before:** `oneTimePurchaseId: captureId`
   - **After:** `oneTimePurchaseId: reportId || captureId` (with reportId extraction from webhook data)

### Database Fix for Existing Users

For the test@gmail.com user (and any other existing Starter users), run:

```sql
UPDATE users
SET one_time_purchase_id = '3ade8bab-1960-4f6d-82fa-68f7eb80328d'
WHERE email = 'test@gmail.com'
  AND subscription_status = 'starter';
```

Or use the SQL script: `scripts/fix-test-user-purchase-id.sql`

## Verification

After the fix, the debug output should show:
```
=== Report Access Debug ===
Report ID: 3ade8bab-1960-4f6d-82fa-68f7eb80328d
User Email: test@gmail.com
Subscription Status: starter
One Time Purchase ID: 3ade8bab-1960-4f6d-82fa-68f7eb80328d  ✅
IDs Match: true  ✅
Has Full Access: true  ✅
=========================
```

## Testing Checklist

- [ ] Code changes deployed
- [ ] Database updated for test@gmail.com user
- [ ] Reload report page and check server logs for debug output
- [ ] Verify all 10 sections are visible (no locked badges)
- [ ] Test new Starter purchase to ensure reportId is saved correctly
- [ ] Remove debug logging from production after verification

## Files Modified

- `src/app/api/paypal/success/route.ts`
- `src/app/api/paypal/capture/route.ts`
- `src/app/api/paypal/webhook/route.ts`
- `scripts/fix-test-user-purchase-id.sql` (new file)
