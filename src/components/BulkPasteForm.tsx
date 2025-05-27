import { useState } from 'react';

interface BulkPasteFormProps {
  onSubmit: (domains: string[]) => void;
  isLoading: boolean;
}

export function BulkPasteForm({ onSubmit, isLoading }: BulkPasteFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const domains = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (domains.length > 200) {
      alert('Too many domains. Maximum allowed is 200.');
      return;
    }

    onSubmit(domains);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="domains"
          className="block text-sm font-medium text-gray-700"
        >
          Paste Domains
        </label>
        <textarea
          id="domains"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter one domain per line (max 200 domains)"
          className="w-full h-48 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Lookup Tenant IDs'}
      </button>
    </form>
  );
} 