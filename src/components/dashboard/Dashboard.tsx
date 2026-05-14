
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
  Loader2,
  Phone,
  Calendar
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import StudentDialog from './StudentDialog';
import SubscriptionDialog from './SubscriptionDialog';

type Section = 'overview' | 'students' | 'subscriptions';

export default function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<Section>('overview');
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
          <div className="w-8 h-8 bg-[#007EA5] rounded flex items-center justify-center font-bold text-white">A</div>
          <span className="text-xl font-bold text-white">AuthFlow</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink 
            active={activeSection === 'overview'} 
            onClick={() => setActiveSection('overview')}
            icon={<LayoutDashboard size={20} />} 
            label="Обзор" 
          />
          <SidebarLink 
            active={activeSection === 'students'} 
            onClick={() => setActiveSection('students')}
            icon={<Users size={20} />} 
            label="Ученики" 
          />
          <SidebarLink 
            active={activeSection === 'subscriptions'} 
            onClick={() => setActiveSection('subscriptions')}
            icon={<CreditCard size={20} />} 
            label="Абонементы" 
          />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#34383D] rounded-full flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white">{user?.email}</p>
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
            <h1 className="text-3xl font-bold mb-1 text-white">
              {activeSection === 'overview' && 'Рабочая область'}
              {activeSection === 'students' && 'Список учеников'}
              {activeSection === 'subscriptions' && 'Управление абонементами'}
            </h1>
            <p className="text-[#6F7787]">Добро пожаловать обратно, {user?.displayName || 'коллега'}.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsStudentDialogOpen(true)} variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Plus className="mr-2" size={18} /> Ученик
            </Button>
            <Button onClick={() => setIsSubDialogOpen(true)} className="bg-[#007EA5] hover:bg-[#007EA5]/90 text-white">
              <Plus className="mr-2" size={18} /> Абонемент
            </Button>
          </div>
        </header>

        {activeSection === 'overview' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard title="Всего учеников" value={students?.length || 0} icon={<Users className="text-[#007EA5]" />} />
              <StatCard title="Активные абонементы" value={subs?.filter(s => s.status === 'active').length || 0} icon={<CreditCard className="text-green-500" />} />
              <StatCard title="Завершено" value={subs?.filter(s => s.status === 'completed').length || 0} icon={<CheckCircle2 className="text-yellow-500" />} />
            </div>

            <Tabs defaultValue="active" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-[#1C1E21] border border-white/5">
                  <TabsTrigger value="active" className="data-[state=active]:bg-[#34383D] text-[#6F7787] data-[state=active]:text-white">Активные</TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-[#34383D] text-[#6F7787] data-[state=active]:text-white">Все</TabsTrigger>
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
                 <div className="bg-[#1C1E21] rounded-xl border border-white/5 p-6">
                   <h3 className="font-bold mb-4 text-white">История всех абонементов</h3>
                   {loadingSubs ? (
                     <Loader2 className="animate-spin text-[#007EA5]" />
                   ) : subs?.length ? (
                     subs.map(sub => (
                       <div key={sub.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                         <div>
                           <p className="font-bold text-white">{sub.studentName}</p>
                           <p className="text-xs text-[#6F7787]">{sub.type} • {sub.sessionsUsed}/{sub.sessionsTotal}</p>
                         </div>
                         <div className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                           sub.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                         }`}>
                           {sub.status === 'active' ? 'Активен' : 'Завершен'}
                         </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-[#6F7787]">Абонементы не найдены.</p>
                   )}
                 </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {activeSection === 'students' && (
          <div className="bg-[#1C1E21] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white">Все ученики</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7787]" size={16} />
                <input 
                  type="text" 
                  placeholder="Поиск..." 
                  className="bg-[#34383D] border-0 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-[#007EA5] outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#34383D]/30 text-[#6F7787] text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Имя</th>
                    <th className="px-6 py-4 font-bold">Телефон</th>
                    <th className="px-6 py-4 font-bold">Дата регистрации</th>
                    <th className="px-6 py-4 font-bold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingStudents ? (
                    <tr><td colSpan={4} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-[#007EA5]" /></td></tr>
                  ) : students?.length ? (
                    students.map(student => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                        <td className="px-6 py-4 text-[#6F7787]">
                          <div className="flex items-center gap-2">
                            <Phone size={14} /> {student.phone || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#6F7787]">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} /> {student.createdAt?.toDate ? student.createdAt.toDate().toLocaleDateString() : '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="text-[#6F7787] hover:text-[#007EA5]">
                            Детали
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-[#6F7787]">Список пуст.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-[#1C1E21] rounded-xl border border-white/5 p-6">
              <h3 className="font-bold mb-6 text-white">Текущие абонементы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {subs?.filter(s => s.status === 'active').map(sub => (
                  <SubscriptionCard key={sub.id} sub={sub} onMark={() => handleMarkAttendance(sub)} />
                )) || <p className="text-[#6F7787]">Нет активных абонементов.</p>}
              </div>
            </div>

            <div className="bg-[#1C1E21] rounded-xl border border-white/5 p-6">
              <h3 className="font-bold mb-4 text-white">Все записи</h3>
              {subs?.map(sub => (
                <div key={sub.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex gap-4 items-center">
                    <div className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-green-500' : 'bg-[#6F7787]'}`} />
                    <div>
                      <p className="font-bold text-white">{sub.studentName}</p>
                      <p className="text-xs text-[#6F7787]">{sub.type} • {sub.sessionsUsed} из {sub.sessionsTotal} занятий</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                      sub.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-[#6F7787]'
                    }`}>
                      {sub.status === 'active' ? 'Активен' : 'Завершен'}
                    </span>
                    <Button variant="ghost" size="sm" className="text-[#6F7787] hover:text-white">Редактировать</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialogs */}
        <StudentDialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen} />
        <SubscriptionDialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen} students={students || []} />
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
        active ? 'bg-[#007EA5] text-white shadow-lg shadow-[#007EA5]/20' : 'text-[#6F7787] hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
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
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}

function SubscriptionCard({ sub, onMark }: { sub: any, onMark: () => void }) {
  const progress = (sub.sessionsUsed / sub.sessionsTotal) * 100;
  
  return (
    <Card className="bg-[#1C1E21] border-white/5 hover:border-[#007EA5]/30 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold truncate text-white">{sub.studentName}</CardTitle>
        <span className="text-[10px] bg-[#007EA5]/10 text-[#007EA5] px-2 py-1 rounded-full font-bold uppercase">
          {sub.type}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#6F7787]">Использовано занятий</span>
          <span className="font-bold text-white">{sub.sessionsUsed} / {sub.sessionsTotal}</span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <Button onClick={onMark} className="w-full bg-[#34383D] hover:bg-[#007EA5] text-white hover:text-white transition-all">
          <CheckCircle2 className="mr-2" size={16} /> Отметить посещение
        </Button>
      </CardContent>
    </Card>
  );
}
