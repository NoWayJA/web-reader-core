import LiveLogs from '@/web-reader/modules/logs/client_components/live-logs';

export default function Page() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">System Logs</h2>
      <LiveLogs />
    </div>
  );
} 