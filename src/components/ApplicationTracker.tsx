import React, { useState } from "react";
import { ApplicationTrack, University } from "../types";
import { CheckSquare, Square, Calendar, Plus, Trash2, Edit3, Bookmark, AlertCircle, RefreshCw } from "lucide-react";

interface ApplicationTrackerProps {
  tracks: ApplicationTrack[];
  universities: University[];
  onSaveTrack: (track: ApplicationTrack) => Promise<void>;
  onDeleteTrack: (trackId: string) => Promise<void>;
  isLoading: boolean;
}

const STATUS_OPTIONS: ApplicationTrack['status'][] = [
  'In Progress',
  'Document Stage',
  'Submitted',
  'Interview Scheduled',
  'Admission Offered',
  'Rejected',
  'Scholarship Awarded'
];

const STATUS_LABELS: Record<ApplicationTrack['status'], string> = {
  'In Progress': 'Судалж буй',
  'Document Stage': 'Материал бүрдүүлэлт',
  'Submitted': 'Илгээсэн',
  'Interview Scheduled': 'Ярилцлага товлогдсон',
  'Admission Offered': 'Тэнссэн (Admission)',
  'Rejected': 'Татгалзсан',
  'Scholarship Awarded': 'Тэтгэлэг олгогдсон'
};

const GENERAL_DOCS = [
  "Passport (Паспорт)",
  "Official Transcripts (Сурлагын дүн)",
  "Personal Statement (Эссэ)",
  "Recommendation Letters (Тодорхойлох захидал)",
  "Financial / Bank Statement (Дансны хуулга)",
  "IELTS/TOEFL score",
  "SAT score"
];

export default function ApplicationTracker({
  tracks,
  universities,
  onSaveTrack,
  onDeleteTrack,
  isLoading
}: ApplicationTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<ApplicationTrack | null>(null);

  // New form fields
  const [selectedUniId, setSelectedUniId] = useState("");
  const [customUniName, setCustomUniName] = useState("");
  const [status, setStatus] = useState<ApplicationTrack['status']>('In Progress');
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [appliedSchol, setAppliedSchol] = useState("");
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingTrack(null);
    setSelectedUniId(universities[0]?.id || "");
    setCustomUniName("");
    setStatus('In Progress');
    setDeadline("");
    setNotes("");
    setAppliedSchol("");
    setCheckedDocs([]);
    setShowAddForm(true);
  };

  const handleOpenEdit = (t: ApplicationTrack) => {
    setEditingTrack(t);
    setSelectedUniId(t.universityId);
    setCustomUniName(t.universityId === 'custom' ? t.universityName : "");
    setStatus(t.status);
    setDeadline(t.deadline || "");
    setNotes(t.notes || "");
    setAppliedSchol(t.appliedScholarships || "");
    setCheckedDocs(t.submittedDocuments || []);
    setShowAddForm(true);
  };

  const toggleDocument = (docName: string) => {
    if (checkedDocs.includes(docName)) {
      setCheckedDocs(prev => prev.filter(d => d !== docName));
    } else {
      setCheckedDocs(prev => [...prev, docName]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let uniName = "";
    if (selectedUniId === "custom") {
      uniName = customUniName || "Custom University";
    } else {
      const match = universities.find(u => u.id === selectedUniId);
      uniName = match ? match.name : "Selected University";
    }

    const payload: ApplicationTrack = {
      id: editingTrack ? editingTrack.id : `track_${Date.now()}`,
      userId: editingTrack ? editingTrack.userId : "current",
      universityId: selectedUniId || "custom",
      universityName: uniName,
      status,
      submittedDocuments: checkedDocs,
      appliedScholarships: appliedSchol,
      deadline,
      notes,
      updatedAt: new Date().toISOString()
    };

    try {
      await onSaveTrack(payload);
      setShowAddForm(false);
    } catch (err: any) {
      alert(`Хадгалахад алдаа гарлаа: ${err.message}`);
    }
  };

  const handleDelete = async (trackId: string) => {
    if (window.confirm("Уг бүртгэлийг устгах уу? This tracker entry will be permanently removed.")) {
      try {
        await onDeleteTrack(trackId);
      } catch (err: any) {
        alert(`Устгахад алдаа гарлаа: ${err.message}`);
      }
    }
  };

  return (
    <div id="application-tracker-container" className="space-y-8 pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-neutral-400" />
            Аппликейшн Хөтөч
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Илгээсэн материал, виз, хариу хүлээж буй сургуулиудын хугацааг нэг дор хянах</p>
        </div>
        {!showAddForm && (
          <button
            id="btn-add-track"
            onClick={handleOpenAdd}
            className="bg-white text-black text-xs font-semibold px-4.5 py-2.5 rounded-xl transition hover:bg-neutral-200 flex items-center gap-1.5 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            Сургууль нэмэх
          </button>
        )}
      </div>

      {/* TRACKING CARD FORM */}
      {showAddForm && (
        <form id="track-form" onSubmit={handleSave} className="bg-neutral-900/50 border border-neutral-800 rounded-2.5xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-md">
              {editingTrack ? "Бүртгэл засварлах" : "Шинэ сургууль хянах"}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Болих
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Сургууль сонгох</label>
              <select
                id="form-track-uni"
                value={selectedUniId}
                onChange={(e) => {
                  setSelectedUniId(e.target.value);
                  if (e.target.value !== "custom") {
                    const match = universities.find(u => u.id === e.target.value);
                    if (match?.deadline) setDeadline(match.deadline);
                  }
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              >
                {universities.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                ))}
                <option value="custom">-- Өөр сургууль бичих --</option>
              </select>
            </div>

            {selectedUniId === "custom" && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Сургуулийн нэр</label>
                <input
                  id="form-track-custom-uni"
                  type="text"
                  required
                  value={customUniName}
                  onChange={(e) => setCustomUniName(e.target.value)}
                  placeholder="e.g. University of British Columbia"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Аппликейшны Төлөв</label>
              <select
                id="form-track-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationTrack['status'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{STATUS_LABELS[opt] || opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Эцсийн хугацаа</label>
              <input
                id="form-track-deadline"
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Nov 15, 2026 or January 15"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Хүсэлт гаргасан Тэтгэлэг</label>
              <input
                id="form-track-schol"
                type="text"
                value={appliedSchol}
                onChange={(e) => setAppliedSchol(e.target.value)}
                placeholder="e.g. Global Korea Scholarship (GKS)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            {/* Checklist of documents */}
            <div>
              <p className="text-xs font-semibold text-neutral-400 mb-2">Бэлдсэн материалын жагсаалт</p>
              <div id="track-docs-checklist" className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {GENERAL_DOCS.map(doc => {
                  const isChecked = checkedDocs.includes(doc);
                  return (
                    <button
                      key={doc}
                      type="button"
                      id={`btn-toggle-doc-${doc.replace(/\s+/g, '-')}`}
                      onClick={() => toggleDocument(doc)}
                      className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-neutral-950/50 flex items-center gap-3 text-neutral-300 text-xs text-wrap transition-all"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5 text-white shrink-0" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-neutral-600 shrink-0" />
                      )}
                      <span>{doc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Application Notes */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Нэмэлт тэмдэглэл</label>
              <textarea
                id="form-track-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need to request counselor for final evaluation before Friday. Follow-up email scheduled for Jan 20."
                rows={5}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-neutral-850">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Буцах
            </button>
            <button
              id="btn-submit-track"
              type="submit"
              disabled={isLoading}
              className="bg-white text-black text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-neutral-200 active:scale-95 transition-all"
            >
              {isLoading ? "Хадгалж байна..." : "Бүртгэл Хадгалах"}
            </button>
          </div>
        </form>
      )}

      {/* TRACKS LIST */}
      <div id="tracks-cards-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map(t => (
          <div
            key={t.id}
            id={`track-card-${t.id}`}
            className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  t.status === 'Admission Offered' || t.status === 'Scholarship Awarded'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : t.status === 'Rejected'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {STATUS_LABELS[t.status] || t.status}
                </span>
                
                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    id={`btn-edit-track-${t.id}`}
                    onClick={() => handleOpenEdit(t)}
                    className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-950"
                    title="Засах"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-delete-track-${t.id}`}
                    onClick={() => handleDelete(t.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 rounded hover:bg-neutral-950"
                    title="Устгах"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">{t.universityName}</h4>
              
              {/* Deadline */}
              {t.deadline && (
                <div className="flex items-center gap-1.5 mt-2 text-neutral-500 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Хугацаа: {t.deadline}</span>
                </div>
              )}

              {/* Progress checklist summary */}
              <div className="mt-4 pt-3.5 border-t border-neutral-850 space-y-1.5">
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Материал бэлтгэл</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-400 h-full transition-all duration-300"
                      style={{ width: `${(t.submittedDocuments?.length || 0) / GENERAL_DOCS.length * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {t.submittedDocuments?.length || 0}/{GENERAL_DOCS.length}
                  </span>
                </div>
              </div>

              {/* Scholarships */}
              {t.appliedScholarships && (
                <div className="mt-3.5 bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-850 grid grid-cols-1 gap-0.5">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Хүссэн тэтгэлэг:</span>
                  <span className="text-[11px] text-neutral-300 font-medium truncate">{t.appliedScholarships}</span>
                </div>
              )}

              {/* Personal Notes */}
              {t.notes && (
                <p className="text-neutral-400 text-xs mt-3 bg-neutral-950/20 p-2.5 rounded-xl border border-neutral-850/60 line-clamp-3 italic">
                  &ldquo;{t.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Last updated timestamp */}
            <div className="mt-4 pt-2.5 border-t border-neutral-850/40 text-[9px] text-neutral-600 font-mono text-right">
              Шинэчлэв: {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        ))}

        {tracks.length === 0 && (
          <div className="col-span-full py-16 bg-neutral-900/10 border border-dashed border-neutral-850 rounded-2xl flex flex-col items-center justify-center text-center p-6">
            <AlertCircle className="w-10 h-10 text-neutral-600 mb-3" />
            <h4 className="font-semibold text-neutral-300 text-sm">Хяналтын хуудас хоосон байна</h4>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">Одоогоор идэвхтэй хянах аппликейшн байхгүй байна. Баруун дээд хэсэгт орших &lsquo;Сургууль нэмэх&rsquo; товчлуураар бүртгэл үүсгээрэй.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 text-xs font-bold text-white bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 px-4 py-2 rounded-xl"
            >
              Анхны сургуулиа хянах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
