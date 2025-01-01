'use client';

import { useState } from 'react';
import EditModal from './edit_modal';
import { PencilIcon } from '@heroicons/react/24/outline';

interface EditButtonProps {
  record: any;
  table: string;
  columns: string[];
  inputTypes: string[];
  onUpdate: (table: string, id: string, data: any) => Promise<any>;
}

export default function EditButton({ record, table, columns, inputTypes, onUpdate }: EditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    const result = await onUpdate(table, record.id, data);
    if (result.success) {
      // Optionally refresh the page or update the UI
      window.location.reload();
    } else {
      alert('Failed to update record');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-indigo-600 hover:text-indigo-900"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        record={record}
        columns={columns}
        inputTypes={inputTypes}
      />
    </>
  );
} 