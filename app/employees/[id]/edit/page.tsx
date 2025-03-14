import { prisma } from '@/lib/prisma';
import EmployeeForm from '@/components/employees/EmployeeForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditEmployeePage({ params }: PageProps) {
  const id = parseInt(params.id);
  
  const employee = await prisma.employee.findUnique({
    where: { id },
  });
  
  if (!employee) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href={`/employees/${employee.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Funcionário</h1>
        </div>
        <p className="text-gray-600">Edite os dados do funcionário {employee.name}.</p>
      </div>
      
      <EmployeeForm employee={employee} isEditing={true} />
    </main>
  );
}