'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface ManyToManyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[], formData: any) => Promise<void>;
  record: any;
  childJoin: string;
  availableChildren: any[];
  currentChildren: any[];
  cols: string[];
  inputTypes: string[];
}

export default function ManyToManyModal({ 
  isOpen, 
  onClose, 
  onSave, 
  record,
  childJoin,
  availableChildren,
  currentChildren,
  cols,
  inputTypes
}: ManyToManyModalProps) {
  const [formData, setFormData] = useState(record);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentChildren.map(child => child.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(selectedIds, formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded bg-white p-6">
          <h2 className="text-lg font-medium mb-4">
            Edit Record
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {cols.map(col => {
                if (col === childJoin) {
                  return (
                    <div key={col} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Items
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableChildren.map((child) => (
                          <label key={child.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(child.id)}
                              onChange={() => {
                                setSelectedIds(prev => 
                                  prev.includes(child.id)
                                    ? prev.filter(id => id !== child.id)
                                    : [...prev, child.id]
                                );
                              }}
                              className="rounded border-gray-300"
                            />
                            <span>{child.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                }
                return (
                <div key={col} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </label>
                  {inputTypes[cols.indexOf(col)] === 'textarea' ? (
                    <textarea
                      value={formData[col] || ''}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={inputTypes[cols.indexOf(col)] || 'text'}
                      value={formData[col] || ''}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
                )
              })}
            </div>
            
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