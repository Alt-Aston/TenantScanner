import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { TenantLookupResult } from '../utils/fetchTenantId';

interface TenantLookupTableProps {
  results: TenantLookupResult[];
}

export function TenantLookupTable({ results }: TenantLookupTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TenantLookupResult;
    direction: 'asc' | 'desc';
  }>({ key: 'domain', direction: 'asc' });

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;
    if (searchTerm) {
      filtered = results.filter(
        (result) =>
          result.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.tenantId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  }, [results, searchTerm, sortConfig]);

  const handleSort = (key: keyof TenantLookupResult) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const downloadCsv = () => {
    const headers = ['Domain', 'Tenant ID', 'Status', 'Error'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedResults.map((result) =>
        [
          result.domain,
          result.tenantId || '',
          result.status,
          result.error || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tenant-lookup-results.csv';
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-64"
        />
        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['domain', 'tenantId', 'status'].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof TenantLookupResult)}
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedResults.map((result, index) => (
              <tr
                key={`${result.domain}-${index}`}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">{result.domain}</td>
                <td className="px-4 py-2">
                  {result.tenantId || (
                    <span className="text-gray-400">Not available</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status}
                    {result.error && (
                      <span className="ml-1 text-gray-500">: {result.error}</span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 