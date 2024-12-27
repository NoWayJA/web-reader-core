'use client';

import { useState } from 'react';
import AddModal from './add_modal';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddButtonProps {
  table: string;
  columns: string[];
  filter?: string;
  onAdd: (table: string, data: any) => Promise<any>;
}

export default function AddButton({ table, columns, filter, onAdd }: AddButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultValues = filter ? JSON.parse(filter).reduce((acc: any, item: any) => {
    return { ...acc, ...item };
  }, {}) : {};

  const handleSave = async (data: any) => {
    const result = await onAdd(table, data);
    if (result.success) {
      window.location.reload();
    } else {
      alert('Failed to add record');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
      
      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        columns={columns}
        defaultValues={defaultValues}
      />
    </>
  );
} 