# RoelasWorkForce MCP Agent Guide

This guide explains how to use the Model Context Protocol (MCP) implementation in RoelasWorkForce to build AI agents that can interact with the database.

## What is MCP?

Model Context Protocol (MCP) is a standardized way for AI agents to interact with databases and tools. It provides a structured interface that allows AI models to understand the available operations and data schema, making it easier to generate valid requests and interpret responses.

## MCP Endpoints

The following endpoints are available for MCP interactions:

- **Main MCP Endpoint**: `/api/mcp`
  - Accepts POST requests with MCP actions
  - Returns structured responses

- **Schema Endpoint**: `/api/mcp/schema`
  - Provides metadata about the available entities and operations
  - Returns database statistics

## MCP Request Format

All MCP requests follow this format:

```json
{
  "action": "string",  // The operation to perform (e.g., "list", "get", "create")
  "entity": "string",  // The entity to operate on (e.g., "employee", "employees")
  "params": {},        // Optional parameters for the operation
  "data": {}           // Optional data for create/update operations
}
```

## MCP Response Format

All MCP responses follow this format:

```json
{
  "success": boolean,  // Whether the operation was successful
  "data": {},          // The result data (if successful)
  "error": "string"    // Error message (if unsuccessful)
}
```

## Example Operations

### List All Employees

```json
{
  "action": "list",
  "entity": "employees"
}
```

### Get Employee by ID

```json
{
  "action": "get",
  "entity": "employee",
  "params": {
    "id": 1
  }
}
```

### Create Employee

```json
{
  "action": "create",
  "entity": "employee",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "telephone": "123-456-7890"
  }
}
```

### Update Employee

```json
{
  "action": "update",
  "entity": "employee",
  "params": {
    "id": 1
  },
  "data": {
    "name": "John Smith"
  }
}
```

### Delete Employee

```json
{
  "action": "delete",
  "entity": "employee",
  "params": {
    "id": 1
  }
}
```

## Building an AI Agent with MCP

When building an AI agent to interact with this MCP implementation, follow these steps:

1. **Fetch the Schema**: Start by fetching the schema from `/api/mcp/schema` to understand the available entities and operations.

2. **Parse User Intent**: Analyze the user's request to determine which MCP operation is needed.

3. **Construct MCP Request**: Build a valid MCP request based on the user's intent and the schema.

4. **Send Request**: Send the request to the `/api/mcp` endpoint.

5. **Process Response**: Handle the response and present the results to the user.

## Example Agent Workflow

Here's a simplified example of how an AI agent might use MCP:

1. User asks: "Show me all employees"

2. Agent fetches schema to confirm "employees" entity exists

3. Agent constructs request:
   ```json
   {
     "action": "list",
     "entity": "employees"
   }
   ```

4. Agent sends request to `/api/mcp`

5. Agent receives response with employee data and presents it to the user

## Testing the MCP Implementation

You can test the MCP implementation by visiting the `/mcp-test` page in the application. This page provides a user interface for interacting with the MCP endpoints and viewing the responses.

## Advanced Usage

### Filtering and Sorting

You can use the `params` field to add filtering and sorting options:

```json
{
  "action": "list",
  "entity": "employees",
  "params": {
    "where": {
      "name": {
        "contains": "John"
      }
    },
    "orderBy": {
      "name": "asc"
    }
  }
}
```

### Pagination

You can implement pagination using the `skip` and `take` parameters:

```json
{
  "action": "list",
  "entity": "employees",
  "params": {
    "skip": 0,
    "take": 10
  }
}
```

## Troubleshooting

If you encounter issues with the MCP implementation, check the following:

1. Ensure your request follows the correct format
2. Verify that the entity and action exist in the schema
3. Check that any required parameters or data are provided
4. Look for error messages in the response

## Further Development

To extend the MCP implementation:

1. Add new entity handlers in `lib/mcp/handler.ts`
2. Update the schema in `lib/mcp/schema.ts`
3. Add new convenience methods to `lib/mcp/client.ts` if needed 