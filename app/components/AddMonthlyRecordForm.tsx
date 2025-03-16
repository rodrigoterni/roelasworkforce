'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Employee = {
  id: number;
  weekendRate: number;
  holidayRate: number;
};

type AddMonthlyRecordFormProps = {
  employeeId: number;
};

export default function AddMonthlyRecordForm({ employeeId }: AddMonthlyRecordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Fetch employee data to get rates
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await fetch(`/api/employees/${employeeId}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do funcionário');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        console.error('Erro ao buscar funcionário:', err);
        setError('Falha ao carregar dados do funcionário');
      }
    }
    
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);
  
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
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/monthly-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          employeeId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar registro');
      }
      
      // Reset form
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        weekendsWorked: 0,
        holidaysWorked: 0,
        notes: '',
      });
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      setError(err instanceof Error ? err.message : 'Falha ao salvar registro');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
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
        
        <div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Adicionar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
} 