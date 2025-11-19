import React, { useState, useEffect } from 'react';
import { X, Download, Upload, Trash2, Plus, Target, Award, AlertTriangle } from 'lucide-react';
import { getUniversityTargets, saveUniversityTargets, exportDataToJson, importDataFromJson, clearAllData } from '../api';
import { UniversityTarget } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onDataChange }) => {
  const [targets, setTargets] = useState<UniversityTarget[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalScore, setNewGoalScore] = useState("");

  useEffect(() => {
    if (isOpen) setTargets(getUniversityTargets());
  }, [isOpen]);

  const handleAddTarget = () => {
    if (!newGoalName || !newGoalScore) return;
    const score = parseInt(newGoalScore);
    if (isNaN(score)) return;

    const newTarget: UniversityTarget = {
      id: Date.now().toString(),
      name: newGoalName,
      score: score,
      color: '#3b82f6'
    };

    const updated = [...targets, newTarget];
    setTargets(updated);
    saveUniversityTargets(updated);
    setNewGoalName("");
    setNewGoalScore("");
    onDataChange();
  };

  const handleDeleteTarget = (id: string) => {
    const updated = targets.filter(t => t.id !== id);
    setTargets(updated);
    saveUniversityTargets(updated);
    onDataChange();
  };

  const handleClear = async () => {
    if (confirm("⚠️ 严重警告：\n\n即将清空所有历史成绩和设置！\n此操作不可恢复！\n\n确定要继续吗？")) {
      await clearAllData();
      onDataChange();
      onClose();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      await importDataFromJson(file);
      onDataChange();
      onClose();
      alert("数据恢复成功！");
    } catch (err) {
      alert("文件格式错误");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <h3 className="text-xl font-extrabold text-slate-800">Settings</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* 目标管理 */}
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={14} /> 目标大学管理
            </h4>
            
            <div className="space-y-3 mb-4">
              {targets.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-colors group">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                        {t.name[0]}
                     </div>
                     <div>
                       <div className="font-bold text-slate-700 text-sm">{t.name}</div>
                       <div className="text-xs text-slate-400 font-medium">需达到 {t.score} 分</div>
                     </div>
                  </div>
                  <button onClick={() => handleDeleteTarget(t.id)} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {targets.length === 0 && <div className="text-center text-slate-300 text-xs py-2">暂无目标，请添加</div>}
            </div>

            {/* 添加栏 */}
            <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input 
                className="flex-1 bg-transparent border-none px-3 text-sm font-medium focus:ring-0 outline-none placeholder-slate-400"
                placeholder="校名"
                value={newGoalName}
                onChange={e => setNewGoalName(e.target.value)}
              />
              <div className="w-px h-4 bg-slate-200"></div>
              <input 
                className="w-16 bg-transparent border-none px-2 text-sm font-medium focus:ring-0 outline-none placeholder-slate-400 text-center"
                placeholder="分数"
                type="number"
                value={newGoalScore}
                onChange={e => setNewGoalScore(e.target.value)}
              />
              <button 
                onClick={handleAddTarget}
                disabled={!newGoalName || !newGoalScore}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl p-2 transition-colors shadow-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </section>

          <div className="border-t border-slate-100"></div>

          {/* 数据管理 */}
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={14} /> 数据备份与恢复
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={exportDataToJson} className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all group">
                <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Download size={20} />
                </div>
                <span className="text-xs font-bold text-slate-600">导出备份</span>
              </button>
              
              <label className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all cursor-pointer group">
                <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-bold text-slate-600">{isImporting ? "读取中..." : "导入数据"}</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={isImporting} />
              </label>
            </div>
          </section>

          {/* 危险区域 */}
          <section className="pt-4">
             <button onClick={handleClear} className="w-full py-3.5 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100">
                <AlertTriangle size={14} /> 清空所有数据
             </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;