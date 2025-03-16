import { NextResponse } from 'next/server';

export async function GET() {
  // Check if environment variables are loaded
  const dbUrl = process.env.DATABASE_URL;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    databaseUrlExists: !!dbUrl,
    openaiKeyExists: !!openaiKey,
    // Only show first 5 chars of API key for security
    openaiKeyPrefix: openaiKey ? openaiKey.substring(0, 5) + '...' : null,
    nodeEnv: process.env.NODE_ENV,
  });
} 