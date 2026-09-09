import React, { useState } from "react";
import { countriesData } from "../data/countries";
import { CountryFlag } from "../utils/flags";
import { Search, Compass, DollarSign, BookOpen, ShieldCheck, HelpCircle, Landmark } from "lucide-react";

export default function CountryExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countriesData[0]);

  const filteredCountries = countriesData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="country-explorer-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
      {/* Sidebar Selector */}
      <div id="country-sidebar-panel" className="lg:col-span-4 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
          <input
            id="country-search"
            type="text"
            placeholder="Улсаар хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-500 transition-colors"
          />
        </div>

        <div id="country-list-scrollable" className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {filteredCountries.map(c => (
            <button
              key={c.code}
              id={`btn-select-country-${c.code}`}
              onClick={() => setSelectedCountry(c)}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3.5 transition-all duration-200 ${
                selectedCountry.code === c.code
                  ? 'bg-white text-black border-white shadow-xl'
                  : 'bg-neutral-900/30 border-neutral-800 hover:bg-neutral-900/60 text-neutral-300'
              }`}
            >
              <CountryFlag countryNameOrCode={c.code} className="w-8 h-5.5 rounded-sm object-cover shadow-sm border border-neutral-800/20 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{c.name}</p>
                <p className={`text-xs truncate ${selectedCountry.code === c.code ? 'text-neutral-700' : 'text-neutral-500'}`}>
                  {c.currency} • {c.language}
                </p>
              </div>
            </button>
          ))}
          {filteredCountries.length === 0 && (
            <p className="text-neutral-600 text-sm py-8 text-center font-medium">Хайлттай тохирох улс олдсонгүй.</p>
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      <div id="country-details-panel" className="lg:col-span-8 bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        {/* Flag badge overlay background */}
        <div className="absolute top-4 right-4 opacity-[0.04] w-64 h-44 select-none pointer-events-none overflow-hidden rounded-2xl">
          <CountryFlag countryNameOrCode={selectedCountry.code} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-1.5 bg-neutral-900 border border-neutral-850 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
            <CountryFlag countryNameOrCode={selectedCountry.code} className="w-14 h-9.5 rounded-xl object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">{selectedCountry.code}</span>
              <span className="text-xs text-neutral-500">Гарын авлага</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCountry.name}</h2>
          </div>
        </div>

        {/* Cost Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div id="info-living-cost" className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-2xl flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Амьжиргааны дундаж зардал</p>
              <p className="text-sm font-semibold text-white mt-1">{selectedCountry.averageLivingCost}</p>
            </div>
          </div>
          <div id="info-tuition-cost" className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-2xl flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Сургалтын дундаж төлбөр</p>
              <p className="text-sm font-semibold text-white mt-1">{selectedCountry.averageTuitionCost}</p>
            </div>
          </div>
        </div>

        {/* Informative breakdown list */}
        <div className="space-y-6">
          <div id="info-visa-process">
            <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-neutral-400" />
              Виз мэдүүлэх алхамууд
            </h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed bg-neutral-950/20 p-4 border border-neutral-850 rounded-xl">
              {selectedCountry.studentVisaProcess}
            </p>
          </div>

          <div id="info-work-rules">
            <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-neutral-400" />
              Оюутны цагийн ажил хийх журам
            </h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed bg-neutral-950/20 p-4 border border-neutral-850 rounded-xl">
              {selectedCountry.partTimeWorkRules}
            </p>
          </div>

          <div id="info-safety-details">
            <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              Аюулгүй байдал болон эрүүл мэнд
            </h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed bg-neutral-950/20 p-4 border border-neutral-850 rounded-xl">
              {selectedCountry.safetyInformation}
            </p>
          </div>
        </div>

        {/* Quick Exchange Rate Calculator */}
        {selectedCountry.code !== "Mongolia" && selectedCountry.exchangeRateMNT && (
          <div id="currency-calculator" className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-500" />
              Төгрөг хөрвүүлэгч (Төгрөг ₮)
            </h4>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-1/2">
                <input
                  type="number"
                  placeholder="Дүн оруулах"
                  id="foreign-currency-input"
                  className="w-full bg-neutral-950/60 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-550 transition-colors"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const resultMnt = val * (selectedCountry.exchangeRateMNT || 1);
                    const el = document.getElementById("mnt-converted-output");
                    if (el) {
                      el.innerText = resultMnt.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " ₮";
                    }
                  }}
                />
                <span className="absolute right-3.5 top-3 text-[10px] text-neutral-500 font-bold font-mono">
                  {selectedCountry.code}
                </span>
              </div>
              <div className="flex items-center justify-center font-bold text-neutral-400 select-none text-xs">
                ➔
              </div>
              <div className="w-full sm:w-1/2 bg-neutral-950/80 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white flex items-center justify-between min-h-[38px]">
                <span id="mnt-converted-output" className="font-bold text-amber-300 font-mono">0.0 ₮</span>
                <span className="text-[10px] text-neutral-500 font-bold font-mono">MNT</span>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-neutral-500">
              Ханшийн мэдээлэл: 1 {selectedCountry.code} нэгж = {selectedCountry.exchangeRateMNT?.toLocaleString()} ₮
            </div>
          </div>
        )}

        {/* Currency summary bottom banner */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-neutral-500 block">Ашиглах Валют:</span>
            <span className="text-white font-medium text-sm mt-0.5 block">{selectedCountry.currency}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Албан ёсны Хэл:</span>
            <span className="text-white font-medium text-sm mt-0.5 block">{selectedCountry.language}</span>
          </div>
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800">
            <span className="text-amber-400 block font-semibold flex items-center gap-1">₮ MNT Ханшийн харьцаа:</span>
            <span className="text-white font-bold text-sm mt-0.5 block font-mono">{selectedCountry.exchangeRateText || "1.00 ₮"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
