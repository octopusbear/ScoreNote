import { AddExamResponse, CurveData, ExamRecord, ScoresInput } from "./types";

const DB_KEY = "exams_db_v1";
const GOALS = [
  { score: 680, msg: "清华北大在向你招手！" },
  { score: 650, msg: "复旦交大不是梦！" },
  { score: 600, msg: "武汉大学在向你招手～" },
  { score: 550, msg: "211 重点大学稳了！" },
  { score: 500, msg: "一本线就在眼前，冲！" },
  { score: 450, msg: "保持状态，二本很稳！" },
  { score: 0,   msg: "基础很重要，加油！" },
];

const getExams = () => {
  const str = localStorage.getItem(DB_KEY);
  return str ? JSON.parse(str) : [];
};

const saveExams = (exams: ExamRecord[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(exams));
};

export const addExam = async (scores: ScoresInput): Promise<AddExamResponse> => {
  await new Promise(r => setTimeout(r, 600));
  const currentExams = getExams();
  
  // 计算总分 (自动处理 undefined/null)
  const total = 
    (scores.chinese || 0) + (scores.math || 0) + (scores.english || 0) + 
    (scores.physics || 0) + (scores.chemistry || 0) + (scores.biology || 0) +
    (scores.history || 0) + (scores.geography || 0) + (scores.politics || 0);

  const newRecord: ExamRecord = {
    id: Date.now(),
    exam_name: `第${currentExams.length + 1}次记录`,
    exam_date: new Date().toISOString().split('T')[0],
    total_score: total,
    chinese: scores.chinese || null,
    math: scores.math || null,
    english: scores.english || null,
    physics: scores.physics || null,
    chemistry: scores.chemistry || null,
    biology: scores.biology || null,
    history: scores.history || null,
    geography: scores.geography || null,
    politics: scores.politics || null,
  };
  
  const lastRecord = currentExams.length > 0 ? currentExams[currentExams.length - 1] : null;
  let diff = null;
  let isImproved = false;
  let trendMsg = "已记录第一次成绩，加油！";

  if (lastRecord) {
    diff = total - lastRecord.total_score;
    isImproved = diff > 0;
    trendMsg = isImproved 
      ? (diff >= 20 ? "巨大进步！给自己点奖励吧～" : "666，又进步了哦！")
      : "来杯奶茶吗？没关系，调整一下就好。";
  }

  const goal = GOALS.find(g => total >= g.score);
  const goalMsg = goal ? goal.msg : "";

  currentExams.push(newRecord);
  saveExams(currentExams);

  return { status: "ok", total_score: total, diff_from_last: diff, is_improved: isImproved, trend_message: trendMsg, goal_message: goalMsg };
};

export const getExamList = async (): Promise<ExamRecord[]> => { await new Promise(r => setTimeout(r, 300)); return getExams(); };

export const getTotalCurve = async (): Promise<CurveData> => { 
  const exams = getExams(); 
  return { labels: exams.map((e: ExamRecord) => e.exam_name), scores: exams.map((e: ExamRecord) => e.total_score) }; 
};

export const getSubjectCurve = async (subject: string): Promise<CurveData> => { 
  const exams = getExams(); 
  return { 
    subject, 
    labels: exams.map((e: ExamRecord) => e.exam_name), 
    // @ts-ignore
    scores: exams.map((e: ExamRecord) => e[subject] !== null ? e[subject] : null) 
  }; 
};

export const getExamDetail = async (id: number): Promise<ExamRecord | undefined> => { 
  const exams = getExams(); 
  return exams.find((e: ExamRecord) => e.id === id); 
};