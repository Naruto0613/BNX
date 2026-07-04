import React, { useState } from "react";
import { Essay } from "../types";
import { Sparkles, Edit2, History, AlertCircle, FileText, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface EssayHelperProps {
  essays: Essay[];
  onSaveEssay: (essay: Essay) => Promise<void>;
  onDeleteEssay: (essayId: string) => Promise<void>;
  isLoading: boolean;
}

export default function EssayHelper({
  essays,
  onSaveEssay,
  onDeleteEssay,
  isLoading
}: EssayHelperProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeEssay, setActiveEssay] = useState<Essay | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tab, setTab] = useState<'grammar' | 'ielts' | 'structure' | 'suggestions'>('grammar');

  const handleSelectDraft = (e: Essay) => {
    setActiveEssay(e);
    setTitle(e.title);
    setContent(e.content);
    setTab('grammar');
  };

  const handleNewDraft = () => {
    setActiveEssay(null);
    setTitle("");
    setContent("");
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert("Эхлээд эссэнийхээ агуулгыг оруулна уу.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/essay-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "My Admissions Essay", content })
      });

      if (!response.ok) {
        throw new Error("Алдаа гарлаа. Server returned error during essay evaluation.");
      }

      const analysis = await response.json();
      
      const updatedEssay: Essay = {
        id: activeEssay ? activeEssay.id : `essay_${Date.now()}`,
        userId: activeEssay ? activeEssay.userId : "current",
        title: title || "Admissions Essay Draft",
        content,
        scoreEstimate: analysis.scoreEstimate,
        grammarCorrections: analysis.grammarCorrections,
        ieltsFeedback: analysis.ieltsFeedback,
        structureAnalysis: analysis.structureAnalysis,
        suggestions: analysis.suggestions,
        createdAt: new Date().toISOString()
      };

      await onSaveEssay(updatedEssay);
      setActiveEssay(updatedEssay);
      setTab('grammar');
    } catch (err: any) {
      alert(`AI шинжилгээ амжилтгүй боллоо: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteDraft = async (eId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Уг эссэний ноорог болон шинжилгээг устгах уу? This draft and its feedack will be cleared.")) {
      try {
        await onDeleteEssay(eId);
        if (activeEssay?.id === eId) {
          handleNewDraft();
        }
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div id="essay-helper-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
      {/* Sidebar: Essay List & History */}
      <div id="essay-sidebar" className="lg:col-span-4 space-y-4">
        <div className="bg-neutral-900/30 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-400" />
              Эссэний Түүх
            </h3>
            <button
              id="btn-new-essay"
              onClick={handleNewDraft}
              className="text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg text-white"
            >
              Шинэ
            </button>
          </div>

          <div id="essays-scroll-list" className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {essays.map(e => (
              <div
                key={e.id}
                id={`btn-select-essay-${e.id}`}
                onClick={() => handleSelectDraft(e)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2.5 transition cursor-pointer select-none ${
                  activeEssay?.id === e.id
                    ? "bg-white text-black border-white"
                    : "bg-neutral-950/40 border-neutral-800 hover:bg-neutral-900/40 text-neutral-300"
                }`}
              >
                <div className="min-w-0 pr-1 flex-1">
                  <p className="font-semibold text-xs truncate leading-snug">{e.title || "Untitled Essay"}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
                    activeEssay?.id === e.id ? 'text-neutral-600' : 'text-neutral-500'
                  }`}>
                    {e.scoreEstimate || "Үнэлээгүй"}
                  </p>
                </div>
                <button
                  id={`btn-delete-essay-draft-${e.id}`}
                  onClick={(event) => handleDeleteDraft(e.id, event)}
                  className={`p-1 rounded shrink-0 ${
                    activeEssay?.id === e.id ? "hover:bg-neutral-100 text-neutral-600" : "hover:bg-neutral-950 text-neutral-500 hover:text-rose-400"
                  }`}
                  title="Устгах"
                >
                  &times;
                </button>
              </div>
            ))}

            {essays.length === 0 && (
              <p className="text-neutral-650 text-xs py-10 text-center">Хадгалсан ноорог алга. Ноорог бичээд AI шинжилгээ ажиллуулаарай.</p>
            )}
          </div>
        </div>

        {/* Info card */}
        <div id="essay-info-card" className="p-4 bg-neutral-900/10 border border-neutral-850 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-white flex items-center gap-1.5 leading-snug">
            <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
            Зөвлөмж
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Сургуулиудын хувийн тодорхойлолт эссэнд сурлагын дүн биш, таны хэн болох, туулсан амьдрал, шийдлийг сонирхоно. IELTS Feedback хэсгээс үгсийн баялгаа баталгаажуулаарай.
          </p>
        </div>
      </div>

      {/* Main panel: Text editor & analysis result */}
      <div id="essay-editor-wrapper" className="lg:col-span-8 space-y-6">
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Сэдэв, Сургууль</label>
              <input
                id="essay-input-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Common App Essay - Why IT is my Future"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Агуулга / Essay Content</label>
              <textarea
                id="essay-input-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ноорог эссэгээ энд бичих эсвэл хуулаарай..."
                rows={12}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neutral-500 leading-relaxed font-sans resize-none"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>Үгийн тоо: {content ? content.trim().split(/\s+/).length : 0}</span>
                <span>Илгээхээс өмнө хянах</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn-trigger-essay-analysis"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-xl transition duration-150 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black mr-1" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Шинжилж байна...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI Шинжилгээ ажиллуулах
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ANALYSIS OUTPUT */}
        {activeEssay && activeEssay.scoreEstimate && (
          <div id="essay-analysis-results" className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Score header */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div>
                <h3 className="font-bold text-white text-md">AI Хяналтын Дүн</h3>
                <p className="text-xs text-neutral-550 mt-0.5">Шинжилсэн сэдэв: {activeEssay.title}</p>
              </div>
              <div className="bg-white text-black px-4 py-2 rounded-2xl text-center shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-550 block">Band Score</span>
                <span className="text-md font-extrabold">{activeEssay.scoreEstimate}</span>
              </div>
            </div>

            {/* Structured Tab selector */}
            <div className="flex border-b border-neutral-800 overflow-x-auto gap-2 text-xs">
              <button
                id="tab-essay-grammar"
                onClick={() => setTab('grammar')}
                className={`pb-3 px-4 font-semibold shrink-0 transition-colors ${
                  tab === 'grammar' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Дүрэм Засвар
              </button>
              <button
                id="tab-essay-ielts"
                onClick={() => setTab('ielts')}
                className={`pb-3 px-4 font-semibold shrink-0 transition-colors ${
                   tab === 'ielts' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                IELTS-Үнэлгээ
              </button>
              <button
                id="tab-essay-structure"
                onClick={() => setTab('structure')}
                className={`pb-3 px-4 font-semibold shrink-0 transition-colors ${
                  tab === 'structure' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Бүтэц, Урсгал
              </button>
              <button
                id="tab-essay-suggestions"
                onClick={() => setTab('suggestions')}
                className={`pb-3 px-4 font-semibold shrink-0 transition-colors ${
                  tab === 'suggestions' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Сайжруулах Зөвлөмж
              </button>
            </div>

            {/* Display active tab payload */}
            <div id="essay-tab-content" className="bg-neutral-950/30 border border-neutral-850 rounded-2xl p-5 text-neutral-300 text-xs md:text-sm leading-relaxed whitespace-pre-line font-sans">
              {tab === 'grammar' && (
                <div>
                  <h4 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Грамматик болон үгийн зөв бичилт
                  </h4>
                  <p className="text-neutral-300">{activeEssay.grammarCorrections}</p>
                </div>
              )}
              {tab === 'ielts' && (
                <div>
                  <h4 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    IELTS бичих даалгаврын шалгуур үзүүлэлтийн үнэлгээ
                  </h4>
                  <p className="text-neutral-300">{activeEssay.ieltsFeedback}</p>
                </div>
              )}
              {tab === 'structure' && (
                <div>
                  <h4 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-white" />
                    Эссэний бүтэц болон догол мөрүүдийн логик холбоос
                  </h4>
                  <p className="text-neutral-300">{activeEssay.structureAnalysis}</p>
                </div>
              )}
              {tab === 'suggestions' && (
                <div>
                  <h4 className="font-bold text-white mb-2 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Сайжруулахад чиглэгдсэн бодит зөвлөгөөнүүд
                  </h4>
                  <p className="text-neutral-300">{activeEssay.suggestions}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
