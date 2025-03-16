import { NextRequest, NextResponse } from 'next/server';
import { handleMCPRequest, MCPRequest } from '@/lib/mcp/handler';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const mcpRequest: MCPRequest = await request.json();
    
    // Process the request using the MCP handler
    const response = await handleMCPRequest(mcpRequest);
    
    // Return the response
    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add a GET method to provide information about the MCP endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Model Context Protocol (MCP) endpoint',
    usage: 'Send POST requests with action, entity, and optional params/data',
    examples: [
      {
        action: 'list',
        entity: 'employees'
      },
      {
        action: 'get',
        entity: 'employee',
        params: { id: 1 }
      },
      {
        action: 'create',
        entity: 'employee',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          telephone: '123-456-7890'
          // Add other required fields based on your schema
        }
      }
    ]
  });
} 