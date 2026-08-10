import React from "react";
import { ShieldCheck, Clock, AlertTriangle, CreditCard, User, Hash, Calendar, RefreshCw } from "lucide-react";
import { UserProfile } from "../types";
import BnxLogo from "./BnxLogo";

interface MembershipStatusCardProps {
  userProfile: UserProfile | null;
  onOpenPaymentModal: () => void;
  onRefreshProfile?: () => void;
}

export default function MembershipStatusCard({
  userProfile,
  onOpenPaymentModal,
  onRefreshProfile
}: MembershipStatusCardProps) {
  if (!userProfile) return null;

  const paymentStatus = userProfile.paymentStatus || 'unpaid';
  const accessStatus = userProfile.accessStatus || 'inactive';

  // Format dates cleanly if available
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5 text-white shadow-lg relative overflow-hidden mb-6">
      
      {/* Background visual highlight */}
      {accessStatus === 'active' ? (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
      ) : paymentStatus === 'pending' ? (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
      ) : (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-800 px-2 py-1 rounded-lg flex items-center justify-center">
              <BnxLogo className="h-3" />
            </div>

            {accessStatus === 'active' ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3 h-3" /> BNX ЭРХ ИДЭВХТЭЙ ✓
              </span>
            ) : paymentStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono animate-pulse">
                <Clock className="w-3 h-3" /> ТӨЛБӨР ШАЛГАГДАЖ БАЙНА
              </span>
            ) : paymentStatus === 'declined' ? (
              <span className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                <AlertTriangle className="w-3 h-3" /> ТӨЛБӨР БАТАЛГААЖААГҮЙ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-neutral-800 border border-neutral-700 text-neutral-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                <CreditCard className="w-3 h-3" /> ТӨЛБӨР ТӨЛӨӨГҮЙ (ИДЭВХГҮЙ)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-300 font-sans">
            <span className="font-bold text-white flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              {userProfile.name || userProfile.email}
            </span>

            <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px] bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              <Hash className="w-3 h-3 text-amber-400" />
              Код: <strong className="text-amber-300 font-bold">{userProfile.transactionReference || "student_00"}</strong>
            </span>

            {userProfile.subscriptionEnd && (
              <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                Дуусах огноо: <strong className="text-emerald-300">{formatDate(userProfile.subscriptionEnd)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right Side Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {onRefreshProfile && (
            <button
              onClick={onRefreshProfile}
              title="Шинэчлэх"
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {accessStatus !== 'active' && (
            <button
              onClick={onOpenPaymentModal}
              className="bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {paymentStatus === 'pending' ? "ТӨЛБӨРИЙН МЭДЭЭЛЭЛ ХАРАХ" : "ТӨЛБӨР ТӨЛӨХ (100,000₮)"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
