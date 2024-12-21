'use client';

import { useState } from 'react';
import ImportTable from '../server_components/import';

interface CSVUploadProps {
  table: string;
  cols: string[];
  defaults?: string;
}

export default function CSVUpload({ table, cols, defaults }: CSVUploadProps) {
  const [status, setStatus] = useState<{ message: string; success?: boolean } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus({ message: 'Uploading...' });

      const result = await ImportTable({
        params: { 
          table, 
          cols,
          defaults 
        },
        file
      });

      setStatus(result);
    } catch (error) {
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Import {table} from CSV</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Required columns: {cols.join(', ')}
          </label>
          <input
            title="Upload CSV file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
        </div>

        {status && (
          <div className={`p-3 rounded ${
            status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
} 