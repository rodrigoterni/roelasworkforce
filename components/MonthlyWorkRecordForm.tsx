'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type MonthlyWorkRecordFormProps = {
  employeeId: number;
  recordId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type FormData = {
  year: number;
  month: number;
  weekendsWorked: number;
  holidaysWorked: number;
  notes: string;
};

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function MonthlyWorkRecordForm({ employeeId, recordId, onSuccess, onCancel }: MonthlyWorkRecordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    weekendsWorked: 0,
    holidaysWorked: 0,
    notes: '',
  });

  // Fetch record data if editing an existing record
  useEffect(() => {
    if (recordId) {
      const fetchRecord = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/mcp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get',
              entity: 'monthlyWorkRecord',
              params: { id: recordId },
            }),
          });

          const result = await response.json();

          if (result.success && result.data) {
            setFormData({
              year: result.data.year,
              month: result.data.month,
              weekendsWorked: result.data.weekendsWorked,
              holidaysWorked: result.data.holidaysWorked,
              notes: result.data.notes || '',
            });
          } else {
            setError(result.error || 'Failed to fetch record');
          }
        } catch (err) {
          setError('An error occurred while fetching the record');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecord();
    }
  }, [recordId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const action = recordId ? 'update' : 'create';
      const requestBody: any = {
        action,
        entity: 'monthlyWorkRecord',
      };

      if (recordId) {
        requestBody.params = { id: recordId };
        requestBody.data = formData;
      } else {
        requestBody.data = {
          ...formData,
          employeeId,
        };
      }

      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/employees/${employeeId}/monthly-records`);
          router.refresh();
        }
      } else {
        setError(result.error || 'Failed to save record');
      }
    } catch (err) {
      setError('An error occurred while saving the record');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {recordId ? 'Edit Monthly Work Record' : 'Add Monthly Work Record'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min={2000}
              max={2100}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weekendsWorked" className="block text-sm font-medium text-gray-700 mb-1">
              Weekends Worked
            </label>
            <input
              type="number"
              id="weekendsWorked"
              name="weekendsWorked"
              value={formData.weekendsWorked}
              onChange={handleChange}
              min={0}
              max={10}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="holidaysWorked" className="block text-sm font-medium text-gray-700 mb-1">
              Holidays Worked
            </label>
            <input
              type="number"
              id="holidaysWorked"
              name="holidaysWorked"
              value={formData.holidaysWorked}
              onChange={handleChange}
              min={0}
              max={10}
              className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : recordId ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 