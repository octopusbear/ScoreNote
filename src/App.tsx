import { useState, useEffect } from 'react';
import ScoreInput from './components/ScoreInput';
import TrendChart from './components/TrendChart';
import RadarDetail from './components/RadarDetail';
import SettingsModal from './components/SettingsModal';
import { BookOpen, Target, Settings, Sparkles, ArrowUpCircle } from 'lucide-react';
import { calculateCurrentTarget, getLatestScore } from './api';
import { UniversityTarget } from './types';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // V4.0 新增状态
  const [currentTarget, setCurrentTarget] = useState<{ target: UniversityTarget; gap: number; isPassed: boolean } | null>(null);
  const [, setLatestScore] = useState(0);

  // 每次数据更新时，重新计算“阶梯式目标”
  useEffect(() => {
    const score = getLatestScore();
    setLatestScore(score);
    const targetData = calculateCurrentTarget(score);
    setCurrentTarget(targetData);
  }, [refreshTrigger]);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Header (V4.0 Glassmorphism) --- */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200/50">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                ScoreNote 
                <span className="text-[10px] font-extrabold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">V4.0</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* 动态目标胶囊 (V4.0 Highlight) */}
            {currentTarget ? (
              <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-500 animate-fade-in ${
                currentTarget.isPassed 
                  ? "bg-amber-50 text-amber-700 border-amber-200" // 已登顶
                  : "bg-slate-900 text-white border-transparent shadow-md shadow-slate-200" // 冲刺中
              }`}>
                {currentTarget.isPassed ? <Sparkles size={14} className="text-amber-500" /> : <Target size={14} className="text-blue-300" />}
                
                <span>
                  {currentTarget.isPassed ? "已登顶: " : "冲刺: "} 
                  {currentTarget.target.name}
                </span>
                
                {!currentTarget.isPassed && (
                  <>
                    <span className="opacity-30">|</span>
                    <span className="text-blue-200">差 {currentTarget.gap} 分</span>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                <span>🎯 请先设置目标</span>
              </div>
            )}

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
              title="设置与数据"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        
        {/* 1. Score Input */}
        <ScoreInput onSuccess={handleDataChange} />
        
        {/* 2. Charts */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TrendChart refreshTrigger={refreshTrigger} />
          <RadarDetail refreshTrigger={refreshTrigger} />
        </div>

        {/* Footer Quote */}
        <div className="text-center py-12 opacity-60">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
             <ArrowUpCircle size={20} className="text-blue-500 animate-bounce" />
          </div>
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">
            Keep Moving Forward
          </p>
        </div>

      </main>

      {/* --- Modals --- */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onDataChange={handleDataChange}
      />
    </div>
  );
}