import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funcionários' },
      { status: 500 }
    );
  }
}

// POST a new employee
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const employee = await prisma.employee.create({
      data: body,
    });
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Erro ao criar funcionário' },
      { status: 500 }
    );
  }
}