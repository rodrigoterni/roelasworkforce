import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/employees/[id]/monthly-records
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = parseInt(params.id);
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Get monthly records for this employee
    const records = await prisma.monthlyWorkRecord.findMany({
      where: { employeeId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    });
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching employee monthly records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee monthly records' },
      { status: 500 }
    );
  }
} 