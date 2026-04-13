"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка авторизации",
        description: "Неверная почта или пароль."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите почту для восстановления пароля."
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Успешно",
        description: "Ссылка для восстановления пароля отправлена на вашу почту."
      });
      setView('login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пользователь не найден."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVkPlaceholder = () => {
    toast({
      title: "VK Login",
      description: "Авторизация через VK будет доступна в ближайшее время."
    });
  };

  if (view === 'forgot') {
    return (
      <div className="auth-wrapper">
        <h1 className="text-white text-xl font-bold mb-6 text-center">Восстановление</h1>
        <form onSubmit={handleForgotPassword} className="signin-form">
          <input
            type="text"
            placeholder="Ваш Email"
            className="signin-input rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="signin-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={25} />}
          </button>
        </form>
        <div className="mt-4 px-5">
          <p className="text-[#4F5561] font-bold text-xs">
            <button 
              onClick={() => setView('login')}
              className="text-[#6F7787] hover:border-b border-[#6F7787] transition-all"
            >
              Вернуться к входу
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <h1 className="text-white text-xl font-bold mb-6 text-center">Вход в систему</h1>
      <form onSubmit={handleLogin} className="signin-form">
        <input
          type="text"
          placeholder="Email"
          className="signin-input rounded-t-lg border-b border-[#34383D]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="signin-input rounded-b-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signin-submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={25} />}
        </button>
      </form>
      
      <div className="mt-4 px-5 flex flex-col gap-1">
        <p className="text-[#4F5561] font-bold text-xs">
          <button 
            onClick={() => setView('forgot')}
            className="text-[#6F7787] hover:border-b border-[#6F7787] transition-all"
          >
            Забыли пароль?
          </button>
        </p>
      </div>

      <button onClick={handleVkPlaceholder} className="social-login-btn">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M15.072 0H8.928C2.659 0 0 2.659 0 8.928v6.144C0 21.341 2.659 24 8.928 24h6.144C21.341 24 24 21.341 24 15.072V8.928C24 2.659 21.341 0 15.072 0zm3.84 15.12c.12.336.024.576-.456.576h-1.512c-.384 0-.552-.216-.648-.432 0 0-.768-1.872-1.848-3.096-.36-.36-.504-.48-.672-.48-.096 0-.216.12-.216.456v2.544c0 .384-.12.552-.456.552h-2.376c-1.512 0-2.856-.672-4.08-2.424-1.848-2.64-2.616-4.656-2.616-4.656 0-.216.072-.408.456-.408h1.512c.336 0 .48.168.6.432 0 0 .576 1.416 1.392 2.448.264.264.384.336.528.336.072 0 .168-.072.168-.312V10.2c0-.528-.144-.768-.6-.84-.24-.048-.408-.096-.408-.096-.216-.024-.312-.192-.12-.456.12-.144.432-.312.816-.312h2.208c.384 0 .528.216.528.576V12.12c0 .24.096.312.192.312.144 0 .264-.072.528-.336 1.056-1.536 1.488-3.144 1.488-3.144.072-.264.24-.432.576-.432h1.512c.456 0 .552.24.456.576-.144.624-1.56 2.664-1.56 2.664-.264.336-.336.48 0 .816.24.24 1.056 1.056 1.584 1.848.336.48.528.84.528.84z"/>
        </svg>
        Войти через ВКонтакте
      </button>
    </div>
  );
}
