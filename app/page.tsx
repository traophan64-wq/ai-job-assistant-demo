"use client";

import { useState, useRef, useCallback } from "react";
import { DEMO_RESULT, DEMO_RESUME, DEMO_JD } from "@/data/demo-data";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";

function IconUpload({ className }: { className?: string } = {}) {
  return (
    <svg className={"w-6 h-6 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconSparkle({ className }: { className?: string } = {}) {
  return (
    <svg className={"w-5 h-5 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.566 1.35L21 11.5l-5.522 2.337a2 2 0 00-1.566 1.35L12 21l-1.912-5.813a2 2 0 00-1.566-1.35L3 11.5l5.522-2.337a2 2 0 001.566-1.35L12 3z" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string } = {}) {
  return (
    <svg className={"w-5 h-5 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconFile({ className }: { className?: string } = {}) {
  return (
    <svg className={"w-4 h-4 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function IconTrash({ className }: { className?: string } = {}) {
  return (
    <svg className={"w-4 h-4 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

async function readFileContent(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "txt") return await file.text();
  if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  throw new Error("支持 .txt 和 .docx 格式");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function Home() {
  const [tab, setTab] = useState<"input" | "result">("input");
  const [resume, setResume] = useState(DEMO_RESUME);
  const [jd, setJd] = useState(DEMO_JD);
  const [planType, setPlanType] = useState<"3" | "7">("7");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<{ name: string; size: number } | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [jdFile, setJdFile] = useState<{ name: string; size: number } | null>(null);
  const [jdUploading, setJdUploading] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleResumeUpload = useCallback(async (file: File) => {
    setResumeUploading(true);
    try {
      const text = await readFileContent(file);
      setResume(text);
      setResumeFile({ name: file.name, size: file.size });
    } catch (e: any) {
      setError(e.message);
      setTimeout(() => setError(""), 3000);
    } finally { setResumeUploading(false); }
  }, []);

  const handleJdUpload = useCallback(async (file: File) => {
    setJdUploading(true);
    try {
      const text = await readFileContent(file);
      setJd(text);
      setJdFile({ name: file.name, size: file.size });
    } catch (e: any) {
      setError(e.message);
      setTimeout(() => setError(""), 3000);
    } finally { setJdUploading(false); }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, target: "resume" | "jd") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (target === "resume") await handleResumeUpload(file);
    else await handleJdUpload(file);
  }, [handleResumeUpload, handleJdUpload]);

  const clearResume = () => { setResume(""); setResumeFile(null); };
  const clearJd = () => { setJd(""); setJdFile(null); };

  const handleAnalyze = () => {
    if (!resume.trim() || !jd.trim()) return;
    setStatus("analyzing");
    setError("");
    setTimeout(() => {
      setResult(DEMO_RESULT);
      setStatus("done");
      setTab("result");
    }, 2000);
  };

  const handleReset = () => { setResult(null); setStatus("idle"); setTab("input"); setError(""); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-5 border border-white/10">
            <IconSparkle />
            求职作品集 · Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI 实习求职助手</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">上传简历 + 目标职位 JD，AI 帮你深度分析岗位匹配度、优化简历、准备面试</p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300" /> 岗位解读</span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300" /> 匹配分析</span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300" /> 简历优化</span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300" /> 面试准备</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}
        {result && (
          <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-2xl p-1 w-fit mx-auto shadow-sm">
            <button onClick={handleReset} className={"px-5 py-2.5 rounded-xl text-sm font-medium transition-all " + (tab === "input" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}>
              📝 重新输入
            </button>
            <button onClick={() => setTab("result")} className={"px-5 py-2.5 rounded-xl text-sm font-medium transition-all " + (tab === "result" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}>
              📊 分析报告
            </button>
          </div>
        )}
        {(tab === "input" || !result) && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">📄</div>
                  <div><h3 className="font-semibold text-slate-800 text-sm">你的简历</h3><p className="text-xs text-slate-400">支持 .txt、.docx 格式</p></div>
                </div>
                {!resumeFile ? (
                  <div className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-indigo-400/50 hover:bg-indigo-50/20 group"
                    onClick={() => resumeInputRef.current?.click()}
                    onDrop={(e) => handleDrop(e, "resume")}
                    onDragOver={(e) => e.preventDefault()}>
                    <input ref={resumeInputRef} type="file" accept=".txt,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])} />
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform"><IconUpload /></div>
                      <p className="text-sm font-medium text-slate-600">拖拽文件到此处，或<span className="text-indigo-600">点击上传</span></p>
                      <p className="text-xs text-slate-400">支持 .txt、.docx 格式</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><IconFile /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{resumeFile.name}</p><p className="text-xs text-slate-400">{formatFileSize(resumeFile.size)}</p></div>
                    <button onClick={clearResume} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><IconTrash /></button>
                  </div>
                )}
                {resumeUploading && <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600"><div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> 解析中...</div>}
                <textarea value={resume} onChange={(e) => { setResume(e.target.value); if (!e.target.value) setResumeFile(null); }} rows={12}
                  className="w-full mt-3 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none bg-slate-50"
                  placeholder="在此粘贴简历内容，或上传文件..." />
              </div>
              {/* JD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">🎯</div>
                  <div><h3 className="font-semibold text-slate-800 text-sm">目标职位 JD</h3><p className="text-xs text-slate-400">支持 .txt、.docx 格式</p></div>
                </div>
                {!jdFile ? (
                  <div className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-amber-400/50 hover:bg-amber-50/20 group"
                    onClick={() => jdInputRef.current?.click()}
                    onDrop={(e) => handleDrop(e, "jd")}
                    onDragOver={(e) => e.preventDefault()}>
                    <input ref={jdInputRef} type="file" accept=".txt,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleJdUpload(e.target.files[0])} />
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform"><IconUpload /></div>
                      <p className="text-sm font-medium text-slate-600">拖拽文件到此处，或<span className="text-amber-600">点击上传</span></p>
                      <p className="text-xs text-slate-400">支持 .txt、.docx 格式</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><IconFile /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{jdFile.name}</p><p className="text-xs text-slate-400">{formatFileSize(jdFile.size)}</p></div>
                    <button onClick={clearJd} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><IconTrash /></button>
                  </div>
                )}
                {jdUploading && <div className="mt-3 flex items-center gap-2 text-sm text-amber-600"><div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> 解析中...</div>}
                <textarea value={jd} onChange={(e) => { setJd(e.target.value); if (!e.target.value) setJdFile(null); }} rows={12}
                  className="w-full mt-3 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition resize-none bg-slate-50"
                  placeholder="在此粘贴职位描述，或上传文件..." />
              </div>
            </div>
            {/* Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">📖 学习计划：</span>
                <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1">
                  <button onClick={() => setPlanType("3")} className={"px-4 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "3" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>3天速成</button>
                  <button onClick={() => setPlanType("7")} className={"px-4 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "7" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>7天深度</button>
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={status === "analyzing" || !resume.trim() || !jd.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center">
                {status === "analyzing" ? (
                  <><div className="flex gap-1"><span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" /><span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" /><span className="w-2 h-2 bg-white rounded-full animate-bounce" /></div>AI 分析中...</>
                ) : (
                  <><IconSparkle /> 开始分析</>
                )}
              </button>
            </div>
          </div>
        )}
        {/* Results */}
        {result && tab === "result" && (
          <div ref={resultRef} className="space-y-6 pb-12">
            <ScoreCard result={result} />
            <JDAnalysisCard result={result} />
            <MatchCard result={result} />
            <OptimizeCard result={result} />
            <InterviewCard result={result} />
            <PlanCard result={result} />
          </div>
        )}
      </div>
      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-100">
        <p>AI 实习求职助手 · 作品集 Demo · 2026</p>
      </footer>
    </div>
  );
}

// Score Card
function ScoreCard({ result }: { result: AnalysisResult }) {
  const s = result.matchAnalysis.overallScore;
  const color = s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-600" : "text-red-600";
  const ring = s >= 80 ? "stroke-emerald-500" : s >= 60 ? "stroke-amber-500" : "stroke-red-500";
  const fill = s >= 80 ? "fill-emerald-500/10" : s >= 60 ? "fill-amber-500/10" : "fill-red-500/10";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={"relative w-24 h-24 rounded-2xl flex items-center justify-center " + fill}>
          <span className={"text-3xl font-bold " + color}>{s}</span>
          <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="38" fill="none" className="stroke-slate-100" strokeWidth="5" />
            <circle cx="48" cy="48" r="38" fill="none" className={ring} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 38 * s / 100 + " " + 2 * Math.PI * 38 * (1 - s / 100)} />
          </svg>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-0.5">{"综合匹配度"}</p>
          <p className="text-xl font-bold text-slate-800">{result.matchAnalysis.rating}</p>
          <p className="text-xs text-slate-400 mt-0.5">{"基于简历与 JD 的多维度 AI 分析"}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {result.matchAnalysis.dimensions.map((d, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{d.name}</span>
              <span className={"text-xs font-bold " + (d.score >= 80 ? "text-emerald-600" : d.score >= 60 ? "text-amber-600" : "text-red-600")}>{d.score}{"分"}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={"h-full rounded-full " + (d.score >= 80 ? "bg-emerald-500" : d.score >= 60 ? "bg-amber-500" : "bg-red-500")} style={{ width: d.score + "%" }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{d.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// JD Analysis Card
function JDAnalysisCard({ result }: { result: AnalysisResult }) {
  const jd = result.jdAnalysis;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">{"🔍 岗位核心解读"}</h3>
      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{"核心职责"}</h4>
          <ul className="space-y-2">
            {jd.coreResponsibilities.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{"必备技能"}</h4>
            <div className="space-y-2">
              {jd.requiredSkills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={"w-2 h-2 rounded-full " + (s.priority === "高" ? "bg-red-400" : s.priority === "中" ? "bg-amber-400" : "bg-blue-400")} />
                  <span className="text-sm text-slate-600">{s.name}</span>
                  <span className={"text-xs px-1.5 py-0.5 rounded " + (s.priority === "高" ? "bg-red-50 text-red-500" : s.priority === "中" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-500")}>{s.priority}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{"加分项"}</h4>
            <div className="space-y-1.5">
              {jd.bonusSkills.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500">✦</span> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{"关键词提取"}</h4>
          <div className="flex flex-wrap gap-1.5">
            {jd.keywords.map((k, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Match Card
function MatchCard({ result }: { result: AnalysisResult }) {
  const m = result.matchAnalysis;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">{"📊 匹配度分析"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h4 className="text-sm font-semibold text-emerald-700 mb-2">{"✅ 优势项"}</h4>
          <ul className="space-y-1.5">
            {m.strengths.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-emerald-800"><span className="text-emerald-400 shrink-0 mt-0.5">{"•"}</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <h4 className="text-sm font-semibold text-red-700 mb-2">{"⚠️ 短板项"}</h4>
          <ul className="space-y-1.5">
            {m.weaknesses.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-800"><span className="text-red-400 shrink-0 mt-0.5">{"•"}</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Optimize Card
function OptimizeCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">{"✏️ 简历优化建议"}</h3>
      <div className="space-y-3">
        {result.resumeSuggestions.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-xs text-slate-400 font-medium">{"优化建议"}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-0">
              <div className="p-4 bg-red-50/50 border-b sm:border-b-0 sm:border-r border-slate-200">
                <p className="text-xs font-medium text-red-500 mb-1.5">{"原文"}</p>
                <p className="text-sm text-red-800">{item.original}</p>
              </div>
              <div className="p-4 bg-emerald-50/50">
                <p className="text-xs font-medium text-emerald-500 mb-1.5">{"修改建议"}</p>
                <p className="text-sm text-emerald-800">{item.optimized}</p>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-indigo-50/50 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo-600">
              <span>💡</span> {item.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Interview Card
function InterviewCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">{"🎤 面试问题预测"}</h3>
      <div className="space-y-3">
        {result.interviewQuestions.map((q, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
            <div className="flex items-start gap-3">
              <span className={"px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 " + (q.type === "通用" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600")}>{q.type}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 mb-1.5">{q.question}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{q.answerApproach}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Plan Card
function PlanCard({ result }: { result: AnalysisResult }) {
  const plan = result.improvementPlan;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">{"📖 学习计划"}</h3>
      <p className="text-xs text-slate-400 mb-4">{"📅 "}</p>
      <div className="space-y-3">
        {plan.days.map((day, i) => (
          <details key={i} className="border border-slate-200 rounded-xl overflow-hidden group" open={i < 2}>
            <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{day.day.replace("Day ", "")}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">{day.title}</p>
                <p className="text-xs text-slate-400 truncate">{day.goal}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
              <ul className="space-y-1.5 mt-3">
                {day.actions.map((a, j) => (
                  <li key={j} className="flex gap-2 text-sm text-slate-600"><span className="text-indigo-400 shrink-0 mt-0.5">{"•"}</span><span>{a}</span></li>
                ))}
              </ul>
              {day.output && <p className="text-xs text-cyan-600 mt-2 flex items-center gap-1"><span>📝</span> {"预期产出："}{day.output}</p>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
