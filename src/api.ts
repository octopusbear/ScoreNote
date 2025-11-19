import { AddExamResponse, CurveData, ExamRecord, ScoresInput, UniversityTarget } from "./types";

const DB_KEY = "scorenote_db_v3";
const GOALS_KEY = "scorenote_goals_v3";

// 默认预设目标 (冷启动)
const DEFAULT_GOALS: UniversityTarget[] = [
  { id: "g1", name: "清华大学", score: 680, color: "#ef4444" }, // 红
  { id: "g2", name: "武汉大学", score: 610, color: "#f59e0b" }, // 橙
  { id: "g3", name: "一本分数线", score: 520, color: "#3b82f6" }, // 蓝
];

// --- 数据读取/保存 ---

const getExams = (): ExamRecord[] => {
  const str = localStorage.getItem(DB_KEY);
  return str ? JSON.parse(str) : [];
};

const saveExams = (exams: ExamRecord[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(exams));
};

// --- 目标管理 ---

export const getUniversityTargets = (): UniversityTarget[] => {
  const str = localStorage.getItem(GOALS_KEY);
  if (!str) {
    localStorage.setItem(GOALS_KEY, JSON.stringify(DEFAULT_GOALS));
    return DEFAULT_GOALS;
  }
  return JSON.parse(str);
};

export const saveUniversityTargets = (targets: UniversityTarget[]) => {
  // 自动按分数降序排列
  const sorted = targets.sort((a, b) => b.score - a.score);
  localStorage.setItem(GOALS_KEY, JSON.stringify(sorted));
};

/**
 * V4.0 核心：计算当前应该攻克的下一个目标
 * 逻辑：在所有目标中，找到分数 > 当前分数的最小那个目标。
 * 如果当前分数已经超过所有目标，则返回最高的目标。
 */
export const calculateCurrentTarget = (currentScore: number): { target: UniversityTarget; gap: number; isPassed: boolean } | null => {
  const targets = getUniversityTargets(); // 已按降序排列 (680, 610, 520)
  if (targets.length === 0) return null;

  // 1. 既然是降序，反转一下变成升序处理 (520, 610, 680)
  const ascendingGoals = [...targets].reverse();
  
  // 2. 找第一个比当前分数高的
  const nextGoal = ascendingGoals.find(g => g.score > currentScore);

  if (nextGoal) {
    return { 
      target: nextGoal, 
      gap: nextGoal.score - currentScore,
      isPassed: false 
    };
  } else {
    // 3. 如果没有比当前分数高的，说明全通过了，返回最高的那个
    const maxGoal = targets[0];
    return {
      target: maxGoal,
      gap: 0,
      isPassed: true
    };
  }
};

export const getLatestScore = (): number => {
  const exams = getExams();
  if (exams.length === 0) return 0;
  return exams[exams.length - 1].total_score;
};

// --- 核心业务逻辑 ---

export const addExam = async (scores: ScoresInput): Promise<AddExamResponse> => {
  await new Promise(r => setTimeout(r, 600));
  
  const currentExams = getExams();
  const targets = getUniversityTargets();
  
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
  let trendMsg = "千里之行，始于足下。";

  if (lastRecord) {
    diff = total - lastRecord.total_score;
    isImproved = diff > 0;
    trendMsg = isImproved 
      ? `进步势头不错！比上次高了 ${diff} 分。`
      : `比上次回落 ${Math.abs(diff)} 分，调整状态，下次赢回来。`;
  }

  // V3/V4 目标差距分析
  const reachedGoals = targets.filter(t => total >= t.score).map(t => t.name);
  const unreachedGoals = targets.filter(t => total < t.score);
  // 下一个目标（未达成的目标中分数最低的）
  // targets是降序，unreached也是降序，所以取最后一个
  const nextGoalTarget = unreachedGoals.length > 0 ? unreachedGoals[unreachedGoals.length - 1] : undefined;

  let comment = "";
  if (reachedGoals.length > 0) {
    const highestReached = reachedGoals[0];
    comment = `太棒了！你的发挥已经稳过【${highestReached}】。`;
    if (nextGoalTarget) {
      comment += ` 距离下一关【${nextGoalTarget.name}】只差 ${nextGoalTarget.score - total} 分，多对几道选择题就到了！`;
    } else {
      comment += " 你已经超越了所有设定目标，简直是考神附体！";
    }
  } else {
    if (nextGoalTarget) {
      comment = `别灰心，距离基础目标【${nextGoalTarget.name}】还有 ${nextGoalTarget.score - total} 分的差距。基础不牢，地动山摇，先抓基础。`;
    } else {
      comment = "记录成功。建议在右上角设置中添加几个目标大学。";
    }
  }

  currentExams.push(newRecord);
  saveExams(currentExams);

  return { 
    status: "ok", 
    total_score: total, 
    diff_from_last: diff, 
    is_improved: isImproved, 
    trend_message: trendMsg, 
    analysis_result: {
      reached_goals: reachedGoals,
      next_goal: nextGoalTarget ? { name: nextGoalTarget.name, gap: nextGoalTarget.score - total } : undefined,
      comment: comment
    }
  };
};

export const getExamList = async (): Promise<ExamRecord[]> => getExams();

export const getTotalCurve = async (): Promise<CurveData> => { 
  const exams = getExams(); 
  const targets = getUniversityTargets();
  return { 
    labels: exams.map((e) => e.exam_name), 
    scores: exams.map((e) => e.total_score),
    goals: targets 
  }; 
};

export const getSubjectCurve = async (subject: string): Promise<CurveData> => { 
  const exams = getExams(); 
  return { 
    subject, 
    labels: exams.map((e) => e.exam_name), 
    // @ts-ignore
    scores: exams.map((e) => typeof e[subject] === 'number' ? e[subject] : null) 
  }; 
};

export const getExamDetail = async (id: number): Promise<ExamRecord | undefined> => { 
  return getExams().find((e) => e.id === id); 
};

export const clearAllData = async () => {
  localStorage.removeItem(DB_KEY);
};

export const exportDataToJson = () => {
  const data = {
    exams: getExams(),
    goals: getUniversityTargets(),
    date: new Date().toISOString(),
    appVersion: "3.0"
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ScoreNote_Backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJson = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json.exams)) saveExams(json.exams);
        if (Array.isArray(json.goals)) saveUniversityTargets(json.goals);
        resolve(true);
      } catch (err) {
        reject(false);
      }
    };
    reader.readAsText(file);
  });
};