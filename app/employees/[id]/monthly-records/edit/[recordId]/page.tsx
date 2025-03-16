'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Employee = {
  id: number;
  name: string;
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
};

export default function EditMonthlyRecordPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  const recordId = Number(params.recordId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [record, setRecord] = useState<MonthlyRecord | null>(null);
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    weekendsWorked: 0,
    holidaysWorked: 0,
    notes: '',
  });
  
  // Month names for display
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Fetch employee and record data
  useEffect(() => {
    async function fetchData() {
      if (!employeeId || !recordId || isNaN(employeeId) || isNaN(recordId)) {
        setError('ID de funcionário ou registro inválido');
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
        
        // Fetch record
        const recordResponse = await fetch(`/api/monthly-records/${recordId}`);
        if (!recordResponse.ok) {
          throw new Error('Falha ao buscar registro mensal');
        }
        const recordData = await recordResponse.json();
        setRecord(recordData);
        
        // Set form data
        setFormData({
          year: recordData.year,
          month: recordData.month,
          weekendsWorked: recordData.weekendsWorked,
          holidaysWorked: recordData.holidaysWorked,
          notes: recordData.notes || '',
        });
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Falha ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [employeeId, recordId]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value)
    }));
  };
  
  // Calculate preview amounts
  const calculatePreview = () => {
    if (!employee) return { weekendAmount: 0, holidayAmount: 0, totalAmount: 0 };
    
    const weekendAmount = employee.weekendRate * formData.weekendsWorked;
    const holidayAmount = employee.holidayRate * formData.holidaysWorked;
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recordId) {
      setError('ID de registro inválido');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/monthly-records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar registro');
      }
      
      // Navigate back to the monthly records page
      router.push(`/employees/${employeeId}/monthly-records`);
    } catch (err) {
      console.error('Erro ao atualizar registro:', err);
      setError(err instanceof Error ? err.message : 'Falha ao atualizar registro');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (error || !employee || !record) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Erro ao carregar dados'}
        </div>
        <Link 
          href={`/employees/${employeeId}/monthly-records`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Voltar para Registros Mensais
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            href={`/employees/${employeeId}/monthly-records`}
            className="text-indigo-600 hover:text-indigo-800 mr-2"
          >
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Registro Mensal - {employee.name}</h1>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Ano</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                min="2000"
                max="2100"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Mês</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
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
              <label className="block text-gray-700 mb-1">Fins de Semana Trabalhados</label>
              <input
                type="number"
                name="weekendsWorked"
                value={formData.weekendsWorked}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Feriados Trabalhados</label>
              <input
                type="number"
                name="holidaysWorked"
                value={formData.holidaysWorked}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                min="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Observações (Opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
          
          {/* Preview calculations */}
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-2">Prévia do Cálculo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-gray-600">Valor Fins de Semana:</p>
                <p className="font-medium">{formatCurrency(preview.weekendAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Feriados:</p>
                <p className="font-medium">{formatCurrency(preview.holidayAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total:</p>
                <p className="font-medium">{formatCurrency(preview.totalAmount)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Atualizar Registro'}
            </button>
            
            <Link
              href={`/employees/${employeeId}/monthly-records`}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors inline-flex items-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 