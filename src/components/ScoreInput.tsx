import React, { useState } from "react";
import { addExam } from "../api";
import { AddExamResponse } from "../types";
import { Save, Trophy, TrendingUp, TrendingDown, Sparkles, Target, ArrowRight, Calculator } from "lucide-react";

interface Props {
  onSuccess: () => void;
}

const ScoreInput: React.FC<Props> = ({ onSuccess }) => {
  const [scores, setScores] = useState({ 
    chinese: "", math: "", english: "", 
    physics: "", chemistry: "", biology: "",
    history: "", geography: "", politics: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AddExamResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d{0,3}$/.test(value)) {
      setScores(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const p = (val: string) => (val ? parseInt(val) : undefined);
      const payload = {
        chinese: p(scores.chinese), math: p(scores.math), english: p(scores.english),
        physics: p(scores.physics), chemistry: p(scores.chemistry), biology: p(scores.biology),
        history: p(scores.history), geography: p(scores.geography), politics: p(scores.politics),
      };
      const res = await addExam(payload);
      setResult(res);
      setScores({ chinese: "", math: "", english: "", physics: "", chemistry: "", biology: "", history: "", geography: "", politics: "" });
      onSuccess();
    } catch (err) { 
      alert("保存失败，请重试"); 
    } finally { 
      setLoading(false); 
    }
  };

  const subjects = [
    { id: "chinese", label: "语文", color: "text-rose-600 bg-rose-50 focus:ring-rose-200" },
    { id: "math", label: "数学", color: "text-emerald-600 bg-emerald-50 focus:ring-emerald-200" },
    { id: "english", label: "英语", color: "text-violet-600 bg-violet-50 focus:ring-violet-200" },
    { id: "physics", label: "物理", color: "text-blue-600 bg-blue-50 focus:ring-blue-200" },
    { id: "chemistry", label: "化学", color: "text-cyan-600 bg-cyan-50 focus:ring-cyan-200" },
    { id: "biology", label: "生物", color: "text-lime-600 bg-lime-50 focus:ring-lime-200" },
    { id: "politics", label: "政治", color: "text-pink-600 bg-pink-50 focus:ring-pink-200" },
    { id: "history", label: "历史", color: "text-amber-600 bg-amber-50 focus:ring-amber-200" },
    { id: "geography", label: "地理", color: "text-sky-600 bg-sky-50 focus:ring-sky-200" },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
      
      {/* 标题区域 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white shadow-sm">
               <Sparkles size={16} className="fill-white" />
            </div>
            记录新成绩
          </h2>
          <p className="text-slate-400 text-xs font-medium ml-1">Update your latest scores</p>
        </div>
      </div>
      
      {/* 输入网格 */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
        {subjects.map((subj) => (
          <div key={subj.id} className="group">
            <label className="block text-[11px] font-bold text-slate-400 mb-2 text-center group-hover:text-slate-600 transition-colors">{subj.label}</label>
            <input 
              type="text" 
              name={subj.id} 
              value={scores[subj.id as keyof typeof scores]} 
              onChange={handleChange} 
              placeholder="-"
              autoComplete="off"
              className={`w-full h-14 rounded-2xl border-0 text-center text-xl font-black transition-all placeholder-slate-200 ${subj.color} focus:ring-4 ring-inset outline-none shadow-sm`} 
            />
          </div>
        ))}
      </div>

      {/* 按钮：V4.0 渐变色 */}
      <button 
        onClick={handleSubmit} 
        disabled={loading} 
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-200 disabled:opacity-70 disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Calculator size={18} className="animate-spin" /> 计算智能分析...
          </span>
        ) : (
          <>
            <Save size={18} /> 保存并生成分析报告
          </>
        )}
      </button>

      {/* 结果分析卡片 */}
      {result && (
        <div className="mt-8 animate-slide-up">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-100">
            
            {/* 装饰光晕 */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>

            <div className="relative z-10">
              {/* 分数头 */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Score</div>
                  <div className="text-6xl font-black text-slate-800 tracking-tighter leading-none">
                    {result.total_score}
                  </div>
                </div>
                
                {result.diff_from_last !== null && (
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border ${result.is_improved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-500 border-orange-100'}`}>
                    {result.is_improved ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    <span>{result.is_improved ? '+' : ''}{result.diff_from_last}</span>
                  </div>
                )}
              </div>

              {/* AI 评语框 */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm mb-5">
                 <div className="flex gap-3">
                    <div className="mt-1">
                       <Sparkles size={18} className="text-violet-500 fill-violet-100" />
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {result.analysis_result.comment}
                    </p>
                 </div>
              </div>

              {/* 目标徽章 */}
              <div className="flex flex-wrap gap-2">
                {result.analysis_result.reached_goals.map(goal => (
                  <div key={goal} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-xs font-bold shadow-sm">
                    <Trophy size={12} className="fill-amber-500 text-amber-500" />
                    <span>已达成: {goal}</span>
                  </div>
                ))}
                
                {result.analysis_result.next_goal && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200 text-xs font-bold animate-pulse">
                    <Target size={12} className="text-blue-300"/>
                    <span>Target: {result.analysis_result.next_goal.name}</span>
                    <ArrowRight size={12} className="opacity-50"/>
                    <span className="text-blue-200">差{result.analysis_result.next_goal.gap}分</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScoreInput;