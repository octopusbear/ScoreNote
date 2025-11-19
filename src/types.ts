export interface ExamRecord {
  id: number;
  exam_name: string;
  exam_date: string;
  total_score: number;
  chinese: number | null;
  math: number | null;
  english: number | null;
  physics: number | null;
  chemistry: number | null;
  biology: number | null;
  history: number | null;
  geography: number | null;
  politics: number | null;
  [key: string]: number | string | null;
}

export interface ScoresInput {
  chinese?: number;
  math?: number;
  english?: number;
  physics?: number;
  chemistry?: number;
  biology?: number;
  history?: number;
  geography?: number;
  politics?: number;
}

// V3.0 新增：多目标定义
export interface UniversityTarget {
  id: string;
  name: string;
  score: number;
  color?: string; 
}

export interface AddExamResponse {
  status: string;
  total_score: number;
  diff_from_last: number | null;
  is_improved: boolean;
  trend_message: string;
  // V3.0 新增：智能分析结果
  analysis_result: {
    reached_goals: string[]; // 已达成的目标名称
    next_goal?: { name: string; gap: number }; // 下一个最近的目标
    comment: string; // 综合AI评语
  };
}

export interface CurveData {
  labels: string[];
  scores: (number | null)[];
  subject?: string;
  goals?: UniversityTarget[]; // 用于图表画参考线
}