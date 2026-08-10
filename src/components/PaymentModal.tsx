import React, { useState } from "react";
import {
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Building2,
  User,
  Hash,
  X,
} from "lucide-react";
import BnxLogo from "./BnxLogo";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  email: string;
  studentName: string;
  transactionReference: string;
  paymentStatus?: "unpaid" | "pending" | "paid" | "declined";
  onPaymentSubmitted: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  uid,
  email,
  studentName,
  transactionReference,
  paymentStatus,
  onPaymentSubmitted,
}: PaymentModalProps) {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const BANK_ACCOUNT = "MN 30 0005 00 5222 111 351";
  const BANK_NAME = "Хаан Банк (Khan Bank)";
  const ACCOUNT_HOLDER = "Naranbadrakh";
  const AMOUNT = "100,000₮";

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("MN300005005222111351");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transactionReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSubmitPayment = async () => {
    setSubmitting(true);
    setSubmitMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payment-requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          data.error || "Төлбөрийн хүсэлт илгээхэд алдаа гарлаа.",
        );
      }

      setSubmitMessage(data.message || "Таны төлбөрийн хүсэлт илгээгдлээ.");
      onPaymentSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || "Сүлжээний алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-linear-to-r from-amber-500 via-amber-300 to-amber-500 rounded-b-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 px-3 py-1 rounded-full mb-1">
            <BnxLogo className="h-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 font-mono">
              BNX Гишүүнчлэл
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            BNX-д бүртгүүлэх
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            100,000₮ төлбөрөө шилжүүлээд бүртгэлээ баталгаажуулна уу.
          </p>
        </div>

        {/* Status indicator if pending */}
        {paymentStatus === "pending" && (
          <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-300 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                Таны төлбөр шалгагдаж байна
              </span>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Админ таны шилжүүлгийг шалгасны дараа бүртгэл баталгаажна.
              </p>
            </div>
          </div>
        )}

        {submitMessage && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-300 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Амжилттай илгээгдлээ</span>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                {submitMessage}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Bank Information Details Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4 mb-6">
          {/* Bank Name */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-850">
            <span className="text-neutral-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-500" />
              Банк
            </span>
            <span className="font-bold text-white font-mono">{BANK_NAME}</span>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-850">
            <span className="text-neutral-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-500" />
              Дансны дугаар
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-300 tracking-wider text-sm">
                {BANK_ACCOUNT}
              </span>
              <button
                onClick={handleCopyAccount}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                {copiedBank ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedBank ? "Хууллаа ✓" : "ХУУЛАХ"}
              </button>
            </div>
          </div>

          {/* Account Holder */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-850">
            <span className="text-neutral-400 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-500" />
              Дансны нэр
            </span>
            <span className="font-bold text-white">{ACCOUNT_HOLDER}</span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-850">
            <span className="text-neutral-400">Төлбөрийн дүн</span>
            <span className="font-black text-amber-400 text-base font-mono">
              {AMOUNT}
            </span>
          </div>

          {/* Unique Transaction Reference */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                ТАНЫ ГҮЙЛГЭЭНИЙ УТГА (ТҮЛХҮҮР)
              </span>
              <span className="text-sm font-black text-white font-mono tracking-widest">
                {transactionReference || "student_00"}
              </span>
            </div>
            <button
              onClick={handleCopyRef}
              className="bg-amber-400 hover:bg-amber-300 text-black px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-md"
            >
              {copiedRef ? (
                <Check className="w-3.5 h-3.5 text-black" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedRef ? "Хууллаа ✓" : "ХУУЛАХ"}
            </button>
          </div>
        </div>

        {/* Warning / Instruction */}
        <div className="bg-neutral-800/50 border border-neutral-800 rounded-xl p-3 mb-6 text-[11px] text-neutral-300 flex items-start gap-2.5">
          <Hash className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong className="text-amber-300 font-bold">Анхаар:</strong>{" "}
            Гүйлгээний утга хэсэгт өөрийн тусгай код{" "}
            <span className="font-mono font-bold text-amber-300">
              ({transactionReference || "student_00"})
            </span>
            -г заавал бичнэ үү.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmitPayment}
          disabled={submitting}
          className="w-full bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 active:scale-98 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span>Илгээж байна...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>БИ ТӨЛСӨН</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
