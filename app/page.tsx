"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DEMO_RESULT, DEMO_RESUME, DEMO_JD } from "@/data/demo-data";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";

// Icons
function IconUpload({ className }: { className?: string } = {}) {
  return <svg className={"w-6 h-6 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
}
function IconSparkle({ className }: { className?: string } = {}) {
  return <svg className={"w-5 h-5 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.566 1.35L21 11.5l-5.522 2.337a2 2 0 00-1.566 1.35L12 21l-1.912-5.813a2 2 0 00-1.566-1.35L3 11.5l5.522-2.337a2 2 0 001.566-1.35L12 3z" /></svg>;
}
function IconCheck({ className }: { className?: string } = {}) {
  return <svg className={"w-5 h-5 " + (className || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function IconFile() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>; }

async function readFileContent(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "txt") return await file.text();
  if (ext === "docx") { const a = await file.arrayBuffer(); const m = await import("mammoth"); const r = await m.extractRawText({ arrayBuffer: a }); return r.value; }
  throw new Error("鏀寔 .txt 鍜?.docx 鏍煎紡");
}
function fmtSize(b: number): string { if (b < 1024) return b + " B"; if (b < 1048576) return (b / 1024).toFixed(1) + " KB"; return (b / 1048576).toFixed(1) + " MB"; }

const ANI = "opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]";

export default function Home() {
  const [tab, setTab] = useState<"input" | "result">("input");
  const [resume, setResume] = useState(DEMO_RESUME);
  const [jd, setJd] = useState(DEMO_JD);
  const [planType, setPlanType] = useState<"3" | "7">("7");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [rf, setRf] = useState<{ n: string; s: number } | null>(null);
  const [ru, setRu] = useState(false);
  const [jf, setJf] = useState<{ n: string; s: number } | null>(null);
  const [ju, setJu] = useState(false);
  const ri = useRef<HTMLInputElement>(null);
  const ji = useRef<HTMLInputElement>(null);
  const rr = useRef<HTMLDivElement>(null);

  const hu = useCallback(async (file: File, t: "r" | "j") => {
    if (t === "r") setRu(true); else setJu(true);
    try {
      const text = await readFileContent(file);
      if (t === "r") { setResume(text); setRf({ n: file.name, s: file.size }); }
      else { setJd(text); setJf({ n: file.name, s: file.size }); }
    } catch (e: any) { setError(e.message); setTimeout(() => setError(""), 3000); }
    finally { if (t === "r") setRu(false); else setJu(false); }
  }, []);

  const hd = useCallback(async (e: React.DragEvent, t: "r" | "j") => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) await hu(f, t); }, [hu]);

  const loadSample = () => { setResume(DEMO_RESUME); setJd(DEMO_JD); setRf(null); setJf(null); };

  const analyze = () => {
    if (!resume.trim() || !jd.trim()) return;
    setStatus("analyzing"); setError("");
    setTimeout(() => { setResult(DEMO_RESULT); setStatus("done"); setTab("result"); }, 2000);
  };

  useEffect(() => { if (result && tab === "result" && rr.current) { rr.current.scrollIntoView({ behavior: "smooth", block: "start" }); } }, [result, tab]);

  const rst = () => { setResult(null); setStatus("idle"); setTab("input"); setError(""); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-5 border border-white/10">
            <IconSparkle /> AI 浣滃搧闆?路 Demo
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">AI 瀹炰範姹傝亴鍔╂墜</h1>
          <p className="text-base md:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">涓婁紶绠€鍘?+ 鐩爣鑱屼綅 JD锛孉I 甯綘娣卞害鍒嗘瀽宀椾綅鍖归厤搴︺€佷紭鍖栫畝鍘嗐€佸噯澶囬潰璇?/p>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-indigo-200">
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300 shrink-0" /> 宀椾綅瑙ｈ</span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300 shrink-0" /> 鍖归厤鍒嗘瀽</span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300 shrink-0" /> 绠€鍘嗕紭鍖?/span>
            <span className="flex items-center gap-1.5"><IconCheck className="w-4 h-4 text-emerald-300 shrink-0" /> 闈㈣瘯鍑嗗</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2"><span>鈿狅笍</span> {error}</div>}

        {/* Tab */}
        {result && (
          <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-2xl p-1 w-fit mx-auto shadow-sm">
            <button onClick={rst} className={"px-5 py-2.5 rounded-xl text-sm font-medium transition-all " + (tab === "input" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700")}>馃摑 閲嶆柊杈撳叆</button>
            <button onClick={() => setTab("result")} className={"px-5 py-2.5 rounded-xl text-sm font-medium transition-all " + (tab === "result" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700")}>馃搳 鍒嗘瀽鎶ュ憡</button>
          </div>
        )}

        {/* Input */}
        {(tab === "input" || !result) && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Resume */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0">馃搫</div>
                  <div><h3 className="font-semibold text-slate-800 text-sm">浣犵殑绠€鍘?/h3><p className="text-xs text-slate-400">鏀寔 .txt銆?docx锛屾嫋鎷芥垨鐐瑰嚮涓婁紶</p></div>
                </div>
                {!rf ? (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-400">宸叉湁绀轰緥鏁版嵁</span>
                    <button onClick={() => ri.current?.click()} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <IconUpload className="w-3.5 h-3.5" /> 涓婁紶鏂囦欢鏇挎崲
                    </button>
                    <input ref={ri} type="file" accept=".txt,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) hu(f, "r"); }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><IconFile /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{rf.n}</p><p className="text-xs text-slate-400">{fmtSize(rf.s)}</p></div>
                    <button onClick={() => { setResume(""); setRf(null); }} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><IconTrash /></button>
                  </div>
                )}
                {ru && <div className="mt-2 flex items-center gap-2 text-sm text-indigo-600"><div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> 瑙ｆ瀽涓?..</div>}
                <textarea value={resume} onChange={(e) => { setResume(e.target.value); if (!e.target.value) setRf(null); }} rows={10} className="w-full mt-3 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none bg-slate-50" placeholder="鍦ㄦ绮樿创绠€鍘嗗唴瀹?.." />
              </div>
              {/* JD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm shrink-0">馃幆</div>
                  <div><h3 className="font-semibold text-slate-800 text-sm">鐩爣鑱屼綅 JD</h3><p className="text-xs text-slate-400">鏀寔 .txt銆?docx锛屾嫋鎷芥垨鐐瑰嚮涓婁紶</p></div>
                </div>
                {!jf ? (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-400">宸叉湁绀轰緥鏁版嵁</span>
                    <button onClick={() => ji.current?.click()} className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                      <IconUpload className="w-3.5 h-3.5" /> 涓婁紶鏂囦欢鏇挎崲
                    </button>
                    <input ref={ji} type="file" accept=".txt,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) hu(f, "j"); }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><IconFile /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{jf.n}</p><p className="text-xs text-slate-400">{fmtSize(jf.s)}</p></div>
                    <button onClick={() => { setJd(""); setJf(null); }} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><IconTrash /></button>
                  </div>
                )}
                {ju && <div className="mt-2 flex items-center gap-2 text-sm text-amber-600"><div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> 瑙ｆ瀽涓?..</div>}
                <textarea value={jd} onChange={(e) => { setJd(e.target.value); if (!e.target.value) setJf(null); }} rows={10} className="w-full mt-3 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition resize-none bg-slate-50" placeholder="鍦ㄦ绮樿创鑱屼綅鎻忚堪..." />
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 shrink-0">馃挕 蹇€熶綋楠岋細</span>
                <button onClick={loadSample} className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100">鍔犺浇绀轰緥鏁版嵁</button>
                <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">馃摉 璁″垝锛?/span>
                  <div className="flex gap-1 bg-slate-100 rounded-xl p-0.5">
                    <button onClick={() => setPlanType("3")} className={"px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "3" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>3澶?/button>
                    <button onClick={() => setPlanType("7")} className={"px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "7" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>7澶?/button>
                  </div>
                </div>
              </div>
              <button onClick={analyze} disabled={status === "analyzing" || !resume.trim() || !jd.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                {status === "analyzing" ? (
                  <><div className="flex gap-1"><span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" /><span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" /><span className="w-2 h-2 bg-white rounded-full animate-bounce" /></div> AI 鍒嗘瀽涓?..</>
                ) : (<><IconSparkle /> 寮€濮嬪垎鏋?/>)}
              </button>
            </div>
            {/* Mobile plan selector */}
            <div className="sm:hidden flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">馃摉 瀛︿範璁″垝锛?/span>
              <div className="flex gap-1 bg-slate-100 rounded-xl p-0.5">
                <button onClick={() => setPlanType("3")} className={"px-4 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "3" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>3澶╅€熸垚</button>
                <button onClick={() => setPlanType("7")} className={"px-4 py-1.5 rounded-lg text-sm font-medium transition-all " + (planType === "7" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>7澶╂繁搴?/button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && tab === "result" && (
          <div ref={rr} className="space-y-5 pb-12">
            <p className="text-xs text-slate-400 text-center">鍒嗘瀽瀹屾垚锛屽叡 6 涓ā鍧?/p>
            <ScoreCard result={result} />
            <JDCard result={result} />
            <MatchCard result={result} />
            <OptimizeCard result={result} />
            <InterviewCard result={result} />
            <PlanCard result={result} />
          </div>
        )}
      </div>
      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-100"><p>AI 瀹炰範姹傝亴鍔╂墜 路 浣滃搧闆?Demo 路 2026</p></footer>
    </div>
  );
}

// Score Card
function ScoreCard({ result }: { result: AnalysisResult }) {
  const s = result.matchAnalysis.overallScore;
  const c = s >= 80 ? "text-emerald-600 stroke-emerald-500 fill-emerald-500/10" : s >= 60 ? "text-amber-600 stroke-amber-500 fill-amber-500/10" : "text-red-600 stroke-red-500 fill-red-500/10";
  const [r, g] = c.split(" ");
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <div className="flex items-center gap-4 md:gap-5">
        <div className={"relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center " + g}>
          <span className={"text-2xl md:text-3xl font-bold " + r}>{s}</span>
          <svg className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="38" fill="none" className="stroke-slate-100" strokeWidth="5" />
            <circle cx="48" cy="48" r="38" fill="none" className={r} strokeWidth="5" strokeLinecap="round" strokeDasharray={2*Math.PI*38*s/100+" "+2*Math.PI*38*(1-s/100)} />
          </svg>
        </div>
        <div><p className="text-xs md:text-sm text-slate-400 mb-0.5">缁煎悎鍖归厤搴?/p><p className="text-lg md:text-xl font-bold text-slate-800">{result.matchAnalysis.rating}</p><p className="text-xs text-slate-400 mt-0.5">澶氱淮搴?AI 鍖归厤鍒嗘瀽</p></div>
      </div>
      <div className="mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {result.matchAnalysis.dimensions.map((d, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-slate-500">{d.name}</span><span className={"text-xs font-bold "+(d.score>=80?"text-emerald-600":d.score>=60?"text-amber-600":"text-red-600")}>{d.score}鍒?/span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className={"h-full rounded-full "+(d.score>=80?"bg-emerald-500":d.score>=60?"bg-amber-500":"bg-red-500")} style={{width:d.score+"%"}} /></div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{d.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// JD Card
function JDCard({ result }: { result: AnalysisResult }) {
  const j = result.jdAnalysis;
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">馃攳 宀椾綅鏍稿績瑙ｈ</h3>
      <div className="space-y-4">
        <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">鏍稿績鑱岃矗</h4>
          <ul className="space-y-2">{j.coreResponsibilities.map((r,i)=>(
            <li key={i} className="flex gap-2.5 text-sm text-slate-600"><span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span><span>{r}</span></li>
          ))}</ul>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">蹇呭鎶€鑳?/h4>
            <div className="space-y-1.5">{j.requiredSkills.map((s,i)=>(
              <div key={i} className="flex items-center gap-2"><div className={"w-2 h-2 rounded-full "+(s.priority==="楂??"bg-red-400":s.priority==="涓??"bg-amber-400":"bg-blue-400")} /><span className="text-sm text-slate-600">{s.name}</span><span className={"text-xs px-1.5 py-0.5 rounded "+(s.priority==="楂??"bg-red-50 text-red-500":s.priority==="涓??"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-500")}>{s.priority}</span></div>
            ))}</div>
          </div>
          <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">鍔犲垎椤?/h4>
            <div className="space-y-1.5">{j.bonusSkills.map((s,i)=>(<div key={i} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-emerald-500 shrink-0">鉁?/span> {s}</div>))}</div>
          </div>
        </div>
        <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">鍏抽敭璇?/h4>
          <div className="flex flex-wrap gap-1.5">{j.keywords.map((k,i)=>(<span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{k}</span>))}</div>
        </div>
      </div>
    </div>
  );
}

// Match Card
function MatchCard({ result }: { result: AnalysisResult }) {
  const m = result.matchAnalysis;
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">馃搳 鍖归厤搴﹀垎鏋?/h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h4 className="text-sm font-semibold text-emerald-700 mb-2">鉁?浼樺娍椤?/h4>
          <ul className="space-y-1.5">{m.strengths.map((t,i)=>(<li key={i} className="flex gap-2 text-sm text-emerald-800"><span className="text-emerald-400 shrink-0 mt-0.5">鈥?/span><span>{t}</span></li>))}</ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <h4 className="text-sm font-semibold text-red-700 mb-2">鈿狅笍 鐭澘椤?/h4>
          <ul className="space-y-1.5">{m.weaknesses.map((t,i)=>(<li key={i} className="flex gap-2 text-sm text-red-800"><span className="text-red-400 shrink-0 mt-0.5">鈥?/span><span>{t}</span></li>))}</ul>
        </div>
      </div>
    </div>
  );
}

// Optimize Card
function OptimizeCard({ result }: { result: AnalysisResult }) {
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">鉁忥笍 绠€鍘嗕紭鍖栧缓璁?/h3>
      <div className="space-y-3">{result.resumeSuggestions.map((t,i)=>(
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100"><span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">{i+1}</span><span className="text-xs text-slate-400 font-medium">浼樺寲寤鸿</span></div>
          <div className="grid sm:grid-cols-2"><div className="p-3.5 bg-red-50/50 border-b sm:border-b-0 sm:border-r border-slate-200"><p className="text-xs font-medium text-red-500 mb-1">鍘熸枃</p><p className="text-sm text-red-800">{t.original}</p></div><div className="p-3.5 bg-emerald-50/50"><p className="text-xs font-medium text-emerald-500 mb-1">淇敼寤鸿</p><p className="text-sm text-emerald-800">{t.optimized}</p></div></div>
          <div className="px-4 py-2 bg-indigo-50/50 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo-600"><span>馃挕</span> {t.reason}</div>
        </div>
      ))}</div>
    </div>
  );
}

// Interview Card
function InterviewCard({ result }: { result: AnalysisResult }) {
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">馃帳 闈㈣瘯闂棰勬祴</h3>
      <div className="space-y-3">{result.interviewQuestions.map((q,i)=>(
        <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
          <div className="flex items-start gap-3"><span className={"px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 "+(q.type==="閫氱敤"?"bg-blue-100 text-blue-600":"bg-purple-100 text-purple-600")}>{q.type}</span><div className="flex-1"><p className="text-sm font-medium text-slate-800 mb-1.5">{q.question}</p><p className="text-xs text-slate-500 leading-relaxed">{q.answerApproach}</p></div></div>
        </div>
      ))}</div>
    </div>
  );
}

// Plan Card
function PlanCard({ result }: { result: AnalysisResult }) {
  const plan = result.improvementPlan;
  return (
    <div className={"bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm " + ANI}>
      <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2 text-sm md:text-base">馃摉 瀛︿範璁″垝</h3>
      <p className="text-xs text-slate-400 mb-4">馃搮 {plan.type}瀛︿範璁″垝锛屾寜澶╂媶瑙ｅ涔犱换鍔?/p>
      <div className="space-y-3">{plan.days.map((d,i)=>(
        <details key={i} className="border border-slate-200 rounded-xl overflow-hidden group" open={i<2}>
          <summary className="flex items-center gap-3 p-3.5 md:p-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{d.day.replace("Day ","")}</span>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-700">{d.title}</p><p className="text-xs text-slate-400 truncate">{d.goal}</p></div>
            <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <div className="px-4 pb-4 pt-0 border-t border-slate-100">
            <ul className="space-y-1.5 mt-3">{d.actions.map((a,j)=>(<li key={j} className="flex gap-2 text-sm text-slate-600"><span className="text-indigo-400 shrink-0 mt-0.5">鈥?/span><span>{a}</span></li>))}</ul>
            {d.output && <p className="text-xs text-cyan-600 mt-2 flex items-center gap-1"><span>馃摑</span> 棰勬湡浜у嚭锛歿d.output}</p>}
          </div>
        </details>
      ))}</div>
    </div>
  );
}
