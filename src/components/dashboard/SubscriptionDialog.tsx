
"use client"

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: any[];
  subscription?: any;
}

export default function SubscriptionDialog({ open, onOpenChange, students, subscription }: SubscriptionDialogProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState('Общий');
  const [total, setTotal] = useState('8');
  const [used, setUsed] = useState('0');

  useEffect(() => {
    if (subscription) {
      setStudentId(subscription.studentId || '');
      setType(subscription.type || 'Общий');
      setTotal(String(subscription.sessionsTotal || '8'));
      setUsed(String(subscription.sessionsUsed || '0'));
    } else {
      setStudentId('');
      setType('Общий');
      setTotal('8');
      setUsed('0');
    }
  }, [subscription, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !studentId) return;

    const student = students.find(s => s.id === studentId);

    setLoading(true);
    try {
      const data = {
        userId: user.uid,
        studentId,
        studentName: student?.name || 'Unknown',
        type,
        sessionsTotal: parseInt(total),
        sessionsUsed: parseInt(used),
        status: parseInt(used) >= parseInt(total) ? 'completed' : 'active',
      };

      if (subscription?.id) {
        const subRef = doc(db, 'subscriptions', subscription.id);
        updateDocumentNonBlocking(subRef, data);
        toast({ title: "Абонемент обновлен" });
      } else {
        addDocumentNonBlocking(collection(db, 'subscriptions'), data);
        toast({ title: "Абонемент создан" });
      }
      onOpenChange(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка", description: "Не удалось сохранить абонемент." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1E21] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>{subscription ? 'Редактировать абонемент' : 'Новый абонемент'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Выберите ученика</Label>
            <Select onValueChange={setStudentId} value={studentId} disabled={!!subscription}>
              <SelectTrigger className="bg-[#34383D] border-white/5">
                <SelectValue placeholder="Выберите из списка" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1E21] text-white border-white/10">
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Тип занятий</Label>
            <Input 
              value={type} 
              onChange={e => setType(e.target.value)} 
              placeholder="Например: Йога или Каратэ"
              className="bg-[#34383D] border-white/5"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Всего занятий</Label>
              <Input 
                type="number"
                value={total} 
                onChange={e => setTotal(e.target.value)} 
                className="bg-[#34383D] border-white/5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Использовано</Label>
              <Input 
                type="number"
                value={used} 
                onChange={e => setUsed(e.target.value)} 
                className="bg-[#34383D] border-white/5"
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" className="bg-[#007EA5] hover:bg-[#007EA5]/90" disabled={loading || !studentId}>
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              {subscription ? 'Сохранить' : 'Активировать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
