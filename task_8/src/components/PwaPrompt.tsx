import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!needRefresh && !offlineReady && !installEvent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-80 z-50 bg-white border border-gray-200 shadow-lg p-4 text-xs space-y-3">
      {needRefresh && <p>A new version is available.</p>}
      {!needRefresh && offlineReady && <p>The app is ready to work offline.</p>}
      {!needRefresh && !offlineReady && installEvent && (
        <p>Install this app on your device for quick, offline access.</p>
      )}
      <div className="flex gap-2 justify-end">
        {needRefresh && (
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 cursor-pointer"
          >
            Reload
          </button>
        )}
        {!needRefresh && installEvent && (
          <button
            type="button"
            onClick={async () => {
              await installEvent.prompt();
              setInstallEvent(null);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 cursor-pointer"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setNeedRefresh(false);
            setOfflineReady(false);
            setInstallEvent(null);
          }}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
