import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EmployeeDetailPage({ params }: PageProps) {
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
    notFound();
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/employees" className="text-indigo-600 hover:text-indigo-800 mr-2">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">{employee.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/employees/${employee.id}/edit`}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Editar
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p>{employee.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CPF</p>
              <p>{employee.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">RG</p>
              <p>{employee.rg}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Contratação</p>
              <p>{formatDate(employee.hireDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`${
                employee.isActive ? 'text-green-600' : 'text-red-600'
              } font-medium`}>
                {employee.isActive ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Financeiras</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Salário Base</p>
              <p className="font-medium">{formatCurrency(employee.salary)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taxa de Fim de Semana</p>
              <p>{employee.weekendRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taxa de Feriado</p>
              <p>{employee.holidayRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fins de Semana Trabalhados</p>
              <p>{employee.weekendsWorked}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Feriados Trabalhados</p>
              <p>{employee.holidaysWorked}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Seguro de Saúde</p>
              {employee.hasInsurance ? (
                <p className="font-medium">{formatCurrency(employee.insuranceAmount)}</p>
              ) : (
                <p className="text-gray-500">Não possui</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Vale Transporte</p>
              {employee.hasTransportFee ? (
                <p className="font-medium">{formatCurrency(employee.transportFeeDaily)} (diário)</p>
              ) : (
                <p className="text-gray-500">Não possui</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Vale Alimentação</p>
              {employee.hasFoodSupport ? (
                <p className="font-medium">{formatCurrency(employee.foodSupportAmount)} (mensal)</p>
              ) : (
                <p className="text-gray-500">Não possui</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Bancárias</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Banco</p>
              <p>{employee.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Agência</p>
              <p>{employee.bankBranch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conta</p>
              <p>{employee.bankAccount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chave PIX</p>
              <p>{employee.bankPix}</p>
            </div>
          </div>
        </div>
      </div>
      
      {employee.shifts.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Últimos Turnos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employee.shifts.map((shift) => {
                  const startDate = new Date(shift.startTime);
                  const endDate = new Date(shift.endTime);
                  
                  const formatTime = (date: Date) => {
                    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  };
                  
                  let shiftType = 'Normal';
                  if (shift.isHoliday) shiftType = 'Feriado';
                  else if (shift.isWeekend) shiftType = 'Fim de Semana';
                  
                  return (
                    <tr key={shift.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(startDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(startDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(endDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          shift.isHoliday 
                            ? 'bg-red-100 text-red-800' 
                            : shift.isWeekend 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {shiftType}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}