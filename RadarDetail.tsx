import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getExamList, getExamDetail } from "./api";
import { ExamRecord } from "./types";

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
        { key: "chinese", label: "语文" }, { key: "math", label: "数学" }, { key: "english", label: "英语" },
        { key: "physics", label: "物理" }, { key: "chemistry", label: "化学" }, { key: "biology", label: "生物" },
        { key: "politics", label: "政治" }, { key: "history", label: "历史" }, { key: "geography", label: "地理" },
      ];
      
      // 智能筛选：过滤掉没有分数的科目 (null 或 undefined 或 0)
      // 注意：如果你输入了0分，也会被隐藏。如果想显示0分，请把 || 0 去掉
      const chartData = allSubjects
        // @ts-ignore
        .filter(s => data[s.key] !== null && data[s.key] !== undefined)
        // @ts-ignore
        .map(s => ({ subject: s.label, A: data[s.key] || 0, fullMark: 150 }));
        
      setDetailData(chartData);
    });
  }, [selectedId, exams]);

  if (exams.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>单次能力分析
        </h2>
        <select 
          className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-200" 
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
      <div className="h-[320px] w-full flex items-center justify-center bg-slate-50 rounded-xl">
        {detailData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={detailData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="分数" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-slate-400 text-sm">此次考试未录入详细科目分数</div>
        )}
      </div>
    </div>
  );
};
export default RadarDetail;