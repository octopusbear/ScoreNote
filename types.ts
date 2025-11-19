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

export interface AddExamResponse {
  status: string;
  total_score: number;
  diff_from_last: number | null;
  is_improved: boolean;
  trend_message: string;
  goal_message: string;
}

export interface CurveData {
  labels: string[];
  scores: (number | null)[];
  subject?: string;
}