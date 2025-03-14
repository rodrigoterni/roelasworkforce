import EmployeeForm from '@/components/employees/EmployeeForm';
import Link from 'next/link';

export default function NewEmployeePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/employees" className="text-indigo-600 hover:text-indigo-800 mr-2">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">Novo Funcionário</h1>
        </div>
        <p className="text-gray-600">Preencha os dados para cadastrar um novo funcionário.</p>
      </div>
      
      <EmployeeForm />
    </main>
  );
}