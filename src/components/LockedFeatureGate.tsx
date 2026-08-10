import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  ChevronRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText,
  Globe,
} from "lucide-react";
import { UserProfile } from "../types";
import BnxLogo from "./BnxLogo";

interface LockedFeatureGateProps {
  userProfile: UserProfile | null;
  featureTitle: string;
  featureDescription: string;
  onOpenPaymentModal: () => void;
  onRefreshProfile?: () => void;
}

export default function LockedFeatureGate({
  userProfile,
  featureTitle,
  featureDescription,
  onOpenPaymentModal,
  onRefreshProfile,
}: LockedFeatureGateProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const paymentStatus = userProfile?.paymentStatus || "unpaid";
  const accessStatus = userProfile?.accessStatus || "inactive";
  const transactionReference =
    userProfile?.transactionReference || "student_01";

  const BANK_ACCOUNT = "MN300005005222111351";
  const BANK_NAME = "Хаан Банк (Khan Bank)";
  const ACCOUNT_HOLDER = "Naranbadrakh";
  const AMOUNT = "100,000₮";

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transactionReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in font-sans">
      {/* Primary Locked Hero Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Glow Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />

        {/* Top Header Label */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-black border border-neutral-700 p-2 rounded-xl flex items-center justify-center">
              <BnxLogo className="h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase font-mono block">
                BNX Гишүүнчлэл Шаардлагатай
              </span>
              <span className="text-xs text-neutral-400 font-semibold block">
                Навигатор Систем • Идэвхгүй Эрх
              </span>
            </div>
          </div>

          {/* Status Pill */}
          {paymentStatus === "pending" ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase font-mono animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Шалгагдаж байна</span>
            </div>
          ) : paymentStatus === "declined" ? (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Баталгаажаагүй</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full text-xs font-bold uppercase font-mono">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Төлбөр төлөөгүй</span>
            </div>
          )}
        </div>

        {/* Feature Title and Lock Statement */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {featureTitle}
          </h2>

          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
            {featureDescription}
          </p>

          <p className="text-xs text-amber-300 font-semibold bg-amber-400/10 border border-amber-400/20 p-3 rounded-xl inline-block mt-2">
            ⚠️ Таны бүртгэл төлбөр төлөөгүй тул энэ хэсгийг ашиглах боломжгүй
            байна. 100,000₮ төлбөрөө баталгаажуулж BNX системийн бүх боломжийг
            нээнэ үү.
          </p>
        </div>

        {/* Status Conditional Blocks */}
        {paymentStatus === "pending" ? (
          <div className="bg-neutral-950 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Таны төлбөрийн хүсэлтийг админ шалгаж байна</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-lg mx-auto">
              Таны гүйлгээний утга:{" "}
              <strong className="text-amber-300 font-mono text-sm">
                {transactionReference}
              </strong>
              .<br />
              Шилжүүлгийг Хаан Банкны баримтаар шалгаж баталгаажуулмагц таны BNX
              эрх автоматаар нээгдэнэ.
            </p>
            {onRefreshProfile && (
              <button
                onClick={onRefreshProfile}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 mx-auto cursor-pointer focus:outline-none"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Мэдээлэл Шинэчлэх</span>
              </button>
            )}
          </div>
        ) : (
          /* Payment Instruction Card & Action */
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">
                  Банкны Шилжүүлгийн Заавар
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Хаан Банкаар 100,000₮ шилжүүлэх
                </h3>
              </div>
              <button
                onClick={onOpenPaymentModal}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <CreditCard className="w-4 h-4" />
                <span>ТӨЛБӨР ТӨЛӨХ / ИЛГЭЭХ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-500 font-mono uppercase block">
                  Банк & Дансны дугаар
                </span>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-mono font-bold text-white text-sm">
                    {BANK_ACCOUNT}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="text-neutral-400 hover:text-amber-400 text-[10px] font-mono flex items-center gap-1 focus:outline-none"
                  >
                    {copiedAccount ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedAccount ? "Хуулагдлаа" : "Хуулах"}</span>
                  </button>
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  {BANK_NAME} • Хүлээн авагч: {ACCOUNT_HOLDER}
                </span>
              </div>

              <div className="bg-neutral-900 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">
                  Гүйлгээний Утга (Заавал бичнэ!)
                </span>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-mono font-black text-amber-300 text-base">
                    {transactionReference}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="text-amber-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1 focus:outline-none"
                  >
                    {copiedRef ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedRef ? "Хуулагдлаа" : "Код хуулах"}</span>
                  </button>
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  Энэ кодоор таны төлбөр тулгагдаж идэвхжинэ
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Benefits List Grid */}
        <div className="border-t border-neutral-800 pt-8">
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono mb-4 text-center">
            BNX Навигатор Системийн Боломжууд:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-amber-400 shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Их Сургуулийн Шалгуур
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  100+ топ сургуулийн элсэлтийн босго, төлбөр, шаардлага
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Gemini AI Магадлал
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Тэнцэх & тэтгэлэг авах хувийн магадлалын тооцоолол
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-sky-400 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Тэтгэлгүүдийн Сан
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  100% бүтэн ба бага зардлаар суралцах тэтгэлгүүд
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-indigo-400 shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Аппликейшн Хөтөч
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Бичиг баримт, эцсийн хугацаа болон визний хяналт
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-rose-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  AI Эссэ Шүүмж
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Дүрмийн алдаа засах, IELTS/TOEFL эссэ оноо ба зөвлөмж
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl text-teal-400 shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Суралцах Улсууд
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  10 гаруй улсын амьдрах өртөг, виз, цагийн ажил
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
