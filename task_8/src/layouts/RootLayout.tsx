import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toaster } from "@/components/Toaster";
import { OfflineBanner } from "@/components/OfflineBanner";
import { PwaPrompt } from "@/components/PwaPrompt";

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <OfflineBanner />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <PwaPrompt />
    </div>
  );
};
