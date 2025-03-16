'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MonthlyWorkRecord = {
  id: number;
  employeeId: number;
  year: number;
  month: number;
  weekendsWorked: number;
  holidaysWorked: number;
  weekendAmount: number;
  holidayAmount: number;
  totalAmount: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type MonthlyRecordsTableProps = {
  records: MonthlyWorkRecord[];
  employeeId: number;
  formatCurrency: (value: number) => string;
};

export default function MonthlyRecordsTable({ records, employeeId, formatCurrency }: MonthlyRecordsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Month names for display
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const handleDelete = async (recordId: number) => {
    if (!recordId || !confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/monthly-records/${recordId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir registro');
      }
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      alert('Falha ao excluir registro. Por favor, tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (!records || records.length === 0) {
    return <p className="text-gray-500">Nenhum registro encontrado. Adicione seu primeiro registro acima.</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4 border text-left">Período</th>
            <th className="py-2 px-4 border text-left">Fins de Semana</th>
            <th className="py-2 px-4 border text-left">Feriados</th>
            <th className="py-2 px-4 border text-left">Valor Fins de Semana</th>
            <th className="py-2 px-4 border text-left">Valor Feriados</th>
            <th className="py-2 px-4 border text-left">Valor Total</th>
            <th className="py-2 px-4 border text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border">
                {monthNames[(record.month - 1) % 12]} {record.year}
              </td>
              <td className="py-2 px-4 border">{record.weekendsWorked}</td>
              <td className="py-2 px-4 border">{record.holidaysWorked}</td>
              <td className="py-2 px-4 border">{formatCurrency(record.weekendAmount)}</td>
              <td className="py-2 px-4 border">{formatCurrency(record.holidayAmount)}</td>
              <td className="py-2 px-4 border font-medium">{formatCurrency(record.totalAmount)}</td>
              <td className="py-2 px-4 border">
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/employees/${employeeId}/monthly-records/edit/${record.id}`)}
                    className="text-indigo-600 hover:text-indigo-800"
                    disabled={isDeleting}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={isDeleting}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 