# PayPal Sandbox Setup - Step by Step Guide

## 🎯 What We're Setting Up

1. PayPal Developer Account
2. Sandbox App (to get Client ID & Secret)
3. Test Accounts (Buyer & Seller)
4. Subscription Plan for Pro tier ($29/month)
5. Webhook Configuration

---

## Step 1: Create PayPal Developer Account

### 1.1 Go to PayPal Developer Portal
👉 https://developer.paypal.com/

### 1.2 Sign Up / Log In
- If you don't have a PayPal account, create one
- Log in with your PayPal credentials
- Accept developer terms

---

## Step 2: Create Sandbox App

### 2.1 Navigate to Apps
1. Click **"Dashboard"** in top menu
2. Click **"Apps & Credentials"** in left sidebar
3. Make sure you're on **"Sandbox"** tab (top of page)

### 2.2 Create New App
1. Click **"Create App"** button
2. Fill in details:
   - **App Name:** `BrandProbe Sandbox`
   - **App Type:** Select **"Merchant"**
3. Click **"Create App"**

### 2.3 Get Your Credentials
You'll see a screen with:
- ✅ **Client ID** - Copy this (starts with `A...`)
- ✅ **Secret** - Click "Show" and copy it

**Save these credentials!** You'll need them in a moment.

---

## Step 3: Create Test Accounts

### 3.1 Navigate to Sandbox Accounts
1. Click **"Testing Tools"** → **"Sandbox Accounts"** in left sidebar

### 3.2 Default Accounts
PayPal creates 2 default accounts:
- **Business Account** (Seller) - Receives payments
- **Personal Account** (Buyer) - Makes payments

### 3.3 View Account Details
Click on **Personal Account** → **"View/Edit Account"**
- Note the **Email** and **Password**
- You'll use these to test payments

---

## Step 4: Create Subscription Plan (Pro Tier)

### 4.1 Navigate to Subscriptions
1. Go to **PayPal Business Dashboard** (not Developer)
   👉 https://www.sandbox.paypal.com/
2. Log in with your **Business Account** credentials (from Step 3.2)
3. Go to **"Products & Services"** → **"Subscriptions"**

### 4.2 Create Plan
1. Click **"Create Plan"**
2. Fill in details:
   - **Plan Name:** `BrandProbe Pro`
   - **Plan Description:** `10 reports/month + auto re-scan + progress tracking`
   - **Plan Type:** `Regular`

### 4.3 Configure Billing
1. **Billing Cycle:**
   - **Frequency:** Monthly
   - **Tenure:** Ongoing (no end date)
   - **Price:** `$29.00 USD`
2. **Trial Period:** Skip (leave unchecked)
3. **Setup Fee:** Skip (leave at $0)

### 4.4 Save & Activate
1. Click **"Save"**
2. **Activate** the plan
3. Copy the **Plan ID** (starts with `P-`)

**Important:** Save this Plan ID! You'll add it to your .env file.

---

## Step 5: Add Credentials to .env.local

### 5.1 Open Your .env.local File
```bash
# In your project root
nano .env.local
# or
code .env.local
```

### 5.2 Add PayPal Credentials
```bash
# ==================
# PayPal Sandbox
# ==================
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
PAYPAL_CLIENT_SECRET=YOUR_SECRET_HERE
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE

# Subscription Plan ID
PAYPAL_PRO_PLAN_ID=P-YOUR_PLAN_ID_HERE
```

### 5.3 Replace Placeholders
Replace these values:
- `YOUR_CLIENT_ID_HERE` → Client ID from Step 2.3
- `YOUR_SECRET_HERE` → Secret from Step 2.3
- `YOUR_PLAN_ID_HERE` → Plan ID from Step 4.4

### Example:
```bash
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=AZ1234567890_abcdefghijklmnop
PAYPAL_CLIENT_SECRET=EL0987654321_zyxwvutsrqponmlk
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZ1234567890_abcdefghijklmnop
PAYPAL_PRO_PLAN_ID=P-1AB23456CD789012E
```

---

## Step 6: Configure Webhook (Optional for Local Testing)

### 6.1 Use ngrok for Local Testing
Since PayPal can't reach localhost, use ngrok:

```bash
# Install ngrok
brew install ngrok
# or download from https://ngrok.com/

# Start ngrok tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 6.2 Add Webhook in PayPal
1. Go to **PayPal Developer Dashboard** → **Apps & Credentials**
2. Click your **"BrandProbe Sandbox"** app
3. Scroll down to **"Webhooks"** section
4. Click **"Add Webhook"**
5. **Webhook URL:** `https://abc123.ngrok.io/api/paypal/webhook`
6. **Event types:** Select these:
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `BILLING.SUBSCRIPTION.ACTIVATED`
   - ✅ `BILLING.SUBSCRIPTION.CANCELLED`
   - ✅ `BILLING.SUBSCRIPTION.SUSPENDED`
   - ✅ `BILLING.SUBSCRIPTION.EXPIRED`
7. Click **"Save"**

**Note:** For production, replace ngrok URL with your actual domain.

---

## Step 7: Test Your Setup

### 7.1 Start Your App
```bash
npm run dev
```

### 7.2 Test Starter Payment ($9 One-Time)

1. Generate a free report on your site
2. Click **"Unlock for $9"** button
3. You'll be redirected to PayPal sandbox
4. Log in with **Personal Account** (buyer) credentials
5. Complete payment
6. You should be redirected back with success message

### 7.3 Test Pro Subscription ($29/Month)

1. Click **"Get Pro - $29/mo"** button
2. Log in to PayPal sandbox
3. Approve subscription
4. Check if user is upgraded to Pro tier

### 7.4 Verify in Database

Check your Supabase database:
```sql
SELECT email, subscription_status, subscription_id, one_time_purchase_id
FROM users
WHERE email = 'YOUR_TEST_EMAIL';
```

Should show:
- **Starter:** `subscription_status = 'starter'`, `one_time_purchase_id` filled
- **Pro:** `subscription_status = 'active'`, `subscription_id` filled

---

## 🧪 Test Accounts Reference

### Personal Account (Buyer)
Use these to make test payments:
- **Email:** [From Step 3.2 - check your sandbox accounts]
- **Password:** [From Step 3.2]

### Business Account (Seller)
This receives payments:
- **Email:** [From Step 3.2]
- **Password:** [From Step 3.2]

---

## 🔍 Debugging Tips

### Can't Find Subscription Plans?
- Make sure you're logged into **Business Account** in **sandbox.paypal.com**
- Not the Developer Dashboard

### "Plan Not Found" Error?
- Verify Plan ID starts with `P-`
- Check plan is **Activated** in PayPal
- Confirm `PAYPAL_PRO_PLAN_ID` matches exactly

### Webhook Not Working?
- Check ngrok is running: `ngrok http 3000`
- Verify webhook URL in PayPal includes `/api/paypal/webhook`
- Check event types are selected

### Payment Not Completing?
- Check browser console for errors
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set (client-side needs this)
- Make sure PayPal SDK loaded (check Network tab)

---

## 📝 Checklist

- [ ] Created PayPal Developer Account
- [ ] Created Sandbox App
- [ ] Copied Client ID and Secret
- [ ] Found/Created Test Accounts
- [ ] Created Subscription Plan for Pro tier
- [ ] Copied Plan ID
- [ ] Added all credentials to `.env.local`
- [ ] Tested Starter payment ($9)
- [ ] Tested Pro subscription ($29/mo)
- [ ] Verified database updates
- [ ] (Optional) Configured webhook with ngrok

---

## 🎉 You're Done!

Your PayPal sandbox is now configured and ready for testing!

**Next Steps:**
1. Test payment flows thoroughly
2. Check email notifications (if configured)
3. Test subscription cancellation
4. When ready, switch to production credentials

---

## 🚀 Going to Production

When ready to go live:

1. **Create Production App:**
   - PayPal Developer → Apps & Credentials → **Production** tab
   - Create new app
   - Get production Client ID & Secret

2. **Create Production Subscription Plan:**
   - Log in to **live PayPal Business Account**
   - Create same plan as sandbox
   - Get production Plan ID

3. **Update .env.local:**
   ```bash
   PAYPAL_MODE=production
   PAYPAL_CLIENT_ID=PRODUCTION_CLIENT_ID
   PAYPAL_CLIENT_SECRET=PRODUCTION_SECRET
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=PRODUCTION_CLIENT_ID
   PAYPAL_PRO_PLAN_ID=PRODUCTION_PLAN_ID
   ```

4. **Update Webhook:**
   - Use real domain instead of ngrok
   - `https://brandprobe.com/api/paypal/webhook`

---

## 💡 Pro Tips

1. **Keep Sandbox Separate:** Don't mix sandbox and production credentials
2. **Test Thoroughly:** Try failed payments, cancellations, etc.
3. **Monitor Webhooks:** Check PayPal webhook logs for delivery status
4. **Email Confirmations:** Test that users receive payment confirmations
5. **Refund Flow:** Test refunds before going live

---

Need help? Check:
- PayPal Developer Docs: https://developer.paypal.com/docs/
- Sandbox Accounts: https://developer.paypal.com/dashboard/accounts
- Webhook Events: https://developer.paypal.com/docs/api-basics/notifications/webhooks/event-names/

Happy testing! 🎉
