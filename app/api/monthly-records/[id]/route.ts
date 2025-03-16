import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/monthly-records/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const record = await prisma.monthlyWorkRecord.findUnique({
      where: { id },
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
    
    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error fetching monthly record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly record' },
      { status: 500 }
    );
  }
}

// PUT /api/monthly-records/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { year, month, weekendsWorked, holidaysWorked, notes } = body;
    
    // Check if record exists
    const existingRecord = await prisma.monthlyWorkRecord.findUnique({
      where: { id },
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
    const weekendAmount = existingRecord.employee.weekendRate * Number(weekendsWorked || existingRecord.weekendsWorked);
    const holidayAmount = existingRecord.employee.holidayRate * Number(holidaysWorked || existingRecord.holidaysWorked);
    const totalAmount = weekendAmount + holidayAmount;
    
    // Update record
    const record = await prisma.monthlyWorkRecord.update({
      where: { id },
      data: {
        year: year !== undefined ? Number(year) : existingRecord.year,
        month: month !== undefined ? Number(month) : existingRecord.month,
        weekendsWorked: weekendsWorked !== undefined ? Number(weekendsWorked) : existingRecord.weekendsWorked,
        holidaysWorked: holidaysWorked !== undefined ? Number(holidaysWorked) : existingRecord.holidaysWorked,
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

// DELETE /api/monthly-records/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Check if record exists
    const existingRecord = await prisma.monthlyWorkRecord.findUnique({
      where: { id },
    });
    
    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    // Delete record
    await prisma.monthlyWorkRecord.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting monthly record:', error);
    return NextResponse.json(
      { error: 'Failed to delete monthly record' },
      { status: 500 }
    );
  }
} 