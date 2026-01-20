# Production Deployment Guide

## Overview

This application uses Netlify Functions for backend API endpoints. All voice features (STT, TTS, LLM) are implemented as serverless functions with production-grade safeguards.

## Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### Required Variables

```bash
# Google Cloud credentials (JSON string)
GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account",...}'

# CORS origins (comma-separated)
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Site URL for CORS
SITE_URL=https://your-domain.com
```

### Feature Kill Switches (Runtime Control)

```bash
# Enable/disable services (default: enabled if not set)
STT_ENABLED=true|false
TTS_ENABLED=true|false
LLM_ENABLED=true|false
```

**Note**: These can be changed in Netlify Dashboard without redeployment to instantly disable features.

## Rate Limits

Built-in rate limiting per user/IP:
- **STT**: 30 requests/minute
- **TTS**: 30 requests/minute
- **LLM**: 20 requests/minute

Rate limit headers returned:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Timeouts

Automatic timeouts enforced:
- **STT**: 10 seconds
- **TTS**: 10 seconds
- **LLM**: 8 seconds

On timeout, request is cancelled and user-friendly error returned.

## Security Features

### CORS
- Restricted to allowed origins from `ALLOWED_ORIGINS`
- Development: `http://localhost:5173`, `http://localhost:3000`

### Security Headers
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### Audit Logging
Only safe metadata is logged:
- Task type (loan, enrollment)
- Step entered
- Action type
- Error codes

**Never logged**:
- Audio content
- Transcripts
- SSN
- Bank account numbers
- Personal data

## Local Development

### Option 1: Netlify Dev (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local dev server with functions
netlify dev
```

This starts:
- Frontend on `http://localhost:8888`
- Functions proxy on `http://localhost:8888/.netlify/functions`

### Option 2: Separate Servers

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start Netlify Dev (functions only)
netlify dev --live=false --port=8888
```

## Deployment

### Automatic Deployment (Git Integration)

1. Connect your Git repository to Netlify
2. Set environment variables in Netlify Dashboard
3. Netlify will auto-deploy on push to main branch

### Manual Deployment

```bash
# Build
npm run build

# Deploy
netlify deploy --prod
```

## Monitoring

### Function Logs

View logs in Netlify Dashboard → Functions → Logs

### Audit Events

Audit events are logged to function console. Look for:
- `[AUDIT]` prefix in logs
- JSON structure with safe metadata only

## Kill Switch Usage

To instantly disable voice features:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Set `STT_ENABLED=false` (or `TTS_ENABLED=false`, `LLM_ENABLED=false`)
3. Save (no redeployment needed)
4. Functions will return 503 with user-friendly message

## Cost Control

### Rate Limiting
- Prevents abuse and controls costs
- Limits reset per minute window

### Timeouts
- Prevent runaway requests
- Cancel requests that exceed limits

### Kill Switches
- Instantly disable services
- No redeployment required
- Prevents unexpected costs

## Troubleshooting

### Functions Not Working

1. Check environment variables are set
2. Verify `GOOGLE_CLOUD_CREDENTIALS` is valid JSON
3. Check function logs for errors
4. Verify CORS settings match your domain

### Rate Limit Errors

- Check `X-RateLimit-Reset` header for retry time
- Rate limits are per-user/IP
- Consider implementing authenticated rate limiting with user IDs

### Timeout Errors

- Check network connectivity
- Verify Google Cloud API is accessible
- Consider increasing timeout if needed (update `TIMEOUTS` constants)

## Production Checklist

- [ ] All environment variables set
- [ ] CORS origins configured
- [ ] Google Cloud credentials configured
- [ ] Kill switches tested (disable/enable features)
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] Audit logging verified (check logs)
- [ ] Error handling tested
- [ ] Timeout behavior tested
