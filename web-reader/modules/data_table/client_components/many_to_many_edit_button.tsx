'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import ManyToManyModal from './many_to_many_edit_modal';
import { updateManyToManyRelationships } from '../server_actions/many_to_many';

interface ManyToManyEditButtonProps {
  record: any;
  availableChildren: any[];
  currentChildren: any[];
  parentTable: string;
  childTable: string;
  childJoin: string;
  joinTable: string;
  cols: string[];
  inputTypes: string[];
}

export default function ManyToManyEditButton({
  record,
  availableChildren,
  currentChildren,
  childJoin,
  joinTable,
  cols,
  inputTypes,
  parentTable
}: ManyToManyEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (selectedIds: string[], formData: any) => {
    try {
      const result = await updateManyToManyRelationships(
        record.id, 
        selectedIds, 
        joinTable,
        formData,
        parentTable,
        childJoin
      );
      
      if (result.success) {
        window.location.reload();
      } else {
        alert('Failed to update record');
      }
    } catch (error) {
      console.error('Failed to update record:', error);
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
      
      <ManyToManyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        record={record}
        childJoin={childJoin}
        availableChildren={availableChildren}
        currentChildren={currentChildren}
        cols={cols}
        inputTypes={inputTypes}
      />
    </>
  );
} 