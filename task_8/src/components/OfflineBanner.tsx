import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export const OfflineBanner = () => {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
      You are offline. Showing cached data — changes need a connection.
    </div>
  );
};
