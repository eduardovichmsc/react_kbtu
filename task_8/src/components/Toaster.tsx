import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  dismissNotification,
  selectNotifications,
  type Notification,
} from "@/features/notifications/notificationsSlice";
import { cn } from "@/utils/cn";

const Toast = ({ item }: { item: Notification }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissNotification(item.id)), 5000);
    return () => clearTimeout(t);
  }, [dispatch, item.id]);

  return (
    <div
      role="status"
      className={cn(
        "p-3 border text-xs flex items-start justify-between gap-3 shadow-sm bg-white",
        item.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        item.type === "error" && "border-red-200 bg-red-50 text-red-700",
        item.type === "info" && "border-gray-200 text-gray-700"
      )}
    >
      <span>{item.message}</span>
      <button
        type="button"
        onClick={() => dispatch(dismissNotification(item.id))}
        className="font-bold cursor-pointer"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export const Toaster = () => {
  const items = useAppSelector(selectNotifications);
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2">
      {items.map((n) => (
        <Toast key={n.id} item={n} />
      ))}
    </div>
  );
};
