import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getExamList, getExamDetail } from "../api";
import { ExamRecord } from "../types";

interface Props {
  refreshTrigger: number;
}

const RadarDetail: React.FC<Props> = ({ refreshTrigger }) => {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detailData, setDetailData] = useState<any[]>([]);

  useEffect(() => {
    getExamList().then(list => {
      setExams(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[list.length - 1].id.toString());
    });
  }, [refreshTrigger]);

  useEffect(() => {
    if (!selectedId) return;
    getExamDetail(parseInt(selectedId)).then(data => {
      if (!data) return;
      
      const allSubjects = [
        { key: "chinese", label: "语文", full: 150 }, 
        { key: "math", label: "数学", full: 150 }, 
        { key: "english", label: "英语", full: 150 },
        { key: "physics", label: "物理", full: 100 }, 
        { key: "chemistry", label: "化学", full: 100 }, 
        { key: "biology", label: "生物", full: 100 },
        { key: "politics", label: "政治", full: 100 }, 
        { key: "history", label: "历史", full: 100 }, 
        { key: "geography", label: "地理", full: 100 },
      ];
      
      const chartData = allSubjects
        // @ts-ignore
        .filter(s => data[s.key] !== null && data[s.key] !== undefined)
        // @ts-ignore
        .map(s => ({ subject: s.label, A: data[s.key] || 0, fullMark: s.full }));
        
      setDetailData(chartData);
    });
  }, [selectedId, exams]);

  if (exams.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <div className="w-1.5 h-5 bg-violet-500 rounded-full"></div>
          学科均衡度
        </h2>
        <select 
          className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-violet-100 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" 
          value={selectedId} 
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.exam_name} ({exam.total_score}分)
            </option>
          ))}
        </select>
      </div>
      <div className="h-[320px] w-full flex items-center justify-center bg-slate-50/30 rounded-3xl border border-slate-50">
        {detailData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={detailData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="得分" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.25} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}/>
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-slate-300 text-xs font-medium">无单科数据</div>
        )}
      </div>
    </div>
  );
};
export default RadarDetail;