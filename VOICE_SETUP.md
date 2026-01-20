# Voice Mode Setup Guide

This guide explains how to set up Google Speech-to-Text and Text-to-Speech for the Voice Mode feature.

## Architecture

```
Frontend (React)
  ↓
Backend Proxy (Express) - /api/voice/stt, /api/voice/tts
  ↓
Google Cloud Speech APIs
```

**Security**: API keys are stored ONLY in backend environment variables. Frontend never sees keys.

## Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Google Cloud credentials:**

   Option A: Set `GOOGLE_CLOUD_CREDENTIALS` environment variable:
   ```bash
   export GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account","project_id":"your-project-id",...}'
   ```

   Option B: Use credentials file:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
   ```

4. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

5. **Start the server:**
```bash
npm start
# Or for development:
npm run dev
```

## Frontend Setup

The frontend is already configured. Vite proxy will forward `/api` requests to the backend server.

## Testing

1. Start the backend server (port 3001)
2. Start the frontend dev server (port 5173)
3. Navigate to Voice Mode (click mic icon in header)
4. Click the microphone button to start recording
5. Speak your query
6. Click again to stop and process

## API Endpoints

### POST /api/voice/stt
Speech-to-Text endpoint.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `audio` file (webm/wav)

**Response:**
```json
{
  "transcript": "user's spoken text",
  "confidence": 0.95
}
```

### POST /api/voice/tts
Text-to-Speech endpoint.

**Request:**
```json
{
  "text": "text to speak"
}
```

**Response:**
- Content-Type: `audio/mpeg`
- Body: Audio buffer (MP3)

## Security Features

- ✅ API keys stored only in backend
- ✅ No audio storage
- ✅ No logging of raw audio or transcripts
- ✅ Text sanitization for TTS (masks SSN, bank numbers)
- ✅ No auto-start mic in confirmation states
- ✅ User can interrupt audio at any time

## Troubleshooting

**Microphone access denied:**
- Check browser permissions
- Ensure HTTPS in production (required for mic access)

**STT/TTS not working:**
- Verify backend server is running
- Check Google Cloud credentials are valid
- Check browser console for errors
- Verify `/api/health` endpoint returns `{"status":"ok"}`

**CORS errors:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check backend CORS configuration

## Production Deployment

1. Deploy backend server (Node.js/Express)
2. Set environment variables in production
3. Update frontend API proxy configuration if needed
4. Ensure HTTPS (required for microphone access)
