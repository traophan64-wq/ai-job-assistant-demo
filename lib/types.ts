export interface AnalysisInput {
  resume: string;
  jobDescription: string;
  planType: "3" | "7";
}

export interface JDAnalysis {
  coreResponsibilities: string[];
  requiredSkills: { name: string; priority: "高" | "中" | "低" }[];
  bonusSkills: string[];
  keywords: string[];
}

export interface DimensionScore {
  name: string;
  score: number;
  comment: string;
}

export interface MatchAnalysis {
  overallScore: number;
  rating: string;
  dimensions: DimensionScore[];
  strengths: string[];
  weaknesses: string[];
}

export interface ResumeSuggestion {
  original: string;
  optimized: string;
  reason: string;
}

export interface InterviewQuestion {
  question: string;
  answerApproach: string;
  type: "通用" | "针对性";
}

export interface DayPlan {
  day: string;
  title: string;
  goal: string;
  actions: string[];
  output?: string;
}

export interface AnalysisResult {
  jdAnalysis: JDAnalysis;
  matchAnalysis: MatchAnalysis;
  resumeSuggestions: ResumeSuggestion[];
  interviewQuestions: InterviewQuestion[];
  improvementPlan: {
    type: string;
    days: DayPlan[];
  };
}

export type AnalysisStatus = "idle" | "analyzing" | "done" | "error";