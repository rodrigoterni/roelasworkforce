'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Employee = {
  id: number;
  name: string;
  email: string;
  weekendRate: number;
  holidayRate: number;
};

export default function AddMonthlyRecordPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [formData, setFormData] = useState({
    employeeId: 0,
    year: currentYear,
    month: currentMonth,
    weekendsWorked: 0,
    holidaysWorked: 0,
    notes: '',
  });
  
  // Month names for display
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch('/api/employees');
        if (!response.ok) {
          throw new Error('Falha ao buscar funcionários');
        }
        const data = await response.json();
        setEmployees(data || []);
        
        // Set default employee if available
        if (data && data.length > 0) {
          setFormData(prev => ({
            ...prev,
            employeeId: data[0].id,
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        setError('Falha ao carregar lista de funcionários');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEmployees();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value),
    }));
  };
  
  // Get selected employee
  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
  
  // Calculate preview amounts
  const calculatePreview = () => {
    if (!selectedEmployee) return { weekendAmount: 0, holidayAmount: 0, totalAmount: 0 };
    
    const weekendAmount = selectedEmployee.weekendRate * formData.weekendsWorked;
    const holidayAmount = selectedEmployee.holidayRate * formData.holidaysWorked;
    const totalAmount = weekendAmount + holidayAmount;
    
    return { weekendAmount, holidayAmount, totalAmount };
  };
  
  const preview = calculatePreview();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.employeeId === 0) {
      setError('Por favor, selecione um funcionário');
      return;
    }
    
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);
    
    try {
      const response = await fetch('/api/monthly-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const employeeName = selectedEmployee?.name || 'funcionário';
        setSuccess(`Registro mensal adicionado com sucesso para ${employeeName} - ${monthNames[formData.month - 1]} ${formData.year}`);
        
        // Reset form values except employeeId
        setFormData(prev => ({
          ...prev,
          year: currentYear,
          month: currentMonth,
          weekendsWorked: 0,
          holidaysWorked: 0,
          notes: '',
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Falha ao adicionar registro mensal');
      }
    } catch (err) {
      console.error('Erro ao adicionar registro mensal:', err);
      setError('Falha ao adicionar registro mensal');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/employees" className="text-indigo-600 hover:text-indigo-800 mr-2">
            ← Voltar para Funcionários
          </Link>
          <h1 className="text-2xl font-bold">Adicionar Registro Mensal</h1>
        </div>
        <p className="text-gray-600">Adicione um registro mensal para qualquer funcionário.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Funcionário</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="0">Selecione um funcionário</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          
          {selectedEmployee && (
            <div className="p-3 bg-blue-50 rounded mb-4">
              <h3 className="text-sm font-medium mb-2">Taxas do Funcionário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Taxa de Fim de Semana:</p>
                  <p className="font-medium">{formatCurrency(selectedEmployee.weekendRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Taxa de Feriado:</p>
                  <p className="font-medium">{formatCurrency(selectedEmployee.holidayRate)}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ano</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Mês</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fins de Semana Trabalhados</label>
              <input
                type="number"
                name="weekendsWorked"
                value={formData.weekendsWorked}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Feriados Trabalhados</label>
              <input
                type="number"
                name="holidaysWorked"
                value={formData.holidaysWorked}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Observações (Opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          {/* Preview calculations */}
          <div className="p-3 bg-gray-50 rounded">
            <h3 className="text-sm font-medium mb-2">Prévia do Cálculo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-500">Valor Fins de Semana:</p>
                <p className="font-medium">{formatCurrency(preview.weekendAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Feriados:</p>
                <p className="font-medium">{formatCurrency(preview.holidayAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Total:</p>
                <p className="font-medium">{formatCurrency(preview.totalAmount)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting || formData.employeeId === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar Registro'}
            </button>
            
            <Link
              href="/employees"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 