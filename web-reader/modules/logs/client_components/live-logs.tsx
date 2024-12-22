'use client';
import { useEffect, useRef, useState } from 'react';

export default function LiveLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/logs');

    eventSource.onmessage = (event) => {
      const newLogs = JSON.parse(event.data);
      setLogs(newLogs);
    };

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 
        overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
    >
      {logs.map((log, index) => (
        <div key={index} className="py-1">
          {log}
        </div>
      ))}
    </div>
  );
}
