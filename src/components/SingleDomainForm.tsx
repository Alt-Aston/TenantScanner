import { useState } from 'react';
import { fetchTenantId, type TenantLookupResult } from '../utils/fetchTenantId';

interface SingleDomainFormProps {
  onResult: (result: TenantLookupResult) => void;
  isLoading: boolean;
}

export function SingleDomainForm({ onResult, isLoading }: SingleDomainFormProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    
    const result = await fetchTenantId(domain);
    onResult(result);
    setDomain('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="domain"
          className="block text-sm font-medium text-gray-700"
        >
          Domain Name
        </label>
        <input
          type="text"
          id="domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g., microsoft.com)"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !domain.trim()}
        className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Looking up...' : 'Lookup Tenant ID'}
      </button>
    </form>
  );
} 