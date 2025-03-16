import { prisma } from '../prisma';

// Define the schema for the Employee entity
export const employeeSchema = {
  name: 'Employee',
  description: 'Represents an employee in the system',
  properties: {
    id: {
      type: 'integer',
      description: 'Unique identifier for the employee',
      required: false, // Not required for creation as it's auto-generated
    },
    name: {
      type: 'string',
      description: 'Full name of the employee',
      required: true,
    },
    email: {
      type: 'string',
      description: 'Email address of the employee (must be unique)',
      required: true,
    },
    telephone: {
      type: 'string',
      description: 'Contact telephone number of the employee',
      required: true,
    },
    // Add other fields based on your Employee model
  },
  actions: {
    list: {
      description: 'Get a list of all employees',
      params: {
        orderBy: {
          type: 'object',
          description: 'Ordering options',
          required: false,
        },
        where: {
          type: 'object',
          description: 'Filter conditions',
          required: false,
        },
      },
    },
    get: {
      description: 'Get a single employee by ID',
      params: {
        id: {
          type: 'integer',
          description: 'Employee ID',
          required: true,
        },
      },
    },
    create: {
      description: 'Create a new employee',
      data: {
        type: 'object',
        description: 'Employee data',
        required: true,
        properties: {
          name: { type: 'string', required: true },
          email: { type: 'string', required: true },
          telephone: { type: 'string', required: true },
          // Add other required fields
        },
      },
    },
    update: {
      description: 'Update an existing employee',
      params: {
        id: {
          type: 'integer',
          description: 'Employee ID',
          required: true,
        },
      },
      data: {
        type: 'object',
        description: 'Employee data to update',
        required: true,
      },
    },
    delete: {
      description: 'Delete an employee',
      params: {
        id: {
          type: 'integer',
          description: 'Employee ID',
          required: true,
        },
      },
    },
  },
};

// Define the schema for the MonthlyWorkRecord entity
export const monthlyWorkRecordSchema = {
  name: 'MonthlyWorkRecord',
  description: 'Represents a monthly work record for an employee',
  properties: {
    id: {
      type: 'integer',
      description: 'Unique identifier for the record',
      required: false, // Not required for creation as it's auto-generated
    },
    employeeId: {
      type: 'integer',
      description: 'ID of the employee this record belongs to',
      required: true,
    },
    year: {
      type: 'integer',
      description: 'Year of the record',
      required: true,
    },
    month: {
      type: 'integer',
      description: 'Month of the record (1-12)',
      required: true,
    },
    weekendsWorked: {
      type: 'integer',
      description: 'Number of weekends worked in the month',
      required: true,
    },
    holidaysWorked: {
      type: 'integer',
      description: 'Number of holidays worked in the month',
      required: true,
    },
    notes: {
      type: 'string',
      description: 'Optional notes about the record',
      required: false,
    },
  },
  actions: {
    list: {
      description: 'Get a list of all monthly work records',
      params: {
        orderBy: {
          type: 'object',
          description: 'Ordering options',
          required: false,
        },
        where: {
          type: 'object',
          description: 'Filter conditions',
          required: false,
        },
      },
    },
    getByEmployee: {
      description: 'Get monthly work records for a specific employee',
      params: {
        employeeId: {
          type: 'integer',
          description: 'Employee ID',
          required: true,
        },
        year: {
          type: 'integer',
          description: 'Filter by year',
          required: false,
        },
        month: {
          type: 'integer',
          description: 'Filter by month',
          required: false,
        },
      },
    },
    get: {
      description: 'Get a single monthly work record by ID',
      params: {
        id: {
          type: 'integer',
          description: 'Record ID',
          required: true,
        },
      },
    },
    create: {
      description: 'Create a new monthly work record',
      data: {
        type: 'object',
        description: 'Monthly work record data',
        required: true,
        properties: {
          employeeId: { type: 'integer', required: true },
          year: { type: 'integer', required: true },
          month: { type: 'integer', required: true },
          weekendsWorked: { type: 'integer', required: true },
          holidaysWorked: { type: 'integer', required: true },
          notes: { type: 'string', required: false },
        },
      },
    },
    addQuickRecord: {
      description: 'Quickly add a monthly work record for an employee',
      data: {
        type: 'object',
        description: 'Quick monthly work record data',
        required: true,
        properties: {
          employeeId: { type: 'integer', required: true },
          year: { type: 'integer', required: true },
          month: { type: 'integer', required: true },
          weekendsWorked: { type: 'integer', required: true },
          holidaysWorked: { type: 'integer', required: true },
          notes: { type: 'string', required: false },
        },
      },
    },
    update: {
      description: 'Update an existing monthly work record',
      params: {
        id: {
          type: 'integer',
          description: 'Record ID',
          required: true,
        },
      },
      data: {
        type: 'object',
        description: 'Monthly work record data to update',
        required: true,
      },
    },
    delete: {
      description: 'Delete a monthly work record',
      params: {
        id: {
          type: 'integer',
          description: 'Record ID',
          required: true,
        },
      },
    },
  },
};

// Function to get the full MCP schema
export async function getMCPSchema() {
  return {
    version: '1.0',
    description: 'RoelasWorkForce API Schema',
    entities: {
      employee: employeeSchema,
      monthlyWorkRecord: monthlyWorkRecordSchema,
    },
  };
}

// Function to get database metadata
export async function getDatabaseMetadata() {
  try {
    // Get count of employees
    const employeeCount = await prisma.employee.count();
    
    // Get count of monthly work records
    let monthlyWorkRecordCount = 0;
    try {
      monthlyWorkRecordCount = await prisma.monthlyWorkRecord.count();
    } catch (error) {
      console.warn('Could not count monthlyWorkRecord, it might not exist yet:', error);
    }
    
    return {
      counts: {
        employees: employeeCount,
        monthlyWorkRecords: monthlyWorkRecordCount,
        // Add counts for other entities
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting database metadata:', error);
    throw error;
  }
} 