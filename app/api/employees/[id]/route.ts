import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET a specific employee
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        shifts: {
          orderBy: {
            startTime: 'desc',
          },
          take: 10,
        },
      },
    });
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funcionário' },
      { status: 500 }
    );
  }
}

// UPDATE an employee
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const employee = await prisma.employee.update({
      where: { id },
      data: body,
    });
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar funcionário' },
      { status: 500 }
    );
  }
}

// DELETE an employee
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.employee.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário' },
      { status: 500 }
    );
  }
}