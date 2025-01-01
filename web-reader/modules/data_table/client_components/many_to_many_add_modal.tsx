'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ManyToManyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string, selectedIds: string[] }) => Promise<void>;
  availableChildren: any[];
}

export default function ManyToManyAddModal({ 
  isOpen, 
  onClose, 
  onSave, 
  availableChildren 
}: ManyToManyAddModalProps) {
  const [name, setName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, selectedIds });
    setName('');
    setSelectedIds([]);
    onClose();
  };

  const toggleChild = (childId: string) => {
    setSelectedIds(prev => 
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded bg-white p-6">
          <h2 className="text-lg font-medium mb-4">
            Add New Record
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Items
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableChildren.map((child) => (
                  <label key={child.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(child.id)}
                      onChange={() => toggleChild(child.id)}
                      className="rounded border-gray-300"
                    />
                    <span>{child.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {availableChildren
                  .filter(child => selectedIds.includes(child.id))
                  .map(child => (
                    <span
                      key={child.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {child.name}
                      <button
                        type="button"
                        onClick={() => toggleChild(child.id)}
                        className="ml-1 inline-flex items-center"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
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
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
} 