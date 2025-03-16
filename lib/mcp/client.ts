import { MCPRequest, MCPResponse } from './handler';

/**
 * A simple client for making MCP requests
 */
export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/mcp') {
    this.baseUrl = baseUrl;
  }

  /**
   * Send an MCP request to the server
   */
  async sendRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending MCP request:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get the MCP schema
   */
  async getSchema(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/schema`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching MCP schema:', error);
      throw error;
    }
  }

  // Convenience methods for common operations

  /**
   * List all employees
   */
  async listEmployees(params?: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'list',
      entity: 'employees',
      params,
    });
  }

  /**
   * Get an employee by ID
   */
  async getEmployee(id: number): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'get',
      entity: 'employee',
      params: { id },
    });
  }

  /**
   * Create a new employee
   */
  async createEmployee(data: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'create',
      entity: 'employee',
      data,
    });
  }

  /**
   * Update an employee
   */
  async updateEmployee(id: number, data: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'update',
      entity: 'employee',
      params: { id },
      data,
    });
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(id: number): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'delete',
      entity: 'employee',
      params: { id },
    });
  }

  /**
   * List all monthly work records
   */
  async listMonthlyRecords(params?: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'list',
      entity: 'monthlyWorkRecords',
      params,
    });
  }

  /**
   * Get monthly work records for a specific employee
   */
  async getEmployeeMonthlyRecords(employeeId: number, year?: number, month?: number): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'getByEmployee',
      entity: 'monthlyWorkRecord',
      params: { employeeId, year, month },
    });
  }

  /**
   * Get a monthly work record by ID
   */
  async getMonthlyRecord(id: number): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'get',
      entity: 'monthlyWorkRecord',
      params: { id },
    });
  }

  /**
   * Create a new monthly work record
   */
  async createMonthlyRecord(data: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'create',
      entity: 'monthlyWorkRecord',
      data,
    });
  }

  /**
   * Quickly add a monthly work record for an employee
   */
  async addQuickMonthlyRecord(data: {
    employeeId: number;
    year?: number;
    month?: number;
    weekendsWorked: number;
    holidaysWorked: number;
    notes?: string;
  }): Promise<MCPResponse> {
    try {
      // Validate inputs
      if (isNaN(Number(data.employeeId)) || data.employeeId <= 0) {
        return {
          success: false,
          error: `Invalid employee ID: ${data.employeeId}. Must be a positive number.`
        };
      }

      if (isNaN(Number(data.weekendsWorked)) || data.weekendsWorked < 0) {
        return {
          success: false,
          error: `Invalid weekends worked: ${data.weekendsWorked}. Must be a non-negative number.`
        };
      }

      if (isNaN(Number(data.holidaysWorked)) || data.holidaysWorked < 0) {
        return {
          success: false,
          error: `Invalid holidays worked: ${data.holidaysWorked}. Must be a non-negative number.`
        };
      }

      // Use current year and month if not provided
      const currentDate = new Date();
      const recordData = {
        ...data,
        employeeId: Number(data.employeeId),
        weekendsWorked: Number(data.weekendsWorked),
        holidaysWorked: Number(data.holidaysWorked),
        year: data.year !== undefined ? Number(data.year) : currentDate.getFullYear(),
        month: data.month !== undefined ? Number(data.month) : currentDate.getMonth() + 1,
      };

      // Validate year and month
      if (recordData.year < 2000 || recordData.year > 2100) {
        return {
          success: false,
          error: `Invalid year: ${recordData.year}. Must be between 2000 and 2100.`
        };
      }

      if (recordData.month < 1 || recordData.month > 12) {
        return {
          success: false,
          error: `Invalid month: ${recordData.month}. Must be between 1 and 12.`
        };
      }

      console.log("Sending addQuickRecord request with data:", recordData);

      return this.sendRequest({
        action: 'addQuickRecord',
        entity: 'monthlyWorkRecord',
        data: recordData,
      });
    } catch (error) {
      console.error("Error in addQuickMonthlyRecord:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update a monthly work record
   */
  async updateMonthlyRecord(id: number, data: any): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'update',
      entity: 'monthlyWorkRecord',
      params: { id },
      data,
    });
  }

  /**
   * Delete a monthly work record
   */
  async deleteMonthlyRecord(id: number): Promise<MCPResponse> {
    return this.sendRequest({
      action: 'delete',
      entity: 'monthlyWorkRecord',
      params: { id },
    });
  }
} 