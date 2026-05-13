
"use client"

import React, { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { 
  Users, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  CheckCircle2,
  Search,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import StudentDialog from './StudentDialog';
import SubscriptionDialog from './SubscriptionDialog';

export default function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);

  // Queries
  const studentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'students'), where('userId', '==', user.uid));
  }, [user, db]);

  const subsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'subscriptions'), where('userId', '==', user.uid));
  }, [user, db]);

  const { data: students, isLoading: loadingStudents } = useCollection(studentsQuery);
  const { data: subs, isLoading: loadingSubs } = useCollection(subsQuery);

  const handleMarkAttendance = async (sub: any) => {
    if (sub.sessionsUsed >= sub.sessionsTotal) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Все занятия по этому абонементу использованы."
      });
      return;
    }

    try {
      const subRef = doc(db, 'subscriptions', sub.id);
      await updateDoc(subRef, {
        sessionsUsed: sub.sessionsUsed + 1,
        status: (sub.sessionsUsed + 1) === sub.sessionsTotal ? 'completed' : 'active'
      });
      toast({
        title: "Отметка поставлена",
        description: `Списано занятие для ${sub.studentName}. Осталось: ${sub.sessionsTotal - (sub.sessionsUsed + 1)}`
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить абонемент."
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#34383D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1E21] border-r border-white/5 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-[#007EA5] rounded flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold">AuthFlow</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink active icon={<LayoutDashboard size={20} />} label="Обзор" />
          <SidebarLink icon={<Users size={20} />} label="Ученики" />
          <SidebarLink icon={<CreditCard size={20} />} label="Абонементы" />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#34383D] rounded-full flex items-center justify-center">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-[#6F7787]">Администратор</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-2 text-sm font-bold text-[#6F7787] hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Рабочая область</h1>
            <p className="text-[#6F7787]">Добро пожаловать обратно, {user?.displayName || 'коллега'}.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsStudentDialogOpen(true)} variant="outline" className="border-white/10 hover:bg-white/5">
              <Plus className="mr-2" size={18} /> Ученик
            </Button>
            <Button onClick={() => setIsSubDialogOpen(true)} className="bg-[#007EA5] hover:bg-[#007EA5]/90">
              <Plus className="mr-2" size={18} /> Абонемент
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Всего учеников" value={students?.length || 0} icon={<Users className="text-[#007EA5]" />} />
          <StatCard title="Активные абонементы" value={subs?.filter(s => s.status === 'active').length || 0} icon={<CreditCard className="text-green-500" />} />
          <StatCard title="Завершено" value={subs?.filter(s => s.status === 'completed').length || 0} icon={<CheckCircle2 className="text-yellow-500" />} />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-[#1C1E21] border border-white/5">
              <TabsTrigger value="active" className="data-[state=active]:bg-[#34383D]">Активные</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#34383D]">Все</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loadingSubs ? (
              <Loader2 className="animate-spin text-[#007EA5]" />
            ) : subs?.filter(s => s.status === 'active').map(sub => (
              <SubscriptionCard key={sub.id} sub={sub} onMark={() => handleMarkAttendance(sub)} />
            )) || <p className="text-[#6F7787]">Нет активных абонементов.</p>}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
             {/* Table for all subscriptions could go here */}
             <div className="bg-[#1C1E21] rounded-xl border border-white/5 p-6">
               <h3 className="font-bold mb-4">История всех абонементов</h3>
               {subs?.map(sub => (
                 <div key={sub.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                   <div>
                     <p className="font-bold">{sub.studentName}</p>
                     <p className="text-xs text-[#6F7787]">{sub.type} • {sub.sessionsUsed}/{sub.sessionsTotal}</p>
                   </div>
                   <div className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                     sub.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                   }`}>
                     {sub.status}
                   </div>
                 </div>
               ))}
             </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <StudentDialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen} />
        <SubscriptionDialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen} students={students || []} />
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active ? 'bg-[#007EA5] text-white shadow-lg shadow-[#007EA5]/20' : 'text-[#6F7787] hover:text-white hover:bg-white/5'
    }`}>
      {icon} {label}
    </a>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
  return (
    <Card className="bg-[#1C1E21] border-white/5">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[#6F7787] text-sm font-bold uppercase tracking-wider">{title}</p>
          <div className="w-10 h-10 bg-[#34383D] rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-3xl font-bold">{value}</h3>
      </CardContent>
    </Card>
  );
}

function SubscriptionCard({ sub, onMark }: { sub: any, onMark: () => void }) {
  const progress = (sub.sessionsUsed / sub.sessionsTotal) * 100;
  
  return (
    <Card className="bg-[#1C1E21] border-white/5 hover:border-[#007EA5]/30 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold truncate">{sub.studentName}</CardTitle>
        <span className="text-[10px] bg-[#007EA5]/10 text-[#007EA5] px-2 py-1 rounded-full font-bold uppercase">
          {sub.type}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#6F7787]">Использовано занятий</span>
          <span className="font-bold">{sub.sessionsUsed} / {sub.sessionsTotal}</span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <Button onClick={onMark} className="w-full bg-[#34383D] hover:bg-[#007EA5] hover:text-white transition-all">
          <CheckCircle2 className="mr-2" size={16} /> Отметить посещение
        </Button>
      </CardContent>
    </Card>
  );
}
