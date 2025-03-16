'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  notes?: string;
};

type MonthlyWorkRecordListProps = {
  employeeId: number;
  onAddNew?: () => void;
  onEdit?: (recordId: number) => void;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyWorkRecordList({ employeeId, onAddNew, onEdit }: MonthlyWorkRecordListProps) {
  const router = useRouter();
  const [records, setRecords] = useState<MonthlyWorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any>(null);

  // Fetch employee details and records
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch employee details
        const employeeResponse = await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get',
            entity: 'employee',
            params: { id: employeeId },
          }),
        });

        const employeeResult = await employeeResponse.json();
        
        if (employeeResult.success) {
          setEmployee(employeeResult.data);
        } else {
          setError('Failed to fetch employee details');
          return;
        }

        // Fetch monthly records
        const recordsResponse = await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getByEmployee',
            entity: 'monthlyWorkRecord',
            params: { employeeId },
          }),
        });

        const recordsResult = await recordsResponse.json();
        
        if (recordsResult.success) {
          setRecords(recordsResult.data || []);
        } else {
          setError('Failed to fetch monthly records');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const handleDelete = async (recordId: number) => {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          entity: 'monthlyWorkRecord',
          params: { id: recordId },
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted record from the state
        setRecords(records.filter(record => record.id !== recordId));
      } else {
        setError('Failed to delete record');
      }
    } catch (err) {
      setError('An error occurred while deleting the record');
      console.error(err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Monthly Work Records</h2>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Record
        </button>
      </div>

      {employee && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-medium mb-2">Employee Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Name:</span> {employee.name}</p>
              <p><span className="font-medium">Email:</span> {employee.email}</p>
            </div>
            <div>
              <p>
                <span className="font-medium">Weekend Rate:</span> {formatCurrency(employee.weekendRate)}
              </p>
              <p>
                <span className="font-medium">Holiday Rate:</span> {formatCurrency(employee.holidayRate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No monthly work records found.</p>
          <p className="mt-2">Click "Add New Record" to create one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekends Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holidays Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekend Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {MONTHS[record.month - 1]} {record.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.weekendsWorked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.holidaysWorked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(record.weekendAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(record.holidayAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(record.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit && onEdit(record.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 