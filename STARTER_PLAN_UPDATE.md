# Starter Plan Update: 1 Report → 5 Reports

## Changes Summary

The Starter plan has been updated from unlocking **1 specific report** to allowing **5 reports for different websites**.

### Previous Model
- **Price:** $9 one-time
- **Reports:** 1 report only
- **Access:** All 10 sections unlocked for that specific report
- **Limitation:** User was locked to one specific report ID

### New Model
- **Price:** $9 one-time
- **Reports:** 5 reports total
- **Access:** All 10 sections unlocked for all reports
- **Limitation:** Each report must be for a different website (different domain)

## Technical Changes

### 1. Database Schema
- `one_time_purchase_id` field is now set to `null` for Starter users (previously stored report ID)
- `reports_limit` changed from `1` to `5`

### 2. Access Logic
**Before:**
```typescript
const hasFullAccess =
  subscriptionStatus === 'active' ||
  (subscriptionStatus === 'starter' && oneTimePurchaseId === id);
```

**After:**
```typescript
const hasFullAccess =
  subscriptionStatus === 'active' ||
  subscriptionStatus === 'starter';
```

### 3. Report Limit Enforcement
- **Free users:** 1 report total
- **Starter users:** 5 reports total, must be different websites
- **Pro users:** 10 reports per month

### 4. Duplicate Website Check
New validation added in `/api/scan` route:
```typescript
if (user.subscriptionStatus === 'starter') {
  const existingSiteReports = existingReports.filter(report => {
    const reportDomain = extractDomain(report.url);
    return reportDomain === domain;
  });

  if (existingSiteReports.length > 0) {
    return error: 'You already have a report for this website'
  }
}
```

## Files Modified

### Backend/API Routes
1. **src/app/api/paypal/success/route.ts**
   - Changed `oneTimePurchaseId: reportId` → `oneTimePurchaseId: null`
   - Changed `reportsLimit: 1` → `reportsLimit: 5`

2. **src/app/api/paypal/capture/route.ts**
   - Changed `oneTimePurchaseId: reportId` → `oneTimePurchaseId: null`
   - Changed `reportsLimit: 1` → `reportsLimit: 5`

3. **src/app/api/paypal/webhook/route.ts**
   - Changed `oneTimePurchaseId: reportId || captureId` → `oneTimePurchaseId: null`
   - Changed `reportsLimit: 1` → `reportsLimit: 5`

4. **src/app/api/report/[id]/route.ts**
   - Simplified access logic to allow all Starter users access to all their reports
   - Removed `oneTimePurchaseId` matching check

5. **src/app/api/scan/route.ts**
   - Updated Starter limit from `1` to `5`
   - Added duplicate website validation
   - Updated error messages

### Frontend/UI
1. **src/app/pricing/page.tsx**
   - Changed description from "Unlock full report for this website" → "5 reports for different websites"
   - Updated features list to highlight "5 reports for different websites"

2. **src/components/DashboardClient.tsx**
   - Added usage card showing "X/5 Reports Used" for Starter users
   - Changed grid layout to 4 columns when Starter/Pro (to show usage card)

3. **src/app/faq/page.tsx**
   - Updated Starter plan description from "one report" → "5 reports for different websites"

## User Experience

### What Users See

**Free Users:**
- Can create 1 report
- See 4 sections unlocked (Messaging, SEO, Content, Ads)
- See preview of 6 locked sections

**Starter Users ($9 one-time):**
- Can create 5 reports for different websites
- All 10 sections unlocked for every report
- Cannot create multiple reports for the same website
- Dashboard shows "X/5 Reports Used"
- Error message if trying to scan same domain twice

**Pro Users ($29/month):**
- 10 reports per month
- All 10 sections unlocked
- Can rescan same websites
- Monthly report resets

## Migration for Existing Users

For existing Starter users with `one_time_purchase_id` set to a report ID, run this SQL:

```sql
UPDATE users
SET
  one_time_purchase_id = NULL,
  reports_limit = 5
WHERE subscription_status = 'starter';
```

## Benefits of This Change

1. **Better Value:** Users get 5 reports instead of 1 for the same $9 price
2. **More Flexible:** Can analyze multiple websites instead of being locked to one
3. **Clearer Positioning:** Starter is now clearly between Free (1 report) and Pro (10/month)
4. **Different Use Case:** Good for freelancers/consultants analyzing client websites
5. **Prevents Abuse:** "Different websites only" rule prevents unlimited rescanning

## Edge Cases Handled

1. ✅ User tries to scan same domain twice → Error message
2. ✅ User reaches 5 report limit → Upgrade prompt to Pro
3. ✅ User with existing report from Free tier → Counts towards 5 total
4. ✅ Subdomain check → `extractDomain()` ensures `app.example.com` and `example.com` are treated as same domain

## Testing Checklist

- [ ] New Starter purchase creates user with `reports_limit: 5`
- [ ] Starter user can create report #1 successfully
- [ ] Starter user can create reports #2-#5 for different domains
- [ ] Starter user blocked from creating report for duplicate domain
- [ ] Starter user blocked after 5 reports with upgrade prompt
- [ ] All 10 sections visible for all Starter user reports
- [ ] Dashboard shows "X/5 Reports Used" for Starter users
- [ ] Pricing page shows "5 reports for different websites"
- [ ] FAQ updated correctly
