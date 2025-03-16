import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import { MCPClient } from "../mcp/client";

// Create a client instance
const mcpClient = new MCPClient();

// Tool for listing employees
export const listEmployeesTool = new DynamicStructuredTool({
  name: "list_employees",
  description: "Lists all employees in the system",
  schema: z.object({
    filters: z.string().optional().describe("Optional JSON string with filter conditions"),
    orderBy: z.string().optional().describe("Optional JSON string with ordering options"),
  }),
  func: async ({ filters, orderBy }) => {
    try {
      const params: any = {};
      
      if (filters) {
        try {
          params.where = JSON.parse(filters);
        } catch (e: any) {
          return "Error parsing filters JSON: " + e.message;
        }
      }
      
      if (orderBy) {
        try {
          params.orderBy = JSON.parse(orderBy);
        } catch (e: any) {
          return "Error parsing orderBy JSON: " + e.message;
        }
      }
      
      const response = await mcpClient.listEmployees(params);
      
      if (response.success) {
        return JSON.stringify(response.data, null, 2);
      } else {
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
});

// Tool for getting an employee by ID
export const getEmployeeTool = new DynamicStructuredTool({
  name: "get_employee",
  description: "Gets an employee by their ID",
  schema: z.object({
    id: z.number().describe("The ID of the employee to retrieve"),
  }),
  func: async ({ id }) => {
    try {
      const response = await mcpClient.getEmployee(id);
      
      if (response.success) {
        return JSON.stringify(response.data, null, 2);
      } else {
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
});

// Tool for creating an employee
export const createEmployeeTool = new DynamicStructuredTool({
  name: "create_employee",
  description: "Creates a new employee",
  schema: z.object({
    name: z.string().describe("The full name of the employee"),
    email: z.string().describe("The email address of the employee"),
    telephone: z.string().describe("The telephone number of the employee"),
  }),
  func: async ({ name, email, telephone }) => {
    try {
      const response = await mcpClient.createEmployee({
        name,
        email,
        telephone,
      });
      
      if (response.success) {
        return `Employee created successfully with ID: ${response.data.id}`;
      } else {
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
});

// Tool for updating an employee
export const updateEmployeeTool = new DynamicStructuredTool({
  name: "update_employee",
  description: "Updates an existing employee",
  schema: z.object({
    id: z.number().describe("The ID of the employee to update"),
    data: z.string().describe("JSON string with the employee data to update"),
  }),
  func: async ({ id, data }) => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e: any) {
        return "Error parsing employee data JSON: " + e.message;
      }
      
      const response = await mcpClient.updateEmployee(id, parsedData);
      
      if (response.success) {
        return "Employee updated successfully";
      } else {
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
});

// Tool for deleting an employee
export const deleteEmployeeTool = new DynamicStructuredTool({
  name: "delete_employee",
  description: "Deletes an employee",
  schema: z.object({
    id: z.number().describe("The ID of the employee to delete"),
  }),
  func: async ({ id }) => {
    try {
      const response = await mcpClient.deleteEmployee(id);
      
      if (response.success) {
        return "Employee deleted successfully";
      } else {
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
});

// Tool for adding a monthly record to an employee
export const addMonthlyRecordTool = new DynamicStructuredTool({
  name: "add_monthly_record",
  description: "Quickly adds a monthly work record for an employee with weekends and holidays worked",
  schema: z.object({
    employeeId: z.union([z.number(), z.string()]).describe("The ID of the employee to add the record for"),
    weekendsWorked: z.union([z.number(), z.string()]).describe("Number of weekends worked in the month"),
    holidaysWorked: z.union([z.number(), z.string()]).describe("Number of holidays worked in the month"),
    year: z.union([z.number(), z.string()]).optional().describe("Year of the record (defaults to current year if not provided)"),
    month: z.union([z.number(), z.string()]).optional().describe("Month of the record (1-12, defaults to current month if not provided)"),
    notes: z.string().optional().describe("Optional notes about the record"),
  }),
  func: async ({ employeeId, weekendsWorked, holidaysWorked, year, month, notes }) => {
    try {
      // Convert inputs to appropriate types
      const employeeIdNum = Number(employeeId);
      const weekendsWorkedNum = Number(weekendsWorked);
      const holidaysWorkedNum = Number(holidaysWorked);
      
      // Validate conversions
      if (isNaN(employeeIdNum)) {
        return "Error: Employee ID must be a valid number";
      }
      
      if (isNaN(weekendsWorkedNum)) {
        return "Error: Weekends worked must be a valid number";
      }
      
      if (isNaN(holidaysWorkedNum)) {
        return "Error: Holidays worked must be a valid number";
      }
      
      let yearNum = undefined;
      if (year !== undefined) {
        yearNum = Number(year);
        if (isNaN(yearNum)) {
          return "Error: Year must be a valid number";
        }
      }
      
      let monthNum = undefined;
      if (month !== undefined) {
        monthNum = Number(month);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return "Error: Month must be a valid number between 1 and 12";
        }
      }
      
      // Get employee details first to show rates in the response
      const employeeResponse = await mcpClient.getEmployee(employeeIdNum);
      
      if (!employeeResponse.success) {
        return "Error: " + (employeeResponse.error || `Employee with ID ${employeeIdNum} not found`);
      }
      
      const employee = employeeResponse.data;
      
      // Add the monthly record
      const response = await mcpClient.addQuickMonthlyRecord({
        employeeId: employeeIdNum,
        weekendsWorked: weekendsWorkedNum,
        holidaysWorked: holidaysWorkedNum,
        year: yearNum,
        month: monthNum,
        notes: notes || undefined,
      });
      
      if (response.success) {
        const record = response.data;
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        // Format currency
        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(amount);
        };
        
        return `
Monthly record added successfully for ${employee.name}:
- Period: ${monthNames[record.month - 1]} ${record.year}
- Weekends Worked: ${record.weekendsWorked} (Rate: ${formatCurrency(employee.weekendRate)})
- Holidays Worked: ${record.holidaysWorked} (Rate: ${formatCurrency(employee.holidayRate)})
- Weekend Amount: ${formatCurrency(record.weekendAmount)}
- Holiday Amount: ${formatCurrency(record.holidayAmount)}
- Total Amount: ${formatCurrency(record.totalAmount)}
${notes ? `- Notes: ${notes}` : ''}
        `;
      } else {
        if (response.data) {
          // If there's already a record, show its details
          const existingRecord = response.data;
          const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          
          // Format currency
          const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(amount);
          };
          
          return `
Error: ${response.error}

Existing record details:
- Period: ${monthNames[existingRecord.month - 1]} ${existingRecord.year}
- Weekends Worked: ${existingRecord.weekendsWorked}
- Holidays Worked: ${existingRecord.holidaysWorked}
- Weekend Amount: ${formatCurrency(existingRecord.weekendAmount)}
- Holiday Amount: ${formatCurrency(existingRecord.holidayAmount)}
- Total Amount: ${formatCurrency(existingRecord.totalAmount)}
${existingRecord.notes ? `- Notes: ${existingRecord.notes}` : ''}
          `;
        }
        
        return "Error: " + (response.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error in addMonthlyRecordTool:", error);
      return "Error: " + (error.message || "Unknown error occurred while adding monthly record");
    }
  },
});

// Tool for getting the MCP schema
export const getMCPSchemaTool = new DynamicStructuredTool({
  name: "get_mcp_schema",
  description: "Gets the MCP schema with information about available entities and operations",
  schema: z.object({}),
  func: async () => {
    try {
      const schema = await mcpClient.getSchema();
      return JSON.stringify(schema, null, 2);
    } catch (error: any) {
      return "Error: " + (error.message || "Unknown error");
    }
  },
}); 