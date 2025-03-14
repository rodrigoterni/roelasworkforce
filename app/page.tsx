import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Get counts from database
  const employeeCount = await prisma.employee.count();
  const activeEmployeeCount = await prisma.employee.count({
    where: { isActive: true },
  });
  
  // You would typically have more data for a real dashboard
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total de Funcionários</p>
              <p className="text-2xl font-semibold">{employeeCount}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/employees" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Funcionários Ativos</p>
              <p className="text-2xl font-semibold">{activeEmployeeCount}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/employees" 
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Ver ativos →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Turnos Hoje</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
          <div className="mt-6">
            <Link 
              href="/shifts" 
              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
              Ver turnos →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/employees/new"
              className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg flex items-center"
            >
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="ml-3 font-medium">Novo Funcionário</span>
            </Link>
            
            <Link
              href="/shifts/new"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex items-center"
            >
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="ml-3 font-medium">Criar Turno</span>
            </Link>
            
            <Link
              href="/payroll/new"
              className="bg-amber-50 hover:bg-amber-100 p-4 rounded-lg flex items-center"
            >
              <div className="p-2 rounded-full bg-amber-100 text-amber-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="ml-3 font-medium">Gerar Pagamento</span>
            </Link>
            
            <Link
              href="/reports"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex items-center"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="ml-3 font-medium">Relatórios</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Versão</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status do Servidor</p>
              <p className="font-medium text-green-600">Online</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximo Feriado</p>
              <p className="font-medium">Nenhum feriado próximo</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última Atualização</p>
              <p className="font-medium">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
