import { NextResponse } from 'next/server';
import { getMCPSchema, getDatabaseMetadata } from '@/lib/mcp/schema';

export async function GET() {
  try {
    // Get the MCP schema
    const schema = await getMCPSchema();
    
    // Get database metadata
    const metadata = await getDatabaseMetadata();
    
    // Return the combined response
    return NextResponse.json({
      schema,
      metadata
    });
  } catch (error) {
    console.error('Error generating MCP schema:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 