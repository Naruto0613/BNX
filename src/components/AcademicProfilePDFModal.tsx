import React, { useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { UserProfile } from "../types";
import {
  Printer,
  X,
  Award,
  BookOpen,
  Download,
  GraduationCap,
  Languages,
  Sparkles,
  Star,
  Globe,
  ShieldCheck,
  FileText,
  Loader2,
} from "lucide-react";

interface AcademicProfilePDFModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function AcademicProfilePDFModal({
  profile,
  isOpen,
  onClose,
}: AcademicProfilePDFModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById("printable-a4-document");
    if (!element) return;

    try {
      setIsGeneratingPdf(true);
      // Wait a tick to ensure full DOM rendering
      await new Promise((resolve) => setTimeout(resolve, 200));

      const imgData = await toJpeg(element, {
        quality: 0.98,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
        fontEmbedCSS: "",
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanName = (profile.name || "Academic_Profile").replace(
        /\s+/g,
        "_",
      );
      pdf.save(`${cleanName}_Academic_CV.pdf`);
    } catch (err) {
      console.error(
        "PDF generator error, falling back to window.print():",
        err,
      );
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate scores summary
  const totalAwards = profile.awardsList?.length || 0;
  const totalActivities = profile.activitiesList?.length || 0;
  const totalResearch = profile.researchList?.length || 0;

  return (
    <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8">
      {/* ACTION HEADER BAR (Hidden during actual print) */}
      <div className="print:hidden w-full max-w-4xl bg-neutral-900 border border-neutral-800 p-4 rounded-2xl mb-6 flex items-center justify-between gap-4 sticky top-2 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              A4 Академик CV & Портфолио PDF
            </h3>
            <p className="text-xs text-neutral-400">
              Хэвлэх болон PDF-ээр хадгалахад бэлэн стандартын формат
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>PDF Бэлтгэж байна...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-black" />
                <span>PDF Татах</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-300" />
            <span>Хэвлэх</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PRINT STYLING SHEET */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-a4-document, #printable-a4-document * {
            visibility: visible;
          }
          #printable-a4-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* A4 DOCUMENT CANVAS CONTAINER */}
      <div
        id="printable-a4-document"
        className="w-full max-w-4xl bg-white text-neutral-900 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8 font-sans border border-neutral-200"
      >
        {/* DOCUMENT HEADER */}
        <div className="border-b-2 border-neutral-900 pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-widest uppercase bg-black text-white px-2 py-0.5 rounded">
                OFFICIAL PORTFOLIO
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">
                COMMON APP STANDARD CV
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight uppercase">
              {profile.name || "Академик Профайл"}
            </h1>
            <p className="text-xs font-semibold text-neutral-600 mt-1 flex items-center gap-3">
              <span>{profile.school || "Сургуулийн нэр шивэгдээгүй"}</span>
              <span>•</span>
              <span>Төгсөх жил: {profile.graduationYear || "2026"}</span>
              <span>•</span>
              <span>{profile.city || "Улаанбаатар, Монгол"}</span>
            </p>
          </div>

          <div className="text-right text-[11px] text-neutral-500 font-mono">
            <div className="font-bold text-neutral-900">
              ID: MON-APP-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <div>Огноо: {new Date().toLocaleDateString("mn-MN")}</div>
            <div className="text-[9px] text-emerald-600 font-bold mt-1">
              VERIFIED PORTFOLIO
            </div>
          </div>
        </div>

        {/* PROFILE CONTACT & METRICS BAR */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="border-r border-neutral-200 last:border-0">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Сурлагын Голч (GPA)
            </div>
            <div className="text-xl font-black text-neutral-900 mt-0.5">
              {profile.gpa ? `${profile.gpa} / 4.0` : "Бүртгээгүй"}
            </div>
            {profile.classRank && (
              <div className="text-[10px] text-neutral-500">
                Эрэмбэ: {profile.classRank}
              </div>
            )}
          </div>

          <div className="border-r border-neutral-200 last:border-0">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              IELTS / TOEFL
            </div>
            <div className="text-xl font-black text-blue-700 mt-0.5">
              {profile.ieltsScore
                ? `IELTS ${profile.ieltsScore}`
                : profile.toeflScore
                  ? `TOEFL ${profile.toeflScore}`
                  : "—"}
            </div>
            {profile.detScore && (
              <div className="text-[10px] text-neutral-500">
                DET: {profile.detScore}
              </div>
            )}
          </div>

          <div className="border-r border-neutral-200 last:border-0">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              SAT / ACT
            </div>
            <div className="text-xl font-black text-purple-700 mt-0.5">
              {profile.satScore
                ? `SAT ${profile.satScore}`
                : profile.actScore
                  ? `ACT ${profile.actScore}`
                  : "—"}
            </div>
            <div className="text-[10px] text-neutral-500">Стандарт оноо</div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Шагнал & Манлайлал
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {totalAwards} Шагнал / {totalActivities} Ажил
            </div>
            <div className="text-[10px] text-neutral-500">
              {totalResearch} Судалгаа
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="text-xs grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-neutral-900 text-white rounded-xl">
          <div>
            <span className="text-neutral-400 font-medium">И-мэйл:</span>{" "}
            <span className="font-bold">
              {profile.email || "И-мэйл бүртгэгдээгүй"}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 font-medium">Утас:</span>{" "}
            <span className="font-bold">
              {profile.phone || "Утас бүртгэгдээгүй"}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 font-medium">Хаяг:</span>{" "}
            <span className="font-bold">
              {profile.city || "Улаанбаатар"}, Монгол Улс
            </span>
          </div>
        </div>

        {/* SECTION 1: ACADEMIC DETAILS & STANDARDIZED TESTS */}
        <div className="print-break-inside-avoid space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1.5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-neutral-900" /> 1. Академик
            оноо ба стандарчилагдсан шалгалтууд
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                Голч дүн (GPA)
              </span>
              <span className="font-black text-sm text-neutral-900">
                {profile.gpa ? `${profile.gpa} / 4.0` : "Бүртгүүлээгүй"}
              </span>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                IELTS Англи хэл
              </span>
              <span className="font-black text-sm text-neutral-900">
                {profile.ieltsScore ? profile.ieltsScore : "Бүртгүүлээгүй"}
              </span>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                SAT Шалгалт
              </span>
              <span className="font-black text-sm text-neutral-900">
                {profile.satScore ? profile.satScore : "Бүртгүүлээгүй"}
              </span>
            </div>

            {profile.toeflScore && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                  TOEFL iBT
                </span>
                <span className="font-black text-sm text-neutral-900">
                  {profile.toeflScore}
                </span>
              </div>
            )}

            {profile.detScore && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                  Duolingo DET
                </span>
                <span className="font-black text-sm text-neutral-900">
                  {profile.detScore}
                </span>
              </div>
            )}

            {profile.actScore && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                  ACT Шалгалт
                </span>
                <span className="font-black text-sm text-neutral-900">
                  {profile.actScore}
                </span>
              </div>
            )}
          </div>

          {(profile.apCourses || profile.ibCourses) && (
            <div className="mt-2 text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1">
              {profile.apCourses && (
                <div>
                  <span className="font-bold text-neutral-700">
                    AP Хичээлүүд:
                  </span>{" "}
                  {profile.apCourses}
                </div>
              )}
              {profile.ibCourses && (
                <div>
                  <span className="font-bold text-neutral-700">IB Диплом:</span>{" "}
                  {profile.ibCourses}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: HONORS & AWARDS */}
        <div className="print-break-inside-avoid space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1.5 flex items-center gap-2">
            <Award className="w-4 h-4 text-neutral-900" /> 2. Шагнал урамшуулал
            & Олимпиадын амжилт ({totalAwards})
          </h2>
          {profile.awardsList && profile.awardsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white uppercase text-[9px] font-bold">
                    <th className="p-2 border border-neutral-900">
                      Шагналын нэр
                    </th>
                    <th className="p-2 border border-neutral-900">
                      Төрөл / Чиглэл
                    </th>
                    <th className="p-2 border border-neutral-900">Түвшин</th>
                    <th className="p-2 border border-neutral-900">
                      Түвшин (Медаль)
                    </th>
                    <th className="p-2 border border-neutral-900 text-center">
                      Жил
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profile.awardsList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-neutral-200 hover:bg-neutral-50"
                    >
                      <td className="p-2 font-bold text-neutral-900 border border-neutral-200">
                        {item.awardName}
                      </td>
                      <td className="p-2 text-neutral-600 border border-neutral-200">
                        {item.category}
                      </td>
                      <td className="p-2 text-neutral-600 border border-neutral-200 font-semibold">
                        {item.level}
                      </td>
                      <td className="p-2 text-neutral-800 border border-neutral-200 font-bold">
                        {item.awardType}
                      </td>
                      <td className="p-2 text-neutral-600 border border-neutral-200 text-center">
                        {item.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-neutral-500 italic p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              {profile.awards ||
                profile.olympiads ||
                "Шагнал одоогоор бүртгүүлээгүй байна."}
            </div>
          )}
        </div>

        {/* SECTION 3: EXTRACURRICULAR ACTIVITIES & LEADERSHIP */}
        <div className="print-break-inside-avoid space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-900" /> 3. Хичээлээс
            гадуурх ажил & Манлайлал ({totalActivities})
          </h2>
          {profile.activitiesList && profile.activitiesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {profile.activitiesList.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>{act.role}</span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-mono">
                      {act.activityType}
                    </span>
                  </div>
                  <div className="text-neutral-700 font-medium">
                    {act.organization}
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-3">
                    <span>⏱ {act.hoursPerWeek} цаг/7 хоног</span>
                    <span>👥 {act.membersLed || 0} гишүүн удирдсан</span>
                  </div>
                  {act.achievements && (
                    <div className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                      {act.achievements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-500 italic p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              {profile.extracurricularActivities ||
                profile.volunteerActivities ||
                "Нийгмийн ажил одоогоор бүртгүүлээгүй байна."}
            </div>
          )}
        </div>

        {/* SECTION 4: RESEARCH & PUBLICATIONS */}
        {profile.researchList && profile.researchList.length > 0 && (
          <div className="print-break-inside-avoid space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-900" /> 4. Судалгаа &
              Эрдэм шинжилгээний өгүүлэл ({totalResearch})
            </h2>
            <div className="space-y-2 text-xs">
              {profile.researchList.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start justify-between"
                >
                  <div>
                    <div className="font-bold text-neutral-900">
                      {res.title}
                    </div>
                    <div className="text-neutral-600 text-[11px] mt-0.5">
                      Чиглэл: {res.researchArea} | Сэтгүүл/Бага хурал:{" "}
                      {res.conferenceOrJournal || "Нээлттэй"}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {res.published}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: LANGUAGES & SKILLS */}
        <div className="print-break-inside-avoid grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" /> Гадаад хэлний мэдлэг
            </h2>
            {profile.languagesList && profile.languagesList.length > 0 ? (
              <div className="space-y-1">
                {profile.languagesList.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded"
                  >
                    <span className="font-bold text-neutral-900">
                      {l.language}
                    </span>
                    <span className="text-neutral-600 font-medium">
                      {l.overallLevel}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 italic">
                Монгол хэл (Эх хэл), Англи хэл
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Техникийн болон зөөлөн чадварууд
            </h2>
            <div className="flex flex-wrap gap-1">
              {(profile.selectedProgrammingSkills || []).map((sk, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded"
                >
                  {sk}
                </span>
              ))}
              {(profile.selectedSoftSkills || []).map((sk, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded"
                >
                  {sk}
                </span>
              ))}
              {(profile.selectedCertificates || []).map((sk, idx) => (
                <span
                  key={idx}
                  className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6: PREFERENCES & TARGET UNIVERSITIES */}
        {profile.preferences && (
          <div className="print-break-inside-avoid space-y-2 text-xs p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Их сургууль, сонирхож буй улс
              орнууд
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-neutral-700">
              <div>
                <span className="font-bold text-neutral-900">
                  Сонирхож буй улс:
                </span>{" "}
                {(profile.preferences.preferredCountries || []).join(", ") ||
                  "Бүх улс"}
              </div>
              <div>
                <span className="font-bold text-neutral-900">
                  Төсөв (жилд):
                </span>{" "}
                ${profile.preferences.budgetAnnualUsd || "Чөлөөтэй"} USD
              </div>
              <div>
                <span className="font-bold text-neutral-900">
                  Тэтгэлэг хүсэх:
                </span>{" "}
                {profile.preferences.needScholarship}
              </div>
              <div>
                <span className="font-bold text-neutral-900">
                  Хүссэн мэргэжил:
                </span>{" "}
                {profile.preferences.careerGoal || "Сонгоогүй"}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER VERIFICATION STAMP */}
        <div className="border-t border-neutral-300 pt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Mongolia Admissions Standard Verified Academic Portfolio
            </span>
          </div>
          <div>Хуудас 1 / 1</div>
        </div>
      </div>
    </div>
  );
}
