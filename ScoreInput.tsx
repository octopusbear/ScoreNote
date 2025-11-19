import React, { useState } from "react";
import { addExam } from "./api";
import { AddExamResponse } from "./types";
import { Save, Trophy, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

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
      // 重置表单
      setScores({ chinese: "", math: "", english: "", physics: "", chemistry: "", biology: "", history: "", geography: "", politics: "" });
      onSuccess();
    } catch (err) { 
      alert("保存失败"); 
    } finally { 
      setLoading(false); 
    }
  };

  const subjects = [
    { id: "chinese", label: "语文", color: "bg-red-50 text-red-600 focus:ring-red-200" },
    { id: "math", label: "数学", color: "bg-emerald-50 text-emerald-600 focus:ring-emerald-200" },
    { id: "english", label: "英语", color: "bg-purple-50 text-purple-600 focus:ring-purple-200" },
    { id: "physics", label: "物理", color: "bg-indigo-50 text-indigo-600 focus:ring-indigo-200" },
    { id: "chemistry", label: "化学", color: "bg-teal-50 text-teal-600 focus:ring-teal-200" },
    { id: "biology", label: "生物", color: "bg-lime-50 text-lime-600 focus:ring-lime-200" },
    { id: "politics", label: "政治", color: "bg-rose-50 text-rose-600 focus:ring-rose-200" },
    { id: "history", label: "历史", color: "bg-amber-50 text-amber-600 focus:ring-amber-200" },
    { id: "geography", label: "地理", color: "bg-sky-50 text-sky-600 focus:ring-sky-200" },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} /> 记录这次考试
        </h2>
        <p className="text-slate-500 text-sm">只填写考了的科目，没考的留空即可～</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-8">
        {subjects.map((subj) => (
          <div key={subj.id}>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 text-center">{subj.label}</label>
            <input 
              type="text" 
              name={subj.id} 
              value={scores[subj.id as keyof typeof scores]} 
              onChange={handleChange} 
              placeholder="-"
              className={`w-full h-12 rounded-xl border-0 text-center text-xl font-bold transition-all placeholder-slate-300 ${subj.color} focus:ring-4 ring-inset`} 
            />
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
        {loading ? "正在计算..." : <><Save size={20} /> 保存并查看分析</>}
      </button>

      {result && (
        <div className="mt-6 p-5 bg-green-50 border border-green-100 rounded-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${result.is_improved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              {result.is_improved ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-slate-500">本次总分</span>
                <span className="text-2xl font-bold text-slate-800">{result.total_score}</span>
              </div>
              <p className="text-slate-700 font-medium">{result.trend_message}</p>
              {result.goal_message && (
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-green-200/50">
                  <Trophy size={16} className="text-yellow-600"/>
                  <span className="text-yellow-800 text-sm font-bold">{result.goal_message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScoreInput;