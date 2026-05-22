
"use client"

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: any;
}

export default function StudentDialog({ open, onOpenChange, student }: StudentDialogProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setPhone(student.phone || '');
    } else {
      setName('');
      setPhone('');
    }
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    setLoading(true);
    try {
      if (student?.id) {
        const studentRef = doc(db, 'students', student.id);
        updateDocumentNonBlocking(studentRef, {
          name,
          phone,
        });
        toast({ title: "Данные ученика обновлены" });
      } else {
        addDocumentNonBlocking(collection(db, 'students'), {
          userId: user.uid,
          name,
          phone,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Ученик добавлен" });
      }
      onOpenChange(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка", description: "Не удалось сохранить изменения." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1E21] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>{student ? 'Редактировать ученика' : 'Добавить ученика'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>ФИО Ученика</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Иван Иванов"
              className="bg-[#34383D] border-white/5"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="+7 (___) ___-__-__"
              className="bg-[#34383D] border-white/5"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" className="bg-[#007EA5] hover:bg-[#007EA5]/90" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              {student ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
