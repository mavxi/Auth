"use client"

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AuthForm from '@/components/auth/AuthForm';
import { LogOut, User as UserIcon, Mail, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#34383D]">
        <Loader2 className="animate-spin text-[#007EA5]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative">
      {!user ? (
        <AuthForm />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <div className="w-full max-w-md bg-[#1C1E21] rounded-xl p-8 shadow-2xl border border-[#4F5561]">
            <div className="flex items-center justify-center w-20 h-20 bg-[#34383D] rounded-full mx-auto mb-6">
              <UserIcon size={40} className="text-[#007EA5]" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">Добро пожаловать</h2>
            <p className="text-[#6F7787] text-center mb-8">{profile?.fullName || user.email}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#34383D]">
                <Mail size={20} className="text-[#007EA5]" />
                <div>
                  <p className="text-xs text-[#6F7787] font-bold uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold">{user.email}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive hover:text-white transition-all duration-300 font-bold mt-6"
              >
                <LogOut size={18} />
                Выйти из системы
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </main>
  );
}
