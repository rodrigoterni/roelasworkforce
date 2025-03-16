import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";
import { pull } from "langchain/hub";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  listEmployeesTool,
  getEmployeeTool,
  createEmployeeTool,
  updateEmployeeTool,
  deleteEmployeeTool,
  getMCPSchemaTool,
  addMonthlyRecordTool
} from "./mcp-tool";

// Function to create and configure the agent
export async function createAgent(apiKey?: string) {
  // Debug: Check if API key is available (only show first 5 chars for security)
  const envApiKey = process.env.OPENAI_API_KEY;
  const keyToUse = apiKey || envApiKey;
  console.log("API Key available:", keyToUse ? `${keyToUse.substring(0, 5)}...` : "No API key found");
  
  if (!keyToUse) {
    throw new Error("OpenAI API key is missing. Please check your .env file or provide a key.");
  }

  // Create the language model
  const llm = new ChatOpenAI({
    modelName: "gpt-4o", // Using a more capable model
    temperature: 0,
    openAIApiKey: keyToUse,
  });

  // Define the tools the agent can use
  const tools = [
    listEmployeesTool,
    getEmployeeTool,
    createEmployeeTool,
    updateEmployeeTool,
    deleteEmployeeTool,
    getMCPSchemaTool,
    addMonthlyRecordTool
  ];

  try {
    // Get the prompt from LangChain Hub
    const promptFromHub = await pull("hwchase17/openai-tools-agent");

    // Create the agent
    const agent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt: promptFromHub as ChatPromptTemplate,
    });

    // Create the agent executor
    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
      maxIterations: 5, // Limit the number of iterations to prevent infinite loops
    });

    return agentExecutor;
  } catch (error) {
    console.error("Error creating agent:", error);
    throw error;
  }
}

// Function to run the agent with a user query
export async function runAgent(agentExecutor: AgentExecutor, query: string) {
  try {
    console.log("Running agent with query:", query);
    const result = await agentExecutor.invoke({
      input: query,
    });
    console.log("Agent result:", result);
    return result.output;
  } catch (error: unknown) {
    console.error("Error running agent:", error);
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("Received tool input did not match expected schema")) {
        return "I encountered an error with the tool input format. Please try rephrasing your request with more specific details. For example: 'Add a monthly record for employee ID 2 with 3 weekends worked and 1 holiday worked'";
      }
      return "Error: " + error.message;
    }
    
    return "An unknown error occurred while processing your request. Please try again with a different query.";
  }
} 