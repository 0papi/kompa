# Slack Logging Setup Guide

## Overview

The Kompa backend now has comprehensive Slack logging integrated throughout all major operations. This allows you to monitor your application in real-time by receiving notifications in a Slack channel.

## Features

### 1. Error Logging
- All application errors are automatically logged to Slack
- Includes error message, stack trace, endpoint, and user information
- Triggered by the global error handler middleware

### 2. User Authentication Events
- **User Registration**: Logs when new users sign up with account type and phone verification status
- Uses `slackService.logAuth('register', userId, email, additionalInfo)`

### 3. Listing Operations
- **Create Listing**: Logs new listings with title, price, location, and status
- **Update Listing**: Logs listing modifications with changed fields
- **Delete Listing**: Logs when listings are soft-deleted
- **Publish/Unpublish**: Logs status changes (PUBLISHED, DRAFT, ARCHIVED)
- Uses `slackService.logListing(action, listingId, userId, title, additionalInfo)`

### 4. Payment Method Operations
- **Create Payment Method**: Logs when providers add new payment methods
- **Update Payment Method**: Logs changes including preferred status updates
- **Delete Payment Method**: Logs payment method removals
- Uses `slackService.logPaymentMethod(action, userId, methodType, isPreferred)`

### 5. User Preferences
- **Update Preferences**: Logs changes to currency, language, and notification settings
- Uses `slackService.logPreferences(userId, changes)`

### 6. Performance Monitoring
- Automatically logs slow API requests (>2 seconds)
- Logs failed requests (4xx, 5xx errors)
- Uses `slackService.logPerformance(endpoint, method, duration, statusCode)`

## Setup Instructions

### Step 1: Create a Slack Webhook

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Kompa Backend Monitor")
4. Select your workspace
5. Go to "Incoming Webhooks" in the sidebar
6. Turn on "Activate Incoming Webhooks"
7. Click "Add New Webhook to Workspace"
8. Select the channel where you want notifications (e.g., #backend-logs)
9. Click "Allow"
10. Copy the webhook URL (it looks like: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX`)

### Step 2: Configure Environment Variable

Add the webhook URL to your `.env` file:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Important Notes:**
- If `SLACK_WEBHOOK_URL` is not set, Slack logging will be disabled
- Messages will be logged to console instead
- This allows for easy testing without Slack integration

### Step 3: Deploy

Once you've added the webhook URL to your environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. For production deployment to Fly.io:
   ```bash
   # Set the secret in Fly.io
   fly secrets set SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

   # Deploy
   fly deploy
   ```

### Step 4: Test the Integration

Test by triggering various events:

```bash
# Test error logging - try an invalid request
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Test user registration
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "account_type": "CONSUMER"
  }'

# Test listing creation (requires auth token)
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Listing",
    "description": "Test Description",
    "price": 100000,
    "city": "Accra",
    "state": "Greater Accra"
  }'
```

## Slack Message Format

All Slack messages follow a consistent format:

### Color Coding
- 🟢 **Green** (#36a64f): Success/Info messages
- 🟠 **Orange** (#ff9900): Warnings
- 🔴 **Red** (#ff0000): Errors

### Message Structure
```
[Emoji] [Title]
[Description]

Field 1: Value 1
Field 2: Value 2
...

Footer: Kompa Backend
Timestamp: [Unix timestamp]
```

### Example Messages

**User Registration:**
```
✅ New User Registration
User test@example.com register

User ID: abc-123-def
Email: test@example.com
Account Type: CONSUMER
Has Phone: No

Kompa Backend • 12:34 PM
```

**Listing Created:**
```
✅ New Listing Created
Listing "Beautiful 3BR House in Accra" created

Listing ID: listing-123
User ID: user-456
Title: Beautiful 3BR House in Accra
Status: DRAFT
Price: $150,000
Location: Accra, Greater Accra

Kompa Backend • 12:35 PM
```

**Error Occurred:**
```
❌ Error Occurred
Listing not found

Error: Listing not found
Context: GET /api/v1/listings/invalid-id
Endpoint: GET /api/v1/listings/invalid-id
User: user-123
Stack Trace: ```
Error: Listing not found
    at ListingService.getListingById (listing.service.ts:45:11)
    ...
```

Kompa Backend • 12:36 PM
```

## Available Logging Methods

### SlackService Methods

```typescript
import { slackService, SlackLogLevel } from '@/services/slack.service';

// Generic logging
await slackService.log(
  SlackLogLevel.INFO,
  'Custom Event',
  'Something happened',
  [{ title: 'Field', value: 'Value' }]
);

// Error logging
await slackService.logError(
  error,
  'Context description',
  { userId: '123', action: 'create' }
);

// Authentication events
await slackService.logAuth(
  'register' | 'login' | 'logout' | 'verify_email',
  userId,
  email,
  { additionalField: 'value' }
);

// Listing operations
await slackService.logListing(
  'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'archive',
  listingId,
  userId,
  title,
  { additionalField: 'value' }
);

// Payment methods
await slackService.logPaymentMethod(
  'create' | 'update' | 'delete',
  userId,
  methodType,
  isPreferred
);

// User preferences
await slackService.logPreferences(
  userId,
  { preferredCurrency: 'GHS', preferredLanguage: 'en' }
);

// Bookmarks (for future implementation)
await slackService.logBookmark(
  'create' | 'delete',
  userId,
  listingId
);

// Database operations
await slackService.logDatabase(
  'migration' | 'seed' | 'backup' | 'restore',
  'started' | 'completed' | 'failed',
  'Optional details'
);

// Performance monitoring
await slackService.logPerformance(
  endpoint,
  method,
  duration,
  statusCode
);
```

## Coverage Summary

✅ **Implemented:**
- Error handling (all errors)
- User registration
- Listing create/update/delete/status changes
- Payment method create/update/delete
- User preferences updates

⏳ **Ready for Implementation:**
- Bookmark operations (when bookmark feature is built)
- Database operations (migrations, backups)
- Performance monitoring (slow requests)
- User login/logout events
- Email verification events

## Disabling Slack Logging

To disable Slack logging (e.g., for local development):

1. Remove or comment out `SLACK_WEBHOOK_URL` from your `.env` file
2. The service will automatically detect this and log to console instead
3. All logs will appear as: `[Slack] Logging disabled - Message: {...}`

## Best Practices

1. **Keep webhook URL secret**: Never commit it to version control
2. **Use appropriate channels**: Create dedicated channels for different environments
   - `#backend-logs-dev` for development
   - `#backend-logs-staging` for staging
   - `#backend-logs-prod` for production
3. **Monitor but don't spam**: The service already filters out normal successful requests
4. **Set up alerts**: Configure Slack to notify on-call engineers for errors
5. **Regular review**: Check logs regularly to catch patterns or recurring issues

## Troubleshooting

### Logs not appearing in Slack

1. Check that `SLACK_WEBHOOK_URL` is set correctly in your environment
2. Verify the webhook URL is valid by testing with curl:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H 'Content-Type: application/json' \
     -d '{"text": "Test message"}'
   ```
3. Check server logs for Slack service errors
4. Ensure your Slack app has permission to post to the channel

### Too many notifications

1. Adjust the performance threshold in `slack.service.ts` (currently 2000ms)
2. Filter out specific event types if needed
3. Create separate channels for different log levels
4. Use Slack's notification settings to customize alerts

### Messages not formatted correctly

1. Slack uses markdown formatting - check field values for special characters
2. Long stack traces are truncated to 1000 characters
3. JSON objects are stringified and truncated to 500 characters

## Future Enhancements

Planned features for future releases:

- [ ] Aggregate similar errors to prevent spam
- [ ] Daily/weekly summary reports
- [ ] Custom notification rules per event type
- [ ] Integration with monitoring tools (Sentry, DataDog)
- [ ] Structured logging with searchable metadata
- [ ] Rate limiting for high-frequency events
- [ ] Custom Slack slash commands for querying logs

## Support

For issues or questions about Slack logging:
1. Check this documentation first
2. Review the `slack.service.ts` source code
3. Check Slack API documentation: https://api.slack.com/messaging/webhooks
