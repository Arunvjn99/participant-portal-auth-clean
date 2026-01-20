# Voice API Server

Backend proxy server for Google Speech-to-Text and Text-to-Speech APIs.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Google Cloud credentials:
   - Create a service account in Google Cloud Console
   - Download the JSON credentials file
   - Set `GOOGLE_CLOUD_CREDENTIALS` environment variable with the JSON content
   - Or set `GOOGLE_APPLICATION_CREDENTIALS` to point to the credentials file

3. Set environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

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

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "services": {
    "stt": true,
    "tts": true
  }
}
```

## Security

- API keys are stored only in environment variables
- Never logs raw audio or transcripts
- Never stores audio recordings
- Sanitizes text for TTS (masks sensitive data)
