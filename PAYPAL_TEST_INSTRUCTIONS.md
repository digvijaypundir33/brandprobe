# PayPal Testing Instructions - Quick Guide

## 🎯 What You Need to Do

1. Create Pro subscription plan ($29/month)
2. Add Plan ID to `.env.local`
3. Test Starter payment ($9)
4. Test Pro subscription ($29/month)

---

## Step 1: Get Business Account Login

### Option A: Find Existing Test Accounts

1. Go to https://developer.paypal.com/dashboard/accounts
2. Look for your test accounts:
   - **Business Account** (facilitator) - This is YOUR account
   - **Personal Account** (buyer) - This is the TEST CUSTOMER

3. Click on **Business Account** row
4. Click **"View/Edit Account"**
5. Copy the **Email** and **System Generated Password**

### Option B: Create New Business Account (if needed)

1. Go to https://developer.paypal.com/dashboard/accounts
2. Click **"Create Account"**
3. Choose:
   - **Account Type:** Business
   - **Email:** brandprobe-business@personal.example.com
   - **Password:** Auto-generate
4. Click **"Create Account"**
5. Note the email and password

---

## Step 2: Create Pro Subscription Plan

### 2.1 Log into PayPal Sandbox

1. Go to https://www.sandbox.paypal.com/
2. Click **"Log In"**
3. Enter **Business Account** email and password (from Step 1)
4. Click **"Log In"**

### 2.2 Navigate to Subscriptions

1. Once logged in, look for navigation menu
2. Click **"Products & Services"** (or **"Tools"**)
3. Click **"Subscriptions"** (or **"Recurring Payments"**)
4. Click **"Create Plan"** or **"Get Started"**

### 2.3 Fill in Plan Details

```
Plan Name: BrandProbe Pro
Description: 10 reports/month + auto re-scan + progress tracking

Billing Cycle:
├─ Frequency: Monthly
├─ Tenure Type: Regular
└─ Price per cycle: $29.00 USD

Trial Period: None (skip)
Setup Fee: None (skip)
```

### 2.4 Save and Activate

1. Click **"Save"** or **"Create Plan"**
2. You'll see the plan listed
3. **Important:** Make sure to **ACTIVATE** the plan
   - Look for "Activate" or "Active" toggle
   - Plan must be ACTIVE to use in API

### 2.5 Copy Plan ID

1. Click on your newly created plan
2. Look for **"Plan ID"** - it starts with `P-`
3. Example: `P-1AB23456CD789012E`
4. **Copy this ID** - you'll need it next!

---

## Step 3: Update .env.local

Open `.env.local` and replace:

```bash
# BEFORE
PAYPAL_PRO_PLAN_ID=P-xxxxxxxxxxxxxxxxxxxxx

# AFTER
PAYPAL_PRO_PLAN_ID=P-1AB23456CD789012E
```

**Use your actual Plan ID!**

---

## Step 4: Test Payments

### 4.1 Start Your App

```bash
npm run dev
```

Your app should be running at http://localhost:3000

### 4.2 Test Starter Payment ($9 One-Time)

1. Go to http://localhost:3000
2. Enter a test URL (e.g., `https://example.com`)
3. Enter your email
4. Click "Get My Report"
5. Wait for report to generate
6. Click **"Unlock for $9"** button
7. You'll be redirected to PayPal sandbox

**On PayPal Page:**
- Log in with **Personal Account** (buyer) credentials
- **OR** click "Pay with Debit or Credit Card"
- Use test card: `4032039963683087`
- CVV: `123`, Expiry: `12/2026`
- Complete payment

**Expected Result:**
- Redirected back to your report
- URL: `/report/xxx?payment=success&tier=starter`
- Report is now unlocked (all 10 sections visible)

### 4.3 Test Pro Subscription ($29/Month)

1. Go to http://localhost:3000
2. Generate another report (or use existing)
3. Click **"Get Pro - $29/mo"** button
4. You'll be redirected to PayPal subscription page

**On PayPal Page:**
- Log in with **Personal Account** (buyer)
- Review subscription: $29.00/month
- Click **"Agree & Subscribe"**

**Expected Result:**
- Redirected back to your app
- URL: `/?payment=success&tier=pro`
- User is upgraded to Pro tier

### 4.4 Verify in Database

Check your Supabase database:

```sql
SELECT
  email,
  subscription_status,
  subscription_id,
  one_time_purchase_id,
  reports_limit
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:**
- Starter user: `subscription_status = 'starter'`, `reports_limit = 1`
- Pro user: `subscription_status = 'active'`, `reports_limit = 10`

---

## Step 5: Test Credit Card Payment (No PayPal Account)

### 5.1 Clear Cookies
Open incognito/private window or clear cookies

### 5.2 Generate Report
1. Go to http://localhost:3000
2. Generate a new report
3. Click **"Unlock for $9"**

### 5.3 Pay with Card
1. On PayPal page, **DON'T log in**
2. Look for **"Pay with Debit or Credit Card"** link
3. Click it
4. Enter test card details:
   ```
   Card Number: 4032039963683087
   Expiry: 12/2026
   CVV: 123
   Name: Test User
   Email: test@example.com
   ```
5. Click **"Pay Now"**

**Expected Result:**
- Payment processes without PayPal login
- Redirected back with success
- Report unlocked

---

## 🧪 Test Cards (Sandbox)

### Valid Test Cards

```
Visa:
- 4032039963683087
- 4111111111111111

Mastercard:
- 5449631058421645
- 5555555555554444

American Express:
- 378282246310005

CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/2026)
Name: Any name
```

### Invalid Cards (for testing errors)

```
Declined Card:
- 4000000000000002 (card declined)

Insufficient Funds:
- 4000000000009995
```

---

## 🔍 Troubleshooting

### "Plan not found" error

**Check:**
1. Plan ID is correct (starts with `P-`)
2. Plan is ACTIVATED in PayPal
3. `.env.local` has correct `PAYPAL_PRO_PLAN_ID`
4. Restart dev server after changing `.env.local`

**Fix:**
```bash
# Verify .env.local
cat .env.local | grep PAYPAL_PRO_PLAN_ID

# Restart server
npm run dev
```

### PayPal redirects to error page

**Check:**
1. `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set (client-side needs this)
2. Client ID matches `PAYPAL_CLIENT_ID`
3. App is running on http://localhost:3000

**Fix:**
```bash
# Check both CLIENT_IDs match
grep PAYPAL_CLIENT_ID .env.local
```

### Payment succeeds but user not upgraded

**Check:**
1. Webhook endpoint (not needed for testing - handled by redirect)
2. Check browser console for errors
3. Check Network tab for API responses

**Debug:**
```bash
# Check API route logs in terminal
# Look for "PayPal success" messages
```

### "Guest checkout not available"

**Enable in PayPal:**
1. https://www.sandbox.paypal.com/
2. Log in with Business Account
3. Settings → Payment Preferences
4. PayPal Account Optional → **ON**
5. Save

---

## 📊 What to Check

### After Starter Payment ($9)

✅ User redirected to `/report/{id}?payment=success&tier=starter`
✅ All 10 sections of report visible
✅ Database: `subscription_status = 'starter'`
✅ Database: `one_time_purchase_id` filled
✅ Database: `reports_limit = 1`

### After Pro Subscription ($29/mo)

✅ User redirected to `/?payment=success&tier=pro`
✅ Database: `subscription_status = 'active'`
✅ Database: `subscription_id` filled (starts with `I-`)
✅ Database: `reports_limit = 10`

### PayPal Dashboard

1. Go to https://www.sandbox.paypal.com/
2. Log in with **Business Account**
3. Check **Activity** → See payments received
4. For subscriptions: **Products & Services** → **Subscriptions** → See active subscribers

---

## 🎯 Quick Test Checklist

- [ ] Created Pro plan in PayPal sandbox
- [ ] Copied Plan ID to `.env.local`
- [ ] Restarted dev server
- [ ] Tested Starter payment ($9) - SUCCESS
- [ ] Tested Pro subscription ($29/mo) - SUCCESS
- [ ] Tested credit card payment (no PayPal login) - SUCCESS
- [ ] Verified database updates - CORRECT
- [ ] Checked PayPal dashboard - PAYMENTS VISIBLE

---

## 🚀 Next Steps After Testing

Once everything works in sandbox:

1. **Test thoroughly** - Try different scenarios
2. **Test error cases** - Cancelled payments, failed cards
3. **When ready for production:**
   - Create production PayPal app
   - Create production subscription plan
   - Update `.env.local` with production credentials
   - Change `PAYPAL_MODE=production`
   - Deploy!

---

## 💡 Pro Tips

1. **Keep sandbox and production separate**
   - Use different email addresses
   - Don't mix credentials

2. **Test all payment flows**
   - PayPal account payment
   - Credit card payment (guest)
   - Subscription
   - Cancellation

3. **Monitor logs**
   - Check terminal for API logs
   - Check browser console for errors
   - Check PayPal dashboard for transactions

4. **Document your Plan ID**
   - Save it somewhere safe
   - You'll need it for production too

---

Need help? Stuck on any step? Let me know! 🎉
