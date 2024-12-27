'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  record: any;
  columns: string[];
}

export default function EditModal({ isOpen, onClose, onSave, record, columns }: EditModalProps) {
  const [formData, setFormData] = useState(record);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  const handleInputChange = (column: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Edit Record</Dialog.Title>
          
          <form onSubmit={handleSubmit}>
            {columns.map((column) => (
              <div key={column} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData[column] || ''}
                  onChange={(e) => handleInputChange(column, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 