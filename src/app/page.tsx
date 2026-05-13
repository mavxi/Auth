
"use client"

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/dashboard/Dashboard';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#34383D]">
        <Loader2 className="animate-spin text-[#007EA5]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {!user ? (
        <LandingPage />
      ) : (
        <Dashboard />
      )}
      <Toaster />
    </main>
  );
}
