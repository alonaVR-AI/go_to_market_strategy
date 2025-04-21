# Marketing Strategy Builder

A Next.js application for building comprehensive go-to-market strategies using AI.

## Features

- AI-powered GTM strategy building
- Real-time chat interface
- Voice input support
- Image generation capabilities
- Text-to-speech functionality

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Firebase (Authentication & Storage)
- OpenAI API
- Anthropic API
- Replicate API
- Deepgram API
- ElevenLabs API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/alonaVR-AI/Marketing.git
cd Marketing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration values

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

- `OPENAI_API_KEY`: Your OpenAI API key
- `ELEVENLABS_API_KEY`: Your ElevenLabs API key
- Firebase configuration (if using Firebase features)
- `DEEPGRAM_API_KEY`: Your Deepgram API key (if using voice features)

## Deployment

This project is configured for deployment on Vercel. Simply push to your repository and Vercel will automatically deploy your application.

## License

MIT