import React, { useState } from 'react';
import ScoreInput from './ScoreInput';
import TrendChart from './TrendChart';
import RadarDetail from './RadarDetail';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-md">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                我的成绩单
              </h1>
              <p className="text-xs text-slate-500">记录点滴进步</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
            <GraduationCap size={16} />
            <span>目标：武汉大学</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        
        {/* 1. Score Input Section */}
        <section className="animate-fade-in-down">
          <ScoreInput onSuccess={handleSuccess} />
        </section>

        {/* 2. Trend Section */}
        <section>
          <TrendChart refreshTrigger={refreshTrigger} />
        </section>

        {/* 3. Radar Detail Section */}
        <section>
          <RadarDetail refreshTrigger={refreshTrigger} />
        </section>

        <div className="text-center text-slate-400 text-sm py-8">
          加油，你是最棒的！ 💪
        </div>

      </main>
    </div>
  );
}
