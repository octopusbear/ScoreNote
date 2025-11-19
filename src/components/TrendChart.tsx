import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
import { getSubjectCurve, getTotalCurve, getExamList } from "../api";
import { UniversityTarget } from "../types";

interface Props {
  refreshTrigger: number;
}

const ALL_SUBJECTS = [
  { key: "total", label: "总分", color: "#4f46e5" }, // Indigo
  { key: "chinese", label: "语文", color: "#e11d48" },
  { key: "math", label: "数学", color: "#059669" },
  { key: "english", label: "英语", color: "#7c3aed" },
  { key: "physics", label: "物理", color: "#2563eb" },
  { key: "chemistry", label: "化学", color: "#0d9488" },
  { key: "biology", label: "生物", color: "#65a30d" },
  { key: "politics", label: "政治", color: "#db2777" },
  { key: "history", label: "历史", color: "#d97706" },
  { key: "geography", label: "地理", color: "#0284c7" },
];

const TrendChart: React.FC<Props> = ({ refreshTrigger }) => {
  const [activeTab, setActiveTab] = useState("total");
  const [chartData, setChartData] = useState<any[]>([]);
  const [goals, setGoals] = useState<UniversityTarget[]>([]);
  const [visibleTabs, setVisibleTabs] = useState(ALL_SUBJECTS);

  useEffect(() => {
    getExamList().then(exams => {
      if (exams.length === 0) return;
      const availableKeys = new Set(["total"]);
      exams.forEach(exam => {
        ALL_SUBJECTS.forEach(s => {
          if (s.key === 'total') return;
          // @ts-ignore
          const val = exam[s.key];
          if (val !== null && val !== undefined) availableKeys.add(s.key);
        });
      });
      setVisibleTabs(ALL_SUBJECTS.filter(s => availableKeys.has(s.key)));
    });
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      const data = activeTab === "total" ? await getTotalCurve() : await getSubjectCurve(activeTab);
      setChartData(data.labels.map((l, i) => ({ name: l, score: data.scores[i] })));
      
      if (activeTab === "total" && data.goals) {
        setGoals(data.goals);
      } else {
        setGoals([]);
      }
    };
    fetchData();
  }, [activeTab, refreshTrigger]);

  const activeColor = ALL_SUBJECTS.find(s => s.key === activeTab)?.color || "#4f46e5";

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
          成绩趋势
        </h2>
        <div className="flex bg-slate-50 p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide w-full sm:w-auto border border-slate-100">
          {visibleTabs.map((subj) => (
            <button 
              key={subj.key} 
              onClick={() => setActiveTab(subj.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${activeTab === subj.key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {subj.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.2}/><stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 500}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ color: activeColor, fontWeight: 'bold' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={activeColor} 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorScore)" 
                connectNulls 
                animationDuration={1500} 
              />
              
              {goals.map((goal) => (
                 <ReferenceLine 
                    key={goal.id} 
                    y={goal.score} 
                    stroke={goal.color || "#94a3b8"} 
                    strokeDasharray="4 4"
                    strokeOpacity={0.6}
                    ifOverflow="extendDomain"
                 >
                   <Label 
                     value={goal.name} 
                     position="insideTopRight" 
                     fill={goal.color || "#94a3b8"} 
                     fontSize={10}
                     fontWeight={700}
                     offset={10}
                   />
                 </ReferenceLine>
              ))}

            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl grayscale opacity-50">📉</div>
            <span className="text-xs font-medium">暂无趋势数据</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrendChart;