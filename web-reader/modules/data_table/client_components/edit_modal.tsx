'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  record: any;
  columns: string[];
  child: string[];
  childValues: Record<string, any[]>;
  inputTypes: string[];
}

export default function EditModal({ isOpen, onClose, onSave, record, columns, child, childValues, inputTypes }: EditModalProps) {
  const [formData, setFormData] = useState(record);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    child.forEach(c => {
      initial[c] = record[c]?.id || '';
    });
    return initial;
  });

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
        <div className="w-full max-w-3xl rounded bg-white p-6">
          <h2 className="text-lg font-medium mb-4">Edit Record</h2>
          
          <form onSubmit={handleSubmit}>
            {columns.map((column, index) => (
              <div key={column} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </label>
                {inputTypes[index] === 'textarea' ? (
                  <textarea
                    value={formData[column] || ''}
                    onChange={(e) => handleInputChange(column, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                ) : (
                  <input
                    type={inputTypes[index] || 'text'}
                    value={formData[column] || ''}
                    onChange={(e) => handleInputChange(column, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
            {child.map((child) => (
              <div key={child} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{child.charAt(0).toUpperCase() + child.slice(1)}</label>
                <select 
                  value={selectedValues[child]} 
                  onChange={(e) => {
                    setSelectedValues(prev => ({...prev, [child]: e.target.value}));
                    handleInputChange(`${child}Id`, e.target.value);
                  }} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">None</option>
                  {childValues[child]?.map((value: any) => (
                    <option key={value.id} value={value.id}>{value.name}</option>
                  ))}
                </select>
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
        </div>
      </div>
    </Dialog>
  );
} 