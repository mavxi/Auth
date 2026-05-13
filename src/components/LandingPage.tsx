
"use client"

import React, { useState } from 'react';
import AuthForm from './auth/AuthForm';
import { CheckCircle, Users, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return (
      <div className="min-h-screen bg-[#34383D] flex items-center justify-center">
        <div className="relative">
          <button 
            onClick={() => setShowAuth(false)}
            className="absolute -top-12 left-0 text-[#6F7787] hover:text-white transition-colors text-sm font-bold"
          >
            ← Назад на главную
          </button>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#34383D] text-white">
      {/* Hero Section */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#007EA5] rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold tracking-tight">AuthFlow Studio</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setShowAuth(true)}
          className="text-[#6F7787] hover:text-white hover:bg-white/5 font-bold"
        >
          Войти
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Управляйте вашей студией <span className="text-[#007EA5]">проще</span>
          </h1>
          <p className="text-[#6F7787] text-lg mb-8 max-w-lg">
            Учет учеников, контроль абонементов и статистика посещаемости в одном безопасном месте. Создано для школ танцев, йоги и единоборств.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={() => setShowAuth(true)}
              className="bg-[#007EA5] hover:bg-[#007EA5]/90 text-white px-8 h-14 rounded-xl font-bold text-lg"
            >
              Начать бесплатно <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FeatureCard 
            icon={<Users className="text-[#007EA5]" />}
            title="База учеников"
            desc="Храните контакты и историю каждого клиента."
          />
          <FeatureCard 
            icon={<Calendar className="text-[#007EA5]" />}
            title="Абонементы"
            desc="Следите за остатком занятий в реальном времени."
          />
          <FeatureCard 
            icon={<CheckCircle className="text-[#007EA5]" />}
            title="Отметки"
            desc="Один клик — и занятие списано."
          />
          <FeatureCard 
            icon={<BarChart3 className="text-[#007EA5]" />}
            title="Аналитика"
            desc="Визуальные отчеты о росте вашей школы."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#1C1E21] p-6 rounded-2xl border border-white/5 hover:border-[#007EA5]/30 transition-all group">
      <div className="w-12 h-12 bg-[#34383D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-[#6F7787] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
