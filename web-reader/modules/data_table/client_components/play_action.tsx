'use client';

import { PlayIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface PlayActionProps {
  id: string;
  action: (id: string) => Promise<any>;
}

export default function PlayAction({ id, action }: PlayActionProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsActive(true);
      await action(id);
      // Keep the success color for 1 second
      setTimeout(() => setIsActive(false), 1000);
    } catch (error) {
      console.error('Play action failed:', error);
      setIsActive(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-colors duration-300 ${
        isActive 
          ? 'text-blue-600 hover:text-blue-900' 
          : 'text-green-600 hover:text-green-900'
      }`}
      title="Play"
    >
      <PlayIcon className="h-5 w-5" />
    </button>
  );
} 