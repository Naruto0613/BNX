import React, { useState } from "react";
import { Scholarship, UserProfile, AIScholarshipMatch } from "../types";
import { CountryFlag } from "../utils/flags";
import { Award, Compass, Search, Calendar, DollarSign, Sparkles, Filter, HelpCircle, AlertCircle } from "lucide-react";

interface ScholarshipFinderProps {
  scholarships: Scholarship[];
  profile: UserProfile;
}

export default function ScholarshipFinder({ scholarships, profile }: ScholarshipFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  // AI Matches state
  const [aiSponsorships, setAiSponsorships] = useState<AIScholarshipMatch[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const countries = ["All", ...Array.from(new Set(scholarships.map(s => s.country || "")))].filter(c => c !== "");

  const filteredSchols = scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.eligibility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "All" || s.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const getAIScholarships = async () => {
    setIsLoadingAI(true);
    setAiSponsorships([]);
    try {
      const resp = await fetch("/api/scholarships-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (!resp.ok) {
        throw new Error("Алдаа гарлаа. Server returned error during scholarship curation.");
      }
      const data = await resp.json();
      if (data.scholarships) {
        setAiSponsorships(data.scholarships);
      }
    } catch (err: any) {
      alert(`AI Scholarship finder error: ${err.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div id="scholarships-page-root" className="space-y-8 pb-16">
      
      {/* 1. AI SPONSORSHIP PORTAL */}
      <div id="ai-sponsorship-matching" className="p-6 md:p-8 bg-neutral-900/50 border border-neutral-800 rounded-3xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <Award className="w-52 h-52" />
        </div>
        <div className="max-w-2xl">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs bg-white text-black px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">ТЭТГЭЛГИЙН РАДАР</span>
            <span className="text-xs text-neutral-500 font-mono">Gemini ухаалаг зөвлөх</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">Миний суралцах чиглэл, голчид тохирох тэтгэлгүүд</h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 leading-relaxed">
            IELTS оноо, GPA болон сонирхож буй мэргэжилд тулгуурлан Монгол оюутнуудад зориулсан Засгийн газрын болон сургуулийн тэтгэлгүүдийг Gemini AI хангаж, бэлтгэл стратегийг зааж өгнө.
          </p>

          <button
            id="btn-trigger-ai-scholarships"
            onClick={getAIScholarships}
            disabled={isLoadingAI || !profile.name}
            className="mt-5 bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-xl transition duration-150 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoadingAI ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black mr-1" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI Тэтгэлэг тодорхойлж байна...
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                Миний AI Тэтгэлэгтэй тохирох
              </>
            )}
          </button>
          {!profile.name && (
            <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5" /> Эхлээд &lsquo;Хувийн паспорт&rsquo; табт орж голч мэдээллээ бүртгүүлнэ үү.
            </p>
          )}
        </div>
      </div>

      {/* AI SCHOLARSHIP MATCH RESULTS */}
      {aiSponsorships.length > 0 && (
        <div id="ai-scholarship-sponsorships-results" className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            AI Тохирох тэтгэлэгүүд
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSponsorships.map((s, i) => (
              <div
                key={i}
                id={`ai-schol-card-${i}`}
                className="bg-neutral-950/60 border border-neutral-850 rounded-2xl p-5 hover:border-neutral-750 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1.5">
                      <CountryFlag countryNameOrCode={s.country} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                      <span>{s.country}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">Deadline: {s.deadline}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-relaxed">{s.name}</h4>
                  
                  <div className="mt-4 p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Санхүүжилт, Сэтгэгдэл:</span>
                    <span className="text-white text-xs font-semibold">{s.amount}</span>
                  </div>

                  <div className="mt-3.5 text-xs text-neutral-400 space-y-2">
                    <p><strong className="text-neutral-500 text-[10px] uppercase block tracking-wider">Шалгуур:</strong> {s.eligibility}</p>
                    <p className="p-3 bg-white/5 border border-white/10 text-neutral-300 rounded-xl italic mt-2">
                      <strong className="text-white text-[10px] not-italic block uppercase tracking-wider mb-0.5 font-mono">Монгол оюутанд зөвлөх стратеги:</strong>
                      &ldquo;{s.matchingStrategy}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CATALOGUE SEARCH & EXPLORE */}
      <div id="catalog-header" className="pt-4">
        <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
          <Compass className="w-4.5 h-4.5 text-neutral-400" />
          Тэтгэлэгийн хуудас / Тэтгэлэгүүдийн сан
        </h3>
        <p className="text-xs text-neutral-500">Монгол улсын болон олон улсын томоохон засгийн газрын тэтгэлэгүүдийг шүүх</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
          <input
            id="scholarship-search"
            type="text"
            placeholder="Тэтгэлэгийн нэр, шалгуураар хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <div className="flex gap-1 py-1">
            {countries.map(c => (
              <button
                key={c}
                id={`btn-schol-country-${c}`}
                onClick={() => setSelectedCountry(c)}
                className={`text-xs px-3.5 py-2 rounded-xl border shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedCountry === c
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {c === 'All' ? (
                  <span>🌐</span>
                ) : (
                  <CountryFlag countryNameOrCode={c} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                )}
                <span>{c === 'All' ? 'Бүх Улс' : c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Scholarships Catalog */}
      <div id="scholarships-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchols.map(s => (
          <div
            key={s.id}
            id={`schol-element-${s.id}`}
            className="bg-neutral-905/30 border border-neutral-800/80 hover:border-neutral-700 transition rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-[10px]">
                {s.country && (
                  <span className="bg-neutral-950 border border-neutral-850 px-2.5 py-0.5 rounded font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                    <CountryFlag countryNameOrCode={s.country} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                    <span>{s.country}</span>
                  </span>
                )}
                <span className="text-neutral-500 font-mono">Эцсийн хугацаа: {s.deadline}</span>
              </div>

              <h4 className="font-bold text-white text-sm line-clamp-2 leading-relaxed">{s.name}</h4>

              {s.universityName && (
                <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                  Сургууль: <span className="text-neutral-200">{s.universityName}</span>
                </p>
              )}

              <div className="mt-4 p-3 bg-neutral-950/40 border border-neutral-850/65 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Санхүүгийн туслалцаа:</span>
                <span className="text-neutral-200 text-xs font-semibold">{s.amount}</span>
              </div>

              <div className="mt-3.5 text-xs text-neutral-400 space-y-1.5 leading-relaxed">
                <p><strong className="text-neutral-500 text-[10px] uppercase block tracking-wider">Шалгуур:</strong> {s.eligibility}</p>
                {s.major && <p><strong className="text-neutral-500 text-[10px] uppercase block tracking-wider">Мэргэжил:</strong> {s.major}</p>}
              </div>
            </div>
          </div>
        ))}

        {filteredSchols.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-550 text-xs">
            Ашиглах тэтгэлэг алга байна.
          </div>
        )}
      </div>

    </div>
  );
}
