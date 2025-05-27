import React, { useCallback, useState } from 'react';
import { parseFile } from '../utils/parseFile';
import { Upload } from 'lucide-react';

interface DomainUploaderProps {
  onUpload: (domains: string[]) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export function DomainUploader({ onUpload, onError, isLoading }: DomainUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const result = await parseFile(file);
    if (result.error) {
      onError(result.error);
    } else {
      onUpload(result.domains);
    }
  }, [onUpload, onError]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseFile(file);
    if (result.error) {
      onError(result.error);
    } else {
      onUpload(result.domains);
    }
  }, [onUpload, onError]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileSelect}
        accept=".csv,.txt"
        disabled={isLoading}
      />
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isLoading ? 'Processing...' : 'Drop your file here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select a file (.csv or .txt)
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Maximum 200 domains
        </p>
      </label>
    </div>
  );
} 