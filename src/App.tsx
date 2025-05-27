import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { SingleDomainForm } from './components/SingleDomainForm';
import { DomainUploader } from './components/DomainUploader';
import { BulkPasteForm } from './components/BulkPasteForm';
import { TenantLookupTable } from './components/TenantLookupTable';
import type { TenantLookupResult } from './utils/fetchTenantId';
import { batchFetchTenantIds } from './utils/fetchTenantId';
import '@fontsource/inter';
import '@fontsource/poppins';

function App() {
  const [results, setResults] = useState<TenantLookupResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSingleResult = (result: TenantLookupResult) => {
    setResults((prev) => [result, ...prev]);
  };

  const handleBulkUpload = async (domains: string[]) => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const batchResults = await batchFetchTenantIds(domains, 20, setProgress);
      setResults((prev) => [...batchResults, ...prev]);
    } catch (error) {
      console.error('Error processing domains:', error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleError = (error: string) => {
    console.error(error);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-center mb-8">
          Azure Tenant ID Lookup Tool
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <Tabs.Root defaultValue="single" className="space-y-6">
            <Tabs.List className="flex space-x-1 border-b">
              <Tabs.Trigger
                value="single"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-gray-900"
              >
                Single Domain
              </Tabs.Trigger>
              <Tabs.Trigger
                value="bulk-paste"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-gray-900"
              >
                Bulk Paste
              </Tabs.Trigger>
              <Tabs.Trigger
                value="bulk-upload"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-gray-900"
              >
                File Upload
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="single" className="space-y-4">
              <SingleDomainForm
                onResult={handleSingleResult}
                isLoading={isLoading}
              />
            </Tabs.Content>

            <Tabs.Content value="bulk-paste" className="space-y-4">
              <BulkPasteForm
                onSubmit={handleBulkUpload}
                isLoading={isLoading}
              />
              {isLoading && progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="bulk-upload" className="space-y-4">
              <DomainUploader
                onUpload={handleBulkUpload}
                onError={handleError}
                isLoading={isLoading}
              />
              {isLoading && progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <TenantLookupTable results={results} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 