'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MonthlyRecordsTable from '@/app/components/MonthlyRecordsTable';
import AddMonthlyRecordForm from '@/app/components/AddMonthlyRecordForm';

type Employee = {
  id: number;
  name: string;
  email: string;
  weekendRate: number;
  holidayRate: number;
};

type MonthlyRecord = {
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

export default function EmployeeMonthlyRecordsPage() {
  const params = useParams();
  const employeeId = parseInt(params.id as string);
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Fetch employee and records
  useEffect(() => {
    async function fetchData() {
      if (!employeeId || isNaN(employeeId)) {
        setError('ID de funcionário inválido');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch employee
        const employeeResponse = await fetch(`/api/employees/${employeeId}`);
        if (!employeeResponse.ok) {
          throw new Error('Falha ao buscar dados do funcionário');
        }
        const employeeData = await employeeResponse.json();
        setEmployee(employeeData);
        
        // Fetch monthly records
        const recordsResponse = await fetch(`/api/employees/${employeeId}/monthly-records`);
        if (!recordsResponse.ok) {
          throw new Error('Falha ao buscar registros mensais');
        }
        const recordsData = await recordsResponse.json();
        setRecords(recordsData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Falha ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [employeeId]);
  
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </main>
    );
  }
  
  if (error || !employee) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Erro ao carregar dados'}
        </div>
        <Link href="/employees" className="text-indigo-600 hover:text-indigo-800">
          ← Voltar para Funcionários
        </Link>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href={`/employees/${employee.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">Registros Mensais - {employee.name}</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Registro Mensal</h2>
          <AddMonthlyRecordForm employeeId={employee.id} />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Registros Mensais</h2>
          <MonthlyRecordsTable 
            records={records} 
            employeeId={employee.id}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </main>
  );
} 