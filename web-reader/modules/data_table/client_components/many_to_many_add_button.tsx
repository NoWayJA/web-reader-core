'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ManyToManyAddModal from './many_to_many_add_modal';
import { addManyToManyRecord } from '../server_actions/many_to_many';

interface ManyToManyAddButtonProps {
  availableChildren: any[];
  parentTable: string;
  childTable: string;
  joinTable: string;
}

export default function ManyToManyAddButton({
  availableChildren,
  parentTable,
  joinTable
}: ManyToManyAddButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: { name: string, selectedIds: string[] }) => {
    try {
      const result = await addManyToManyRecord(data.name, data.selectedIds, parentTable, joinTable);
      
      if (result.success) {
        window.location.reload();
      } else {
        alert('Failed to add record');
      }
    } catch (error) {
      console.error('Failed to add record:', error);
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
      
      <ManyToManyAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        availableChildren={availableChildren}
      />
    </>
  );
} 