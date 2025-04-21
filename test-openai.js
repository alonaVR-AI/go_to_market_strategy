import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the .env.local file directly
const envPath = join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKey = envContent.split('=')[1].trim();

console.log('API Key being used:', apiKey);

// Create an OpenAI API client with explicit configuration
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.openai.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: undefined,
  organization: undefined, // Add your org ID here if you have one
});

const testOpenAI = async () => {
  try {
    console.log('Making request to OpenAI...');
    
    // First, test the models endpoint
    console.log('Testing models endpoint...');
    const models = await openai.models.list();
    console.log('Models available:', models.data.length);

    // Then test chat completion
    console.log('\nTesting chat completion...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello!' }],
      temperature: 0.7,
      max_tokens: 100,
    });

    console.log('Response from OpenAI:', completion.choices[0].message);
  } catch (err) {
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.status,
      headers: err.response?.headers
    });
  }
};

testOpenAI(); 