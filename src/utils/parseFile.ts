import Papa from 'papaparse';

export interface FileParseResult {
  domains: string[];
  error?: string;
}

export const parseFile = (file: File): Promise<FileParseResult> => {
  return new Promise((resolve) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      resolve({
        domains: [],
        error: 'Invalid file type. Please upload a .csv or .txt file.',
      });
      return;
    }

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const domains = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        if (domains.length > 200) {
          resolve({
            domains: [],
            error: 'Too many domains. Maximum allowed is 200.',
          });
          return;
        }

        resolve({ domains });
      };

      reader.onerror = () => {
        resolve({
          domains: [],
          error: 'Error reading file.',
        });
      };

      reader.readAsText(file);
    } else {
      Papa.parse(file, {
        complete: (results) => {
          const domains = results.data
            .flat()
            .map(item => String(item).trim())
            .filter(item => item.length > 0);

          if (domains.length > 200) {
            resolve({
              domains: [],
              error: 'Too many domains. Maximum allowed is 200.',
            });
            return;
          }

          resolve({ domains });
        },
        error: () => {
          resolve({
            domains: [],
            error: 'Error parsing CSV file.',
          });
        },
      });
    }
  });
}; 