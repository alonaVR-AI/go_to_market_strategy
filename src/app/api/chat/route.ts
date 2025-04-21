import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// CORS headers for API routes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Set edge runtime
export const runtime = 'edge';

export async function POST(req: Request) {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', { status: 500 });
  }

  try {
    // Parse request body
    const { messages } = await req.json();

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      stream: true,
      max_tokens: 1000
    });

    // Create stream from completion
    // @ts-ignore - OpenAI stream types are not compatible with Vercel AI SDK
    const stream = OpenAIStream(completion);

    // Return streaming response
    return new StreamingTextResponse(stream, {
      headers: corsHeaders
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.response?.data || error.cause || error.stack,
        status: error.status || 500
      }),
      {
        status: error.status || 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
} 