'use client';

import { useState, useEffect } from 'react';
import { MCPClient } from '@/lib/mcp/client';

export default function MCPTestPage() {
  const [schema, setSchema] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    telephone: '',
  });

  const mcpClient = new MCPClient();

  // Load schema and employees on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Get schema
        const schemaResponse = await mcpClient.getSchema();
        setSchema(schemaResponse);
        
        // Get employees
        const employeesResponse = await mcpClient.listEmployees();
        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        } else {
          setError(employeesResponse.error || 'Failed to load employees');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await mcpClient.createEmployee(newEmployee);
      
      if (response.success) {
        // Reset form
        setNewEmployee({
          name: '',
          email: '',
          telephone: '',
        });
        
        // Refresh employee list
        const employeesResponse = await mcpClient.listEmployees();
        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        }
      } else {
        setError(response.error || 'Failed to create employee');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle employee deletion
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        
        const response = await mcpClient.deleteEmployee(id);
        
        if (response.success) {
          // Refresh employee list
          const employeesResponse = await mcpClient.listEmployees();
          if (employeesResponse.success) {
            setEmployees(employeesResponse.data || []);
          }
        } else {
          setError(response.error || 'Failed to delete employee');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MCP Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schema Information */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">MCP Schema</h2>
          {loading ? (
            <p>Loading schema...</p>
          ) : schema ? (
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(schema, null, 2)}
            </pre>
          ) : (
            <p>No schema available</p>
          )}
        </div>
        
        {/* Employee Form */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Telephone</label>
              <input
                type="tel"
                name="telephone"
                value={newEmployee.telephone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Employee List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Telephone</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td className="py-2 px-4 border">{employee.id}</td>
                    <td className="py-2 px-4 border">{employee.name}</td>
                    <td className="py-2 px-4 border">{employee.email}</td>
                    <td className="py-2 px-4 border">{employee.telephone}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No employees found</p>
        )}
      </div>
    </div>
  );
} 