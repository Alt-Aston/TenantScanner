import React, { useMemo, useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import type { TenantLookupResult } from '../utils/fetchTenantId';

interface TenantLookupTableProps {
  results: TenantLookupResult[];
}

export function TenantLookupTable({ results }: TenantLookupTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const handleCopyClick = async (tenantId: string) => {
    try {
      await navigator.clipboard.writeText(tenantId);
      setCopiedId(tenantId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:w-64 text-[0.7rem] sm:text-base"
        />
        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span className="text-[0.8rem] sm:text-base">Download CSV</span>
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
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100 text-[0.7rem] sm:text-base"
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
                <td className="px-4 py-2 text-[0.7rem] sm:text-base">{result.domain}</td>
                <td className="px-4 py-2">
                  {result.tenantId ? (
                    <button
                      onClick={() => handleCopyClick(result.tenantId!)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 focus:outline-none text-[0.7rem] sm:text-base max-w-[150px] sm:max-w-none"
                      title={result.tenantId}
                    >
                      <span className="truncate">{result.tenantId}</span>
                      {copiedId === result.tenantId ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Copy className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-[0.7rem] sm:text-base">Not available</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[0.7rem] sm:text-xs font-medium ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status}
                    {result.error && (
                      <span className="ml-1 text-gray-500 hidden sm:inline">: {result.error}</span>
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