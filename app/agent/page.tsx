'use client';

import { useState, useEffect } from 'react';
import { AgentExecutor } from 'langchain/agents';
import ChatInterface from '@/components/ChatInterface';
import { createAgent, runAgent } from '@/lib/agent/agent';

export default function AgentPage() {
  const [agentExecutor, setAgentExecutor] = useState<AgentExecutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [manualKeyMode, setManualKeyMode] = useState(false);

  // Initialize agent on component mount
  useEffect(() => {
    async function initAgent() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Create agent using the API key from environment variables
        const executor = await createAgent();
        setAgentExecutor(executor);
      } catch (err) {
        console.error('Error initializing agent:', err);
        setError('Failed to initialize agent. Please check your OpenAI API key in the .env file or enter it manually below.');
        setAgentExecutor(null);
        // Enable manual key mode if environment variable fails
        setManualKeyMode(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAgent();
  }, []);

  // Handle manual API key submission
  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const executor = await createAgent(apiKey);
      setAgentExecutor(executor);
      setManualKeyMode(false);
    } catch (err) {
      console.error('Error initializing agent with manual key:', err);
      setError('Failed to initialize agent with the provided API key. Please check that it is valid.');
      setAgentExecutor(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle running the agent
  const handleRunAgent = async (query: string) => {
    if (!agentExecutor) {
      return 'The AI assistant is not available. Please check the OpenAI API key.';
    }
    
    try {
      return await runAgent(agentExecutor, query);
    } catch (err) {
      console.error('Error running agent:', err);
      return 'Sorry, I encountered an error while processing your request.';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">RoelasWorkForce AI Agent</h1>
      
      {/* Status Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">AI Assistant Status</h2>
        
        {isLoading && (
          <div className="p-3 bg-blue-100 text-blue-700 rounded">
            <p>Initializing AI assistant...</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && agentExecutor && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            <p>AI assistant is ready! You can now ask questions about employees.</p>
          </div>
        )}
        
        {/* Manual API Key Form */}
        {manualKeyMode && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Enter OpenAI API Key Manually</h3>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <div className="flex">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Use This Key'}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Your API key is only stored in your browser and is never sent to our servers.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Chat Interface */}
      <div className="h-[600px]">
        <ChatInterface
          agentExecutor={agentExecutor}
          onRunAgent={handleRunAgent}
        />
      </div>
      
      {/* Example Queries */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Example Queries</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>List all employees</li>
          <li>Get details for employee with ID 1</li>
          <li>Create a new employee named John Doe with email john@example.com and phone 123-456-7890</li>
          <li>Update the name of employee with ID 1 to Jane Smith</li>
          <li>Delete employee with ID 2</li>
          <li>Add a monthly record for employee 1 with 2 weekends and 1 holiday worked</li>
          <li>Add monthly record for employee ID 2 with 3 weekends worked and 2 holidays worked for April 2023</li>
          <li>Show me the database schema</li>
        </ul>
      </div>
      
      {/* Monthly Record Tool Examples */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Monthly Record Tool Examples</h2>
        <p className="mb-2 text-gray-700">Here are some examples of how to use the monthly record tool:</p>
        
        <div className="bg-gray-50 p-3 rounded mb-3">
          <p className="font-medium">Basic usage:</p>
          <p className="text-blue-600 italic">"Add a monthly record for employee 1 with 2 weekends and 1 holiday worked"</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded mb-3">
          <p className="font-medium">Specifying month and year:</p>
          <p className="text-blue-600 italic">"Add monthly record for employee ID 2 with 3 weekends worked and 2 holidays worked for April 2023"</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded mb-3">
          <p className="font-medium">Adding notes:</p>
          <p className="text-blue-600 italic">"Add a monthly record for employee 3 with 1 weekend and 0 holidays worked with notes: Extra shift on Saturday"</p>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">Note: The tool will use the current month and year if not specified.</p>
      </div>
    </div>
  );
} 