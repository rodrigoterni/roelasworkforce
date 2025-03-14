import { prisma } from '@/lib/prisma';
import EmployeeList from '@/components/employees/EmployeeList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Funcionários</h1>
        <Link 
          href="/employees/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Novo Funcionário
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <EmployeeList initialEmployees={employees} />
      </div>
    </main>
  );
}