# Shareable Links Implementation

This document describes the shareable link system with expiration for BrandProbe reports.

## Overview

The shareable link system allows report owners to create time-limited (or permanent) share links that grant full access to their reports without requiring authentication. This is useful for sharing reports with clients, team members, or stakeholders.

## Features

- **Expiration Options**: Links can expire after 1, 3, 5, or 7 days, or never expire
- **Short Tokens**: Uses 8-character alphanumeric tokens for clean, shareable URLs
- **Secure**: Only report owners can create share links
- **Access Control**: Valid share tokens grant full access to all report sections
- **Easy Sharing**: Modal interface with copy-to-clipboard functionality

## Components Created

### 1. Database Migration
**File**: `/supabase/migrations/20260304000000_add_report_shares.sql`

Creates the `report_shares` table with:
- `id` (UUID): Primary key
- `report_id` (UUID): Foreign key to reports table
- `share_token` (TEXT): Unique 8-character alphanumeric token
- `expires_at` (TIMESTAMP): When the link expires (null = never)
- `created_at` (TIMESTAMP): When the share was created
- `created_by` (TEXT): Email of the user who created the share

Includes indexes for optimized lookups on `report_id`, `share_token`, and `expires_at`.

### 2. API Endpoints

#### Create Share Link
**Endpoint**: `POST /api/share/create`

**Request Body**:
```json
{
  "reportId": "uuid-of-report",
  "expirationDays": 7  // or 1, 3, 5, 7, or null for never
}
```

**Response**:
```json
{
  "success": true,
  "shareUrl": "https://brandprobe.com/report/{id}?share={token}",
  "shareToken": "abc123XY",
  "expiresAt": "2026-03-11T12:00:00.000Z"  // or null
}
```

**Features**:
- Verifies user authentication
- Validates report ownership
- Generates cryptographically random 8-character token
- Ensures token uniqueness
- Creates database record
- Returns full share URL

#### Validate Share Link
**Endpoint**: `GET /api/share/validate?reportId={id}&token={token}`

**Response**:
```json
{
  "success": true,
  "valid": true,
  "expiresAt": "2026-03-11T12:00:00.000Z",
  "createdBy": "user@example.com"
}
```

Or if invalid:
```json
{
  "success": true,
  "valid": false,
  "reason": "Share link has expired"
}
```

**Features**:
- Looks up share record by report ID and token
- Checks expiration status
- Returns validation result with details

### 3. ShareModal Component
**File**: `/src/components/ShareModal.tsx`

A modal dialog for creating and managing share links with:
- Radio buttons for expiration options (1, 3, 5, 7 days, Never)
- Generate button that calls the create API
- Display of generated link with copy button
- Expiration date/time display
- Success and error states
- Smooth animations using Framer Motion

**Usage**:
```tsx
<ShareModal
  isOpen={showShareModal}
  onClose={() => setShowShareModal(false)}
  reportId={reportId}
/>
```

### 4. Report Page Integration
**File**: `/src/app/report/[id]/page.tsx`

**Changes**:
- Added `ShareModal` component import
- Added `showShareModal` state
- Modified `handleShare` to open modal instead of just copying link
- Integrated modal component into page

### 5. Report API Update
**File**: `/src/app/api/report/[id]/route.ts`

**Changes**:
- Checks for `?share=` query parameter
- Validates share token if present
- Checks expiration status
- Grants `hasFullAccess` if share token is valid
- Falls back to existing owner-based access logic

## How It Works

### Creating a Share Link

1. User clicks the share button on a report page
2. ShareModal opens with expiration options
3. User selects expiration time (or "Never")
4. User clicks "Generate Link"
5. API validates user owns the report
6. API generates random 8-character token using `crypto.randomBytes`
7. API creates record in `report_shares` table
8. API returns share URL: `/report/{id}?share={token}`
9. Modal displays URL with copy button
10. User copies and shares the link

### Accessing a Shared Report

1. Recipient opens shared link: `/report/{id}?share={token}`
2. Report page loads and fetches report data
3. Report API (`GET /api/report/[id]`) receives request
4. API extracts `share` query parameter
5. API looks up share record in database
6. API validates token matches and hasn't expired
7. If valid, API sets `hasFullAccess = true`
8. Report page displays all 10 sections (including paid sections)
9. Recipient can view full report without authentication

### Token Generation

Tokens are generated using Node's `crypto.randomBytes`:
- 8 bytes of random data
- Converted to alphanumeric characters (a-z, A-Z, 0-9)
- Results in 8-character token like "aB3xY9Tz"
- Uniqueness is verified before insertion

### Expiration Logic

- If `expirationDays` is provided, expiration date = now + days
- If `expirationDays` is null, `expires_at` is null (never expires)
- Validation checks if current time > `expires_at`
- Expired links return `valid: false` with reason

## Testing Instructions

### 1. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply directly to Supabase
psql $DATABASE_URL -f supabase/migrations/20260304000000_add_report_shares.sql
```

### 2. Test Share Link Creation

1. Generate a report (or use existing report)
2. Ensure you're logged in as the report owner
3. Click the share button on the report page
4. Select expiration time (e.g., 7 days)
5. Click "Generate Link"
6. Verify link appears with copy button
7. Verify expiration date is shown correctly

### 3. Test Share Link Access

1. Copy the generated share URL
2. Open in incognito/private browser window (not logged in)
3. Navigate to the share URL
4. Verify full report loads with all 10 sections
5. Verify no paywall or locked sections appear

### 4. Test Expiration

To test expiration without waiting:

1. Manually update database:
```sql
UPDATE report_shares
SET expires_at = NOW() - INTERVAL '1 day'
WHERE share_token = 'your-token';
```

2. Try accessing the share link
3. Verify access is denied or limited

### 5. Test Invalid Tokens

1. Modify token in URL (e.g., change one character)
2. Try accessing report
3. Verify fallback to free tier (4 sections visible)

## Security Considerations

1. **Token Entropy**: 8-character alphanumeric = 62^8 ≈ 218 trillion combinations
2. **Unique Tokens**: Database constraint ensures no duplicates
3. **Ownership Verification**: Only report owners can create shares
4. **Expiration**: Time-limited links reduce long-term exposure
5. **No Authentication Required**: Share links bypass auth for easier sharing
6. **Cascading Deletes**: Shares are deleted when reports are deleted

## Future Enhancements

Potential additions for future versions:

1. **Share Management UI**: View/revoke existing shares
2. **Usage Analytics**: Track views per share link
3. **Password Protection**: Optional password for share links
4. **View Limits**: Expire after N views
5. **Custom Expiration**: Allow users to set specific date/time
6. **Share History**: Show when/how many times link was accessed
7. **Notification**: Email owner when share link is accessed
8. **Bulk Sharing**: Create multiple links at once

## Troubleshooting

### Share Link Not Working

1. Check database migration ran successfully:
```sql
SELECT * FROM report_shares LIMIT 1;
```

2. Verify share record exists:
```sql
SELECT * FROM report_shares WHERE share_token = 'your-token';
```

3. Check expiration:
```sql
SELECT *, expires_at < NOW() as expired FROM report_shares WHERE share_token = 'your-token';
```

### "Unauthorized" Error When Creating Share

- Ensure user is authenticated (has valid session cookie)
- Verify user owns the report
- Check browser console for detailed error messages

### Modal Not Opening

- Check ShareModal import in report page
- Verify showShareModal state is being set
- Check browser console for React errors

## API Error Codes

- `400`: Invalid request (missing reportId, invalid expirationDays)
- `401`: Unauthorized (user not logged in)
- `403`: Forbidden (user doesn't own report)
- `404`: Report not found
- `500`: Server error (database error, token generation failed)

## Database Queries

### Find All Shares for a Report
```sql
SELECT * FROM report_shares WHERE report_id = 'report-uuid';
```

### Find Expired Shares
```sql
SELECT * FROM report_shares WHERE expires_at < NOW();
```

### Delete Expired Shares
```sql
DELETE FROM report_shares WHERE expires_at < NOW();
```

### Count Shares by User
```sql
SELECT created_by, COUNT(*) as share_count
FROM report_shares
GROUP BY created_by;
```
