
"use client"

import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // CAPTCHA State
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, result: a + b });
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [view]);

  const validateCaptcha = () => {
    if (parseInt(captchaInput) !== captcha.result) {
      toast({
        variant: "destructive",
        title: "Ошибка CAPTCHA",
        description: "Пожалуйста, решите пример правильно."
      });
      generateCaptcha();
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!validateCaptcha()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка авторизации",
        description: "Неверная почта или пароль."
      });
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    if (!validateCaptcha()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profileData = {
        id: user.uid,
        fullName: fullName,
        email: email,
      };

      const docRef = doc(db, 'user_profiles', user.uid);
      setDoc(docRef, profileData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Успех",
        description: "Аккаунт успешно создан!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт."
      });
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profileData = {
        id: user.uid,
        fullName: user.displayName || 'Google User',
        email: user.email || '',
      };

      const docRef = doc(db, 'user_profiles', user.uid);
      setDoc(docRef, profileData, { merge: true })
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Успех",
        description: `Добро пожаловать, ${user.displayName || 'в систему'}!`
      });
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          variant: "destructive",
          title: "Ошибка входа",
          description: error.message || "Не удалось войти через Google."
        });
      }
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
    if (!validateCaptcha()) return;

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
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const CaptchaField = () => (
    <div className="mt-4 mb-2 p-3 bg-[#34383D]/30 rounded-lg border border-[#4F5561]/20">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-[#6F7787] font-bold uppercase tracking-widest">Проверка (CAPTCHA)</p>
        <button 
          type="button" 
          onClick={generateCaptcha}
          className="text-[#007EA5] hover:rotate-180 transition-transform duration-500"
          title="Обновить"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-center font-bold text-lg bg-[#1C1E21] py-2 rounded border border-[#34383D] select-none">
          {captcha.a} + {captcha.b} =
        </div>
        <input
          type="number"
          placeholder="?"
          className="w-16 h-[46px] bg-[#1C1E21] border border-[#34383D] rounded-md text-center font-bold text-white focus:outline-none focus:border-[#007EA5] transition-colors"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
        />
      </div>
    </div>
  );

  if (view === 'forgot') {
    return (
      <div className="auth-wrapper">
        <h1 className="text-white text-xl font-bold mb-6 text-center">Восстановление</h1>
        <form onSubmit={handleForgotPassword} className="signin-form">
          <input
            type="email"
            placeholder="Ваш Email"
            className="signin-input rounded-lg mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <CaptchaField />
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
    <div className="auth-wrapper !mt-[-140px]">
      <h1 className="text-white text-xl font-bold mb-6 text-center">
        {view === 'login' ? 'Вход в систему' : 'Регистрация'}
      </h1>
      <form onSubmit={view === 'login' ? handleLogin : handleSignUp} className="signin-form">
        {view === 'signup' && (
          <input
            type="text"
            placeholder="Полное имя"
            className="signin-input rounded-t-lg border-b border-[#34383D]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className={`signin-input ${view === 'login' ? 'rounded-t-lg' : ''} border-b border-[#34383D]`}
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
        
        <CaptchaField />

        <button type="submit" className="signin-submit !top-[auto] !bottom-[-26px] !right-[50%] !translate-x-[50%]" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={25} />}
        </button>
      </form>
      
      <div className="mt-12 px-5 flex flex-col gap-2">
        <p className="text-[#4F5561] font-bold text-xs flex justify-between">
          <button 
            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            className="text-[#6F7787] hover:border-b border-[#6F7787] transition-all"
          >
            {view === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
          </button>
          {view === 'login' && (
            <button 
              onClick={() => setView('forgot')}
              className="text-[#6F7787] hover:border-b border-[#6F7787] transition-all"
            >
              Забыли пароль?
            </button>
          )}
        </p>
      </div>

      <button onClick={handleGoogleLogin} className="social-login-btn mt-6" disabled={loading}>
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
          <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"/>
          <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
          <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
        </svg>
        Войти через Google
      </button>
    </div>
  );
}
