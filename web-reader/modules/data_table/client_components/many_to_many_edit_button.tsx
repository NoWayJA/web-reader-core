'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import ManyToManyModal from './many_to_many_modal';
import { updateManyToManyRelationships } from '../server_actions/many_to_many';

interface ManyToManyEditButtonProps {
  record: any;
  availableChildren: any[];
  currentChildren: any[];
  parentTable: string;
  childTable: string;
  joinTable: string;
}

export default function ManyToManyEditButton({
  record,
  availableChildren,
  currentChildren,
  joinTable
}: ManyToManyEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (selectedIds: string[]) => {
    try {
      const result = await updateManyToManyRelationships(record.id, selectedIds, joinTable);
      
      if (result.success) {
        window.location.reload();
      } else {
        alert('Failed to update relationships');
      }
    } catch (error) {
      console.error('Failed to update relationships:', error);
      alert('Failed to update relationships');
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
      
      <ManyToManyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        record={record}
        availableChildren={availableChildren}
        currentChildren={currentChildren}
      />
    </>
  );
} 