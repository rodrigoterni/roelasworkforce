import { prisma } from '../prisma';

// Define the types for MCP requests and responses
export type MCPRequest = {
  action: string;
  entity: string;
  params?: any;
  data?: any;
};

export type MCPResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

// Main MCP handler function
export async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  try {
    const { action, entity, params, data } = request;
    
    // Validate the request
    if (!action || !entity) {
      return {
        success: false,
        error: 'Invalid request: action and entity are required'
      };
    }

    // Handle different entities
    switch (entity.toLowerCase()) {
      case 'employee':
      case 'employees':
        return await handleEmployeeRequest(action, params, data);
      case 'monthlyworkrecord':
      case 'monthlyworkrecords':
        return await handleMonthlyWorkRecordRequest(action, params, data);
      // Add more entities as needed
      default:
        return {
          success: false,
          error: `Unknown entity: ${entity}`
        };
    }
  } catch (error) {
    console.error('MCP handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Handle employee-related requests
async function handleEmployeeRequest(action: string, params?: any, data?: any): Promise<MCPResponse> {
  try {
    switch (action.toLowerCase()) {
      case 'list':
      case 'getall':
        const employees = await prisma.employee.findMany({
          orderBy: { name: 'asc' },
          ...params
        });
        return { success: true, data: employees };
      
      case 'get':
      case 'getbyid':
        if (!params?.id) {
          return { success: false, error: 'Employee ID is required' };
        }
        const employee = await prisma.employee.findUnique({
          where: { id: Number(params.id) }
        });
        if (!employee) {
          return { success: false, error: 'Employee not found' };
        }
        return { success: true, data: employee };
      
      case 'create':
        if (!data) {
          return { success: false, error: 'Employee data is required' };
        }
        const newEmployee = await prisma.employee.create({
          data
        });
        return { success: true, data: newEmployee };
      
      case 'update':
        if (!params?.id) {
          return { success: false, error: 'Employee ID is required' };
        }
        if (!data) {
          return { success: false, error: 'Update data is required' };
        }
        const updatedEmployee = await prisma.employee.update({
          where: { id: Number(params.id) },
          data
        });
        return { success: true, data: updatedEmployee };
      
      case 'delete':
        if (!params?.id) {
          return { success: false, error: 'Employee ID is required' };
        }
        await prisma.employee.delete({
          where: { id: Number(params.id) }
        });
        return { success: true };
      
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (error) {
    console.error('Employee handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Handle monthly work record-related requests
async function handleMonthlyWorkRecordRequest(action: string, params?: any, data?: any): Promise<MCPResponse> {
  try {
    switch (action.toLowerCase()) {
      case 'list':
      case 'getall':
        const records = await prisma.monthlyWorkRecord.findMany({
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          include: { employee: true },
          ...params
        });
        return { success: true, data: records };
      
      case 'getbyemployee':
        if (!params?.employeeId) {
          return { success: false, error: 'Employee ID is required' };
        }
        
        const whereClause: any = { employeeId: Number(params.employeeId) };
        
        if (params.year) {
          whereClause.year = Number(params.year);
        }
        
        if (params.month) {
          whereClause.month = Number(params.month);
        }
        
        const employeeRecords = await prisma.monthlyWorkRecord.findMany({
          where: whereClause,
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          include: { employee: true }
        });
        
        return { success: true, data: employeeRecords };
      
      case 'get':
      case 'getbyid':
        if (!params?.id) {
          return { success: false, error: 'Record ID is required' };
        }
        
        const record = await prisma.monthlyWorkRecord.findUnique({
          where: { id: Number(params.id) },
          include: { employee: true }
        });
        
        if (!record) {
          return { success: false, error: 'Monthly work record not found' };
        }
        
        return { success: true, data: record };
      
      case 'create':
      case 'addquickrecord':
        if (!data) {
          return { success: false, error: 'Record data is required' };
        }
        
        if (!data.employeeId || !data.year || !data.month || data.weekendsWorked === undefined || data.holidaysWorked === undefined) {
          return { success: false, error: 'Required fields missing: employeeId, year, month, weekendsWorked, holidaysWorked' };
        }
        
        // Check if record already exists for this employee, year, and month
        const duplicateRecord = await prisma.monthlyWorkRecord.findFirst({
          where: {
            employeeId: Number(data.employeeId),
            year: Number(data.year),
            month: Number(data.month),
          },
        });
        
        if (duplicateRecord) {
          return { 
            success: false, 
            error: 'A record already exists for this employee, year, and month',
            data: duplicateRecord
          };
        }
        
        // Get employee to calculate amounts
        const employeeForCreate = await prisma.employee.findUnique({
          where: { id: Number(data.employeeId) }
        });
        
        if (!employeeForCreate) {
          return { success: false, error: 'Employee not found' };
        }
        
        // Calculate amounts
        const weekendAmount = employeeForCreate.weekendRate * Number(data.weekendsWorked);
        const holidayAmount = employeeForCreate.holidayRate * Number(data.holidaysWorked);
        const totalAmount = weekendAmount + holidayAmount;
        
        // Create the record with calculated amounts
        const newRecord = await prisma.monthlyWorkRecord.create({
          data: {
            employeeId: Number(data.employeeId),
            year: Number(data.year),
            month: Number(data.month),
            weekendsWorked: Number(data.weekendsWorked),
            holidaysWorked: Number(data.holidaysWorked),
            weekendAmount,
            holidayAmount,
            totalAmount,
            notes: data.notes
          },
          include: { employee: true }
        });
        
        return { success: true, data: newRecord };
      
      case 'update':
        if (!params?.id) {
          return { success: false, error: 'Record ID is required' };
        }
        
        if (!data) {
          return { success: false, error: 'Update data is required' };
        }
        
        // Get the existing record
        const existingRecord = await prisma.monthlyWorkRecord.findUnique({
          where: { id: Number(params.id) }
        });
        
        if (!existingRecord) {
          return { success: false, error: 'Monthly work record not found' };
        }
        
        // Get employee to calculate amounts
        const employeeForUpdate = await prisma.employee.findUnique({
          where: { id: Number(existingRecord.employeeId) }
        });
        
        if (!employeeForUpdate) {
          return { success: false, error: 'Employee not found' };
        }
        
        // Prepare update data
        const updateData: any = { ...data };
        
        // Calculate amounts if weekendsWorked or holidaysWorked changed
        if (updateData.weekendsWorked !== undefined || updateData.holidaysWorked !== undefined) {
          const weekendsWorked = updateData.weekendsWorked !== undefined 
            ? Number(updateData.weekendsWorked) 
            : existingRecord.weekendsWorked;
            
          const holidaysWorked = updateData.holidaysWorked !== undefined 
            ? Number(updateData.holidaysWorked) 
            : existingRecord.holidaysWorked;
          
          updateData.weekendAmount = employeeForUpdate.weekendRate * weekendsWorked;
          updateData.holidayAmount = employeeForUpdate.holidayRate * holidaysWorked;
          updateData.totalAmount = updateData.weekendAmount + updateData.holidayAmount;
        }
        
        // Update the record
        const updatedRecord = await prisma.monthlyWorkRecord.update({
          where: { id: Number(params.id) },
          data: updateData,
          include: { employee: true }
        });
        
        return { success: true, data: updatedRecord };
      
      case 'delete':
        if (!params?.id) {
          return { success: false, error: 'Record ID is required' };
        }
        
        await prisma.monthlyWorkRecord.delete({
          where: { id: Number(params.id) }
        });
        
        return { success: true };
      
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (error) {
    console.error('Monthly work record handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 