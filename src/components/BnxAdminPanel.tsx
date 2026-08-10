import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Hash,
  Mail,
  User,
  Calendar,
  ChevronRight,
  Filter,
} from "lucide-react";
import { PaymentRequest, AdminStats } from "../types";
import BnxLogo from "./BnxLogo";

interface BnxAdminPanelProps {
  adminUid: string;
  adminEmail: string;
}

export default function BnxAdminPanel({
  adminUid,
  adminEmail,
}: BnxAdminPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    declinedRequests: 0,
    activeUsers: 0,
  });
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "declined" | "all"
  >("pending");

  // Modal for declining payment with optional reason
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedReqForDecline, setSelectedReqForDecline] =
    useState<PaymentRequest | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/data?adminUid=${encodeURIComponent(adminUid)}&adminEmail=${encodeURIComponent(adminEmail)}`,
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Админ мэдээлэл авахад алдаа гарлаа.");
      }

      setStats(data.stats);
      setRequests(data.requests || []);
    } catch (err: any) {
      console.error("Fetch admin data error:", err);
      setError(err.message || "Алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [adminUid, adminEmail]);

  const handleApprove = async (reqItem: PaymentRequest) => {
    if (
      !confirm(
        `${reqItem.studentName} (${reqItem.transactionReference}) сурагчийн 100,000₮ төлбөрийг БАТАЛГААЖУУЛАХ уу?`,
      )
    ) {
      return;
    }

    setProcessingId(reqItem.id);
    setActionSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUid,
          adminEmail,
          requestId: reqItem.id,
          userId: reqItem.userId,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Баталгаажуулахад алдаа гарлаа.");
      }

      setActionSuccessMsg(
        `${reqItem.studentName} сурагчийн BNX эрх амжилттай идэвхжлээ.`,
      );
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Баталгаажуулахад алдаа гарлаа.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDeclineModal = (reqItem: PaymentRequest) => {
    setSelectedReqForDecline(reqItem);
    setDeclineReason("Гүйлгээний утга эсвэл дүн таарахгүй байна.");
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = async () => {
    if (!selectedReqForDecline) return;

    setProcessingId(selectedReqForDecline.id);
    setActionSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/decline-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUid,
          adminEmail,
          requestId: selectedReqForDecline.id,
          userId: selectedReqForDecline.userId,
          reason: declineReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Татгалзахад алдаа гарлаа.");
      }

      setActionSuccessMsg(
        `${selectedReqForDecline.studentName} сурагчийн хүсэлт цуцлагдлаа.`,
      );
      setDeclineModalOpen(false);
      setSelectedReqForDecline(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Татгалзахад алдаа гарлаа.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((reqItem) => {
    const matchesStatus =
      statusFilter === "all" || reqItem.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (reqItem.studentName && reqItem.studentName.toLowerCase().includes(q)) ||
      (reqItem.email && reqItem.email.toLowerCase().includes(q)) ||
      (reqItem.transactionReference &&
        reqItem.transactionReference.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans text-neutral-100 antialiased">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-amber-400 text-black px-2.5 py-1 rounded-lg flex items-center justify-center font-black">
              <BnxLogo className="h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              BNX АДМИН ПАНЕЛ
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Төлбөр шалгах ба Хэрэглэгчийн удирдлага
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Оюутнуудын 100,000₮ шилжүүлгийг шалгаж, BNX эрхийг баталгаажуулах
            хэсэг
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition active:scale-95 cursor-pointer self-start md:self-auto border border-neutral-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Шинэчлэх</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total Users */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Нийт хэрэглэгч
            </span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.totalUsers}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="border border-amber-500/30 p-4 rounded-2xl space-y-1 bg-amber-500/5">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Хүлээгдэж буй
            </span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {stats.pendingRequests}
          </div>
        </div>

        {/* Approved Requests */}
        <div className="border border-emerald-500/30 p-4 rounded-2xl space-y-1 bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Баталгаажсан
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {stats.approvedRequests}
          </div>
        </div>

        {/* Declined Requests */}
        <div className="border border-rose-500/30 p-4 rounded-2xl space-y-1 bg-rose-500/5">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Татгалзсан
            </span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {stats.declinedRequests}
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Идэвхтэй гишүүд
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.activeUsers}
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
              statusFilter === "pending"
                ? "bg-amber-400 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Хүлээгдэж буй ({stats.pendingRequests})
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
              statusFilter === "approved"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Баталгаажсан ({stats.approvedRequests})
          </button>
          <button
            onClick={() => setStatusFilter("declined")}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
              statusFilter === "declined"
                ? "bg-rose-500 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Татгалзсан ({stats.declinedRequests})
          </button>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${
              statusFilter === "all"
                ? "bg-neutral-800 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Бүгд ({requests.length})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-60 md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Сурагчийн нэр, и-мэйл, код..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Payment Requests Table / List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 text-xs font-mono">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
            Мэдээлэл ачааллаж байна...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            Илэрц олдсонгүй.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {filteredRequests.map((reqItem) => (
              <div
                key={reqItem.id}
                className="p-4 md:p-5 hover:bg-neutral-850/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Student Info */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-neutral-400" />
                      {reqItem.studentName}
                    </span>

                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {reqItem.transactionReference}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      {reqItem.email}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      Огноо: {formatDate(reqItem.submittedAt)}
                    </span>
                  </div>

                  {reqItem.declineReason && reqItem.status === "declined" && (
                    <div className="text-[11px] text-rose-400/90 italic bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 mt-1">
                      Татгалзсан шалтгаан: {reqItem.declineReason}
                    </div>
                  )}
                </div>

                {/* Amount & Status Badge & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  {/* Amount */}
                  <div className="text-right sm:pr-2">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
                      Төлбөр
                    </span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {(reqItem.amount || 100000).toLocaleString()}₮
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {reqItem.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                        <Clock className="w-3 h-3 animate-pulse" /> ХҮЛЭЭГДЭЖ
                        БАЙНА
                      </span>
                    ) : reqItem.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                        <CheckCircle2 className="w-3 h-3" /> ЗӨВШӨӨРСӨН
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                        <XCircle className="w-3 h-3" /> ТАТГАЛЗСАН
                      </span>
                    )}
                  </div>

                  {/* Actions for pending status */}
                  {reqItem.status === "pending" && (
                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                      <button
                        onClick={() => handleApprove(reqItem)}
                        disabled={processingId === reqItem.id}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ЗӨВШӨӨРӨХ
                      </button>

                      <button
                        onClick={() => handleOpenDeclineModal(reqItem)}
                        disabled={processingId === reqItem.id}
                        className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        ТАТГАЛЗАХ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decline Reason Modal */}
      {declineModalOpen && selectedReqForDecline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Төлбөр татгалзах
            </h3>

            <p className="text-xs text-neutral-300">
              <strong className="text-white">
                {selectedReqForDecline.studentName}
              </strong>{" "}
              ({selectedReqForDecline.transactionReference})-ийн хүсэлтийг
              цуцлах шалтгааныг бичнэ үү:
            </p>

            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Шалтгаан (Ж: Гүйлгээний утга буруу, төлбөр орж ирээгүй)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-400"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeclineModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Болих
              </button>
              <button
                onClick={handleConfirmDecline}
                disabled={processingId === selectedReqForDecline.id}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-md disabled:opacity-50"
              >
                Татгалзах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
