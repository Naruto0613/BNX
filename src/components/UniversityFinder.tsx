import React, { useState } from "react";
import { University, UserProfile, AIRecommendationMatch } from "../types";
import { CountryFlag } from "../utils/flags";
import { Search, MapPin, Award, Book, DollarSign, Calendar, Sparkles, ExternalLink, ShieldCheck, ListFilter, AlertCircle, Eye } from "lucide-react";

interface UniversityFinderProps {
  universities: University[];
  profile: UserProfile;
  onTrackUniversity: (uni: University) => void;
}

export default function UniversityFinder({
  universities,
  profile,
  onTrackUniversity
}: UniversityFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedUni, setSelectedUni] = useState<University | null>(universities[0] || null);

  // AI Matches state
  const [aiMatches, setAiMatches] = useState<AIRecommendationMatch[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Filter countries
  const countries = ["All", ...Array.from(new Set(universities.map(u => u.country)))];

  const filteredUnis = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "All" || u.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const runAiRecommender = async () => {
    setIsCalculating(true);
    setAiMatches([]);
    try {
      const resp = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (!resp.ok) {
        throw new Error("Алдаа гарлаа. Server returned error during match calculation.");
      }
      const data = await resp.json();
      if (data.recommendations) {
        setAiMatches(data.recommendations);
      }
    } catch (err: any) {
      alert(`AI Matchmaker error: ${err.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  // Internal calculator logic fallback
  const getClientSideCalculations = (u: University) => {
    let match = 50;
    const reasons: string[] = [];

    // gpa factor
    if (profile.gpa && u.minGpa) {
      if (profile.gpa >= u.minGpa) {
        match += 15;
        reasons.push("Сурлагын голч дүн (GPA) шаардлага хангасан");
      } else {
        match -= 15;
        reasons.push("Сурлагын голч дүн (GPA) доод хязгаараас доогуур байна");
      }
    }

    // language factor
    if (profile.ieltsScore && u.ieltsMin) {
      if (profile.ieltsScore >= u.ieltsMin) {
        match += 15;
        reasons.push("IELTS оноо хангалттай");
      } else {
        match -= 15;
        reasons.push("IELTS оноог сайжруулах шаардлагатай");
      }
    }

    // sat factor
    if (profile.satScore && u.satMin) {
      if (profile.satScore >= u.satMin) {
        match += 15;
        reasons.push("SAT оноогоор давуу тал үүсгэсэн");
      } else {
        match -= 5;
        reasons.push("SAT оноо дунджаас бага зэрэг доор байна");
      }
    }

    // honors
    if (profile.olympiads || profile.awards) {
      match += 10;
    }

    // bound match
    match = Math.max(5, Math.min(99, match));

    // difficulty classification
    let difficulty: 'Reach' | 'Target' | 'Safety' = 'Target';
    if (match < 40) {
      difficulty = 'Reach';
    } else if (match > 75) {
      difficulty = 'Safety';
    }

    return { match, difficulty, reasons };
  };

  return (
    <div id="university-finder-root" className="space-y-8 pb-16">
      
      {/* 1. INTRO / MATCH PROMPT CARD */}
      <div id="ai-matching-section" className="p-6 md:p-8 bg-neutral-900/50 border border-neutral-800 rounded-3xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <Sparkles className="w-52 h-52" />
        </div>
        <div className="max-w-2xl">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs bg-white text-black px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">ХИЙМЭЛ ОЮУНЫ ЗӨВЛӨМЖ</span>
            <span className="text-xs text-neutral-500">Түргэн Тохироо</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">Академик оноогоор тохирох сургуулиудыг тодорхойлох</h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 leading-relaxed">
            Таны хувийн академик үзүүлэлт, GPA, IELTS болон SAT, олимпиад, хүсэл сонирхолд тулгуурлан дэлхийн шилдэг сургуультай таарах магадлалыг Google Gemini AI ухаалаг систем тооцоолно.
          </p>
          
          <button
            id="btn-trigger-ai-recommends"
            onClick={runAiRecommender}
            disabled={isCalculating || !profile.name}
            className="mt-5 bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-xl transition duration-150 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black mr-1" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI Тооцоолж байна...
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                Миний тохироог тооцоолох
              </>
            )}
          </button>
          {!profile.name && (
            <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5" /> Эхлээд &lsquo;Хувийн паспорт&rsquo; табт очиж голч мэдээллээ бүртгэнэ үү.
            </p>
          )}
        </div>
      </div>

      {/* AI RECOMMENDATION MATCHES EXPANDED DISPLAY */}
      {aiMatches.length > 0 && (
        <div id="ai-matches-grid-wrapper" className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-400" />
            AI Тохироцын Магадлал / AI Тооцоолуур
          </h3>
          <div id="ai-matched-instances" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.map((m, i) => (
              <div
                key={i}
                id={`ai-match-card-${i}`}
                className="bg-neutral-950/60 border border-neutral-850 rounded-2xl p-5 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between gap-1 mb-3">
                  <span className="text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                    <CountryFlag countryNameOrCode={m.country} className="w-4.5 h-3 rounded-sm object-cover shadow-sm" />
                    <span>{m.country}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    m.difficulty === 'Safety' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : m.difficulty === 'Target'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {m.difficulty === 'Safety' ? 'Хялбар давах (Safety)' : m.difficulty === 'Target' ? 'Дундаж тохирох (Target)' : 'Хүнд шалгууртай (Reach)'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-2 leading-relaxed">{m.universityName}</h4>
                
                {/* Match progress circle */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center font-mono text-xs font-bold leading-none shrink-0 relative bg-neutral-900">
                    <span className="text-white text-sm">{m.matchPercentage}%</span>
                  </div>
                  <div className="text-xs space-y-0.5 text-neutral-400">
                    <p className="font-semibold text-white">Тохирох хувь</p>
                    <p className="text-[10px] text-neutral-500 line-clamp-2">Таны оноо, үзүүлэлтийн нийцэл</p>
                  </div>
                </div>

                {/* Factors feedback summarized */}
                <div className="mt-5 space-y-2 border-t border-neutral-900 pt-3.5 text-[11px] leading-relaxed text-neutral-300">
                  {m.gpaFactor && <p><strong className="text-neutral-500 block uppercase text-[9px] tracking-wider">Голч дүнний нөлөө:</strong> {m.gpaFactor}</p>}
                  {m.testFactor && <p><strong className="text-neutral-500 block uppercase text-[9px] tracking-wider">Шалгалтны онооны нөлөө:</strong> {m.testFactor}</p>}
                  {m.actionableAdvice && <p className="text-amber-400/90 mt-2 italic bg-neutral-950 p-2 border border-neutral-850 rounded-xl">&ldquo;{m.actionableAdvice}&rdquo;</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN CATALOG EXPLORER */}
      <div id="catalog-header" className="pt-4">
        <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
          <Book className="w-4.5 h-4.5 text-neutral-400" />
          Сургуулийн Каталог / Их сургуулийн сан
        </h3>
        <p className="text-xs text-neutral-500">Дэлхийн шилдэг сургуулиудын шалгуур, төлбөр, шаардагдах материалыг харьцуулах</p>
      </div>

      {/* Filters bar */}
      <div id="university-filters-bar" className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
          <input
            id="university-search-input"
            type="text"
            placeholder="Сургуулийн нэрээр хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-550 placeholder:text-neutral-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ListFilter className="w-4 h-4 text-neutral-400 shrink-0" />
          <div className="flex gap-1 overflow-x-auto py-1 pr-2 w-full">
            {countries.map(country => (
              <button
                key={country}
                id={`btn-filter-country-${country}`}
                onClick={() => setSelectedCountry(country)}
                className={`text-xs px-3.5 py-2.5 rounded-xl border shrink-0 transition-colors flex items-center gap-1.5 ${
                  selectedCountry === country
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {country === 'All' ? (
                  <span>🌐</span>
                ) : (
                  <CountryFlag countryNameOrCode={country} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                )}
                <span>{country === 'All' ? 'Бүх Улс' : country}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Universities list & Detailing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: scroll list */}
        <div id="university-scroller" className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredUnis.map(u => {
            const { match, difficulty } = getClientSideCalculations(u);
            return (
              <button
                key={u.id}
                id={`btn-select-uni-${u.id}`}
                onClick={() => setSelectedUni(u)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedUni?.id === u.id
                    ? 'bg-white text-black border-white shadow-xl scale-[1.01]'
                    : 'bg-neutral-900/30 border-neutral-800 hover:bg-neutral-900/60 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase leading-none font-bold flex items-center gap-1.5 ${
                      selectedUni?.id === u.id ? 'bg-neutral-200 text-black' : 'bg-neutral-950 text-neutral-400'
                    }`}>
                      <CountryFlag countryNameOrCode={u.country} className="w-3.5 h-2.5 rounded-sm object-cover shadow-sm" />
                      <span>{u.country}</span>
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      difficulty === 'Safety'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : difficulty === 'Target'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      Үнэлгээ: {difficulty === 'Safety' ? 'Safety (Тохиромжтой)' : difficulty === 'Target' ? 'Target (Боломжтой)' : 'Reach (Чанга)'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-snug truncate pr-1">{u.name}</h4>
                  
                  <div className="flex items-center gap-4 mt-2.5 text-[11px] opacity-75 font-mono">
                    <span>Rank: #{u.ranking || "N/A"}</span>
                    <span>Acc: {u.acceptanceRate || "N/A"}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-neutral-800/10 flex items-center justify-between gap-1 w-full text-[10px]">
                  <span>Шаардах GPA: {u.minGpa || "N/A"}</span>
                  <span className="font-bold text-neutral-600 font-mono">Тохирох хувь: {match}%</span>
                </div>
              </button>
            );
          })}

          {filteredUnis.length === 0 && (
            <p className="text-neutral-550 text-xs py-12 text-center">Хайлтын илэрц олдсонгүй.</p>
          )}
        </div>

        {/* Right column: Selected Uni detail sheet */}
        <div id="university-detailed-card" className="lg:col-span-7 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
          {selectedUni ? (
            <div className="space-y-6">
              
              {/* Header and website */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-md font-mono uppercase font-semibold flex items-center gap-1.5 w-fit">
                    <CountryFlag countryNameOrCode={selectedUni.country} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                    <span>{selectedUni.country}</span>
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1 leading-snug">{selectedUni.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400 font-mono">
                    <span>QS Rank: #{selectedUni.ranking || "N/A"}</span>
                    <span>Acceptance: {selectedUni.acceptanceRate || "N/A"}</span>
                  </div>
                </div>
                {selectedUni.website && (
                  <a
                    href={selectedUni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-neutral-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 focus:outline-none"
                  >
                    Вэбсайт <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Extended Information Portals */}
              <div id="school-all-useful-info-links" className="p-4 bg-neutral-950/20 border border-neutral-850/50 rounded-2xl">
                <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  Мэдээллийн эх сурвалжууд / Чухал холбоосууд
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedUni.website && (
                    <a
                      id="uni-info-btn-web"
                      href={selectedUni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] md:text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-xl p-2.5 flex items-center justify-between transition focus:outline-none"
                    >
                      <span className="truncate">Вебсайт</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 shrink-0 ml-1" />
                    </a>
                  )}
                  {selectedUni.admissionsUrl && (
                    <a
                      id="uni-info-btn-admit"
                      href={selectedUni.admissionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] md:text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-xl p-2.5 flex items-center justify-between transition focus:outline-none"
                    >
                      <span className="truncate">Элсэлтийн алба</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 shrink-0 ml-1" />
                    </a>
                  )}
                  {selectedUni.scholarshipsUrl && (
                    <a
                      id="uni-info-btn-scholar"
                      href={selectedUni.scholarshipsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] md:text-[11px] font-semibold text-amber-400 hover:text-amber-350 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-xl p-2.5 flex items-center justify-between transition focus:outline-none"
                    >
                      <span className="truncate">Тэтгэлэгийн хуудас</span>
                      <ExternalLink className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
                    </a>
                  )}
                  {selectedUni.virtualTourUrl && (
                    <a
                      id="uni-info-btn-tour"
                      href={selectedUni.virtualTourUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] md:text-[11px] font-medium text-blue-300 hover:text-blue-250 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-xl p-2.5 flex items-center justify-between transition focus:outline-none"
                    >
                      <span className="truncate">Виртуал аялал</span>
                      <ExternalLink className="w-3 h-3 text-blue-500 shrink-0 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              {/* Estimate match with current profile fallback bar */}
              {profile.name && (
                <div id="client-gpa-checker-summary" className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-2xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white">Урьдчилсан байдлаар тохирох хувь:</span>
                    <span className="font-mono font-bold text-amber-400">{getClientSideCalculations(selectedUni).match}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-300 h-full transition-all"
                      style={{ width: `${getClientSideCalculations(selectedUni).match}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-neutral-400 space-y-0.5">
                    {getClientSideCalculations(selectedUni).reasons.map((r, ri) => (
                      <p key={ri} className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        {r}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost matrix collapse panels */}
              <div>
                <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-neutral-500" />
                  Хүлээгдэх Зардлууд (Жилээр)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 text-xs text-neutral-300">
                  <div className="bg-neutral-950/30 p-3 border border-neutral-850/60 rounded-xl">
                    <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest block">Сургалтын төлбөр</span>
                    <span className="text-white font-semibold text-sm block mt-0.5">${selectedUni.tuitionFee?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950/30 p-3 border border-neutral-850/60 rounded-xl">
                    <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest block">Дотуур байр</span>
                    <span className="text-white font-semibold text-sm block mt-0.5">${selectedUni.dormitoryFee?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950/30 p-3 border border-neutral-850/60 rounded-xl">
                    <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest block">Эрүүл мэндийн даатгал</span>
                    <span className="text-white font-semibold text-sm block mt-0.5">${selectedUni.healthInsurance?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950/30 p-3 border border-neutral-850/60 rounded-xl">
                    <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest block">Амьжиргааны төлбөр</span>
                    <span className="text-white font-semibold text-sm block mt-0.5">${selectedUni.livingCost?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950/30 p-3 border border-neutral-850/60 rounded-xl">
                    <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest block">Анкетны хураамж</span>
                    <span className="text-white font-semibold text-sm block mt-0.5">${selectedUni.applicationFee?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="bg-white/5 p-3 border border-white/10 rounded-xl">
                    <span className="text-neutral-450 text-[9px] uppercase font-bold tracking-widest block">Нийт Жилийн зардал</span>
                    <span className="text-white font-bold text-sm block mt-0.5">${selectedUni.estimatedAnnualCost?.toLocaleString() || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Requirements & Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-850/60 text-xs">
                <div>
                  <h4 className="font-bold text-neutral-450 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-neutral-500" />
                    Элсэлтийн Шалгуур
                  </h4>
                  <ul className="space-y-1.5 text-neutral-450 leading-relaxed">
                    <li>• Доод голч (Min GPA): <strong className="text-white">{selectedUni.minGpa || "N/A"}</strong></li>
                    <li>• IELTS хэрэгцээ: <strong className="text-white">{selectedUni.ieltsMin || "N/A"}+</strong></li>
                    <li>• TOEFL хэрэгцээ: <strong className="text-white">{selectedUni.toeflMin || "N/A"}+</strong></li>
                    <li>• SAT хэрэгцээ: <strong className="text-white">{selectedUni.satMin || "N/A"}+</strong></li>
                    {selectedUni.requiredSubjects && <li className="text-neutral-400 mt-1 italic block">• Судлах хичээлүүд: {selectedUni.requiredSubjects}</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-450 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    Бүрдүүлэх материал
                  </h4>
                  <p className="text-neutral-400 leading-relaxed text-wrap">
                    {selectedUni.requiredDocuments || "Анкет, ахлах сургуулийн дүнгийн хуулбар, тодорхойлох захидал, эссэ болон санхүүгийн батлан даалт шаардлагатай."}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-4 border-t border-neutral-850/60 pb-2">
                <h4 className="font-bold text-neutral-450 uppercase tracking-widest mb-2 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  Бүртгэлийн хугацаа
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-neutral-400">
                  <div className="bg-neutral-950 p-2 border border-neutral-850 rounded-xl">
                    <span className="text-neutral-500 text-[8px] uppercase block">Бүртгэл нээгдэх</span>
                    <span className="text-white font-semibold block mt-0.5">{selectedUni.openingDate || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950 p-2 border border-rose-500/10 rounded-xl">
                    <span className="text-rose-450 text-[8px] uppercase block">Эцсийн хугацаа (Deadline)</span>
                    <span className="text-rose-300 font-semibold block mt-0.5">{selectedUni.deadline || "N/A"}</span>
                  </div>
                  <div className="bg-neutral-950 p-2 border border-neutral-850 rounded-xl">
                    <span className="text-neutral-500 text-[8px] uppercase block">Хариу гарах</span>
                    <span className="text-white font-semibold block mt-0.5">{selectedUni.resultDate || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Scholarships inside university card */}
              {selectedUni.scholarships && (
                <div className="bg-neutral-950 border border-neutral-850 p-4.5 rounded-2xl">
                  <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-[10px] mb-1.5 flex items-center gap-1">
                    <Award className="w-4.5 h-4.5 text-amber-500" /> Олгох боломжит тэтгэлэгүүд
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{selectedUni.scholarships}</p>
                </div>
              )}

              {/* Track call button */}
              <div className="flex justify-end pt-4">
                <button
                  id={`btn-track-uni-${selectedUni.id}`}
                  onClick={() => onTrackUniversity(selectedUni)}
                  className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-2.5 rounded-xl transition duration-150 active:scale-95 flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <Calendar className="w-4 h-4" />
                  Миний хөтөч рүү нэмэх
                </button>
              </div>

            </div>
          ) : (
            <p className="text-neutral-500 text-sm py-24 text-center">Каталогиос сургууль сонгож дэлгэрэнгүй мэдээллийг хянана уу.</p>
          )}
        </div>

      </div>

    </div>
  );
}
