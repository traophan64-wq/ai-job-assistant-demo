"use client";

import { useState, useRef, useEffect } from "react";
import { DEMO_RESULT, DEMO_RESUME, DEMO_JD } from "@/data/demo-data";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";

/* ─── Types ─── */
type Tab = "input" | "result";

/* ─── Icons (inline SVG) ─── */
const IconPlus = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

/* ─── Main Page ─── */
export default function Home() {
  const [tab, setTab] = useState<Tab>("input");
  const [resume, setResume] = useState(DEMO_RESUME);
  const [jd, setJd] = useState(DEMO_JD);
  const [planType, setPlanType] = useState<"3" | "7">("7");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) return;
    setStatus("analyzing");
    setError("");

    // Use demo mode
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setStatus("done");
      setTab("result");
    }, 2000);
  };

  const handleReset = () => {
    setResult(null);
    setStatus("idle");
    setTab("input");
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-primary rounded-full text-sm font-medium mb-3">
          🤖 求职作品集 Demo
        </div>
        <h1 className="text-3xl font-bold text-text">AI实习求职助手</h1>
        <p className="text-text-secondary mt-2 text-base">
          输入简历 + 岗位JD，AI 帮你读懂岗位、改好简历、准备面试
        </p>
      </header>

      {/* Tab Switcher */}
      {result && (
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit mx-auto">
          <button onClick={handleReset} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "input" ? "bg-white shadow-sm text-primary" : "text-text-secondary hover:text-text"}`}>
            📝 重新输入
          </button>
          <button onClick={() => setTab("result")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "result" ? "bg-white shadow-sm text-primary" : "text-text-secondary hover:text-text"}`}>
            📊 分析报告
          </button>
        </div>
      )}

      {/* Input Section */}
      {(tab === "input" || !result) && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Resume Input */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <label className="block text-sm font-semibold text-text mb-2">
                📄 你的简历 <span className="text-text-secondary font-normal">（粘贴文本）</span>
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={16}
                className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                placeholder="在此粘贴你的简历内容..."
              />
            </div>

            {/* JD Input */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <label className="block text-sm font-semibold text-text mb-2">
                🎯 目标岗位 JD <span className="text-text-secondary font-normal">（粘贴文本）</span>
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={16}
                className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                placeholder="在此粘贴目标岗位JD..."
              />
            </div>
          </div>

          {/* Plan Type + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text">📅 补强计划：</span>
              <div className="flex gap-2">
                <button onClick={() => setPlanType("3")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${planType === "3" ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-text-secondary hover:bg-gray-200"}`}>3天速成</button>
                <button onClick={() => setPlanType("7")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${planType === "7" ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-text-secondary hover:bg-gray-200"}`}>7天深度</button>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === "analyzing" || !resume.trim() || !jd.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {status === "analyzing" ? (
                <>
                  <span className="loading-dot w-2 h-2 bg-white rounded-full inline-block" />
                  <span className="loading-dot w-2 h-2 bg-white rounded-full inline-block" />
                  <span className="loading-dot w-2 h-2 bg-white rounded-full inline-block" />
                  分析中...
                </>
              ) : (
                <>
                  <IconPlus />
                  开始分析
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result Section */}
      {result && tab === "result" && (
        <div ref={resultRef} className="space-y-5">
          {/* Overall Score */}
          <ScoreCard result={result} />

          {/* Step 1: JD Analysis */}
          <ModuleCard number={1} title="岗位JD解析" delay={0}>
            <JDModule result={result} />
          </ModuleCard>

          {/* Step 2: Match Analysis */}
          <ModuleCard number={2} title="简历匹配度分析" delay={1}>
            <MatchModule result={result} />
          </ModuleCard>

          {/* Step 3: Resume Optimization */}
          <ModuleCard number={3} title="简历优化建议" delay={2}>
            <OptimizeModule result={result} />
          </ModuleCard>

          {/* Step 4: Interview Questions */}
          <ModuleCard number={4} title="面试问题生成" delay={3}>
            <InterviewModule result={result} />
          </ModuleCard>

          {/* Step 5: Improvement Plan */}
          <ModuleCard number={5} title="补强计划" delay={4}>
            <PlanModule result={result} />
          </ModuleCard>

          {/* Footer */}
          <div className="text-center py-6 text-text-secondary text-sm">
            <p>🤖 AI实习求职助手 · 求职作品集 Demo</p>
            <p className="mt-1">
              <a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }} className="text-primary hover:underline">重新分析</a>
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {status === "analyzing" && (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-xl border border-border shadow-sm">
            <span className="loading-dot w-3 h-3 bg-primary rounded-full inline-block" />
            <span className="loading-dot w-3 h-3 bg-primary rounded-full inline-block" />
            <span className="loading-dot w-3 h-3 bg-primary rounded-full inline-block" />
            <span className="text-text-secondary ml-2">AI正在分析你的简历和岗位匹配度...</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function ScoreCard({ result }: { result: AnalysisResult }) {
  const s = result.matchAnalysis.overallScore;
  const color = s >= 80 ? "text-success" : s >= 60 ? "text-warning" : "text-danger";
  const bgColor = s >= 80 ? "bg-green-50 border-green-200" : s >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
  return (
    <div className={`${bgColor} rounded-xl border p-6 animate-fade-in-up shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">整体匹配度评分</p>
          <p className="text-4xl font-bold mt-1">
            <span className={color}>{s}</span>
            <span className="text-lg text-text-secondary">/100</span>
          </p>
          <p className={`text-sm font-semibold mt-1 ${color}`}>评级：{result.matchAnalysis.rating}</p>
        </div>
        <div className="w-24 h-24 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444"} strokeWidth="3" strokeDasharray={`${s}, 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold" style={{ color: s >= 80 ? "#10B981" : s >= 60 ? "#F59E0B" : "#EF4444" }}>{s}</span>
        </div>
      </div>
      {/* Dimension bars */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {result.matchAnalysis.dimensions.map((d, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
            <span className="text-xs text-text-secondary w-20 shrink-0">{d.name}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full score-bar" style={{ width: `${d.score}%` }} />
            </div>
            <span className="text-xs font-semibold w-8 text-right">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ number, title, delay, children }: { number: number; title: string; delay: number; children: React.ReactNode }) {
  return (
    <div className={`bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in-up delay-${delay}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">{number}</span>
        <h2 className="text-lg font-bold text-text">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function JDModule({ result }: { result: AnalysisResult }) {
  const jd = result.jdAnalysis;
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text mb-2">📋 岗位核心职责</h3>
        <ul className="space-y-1.5">
          {jd.coreResponsibilities.map((item, i) => <li key={i} className="flex gap-2 text-sm text-text"><span className="text-primary shrink-0 mt-0.5">•</span><span>{item}</span></li>)}
        </ul>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">🎯 必备能力</h3>
          <ul className="space-y-1.5">
            {jd.requiredSkills.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${s.priority === "高" ? "bg-red-100 text-red-600" : s.priority === "中" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>{s.priority}</span>
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">⭐ 加分能力</h3>
          <ul className="space-y-1.5">
            {jd.bonusSkills.map((item, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-accent shrink-0">✦</span><span>{item}</span></li>)}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-text mb-2">🔑 岗位关键词 <span className="text-text-secondary font-normal text-xs">（这些词应出现在简历中）</span></h3>
        <div className="flex flex-wrap gap-1.5">
          {jd.keywords.map((kw, i) => <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">{kw}</span>)}
        </div>
      </div>
    </div>
  );
}

function MatchModule({ result }: { result: AnalysisResult }) {
  const m = result.matchAnalysis;
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-700 mb-2">✅ 优势项</h3>
          <ul className="space-y-1.5">
            {m.strengths.map((item, i) => <li key={i} className="flex gap-2 text-sm text-green-800"><span className="text-green-500 shrink-0">•</span><span>{item}</span></li>)}
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <h3 className="text-sm font-semibold text-red-700 mb-2">⚠️ 短板项</h3>
          <ul className="space-y-1.5">
            {m.weaknesses.map((item, i) => <li key={i} className="flex gap-2 text-sm text-red-800"><span className="text-red-500 shrink-0">•</span><span>{item}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function OptimizeModule({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-3">
      {result.resumeSuggestions.map((item, i) => (
        <div key={i} className="border border-border rounded-xl p-4 hover:border-primary/30 transition">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
            <span className="text-xs text-text-secondary">优化建议</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-xs text-red-500 font-medium mb-1">原文</p>
              <p className="text-sm text-red-800">{item.original}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-xs text-green-500 font-medium mb-1">建议修改</p>
              <p className="text-sm text-green-800">{item.optimized}</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2 flex items-center gap-1"><span className="text-primary">💡</span> {item.reason}</p>
        </div>
      ))}
    </div>
  );
}

function InterviewModule({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-3">
      {result.interviewQuestions.map((q, i) => (
        <div key={i} className="border border-border rounded-xl p-4 hover:border-accent/30 transition">
          <div className="flex items-start gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium mt-0.5 shrink-0 ${q.type === "通用" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{q.type}</span>
            <div>
              <p className="text-sm font-medium text-text">{q.question}</p>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{q.answerApproach}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanModule({ result }: { result: AnalysisResult }) {
  const plan = result.improvementPlan;
  return (
    <div>
      <p className="text-sm text-text-secondary mb-4">📅 {plan.type}补强计划，按天拆解学习任务</p>
      <div className="space-y-3">
        {plan.days.map((day, i) => (
          <details key={i} className="border border-border rounded-xl overflow-hidden group" open={i < 2}>
            <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-xs font-bold shrink-0">{day.day.replace("Day ", "")}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">{day.title}</p>
                <p className="text-xs text-text-secondary">{day.goal}</p>
              </div>
              <svg className="w-4 h-4 text-text-secondary transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-border">
              <ul className="space-y-1.5 mt-3">
                {day.actions.map((a, j) => <li key={j} className="flex gap-2 text-sm text-text"><span className="text-primary shrink-0">•</span><span>{a}</span></li>)}
              </ul>
              {day.output && (
                <p className="text-xs text-accent mt-2 flex items-center gap-1">
                  <span>📦</span> 预期产出：{day.output}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}