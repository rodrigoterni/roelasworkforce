'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type MonthlyRecordQuickAddProps = {
  employeeId: number;
  weekendRate: number;
  holidayRate: number;
};

export default function MonthlyRecordQuickAdd({ 
  employeeId, 
  weekendRate, 
  holidayRate 
}: MonthlyRecordQuickAddProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [formData, setFormData] = useState({
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value),
    }));
  };
  
  // Calculate preview amounts
  const calculatePreview = () => {
    if (!weekendRate || !holidayRate) return { weekendAmount: 0, holidayAmount: 0, totalAmount: 0 };
    
    const weekendAmount = weekendRate * formData.weekendsWorked;
    const holidayAmount = holidayRate * formData.holidaysWorked;
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
    setIsSubmitting(true);
    setSuccess(null);
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
      
      if (response.ok) {
        setSuccess(`Registro mensal adicionado com sucesso para ${monthNames[formData.month - 1]} ${formData.year}`);
        // Reset form to current month/year with zero values
        setFormData({
          year: currentYear,
          month: currentMonth,
          weekendsWorked: 0,
          holidaysWorked: 0,
          notes: '',
        });
        router.refresh();
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
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adicionar Registro Mensal</h2>
      
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
            rows={2}
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
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
} 