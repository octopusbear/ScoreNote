import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSubjectCurve, getTotalCurve, getExamList } from "./api";
import { ExamRecord } from "./types";

interface Props {
  refreshTrigger: number;
}

const ALL_SUBJECTS = [
  { key: "total", label: "总分", color: "#2563eb" },
  { key: "chinese", label: "语文", color: "#dc2626" },
  { key: "math", label: "数学", color: "#059669" },
  { key: "english", label: "英语", color: "#7c3aed" },
  { key: "physics", label: "物理", color: "#4f46e5" },
  { key: "chemistry", label: "化学", color: "#0d9488" },
  { key: "biology", label: "生物", color: "#65a30d" },
  { key: "politics", label: "政治", color: "#e11d48" },
  { key: "history", label: "历史", color: "#d97706" },
  { key: "geography", label: "地理", color: "#0284c7" },
];

const TrendChart: React.FC<Props> = ({ refreshTrigger }) => {
  const [activeTab, setActiveTab] = useState("total");
  const [chartData, setChartData] = useState<any[]>([]);
  const [visibleTabs, setVisibleTabs] = useState(ALL_SUBJECTS);

  // 智能筛选：扫描所有历史成绩，只显示出现过分数的科目
  useEffect(() => {
    getExamList().then(exams => {
      const availableKeys = new Set(["total"]);
      exams.forEach(exam => {
        ALL_SUBJECTS.forEach(s => {
          // @ts-ignore
          const val = exam[s.key];
          if (val !== null && val !== undefined) {
            availableKeys.add(s.key);
          }
        });
      });
      setVisibleTabs(ALL_SUBJECTS.filter(s => availableKeys.has(s.key)));
    });
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      const data = activeTab === "total" ? await getTotalCurve() : await getSubjectCurve(activeTab);
      setChartData(data.labels.map((l, i) => ({ name: l, score: data.scores[i] })));
    };
    fetchData();
  }, [activeTab, refreshTrigger]);

  const activeColor = ALL_SUBJECTS.find(s => s.key === activeTab)?.color || "#3b82f6";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded-full"></span>查看趋势
        </h2>
        <div className="flex bg-slate-100 p-1.5 rounded-xl overflow-x-auto max-w-full scrollbar-hide">
          {visibleTabs.map((subj) => (
            <button 
              key={subj.key} 
              onClick={() => setActiveTab(subj.key)}
              className={`px-4 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${activeTab === subj.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {subj.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[320px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.2}/><stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="score" stroke={activeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300">
            暂无数据，请先录入成绩
          </div>
        )}
      </div>
    </div>
  );
};
export default TrendChart;