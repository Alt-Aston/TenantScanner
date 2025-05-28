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
import backgroundImage from './assets/anna-surovkova-3tv-f4SXSZQ-unsplash.jpg';

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
    <div 
      className="min-h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative overflow-auto"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {/* Blue overlay */}
      <div 
        className="absolute inset-0 fixed"
        style={{
          backgroundColor: 'rgb(0, 32, 128)',
          opacity: '0.5',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Coffee button */}
      <a
        href="https://venmo.com/u/astondavies77"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white/100 text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all hover:shadow-xl flex items-center gap-2 z-50"
      >
        Say thanks with coffee ☕️
      </a>

      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 relative z-10">
        <h1 className="text-3xl font-heading font-bold text-center mb-8">
          Azure Tenant ID Lookup Tool
        </h1>

        <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6 mb-8">
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
          <div className="bg-white/80 backdrop-blur rounded-lg shadow-sm p-6">
            <TenantLookupTable results={results} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 