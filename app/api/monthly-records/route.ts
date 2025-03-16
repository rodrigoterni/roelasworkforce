import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/monthly-records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    
    const whereClause = employeeId ? { employeeId: parseInt(employeeId) } : {};
    
    const records = await prisma.monthlyWorkRecord.findMany({
      where: whereClause,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
      include: {
        employee: {
          select: {
            name: true,
            weekendRate: true,
            holidayRate: true,
          },
        },
      },
    });
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching monthly records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly records' },
      { status: 500 }
    );
  }
}

// POST /api/monthly-records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, year, month, weekendsWorked, holidaysWorked, notes } = body;
    
    // Validate required fields
    if (!employeeId || !year || !month) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, year, month' },
        { status: 400 }
      );
    }
    
    // Check if record already exists for this employee, year, and month
    const existingRecord = await prisma.monthlyWorkRecord.findFirst({
      where: {
        employeeId: Number(employeeId),
        year: Number(year),
        month: Number(month),
      },
    });
    
    if (existingRecord) {
      return NextResponse.json(
        { error: 'A record already exists for this employee, year, and month' },
        { status: 409 }
      );
    }
    
    // Get employee to calculate amounts
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Calculate amounts
    const weekendAmount = employee.weekendRate * Number(weekendsWorked || 0);
    const holidayAmount = employee.holidayRate * Number(holidaysWorked || 0);
    const totalAmount = weekendAmount + holidayAmount;
    
    // Create record
    const record = await prisma.monthlyWorkRecord.create({
      data: {
        employeeId: Number(employeeId),
        year: Number(year),
        month: Number(month),
        weekendsWorked: Number(weekendsWorked || 0),
        holidaysWorked: Number(holidaysWorked || 0),
        weekendAmount,
        holidayAmount,
        totalAmount,
        notes: notes || null,
      },
    });
    
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating monthly record:', error);
    return NextResponse.json(
      { error: 'Failed to create monthly record' },
      { status: 500 }
    );
  }
}

// PUT /api/monthly-records
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, year, month, weekendsWorked, holidaysWorked, notes } = body;
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }
    
    // Check if record exists
    const existingRecord = await prisma.monthlyWorkRecord.findUnique({
      where: { id: Number(id) },
      include: {
        employee: true,
      },
    });
    
    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    // Calculate amounts
    const weekendAmount = existingRecord.employee.weekendRate * Number(weekendsWorked || 0);
    const holidayAmount = existingRecord.employee.holidayRate * Number(holidaysWorked || 0);
    const totalAmount = weekendAmount + holidayAmount;
    
    // Update record
    const record = await prisma.monthlyWorkRecord.update({
      where: { id: Number(id) },
      data: {
        year: Number(year || existingRecord.year),
        month: Number(month || existingRecord.month),
        weekendsWorked: Number(weekendsWorked || existingRecord.weekendsWorked),
        holidaysWorked: Number(holidaysWorked || existingRecord.holidaysWorked),
        weekendAmount,
        holidayAmount,
        totalAmount,
        notes: notes !== undefined ? notes : existingRecord.notes,
      },
    });
    
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error updating monthly record:', error);
    return NextResponse.json(
      { error: 'Failed to update monthly record' },
      { status: 500 }
    );
  }
} 