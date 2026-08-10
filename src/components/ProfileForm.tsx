import React, { useState, useMemo } from "react";
import AcademicProfilePDFModal from "./AcademicProfilePDFModal";
import {
  UserProfile,
  AwardItem,
  ActivityItem,
  ResearchItem,
  LanguageItem,
  DocumentItem,
  UniversityPreferences,
} from "../types";
import {
  User,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  Languages,
  Cpu,
  FileText,
  Target,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  ExternalLink,
  FileCheck,
  Layers,
  ShieldCheck,
  Star,
  Globe,
  Check,
  Zap,
  Camera,
  Info,
  Printer,
} from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
  isLoading: boolean;
}

// Preset options for dropdowns
const AWARD_CATEGORIES = [
  "Academic",
  "Science",
  "Mathematics",
  "Programming",
  "Robotics",
  "Business",
  "Sports",
  "Arts",
  "Language",
  "Other",
] as const;

const AWARD_LEVELS = [
  "School",
  "District",
  "City",
  "Province",
  "National",
  "Regional",
  "International",
  "Global",
] as const;

const AWARD_TYPES = [
  "Champion",
  "Gold",
  "Silver",
  "Bronze",
  "Finalist",
  "Participant",
  "Honorable Mention",
  "Scholarship",
  "Research Award",
] as const;

const ACTIVITY_TYPES = [
  "Leadership",
  "Volunteer",
  "Research",
  "Internship",
  "Club",
  "Sports",
  "Music",
  "Art",
  "Business",
  "Startup",
  "Hackathon",
  "Debate",
  "Competition",
  "Community Service",
  "Teaching",
  "Work Experience",
  "Other",
] as const;

const ACTIVITY_ROLES = [
  "Founder",
  "Co-Founder",
  "President",
  "Vice President",
  "Captain",
  "Leader",
  "Coordinator",
  "Member",
  "Volunteer",
  "Research Assistant",
  "Intern",
  "Employee",
] as const;

const LANGUAGE_LEVELS = ["Basic", "Intermediate", "Fluent", "Native"] as const;

const PROGRAMMING_SKILLS_LIST = [
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "AI",
  "Cybersecurity",
];

const SOFT_SKILLS_LIST = [
  "Leadership",
  "Communication",
  "Critical Thinking",
  "Public Speaking",
  "Teamwork",
  "Problem Solving",
];

const CERTIFICATES_LIST = [
  "AWS",
  "Google",
  "Cisco",
  "Microsoft",
  "Meta",
  "Oracle",
];

const DOCUMENT_TYPES = [
  { key: "Transcript", label: "Дүнгийн хуулбар (Transcript)" },
  { key: "Passport", label: "Гадаад паспорт (Passport)" },
  { key: "CV", label: "Академик CV / Портфолио" },
  {
    key: "Recommendation Letter",
    label: "Тодорхойлох захиа (Recommendation Letter)",
  },
  { key: "Personal Statement", label: "Хувийн эссэ (Personal Statement)" },
  { key: "IELTS", label: "IELTS Батламж" },
  { key: "SAT", label: "SAT Сертификат" },
  { key: "TOEFL", label: "TOEFL Батламж" },
  { key: "Awards", label: "Шагнал, медалууд" },
  { key: "Certificates", label: "Сертификатууд" },
] as const;

const PREFERRED_COUNTRIES_LIST = [
  "АНУ",
  "Их Британи",
  "Канад",
  "Австрали",
  "Герман",
  "Япон",
  "Солонгос",
  "Сингапур",
  "Хятад",
  "Швейцарь",
];

export default function ProfileForm({
  profile,
  onSave,
  isLoading,
}: ProfileFormProps) {
  const [activeSection, setActiveSection] = useState<string>("header");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [formData, setFormData] = useState<UserProfile>({
    uid: profile.uid || "",
    name: profile.name || "",
    photoUrl: profile.photoUrl || "",
    phone: profile.phone || "",
    email: profile.email || "",
    address: profile.address || "Монгол Улс, Улаанбаатар хот",
    dob: profile.dob || "",
    nationality: profile.nationality || "Монгол Улс",
    city: profile.city || "Улаанбаатар",
    graduationYear: profile.graduationYear || 2026,
    country: profile.country || "Монгол Улс",
    school: profile.school || "",
    gpa: profile.gpa || undefined,
    classRank: profile.classRank || "",
    ieltsScore: profile.ieltsScore || undefined,
    toeflScore: profile.toeflScore || undefined,
    detScore: profile.detScore || undefined,
    satScore: profile.satScore || undefined,
    actScore: profile.actScore || undefined,
    apCourses: profile.apCourses || "",
    ibCourses: profile.ibCourses || "",
    careerInterests: profile.careerInterests || "Мэдээллийн Технологи",

    // Structured Lists
    awardsList: profile.awardsList || [],
    activitiesList: profile.activitiesList || [],
    researchList: profile.researchList || [],
    languagesList: profile.languagesList || [
      {
        id: "1",
        language: "Монгол хэл",
        reading: "Native",
        writing: "Native",
        listening: "Native",
        speaking: "Native",
        overallLevel: "Native",
      },
      {
        id: "2",
        language: "Англи хэл",
        reading: "Fluent",
        writing: "Fluent",
        listening: "Fluent",
        speaking: "Fluent",
        overallLevel: "Fluent",
      },
    ],
    selectedProgrammingSkills: profile.selectedProgrammingSkills || [
      "Python",
      "JavaScript",
      "React",
    ],
    selectedSoftSkills: profile.selectedSoftSkills || [
      "Leadership",
      "Problem Solving",
      "Teamwork",
    ],
    selectedCertificates: profile.selectedCertificates || ["Google", "AWS"],
    documentsList:
      profile.documentsList ||
      DOCUMENT_TYPES.map((doc) => ({
        id: doc.key,
        type: doc.key as any,
        status: "Missing",
        fileName: undefined,
      })),
    preferences: profile.preferences || {
      preferredCountries: ["АНУ", "Их Британи", "Канад"],
      budgetAnnualUsd: 25000,
      needScholarship: "Yes",
      preferredClimate: "Temperate",
      preferredCampusSize: "Medium",
      preferredCitySize: "Major Metropolis",
      preferredUniversityType: "Research",
      careerGoal:
        "Мэдээллийн технологи ба Хиймэл оюуны чиглэлээр дэлхийн жишигт нийцсэн инженер болох",
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live Score Calculation
  const scores = useMemo(() => {
    let filledCount = 0;
    const totalFields = 12;

    if (formData.name) filledCount++;
    if (formData.dob || formData.graduationYear) filledCount++;
    if (formData.school) filledCount++;
    if (formData.gpa) filledCount++;
    if (formData.satScore || formData.actScore) filledCount++;
    if (formData.ieltsScore || formData.toeflScore || formData.detScore)
      filledCount++;
    if (formData.awardsList && formData.awardsList.length > 0) filledCount++;
    if (formData.activitiesList && formData.activitiesList.length > 0)
      filledCount++;
    if (formData.languagesList && formData.languagesList.length > 0)
      filledCount++;
    if (
      formData.selectedProgrammingSkills &&
      formData.selectedProgrammingSkills.length > 0
    )
      filledCount++;
    if (
      formData.preferences &&
      formData.preferences.preferredCountries?.length > 0
    )
      filledCount++;
    if (
      formData.documentsList &&
      formData.documentsList.some((d) => d.status === "Uploaded")
    )
      filledCount++;

    const completionPct = Math.min(
      100,
      Math.round((filledCount / totalFields) * 100),
    );

    // Academic Score (0-100)
    let academicScore = 0;
    if (formData.gpa)
      academicScore += Math.min(35, Math.round((formData.gpa / 4.0) * 35));
    if (formData.satScore)
      academicScore += Math.min(
        25,
        Math.round((formData.satScore / 1600) * 25),
      );
    else if (formData.actScore)
      academicScore += Math.min(25, Math.round((formData.actScore / 36) * 25));

    if (formData.ieltsScore)
      academicScore += Math.min(
        20,
        Math.round((formData.ieltsScore / 9.0) * 20),
      );
    else if (formData.toeflScore)
      academicScore += Math.min(
        20,
        Math.round((formData.toeflScore / 120) * 20),
      );
    else if (formData.detScore)
      academicScore += Math.min(20, Math.round((formData.detScore / 160) * 20));

    if (formData.apCourses || formData.ibCourses) academicScore += 10;
    if (formData.classRank) academicScore += 10;
    academicScore = Math.min(100, academicScore);

    // Activity Score (0-100)
    let activityScore = 0;
    const actList = formData.activitiesList || [];
    activityScore += Math.min(40, actList.length * 12);
    const awardList = formData.awardsList || [];
    activityScore += Math.min(30, awardList.length * 10);
    const researchList = formData.researchList || [];
    activityScore += Math.min(20, researchList.length * 10);
    if (formData.selectedProgrammingSkills?.length) {
      activityScore += Math.min(
        10,
        formData.selectedProgrammingSkills.length * 2,
      );
    }
    activityScore = Math.min(100, activityScore);

    // Leadership Score (0-100)
    let leadershipScore = 0;
    actList.forEach((act) => {
      if (
        ["Founder", "Co-Founder", "President", "Captain", "Leader"].includes(
          act.role,
        )
      ) {
        leadershipScore += 25;
      } else if (["Vice President", "Coordinator"].includes(act.role)) {
        leadershipScore += 15;
      }
      if (act.membersLed && act.membersLed > 0) {
        leadershipScore += Math.min(20, act.membersLed * 2);
      }
    });
    awardList.forEach((awd) => {
      if (["International", "Global", "National"].includes(awd.level)) {
        leadershipScore += 10;
      }
    });
    leadershipScore = Math.min(100, leadershipScore);

    return { completionPct, academicScore, activityScore, leadershipScore };
  }, [formData]);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFillDemoData = () => {
    setFormData({
      uid: profile.uid || "",
      name: "Батын Анандын",
      photoUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      phone: "+976 9911-2233",
      email: profile.email || "anand.b@student.mn",
      address: "Монгол Улс, Улаанбаатар хот",
      dob: "2007-05-14",
      nationality: "Монгол Улс",
      city: "Улаанбаатар хот",
      graduationYear: 2026,
      country: "Монгол Улс",
      school: "Шинэ Монгол Ахлах Сургууль",
      gpa: 3.92,
      classRank: "Top 5%",
      ieltsScore: 7.5,
      toeflScore: 104,
      detScore: 135,
      satScore: 1490,
      actScore: 33,
      apCourses:
        "AP Calculus BC (5), AP Physics C (4), AP Computer Science A (5)",
      ibCourses: "Math HL (7), Physics HL (6), Economics SL (6)",
      careerInterests: "Мэдээллийн Технологи",

      awardsList: [
        {
          id: "1",
          awardName: "Улсын Информатикийн Олимпиад - Алтан Медаль",
          competitionName: "Улсын Мэдээлэл Зүйн 36-р Олимпиад",
          category: "Programming",
          level: "National",
          awardType: "Gold",
          year: "2025",
          organizer: "Боловсролын Ерөнхий Газар",
          description:
            "Улсын хэмжээний 250+ сурагчдаас алгоритм, өгөгдлийн бүтцийн бодлогуудыг хамгийн богино хугацаанд бодож 1-р байр эзэлсэн.",
        },
        {
          id: "2",
          awardName:
            "Ази Номхон Далайн Мэдээлэл Зүйн Олимпиад (APIO) - Хүрэл Медаль",
          competitionName: "Asian-Pacific Informatics Olympiad 2025",
          category: "Programming",
          level: "International",
          awardType: "Bronze",
          year: "2025",
          organizer: "APIO Committee",
          description:
            "Азийн 30 гаруй орны шилдэг залуу алгоритмчдын олон улсын тэмцээнд шагналт хүрэл медаль хүртсэн.",
        },
      ],

      activitiesList: [
        {
          id: "1",
          activityType: "Leadership",
          role: "Founder",
          organization: "CodeMongolia Залуучуудын Клуб",
          startDate: "2024-09",
          endDate: "Одоог хүртэл",
          hoursPerWeek: 8,
          membersLed: 35,
          beneficiaries: 200,
          achievements:
            "Ерөнхий боловсролын сургуулийн 200+ сурагчдад Python ба веб програмчлалын анхан шатны үнэ төлбөргүй сургалт амжилттай зохион байгуулсан.",
        },
        {
          id: "2",
          activityType: "Volunteer",
          role: "Leader",
          organization: "Улаанбаатар Ногоон Ирээдүй төсөл",
          startDate: "2024-05",
          endDate: "2024-10",
          hoursPerWeek: 5,
          membersLed: 15,
          beneficiaries: 500,
          achievements:
            "Хотын паркад 300 мод тарих болон хог ангилах аяныг санаачлан 15 сайн дурын ажилтныг удирдан ажилласан.",
        },
      ],

      researchList: [
        {
          id: "1",
          title:
            "Хиймэл оюунд суурилсан Монгол хэлний бичвэр залруулагч алгоритм",
          published: "Yes",
          conferenceOrJournal: "Mongolian Youth Science Conference 2025",
          researchArea: "Natural Language Processing (NLP)",
          supervisor: "Доктор Б.Ганзориг (МҮИС-ийн профессор)",
        },
      ],

      languagesList: [
        {
          id: "1",
          language: "Монгол хэл",
          reading: "Native",
          writing: "Native",
          listening: "Native",
          speaking: "Native",
          overallLevel: "Native",
        },
        {
          id: "2",
          language: "Англи хэл",
          reading: "Fluent",
          writing: "Fluent",
          listening: "Fluent",
          speaking: "Fluent",
          overallLevel: "Fluent",
        },
        {
          id: "3",
          language: "Солонгос хэл",
          reading: "Intermediate",
          writing: "Basic",
          listening: "Intermediate",
          speaking: "Basic",
          overallLevel: "Intermediate",
        },
      ],

      selectedProgrammingSkills: [
        "Python",
        "C++",
        "JavaScript",
        "React",
        "AI",
        "SQL",
      ],
      selectedSoftSkills: [
        "Leadership",
        "Problem Solving",
        "Critical Thinking",
        "Public Speaking",
      ],
      selectedCertificates: ["Google", "AWS"],

      documentsList: [
        {
          id: "Transcript",
          type: "Transcript",
          status: "Uploaded",
          fileName: "Official_Transcript_2026.pdf",
          updatedAt: "2026-01-10",
        },
        {
          id: "Passport",
          type: "Passport",
          status: "Uploaded",
          fileName: "Mongolian_Passport_Anand.pdf",
          updatedAt: "2025-11-20",
        },
        {
          id: "CV",
          type: "CV",
          status: "Uploaded",
          fileName: "Academic_CV_CommonApp.pdf",
          updatedAt: "2026-02-01",
        },
        {
          id: "Recommendation Letter",
          type: "Recommendation Letter",
          status: "Uploaded",
          fileName: "RecLetter_MathTeacher.pdf",
          updatedAt: "2026-01-15",
        },
        {
          id: "Personal Statement",
          type: "Personal Statement",
          status: "Uploaded",
          fileName: "Personal_Statement_Final.pdf",
          updatedAt: "2026-02-02",
        },
        {
          id: "IELTS",
          type: "IELTS",
          status: "Uploaded",
          fileName: "IELTS_Test_Report_Form.pdf",
          updatedAt: "2025-09-12",
        },
        {
          id: "SAT",
          type: "SAT",
          status: "Uploaded",
          fileName: "CollegeBoard_SAT_ScoreReport.pdf",
          updatedAt: "2025-12-05",
        },
        { id: "TOEFL", type: "TOEFL", status: "Missing" },
        {
          id: "Awards",
          type: "Awards",
          status: "Uploaded",
          fileName: "National_Olympiad_Gold_Cert.pdf",
          updatedAt: "2025-05-18",
        },
        {
          id: "Certificates",
          type: "Certificates",
          status: "Uploaded",
          fileName: "Google_DataAnalytics_Cert.pdf",
          updatedAt: "2025-08-30",
        },
      ],

      preferences: {
        preferredCountries: [
          "АНУ",
          "Их Британи",
          "Канад",
          "Герман",
          "Сингапур",
        ],
        budgetAnnualUsd: 30000,
        needScholarship: "Yes",
        preferredClimate: "Temperate",
        preferredCampusSize: "Medium",
        preferredCitySize: "Major Metropolis",
        preferredUniversityType: "Research",
        careerGoal:
          "Ирээдүйд Stanford болон MIT зэрэг дэлхийн шилдэг сургуульд суралцаж, Хиймэл оюуны салбарт стартап үүсгэн байгуулах.",
      },
    });

    setMessage({
      type: "success",
      text: "Загвар сурагчийн академик профайл амжилттай бөглөгдлөө!",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await onSave(formData);
      setMessage({
        type: "success",
        text: "Академик профайл амжилттай хадгалагдлаа!",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Хадгалахад алдаа гарлаа.",
      });
    }
  };

  // Helper arrays for dynamic list management
  const addAward = () => {
    const newAward: AwardItem = {
      id: Date.now().toString(),
      awardName: "",
      competitionName: "",
      category: "Academic",
      level: "National",
      awardType: "Gold",
      year: new Date().getFullYear().toString(),
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      awardsList: [...(prev.awardsList || []), newAward],
    }));
  };

  const updateAward = (id: string, field: keyof AwardItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      awardsList: (prev.awardsList || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeAward = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      awardsList: (prev.awardsList || []).filter((item) => item.id !== id),
    }));
  };

  const addActivity = () => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      activityType: "Leadership",
      role: "Leader",
      organization: "",
      hoursPerWeek: 5,
      membersLed: 0,
      beneficiaries: 0,
      achievements: "",
    };
    setFormData((prev) => ({
      ...prev,
      activitiesList: [...(prev.activitiesList || []), newActivity],
    }));
  };

  const updateActivity = (
    id: string,
    field: keyof ActivityItem,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      activitiesList: (prev.activitiesList || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeActivity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      activitiesList: (prev.activitiesList || []).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const addResearch = () => {
    const newResearch: ResearchItem = {
      id: Date.now().toString(),
      title: "",
      published: "No",
      researchArea: "",
      supervisor: "",
    };
    setFormData((prev) => ({
      ...prev,
      researchList: [...(prev.researchList || []), newResearch],
    }));
  };

  const updateResearch = (
    id: string,
    field: keyof ResearchItem,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      researchList: (prev.researchList || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeResearch = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      researchList: (prev.researchList || []).filter((item) => item.id !== id),
    }));
  };

  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: Date.now().toString(),
      language: "",
      reading: "Intermediate",
      writing: "Intermediate",
      listening: "Intermediate",
      speaking: "Intermediate",
      overallLevel: "Intermediate",
    };
    setFormData((prev) => ({
      ...prev,
      languagesList: [...(prev.languagesList || []), newLang],
    }));
  };

  const updateLanguage = (
    id: string,
    field: keyof LanguageItem,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      languagesList: (prev.languagesList || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      languagesList: (prev.languagesList || []).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const toggleChip = (
    listKey:
      | "selectedProgrammingSkills"
      | "selectedSoftSkills"
      | "selectedCertificates",
    item: string,
  ) => {
    setFormData((prev) => {
      const current = prev[listKey] || [];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return { ...prev, [listKey]: updated };
    });
  };

  const toggleDocumentStatus = (docTypeKey: string) => {
    setFormData((prev) => {
      const list = prev.documentsList || [];
      const updated = list.map((doc) => {
        if (doc.id === docTypeKey || doc.type === docTypeKey) {
          const nextStatus: DocumentItem["status"] =
            doc.status === "Uploaded" ? "Missing" : "Uploaded";
          return {
            ...doc,
            status: nextStatus,
            fileName:
              nextStatus === "Uploaded"
                ? `${docTypeKey}_Document.pdf`
                : undefined,
            updatedAt:
              nextStatus === "Uploaded"
                ? new Date().toISOString().split("T")[0]
                : undefined,
          };
        }
        return doc;
      });
      return { ...prev, documentsList: updated };
    });
  };

  const navItems = [
    { id: "header", label: "Ерөнхий Профайл", icon: User },
    { id: "sec1", label: "1. Хувийн Мэдээлэл", icon: FileText },
    { id: "sec2", label: "2. Академик Дүн", icon: GraduationCap },
    { id: "sec3", label: "3. Шагнал & Олимпиад", icon: Award },
    { id: "sec4", label: "4. Идэвх ба Нийгэм", icon: Briefcase },
    { id: "sec5", label: "5. Судалгаа", icon: BookOpen },
    { id: "sec6", label: "6. Гадаад Хэл", icon: Languages },
    { id: "sec7", label: "7. Ур Чадвар", icon: Cpu },
    { id: "sec8", label: "8. Баримт Бичиг", icon: FileCheck },
    { id: "sec9", label: "9. Сургуулийн Сонголт", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-3 sm:p-6 lg:p-8 font-sans antialiased select-none">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* TOP STATUS BAR & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 rounded-2xl backdrop-blur-xl sticky top-4 z-40 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Академик Профайл Бүтээгч
                <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  CommonApp Standard
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Их сургуулийн элсэлт & тэтгэлэгт тохирох онооны шинжилгээний
                стандарт портфолио
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-amber-400/30 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              A4 PDF Хадгалах
            </button>

            <button
              type="button"
              onClick={handleFillDemoData}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border border-neutral-700/60 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Жишээ Дата Бөглөх
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-white/10 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Профайл Хадгалах
            </button>
          </div>
        </div>

        {/* NOTIFICATION MESSAGES */}
        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              message.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/30 text-rose-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-medium">{message.text}</span>
          </div>
        )}

        {/* HEADER PROFILE CARD & LIVE SCORES */}
        <div
          id="header"
          className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-6 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-amber-500/5 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Details */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative group">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-neutral-700 shadow-xl"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 font-bold text-xl">
                    {formData.name ? formData.name.charAt(0) : "U"}
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 bg-black/80 p-1 rounded-lg border border-neutral-700 cursor-pointer hover:bg-black transition-colors"
                  title="Зураг солих"
                >
                  <Camera className="w-3.5 h-3.5 text-neutral-300" />
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  {formData.name || "Хэрэглэгчийн нэр"}
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Баталгаажсан
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 flex items-center gap-2 flex-wrap">
                  <span>{formData.school || "Ахлах сургууль оруулаагүй"}</span>
                  <span className="text-neutral-600">•</span>
                  <span>{formData.country || "Улс"}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-amber-300 font-medium">
                    {formData.careerInterests || "Салбар"}
                  </span>
                </p>
                <div className="pt-1 flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                  <span>
                    Төгсөх жил:{" "}
                    <strong className="text-white">
                      {formData.graduationYear}
                    </strong>
                  </span>
                  <span>
                    Иргэншил:{" "}
                    <strong className="text-white">
                      {formData.nationality}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Live Admission Match Score Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:w-auto w-full">
              <div className="bg-neutral-950/80 border border-neutral-800/80 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  Профайлын Бүрдэл
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white">
                    {scores.completionPct}%
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${scores.completionPct}%` }}
                  />
                </div>
              </div>

              <div className="bg-neutral-950/80 border border-neutral-800/80 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  Академик Оноо
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-amber-400">
                    {scores.academicScore}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    / 100
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${scores.academicScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-neutral-950/80 border border-neutral-800/80 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  Идэвхийн Оноо
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-sky-400">
                    {scores.activityScore}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    / 100
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full transition-all duration-500"
                    style={{ width: `${scores.activityScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-neutral-950/80 border border-neutral-800/80 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  Манлайлал Оноо
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-indigo-400">
                    {scores.leadershipScore}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    / 100
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full transition-all duration-500"
                    style={{ width: `${scores.leadershipScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Segment Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-neutral-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-md"
                      : "bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN FORM SECTIONS */}
        <div className="space-y-8">
          {/* SECTION 1: PERSONAL INFORMATION */}
          {(activeSection === "header" || activeSection === "sec1") && (
            <div
              id="sec1"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Хувийн Мэдээлэл (Personal Information)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Бүтэн Нэр (Full Name)
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Жишээ: Батын Анандын"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Төрсөн Огноо (Date of Birth)
                  </label>
                  <input
                    type="date"
                    value={formData.dob || ""}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Иргэншил (Nationality)
                  </label>
                  <select
                    value={formData.nationality || "Монгол Улс"}
                    onChange={(e) =>
                      handleChange("nationality", e.target.value)
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none transition-all"
                  >
                    <option value="Монгол Улс">Монгол Улс (Mongolia)</option>
                    <option value="Канад">Канад (Canada)</option>
                    <option value="АНУ">АНУ (United States)</option>
                    <option value="Бусад">Бусад (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Одоо байгаа Улс (Country)
                  </label>
                  <input
                    type="text"
                    value={formData.country || "Монгол Улс"}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Хот / Аймаг (City / State)
                  </label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Улаанбаатар хот"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Ахлах Сургууль (High School)
                  </label>
                  <input
                    type="text"
                    value={formData.school || ""}
                    onChange={(e) => handleChange("school", e.target.value)}
                    placeholder="Шинэ Монгол Ахлах Сургууль"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1.5">
                    Төгсөх Жил (Graduation Year)
                  </label>
                  <select
                    value={formData.graduationYear || 2026}
                    onChange={(e) =>
                      handleChange("graduationYear", Number(e.target.value))
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none transition-all font-mono"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>
                        {y} он
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ACADEMIC RESULTS */}
          {(activeSection === "header" || activeSection === "sec2") && (
            <div
              id="sec2"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Академик Дүн & Шалгалтууд (Academic Results)
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Картаар системчлэгдсэн дүнгүүд
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* GPA Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      GPA (Голч Дүн)
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 4.0
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa || ""}
                    onChange={(e) =>
                      handleChange(
                        "gpa",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="3.85"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-amber-400 focus:border-amber-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">
                    Сургуулийн албан ёсны транскрипт дэх голч
                  </p>
                </div>

                {/* SAT Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      SAT Score
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 1600
                    </span>
                  </div>
                  <input
                    type="number"
                    step="10"
                    min="400"
                    max="1600"
                    value={formData.satScore || ""}
                    onChange={(e) =>
                      handleChange(
                        "satScore",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="1480"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-sky-400 focus:border-sky-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">
                    College Board албан ёсны оноо
                  </p>
                </div>

                {/* ACT Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      ACT Score
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 36
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="36"
                    value={formData.actScore || ""}
                    onChange={(e) =>
                      handleChange(
                        "actScore",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="33"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-indigo-400 focus:border-indigo-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">
                    ACT шалгалтын оноо
                  </p>
                </div>

                {/* IELTS Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      IELTS Overall
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 9.0
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9.0"
                    value={formData.ieltsScore || ""}
                    onChange={(e) =>
                      handleChange(
                        "ieltsScore",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="7.5"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-emerald-400 focus:border-emerald-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">
                    Academic IELTS оноо
                  </p>
                </div>

                {/* TOEFL Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      TOEFL iBT
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 120
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="120"
                    value={formData.toeflScore || ""}
                    onChange={(e) =>
                      handleChange(
                        "toeflScore",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="102"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-emerald-400 focus:border-emerald-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">TOEFL iBT оноо</p>
                </div>

                {/* DET Card */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      DET (Duolingo English)
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Шкала: 160
                    </span>
                  </div>
                  <input
                    type="number"
                    step="5"
                    min="10"
                    max="160"
                    value={formData.detScore || ""}
                    onChange={(e) =>
                      handleChange(
                        "detScore",
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="130"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-base font-extrabold text-amber-400 focus:border-amber-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">
                    Duolingo English Test оноо
                  </p>
                </div>

                {/* Class Rank */}
                <div className="bg-neutral-950/80 border border-neutral-800/80 p-4 rounded-xl space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold text-white block">
                    Ангийн Эрэмбэ (Class Rank)
                  </label>
                  <select
                    value={formData.classRank || ""}
                    onChange={(e) => handleChange("classRank", e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                  >
                    <option value="">Сонгоно уу...</option>
                    <option value="Top 1%">Шилдэг 1% (Top 1%)</option>
                    <option value="Top 5%">Шилдэг 5% (Top 5%)</option>
                    <option value="Top 10%">Шилдэг 10% (Top 10%)</option>
                    <option value="Top 20%">Шилдэг 20% (Top 20%)</option>
                    <option value="Top 50%">
                      Ангийн эхний хагас (Top 50%)
                    </option>
                  </select>
                </div>

                {/* AP & IB Courses */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      AP Курсууд (AP Courses & Scores)
                    </label>
                    <input
                      type="text"
                      value={formData.apCourses || ""}
                      onChange={(e) =>
                        handleChange("apCourses", e.target.value)
                      }
                      placeholder="Жишээ: AP Calculus BC (5), AP Physics (4)"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      IB Диплом (IB Diploma Subjects & Points)
                    </label>
                    <input
                      type="text"
                      value={formData.ibCourses || ""}
                      onChange={(e) =>
                        handleChange("ibCourses", e.target.value)
                      }
                      placeholder="Жишээ: IB Math HL (7), IB Physics SL (6) Total: 41/45"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: HONORS & AWARDS */}
          {(activeSection === "header" || activeSection === "sec3") && (
            <div
              id="sec3"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Шагнал & Олимпиадууд (Honors & Awards)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addAward}
                  className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Шагнал Нэмэх
                </button>
              </div>

              {!formData.awardsList || formData.awardsList.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800 space-y-2">
                  <Award className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    Одоогоор ямар нэгэн шагнал бүртгэгдээгүй байна.
                  </p>
                  <button
                    type="button"
                    onClick={addAward}
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    + Анхны шагналаа бүртгэх
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.awardsList.map((award, index) => (
                    <div
                      key={award.id}
                      className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          Шагнал #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAward(award.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Устгах"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Шагналын Нэр (Award Name)
                          </label>
                          <input
                            type="text"
                            value={award.awardName}
                            onChange={(e) =>
                              updateAward(award.id, "awardName", e.target.value)
                            }
                            placeholder="Улсын Мэдээлэл Зүйн Олимпиад - Алтан Медаль"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Тэмцээний Нэр (Competition Name)
                          </label>
                          <input
                            type="text"
                            value={award.competitionName}
                            onChange={(e) =>
                              updateAward(
                                award.id,
                                "competitionName",
                                e.target.value,
                              )
                            }
                            placeholder="Олон Улсын Математикийн Тэмцээн"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Ангилал (Category)
                          </label>
                          <select
                            value={award.category}
                            onChange={(e) =>
                              updateAward(award.id, "category", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                          >
                            {AWARD_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Түвшин (Level)
                          </label>
                          <select
                            value={award.level}
                            onChange={(e) =>
                              updateAward(award.id, "level", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                          >
                            {AWARD_LEVELS.map((lvl) => (
                              <option key={lvl} value={lvl}>
                                {lvl}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Шагналын Төрөл (Award Type)
                          </label>
                          <select
                            value={award.awardType}
                            onChange={(e) =>
                              updateAward(award.id, "awardType", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                          >
                            {AWARD_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Жил (Year)
                          </label>
                          <input
                            type="text"
                            value={award.year}
                            onChange={(e) =>
                              updateAward(award.id, "year", e.target.value)
                            }
                            placeholder="2025"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">
                          Товч Тодорхойлолт (Max 300 тэмдэгт - Утга агуулга)
                          <span className="float-right text-[10px] text-neutral-500 font-mono">
                            {(award.description || "").length} / 300
                          </span>
                        </label>
                        <textarea
                          maxLength={300}
                          rows={2}
                          value={award.description || ""}
                          onChange={(e) =>
                            updateAward(award.id, "description", e.target.value)
                          }
                          placeholder="Тэмцээний цар хүрээ, үзүүлсэн амжилт, шагналын ач холбогдлыг товч тайлбарлаарай..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:border-amber-400 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: EXTRACURRICULAR ACTIVITIES */}
          {(activeSection === "header" || activeSection === "sec4") && (
            <div
              id="sec4"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Нийгмийн ба Гадуурх Идэвх (Extracurricular Activities)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addActivity}
                  className="bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Идэвх Нэмэх
                </button>
              </div>

              {!formData.activitiesList ||
              formData.activitiesList.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800 space-y-2">
                  <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    Гадуурх идэвх бүртгэгдээгүй байна.
                  </p>
                  <button
                    type="button"
                    onClick={addActivity}
                    className="text-xs text-sky-400 font-semibold hover:underline"
                  >
                    + Гадуурх идэвх, клубын үйл ажиллагаа бүртгэх
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.activitiesList.map((act, index) => (
                    <div
                      key={act.id}
                      className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                        <span className="text-xs font-mono font-bold text-sky-400">
                          Идэвх/Үйл Ажиллагаа #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeActivity(act.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Идэвхийн Төрөл (Activity Type)
                          </label>
                          <select
                            value={act.activityType}
                            onChange={(e) =>
                              updateActivity(
                                act.id,
                                "activityType",
                                e.target.value,
                              )
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none"
                          >
                            {ACTIVITY_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Албан Тушаал / Вайл (Role)
                          </label>
                          <select
                            value={act.role}
                            onChange={(e) =>
                              updateActivity(act.id, "role", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none"
                          >
                            {ACTIVITY_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Байгууллага / Клуб (Organization)
                          </label>
                          <input
                            type="text"
                            value={act.organization}
                            onChange={(e) =>
                              updateActivity(
                                act.id,
                                "organization",
                                e.target.value,
                              )
                            }
                            placeholder="CodeMongolia Youth Club"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Долоо хоногийн цаг (Hours/Week)
                          </label>
                          <input
                            type="number"
                            value={act.hoursPerWeek || 0}
                            onChange={(e) =>
                              updateActivity(
                                act.id,
                                "hoursPerWeek",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Удирдсан Гишүүдийн Тоо (Members Led)
                          </label>
                          <input
                            type="number"
                            value={act.membersLed || 0}
                            onChange={(e) =>
                              updateActivity(
                                act.id,
                                "membersLed",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Хамрагдсан Хүмүүс (Beneficiaries)
                          </label>
                          <input
                            type="number"
                            value={act.beneficiaries || 0}
                            onChange={(e) =>
                              updateActivity(
                                act.id,
                                "beneficiaries",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">
                          Амжилт ба Үр Дүн (Achievements & Impact)
                        </label>
                        <textarea
                          rows={2}
                          value={act.achievements || ""}
                          onChange={(e) =>
                            updateActivity(
                              act.id,
                              "achievements",
                              e.target.value,
                            )
                          }
                          placeholder="Хүрсэн үр дүн, зохион байгуулсан аян, нийгэмд үзүүлсэн нөлөөллийг бичнэ үү..."
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:border-sky-400 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: RESEARCH */}
          {(activeSection === "header" || activeSection === "sec5") && (
            <div
              id="sec5"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    Судалгааны Ажил (Research Projects)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addResearch}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Судалгаа Нэмэх
                </button>
              </div>

              {!formData.researchList || formData.researchList.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800 space-y-2">
                  <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    Судалгааны ажил бүртгэгдээгүй байна.
                  </p>
                  <button
                    type="button"
                    onClick={addResearch}
                    className="text-xs text-indigo-400 font-semibold hover:underline"
                  >
                    + Эрдэм шинжилгээний ажил нэмэх
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.researchList.map((res, index) => (
                    <div
                      key={res.id}
                      className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          Судалгаа #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeResearch(res.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Судалгааны Сэдэв (Research Title)
                          </label>
                          <input
                            type="text"
                            value={res.title}
                            onChange={(e) =>
                              updateResearch(res.id, "title", e.target.value)
                            }
                            placeholder="Судалгааны ажлын нэр болон чиглэл"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Хэвлэгдсэн үү? (Published)
                          </label>
                          <select
                            value={res.published}
                            onChange={(e) =>
                              updateResearch(
                                res.id,
                                "published",
                                e.target.value,
                              )
                            }
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-400 outline-none"
                          >
                            <option value="Yes">Тийм (Yes)</option>
                            <option value="No">Үгүй (No)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Сэтгүүл / Эрдэм Шинжилгээний Хурал
                          </label>
                          <input
                            type="text"
                            value={res.conferenceOrJournal || ""}
                            onChange={(e) =>
                              updateResearch(
                                res.id,
                                "conferenceOrJournal",
                                e.target.value,
                              )
                            }
                            placeholder="Journal of Computer Science"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Судалгааны Салбар (Research Area)
                          </label>
                          <input
                            type="text"
                            value={res.researchArea || ""}
                            onChange={(e) =>
                              updateResearch(
                                res.id,
                                "researchArea",
                                e.target.value,
                              )
                            }
                            placeholder="AI, Applied Mathematics, Economics..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 block mb-1">
                            Удирдан Чиглүүлэгч Багш (Supervisor)
                          </label>
                          <input
                            type="text"
                            value={res.supervisor || ""}
                            onChange={(e) =>
                              updateResearch(
                                res.id,
                                "supervisor",
                                e.target.value,
                              )
                            }
                            placeholder="Доктор Б.Ганзориг"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: LANGUAGES */}
          {(activeSection === "header" || activeSection === "sec6") && (
            <div
              id="sec6"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <Languages className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Гадаад Хэлний Мэдлэг (Languages)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Хэл Нэмэх
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.languagesList || []).map((lang) => (
                  <div
                    key={lang.id}
                    className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) =>
                          updateLanguage(lang.id, "language", e.target.value)
                        }
                        placeholder="Хэлний нэр (Англи хэл...)"
                        className="bg-transparent text-sm font-bold text-emerald-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">
                          Унших (Reading)
                        </span>
                        <select
                          value={lang.reading}
                          onChange={(e) =>
                            updateLanguage(lang.id, "reading", e.target.value)
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        >
                          {LANGUAGE_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">
                          Бичих (Writing)
                        </span>
                        <select
                          value={lang.writing}
                          onChange={(e) =>
                            updateLanguage(lang.id, "writing", e.target.value)
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        >
                          {LANGUAGE_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">
                          Сонсох (Listening)
                        </span>
                        <select
                          value={lang.listening}
                          onChange={(e) =>
                            updateLanguage(lang.id, "listening", e.target.value)
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        >
                          {LANGUAGE_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">
                          Ярих (Speaking)
                        </span>
                        <select
                          value={lang.speaking}
                          onChange={(e) =>
                            updateLanguage(lang.id, "speaking", e.target.value)
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        >
                          {LANGUAGE_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: SKILLS & CHIPS */}
          {(activeSection === "header" || activeSection === "sec7") && (
            <div
              id="sec7"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-6"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Ур Чадвар & Сертификатууд (Skills & Certificates)
                </h3>
              </div>

              {/* Programming Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-300 block">
                  Програмчлал ба Технологи (Programming Skills)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PROGRAMMING_SKILLS_LIST.map((skill) => {
                    const selected = (
                      formData.selectedProgrammingSkills || []
                    ).includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          toggleChip("selectedProgrammingSkills", skill)
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          selected
                            ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/20"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {selected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-300 block">
                  Хувь Хүний Ур Чадвар (Soft Skills)
                </span>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS_LIST.map((skill) => {
                    const selected = (
                      formData.selectedSoftSkills || []
                    ).includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleChip("selectedSoftSkills", skill)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          selected
                            ? "bg-sky-400 text-black border-sky-300 shadow-lg shadow-sky-400/20"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {selected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certificates */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-300 block">
                  Мэргэжлийн Сертификат (Certificates)
                </span>
                <div className="flex flex-wrap gap-2">
                  {CERTIFICATES_LIST.map((cert) => {
                    const selected = (
                      formData.selectedCertificates || []
                    ).includes(cert);
                    return (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleChip("selectedCertificates", cert)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          selected
                            ? "bg-emerald-400 text-black border-emerald-300 shadow-lg shadow-emerald-400/20"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {selected ? `✓ ${cert}` : `+ ${cert}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DOCUMENTS */}
          {(activeSection === "header" || activeSection === "sec8") && (
            <div
              id="sec8"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Баримт Бичгүүдийн Сан (Documents Vault)
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  CommonApp & Элсэлтэд шаардлагатай
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {DOCUMENT_TYPES.map((docType) => {
                  const currentDoc = (formData.documentsList || []).find(
                    (d) => d.type === docType.key,
                  );
                  const isUploaded = currentDoc?.status === "Uploaded";

                  return (
                    <div
                      key={docType.key}
                      className={`bg-neutral-950/90 border rounded-xl p-4 space-y-3 transition-all ${
                        isUploaded
                          ? "border-emerald-500/30"
                          : "border-neutral-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white leading-tight">
                          {docType.label}
                        </span>
                        {isUploaded ? (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Байршуулсан
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-full shrink-0">
                            Байхгүй
                          </span>
                        )}
                      </div>

                      {isUploaded && currentDoc?.fileName && (
                        <p className="text-[11px] text-neutral-400 font-mono truncate">
                          📄 {currentDoc.fileName}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleDocumentStatus(docType.key)}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isUploaded
                              ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                              : "bg-amber-400 text-black hover:bg-amber-300 font-bold"
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {isUploaded ? "Солих / Шинэчлэх" : "Файл байршуулах"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 9: UNIVERSITY PREFERENCES */}
          {(activeSection === "header" || activeSection === "sec9") && (
            <div
              id="sec9"
              className="bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 sm:p-7 space-y-6"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Сургууль & Сонголтын Төлөвлөгөө (University Preferences)
                </h3>
              </div>

              <div className="space-y-4">
                {/* Preferred Countries */}
                <div>
                  <label className="text-xs text-neutral-300 font-bold block mb-2">
                    Мөрөөдлийн ба Сонгосон Улсууд (Preferred Countries)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PREFERRED_COUNTRIES_LIST.map((country) => {
                      const selected = (
                        formData.preferences?.preferredCountries || []
                      ).includes(country);
                      return (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            const current =
                              formData.preferences?.preferredCountries || [];
                            const updated = current.includes(country)
                              ? current.filter((c) => c !== country)
                              : [...current, country];
                            setFormData((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences!,
                                preferredCountries: updated,
                              },
                            }));
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                            selected
                              ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/20"
                              : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                          }`}
                        >
                          {selected ? `✓ ${country}` : `+ ${country}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Жилийн Боломжит Төсөв ($ USD)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={formData.preferences?.budgetAnnualUsd || 20000}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            budgetAnnualUsd: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Тэтгэлэг Шаардлагатай юу?
                    </label>
                    <select
                      value={formData.preferences?.needScholarship || "Yes"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            needScholarship: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    >
                      <option value="Yes">
                        Тийм (Бүтэн эсвэл Хагас тэтгэлэг шаардлагатай)
                      </option>
                      <option value="No">
                        Үгүй (Өөрсдөө төлбөрөө хариуцах боломжтой)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Сургуулийн Төрөл
                    </label>
                    <select
                      value={
                        formData.preferences?.preferredUniversityType ||
                        "Research"
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            preferredUniversityType: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    >
                      <option value="Public">Улсын Их Сургууль (Public)</option>
                      <option value="Private">
                        Хувийн Их Сургууль (Private)
                      </option>
                      <option value="Research">
                        Судалгааны Их Сургууль (Research)
                      </option>
                      <option value="Liberal Arts">
                        Либерал Артс Коллеж (Liberal Arts)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Хотхоны Хэмжээ (Campus Size)
                    </label>
                    <select
                      value={
                        formData.preferences?.preferredCampusSize || "Medium"
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            preferredCampusSize: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    >
                      <option value="Small">Жижиг (&lt; 5,000 оюутан)</option>
                      <option value="Medium">
                        Дунд (5,000 - 15,000 оюутан)
                      </option>
                      <option value="Large">Том (&gt; 15,000 оюутан)</option>
                      <option value="Any">Хамаагүй (Any)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Хотын Орчин (City Size)
                    </label>
                    <select
                      value={
                        formData.preferences?.preferredCitySize ||
                        "Major Metropolis"
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            preferredCitySize: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    >
                      <option value="Major Metropolis">
                        Том Хот (Major Metropolis)
                      </option>
                      <option value="Medium City">
                        Дунд Хотын Бүс (Medium City)
                      </option>
                      <option value="College Town">
                        Оюутны Хотхон (College Town)
                      </option>
                      <option value="Any">Хамаагүй (Any)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-medium block mb-1">
                      Цаг Агаарын Сонголт
                    </label>
                    <select
                      value={
                        formData.preferences?.preferredClimate || "Temperate"
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences!,
                            preferredClimate: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:border-amber-400 outline-none"
                    >
                      <option value="Warm">Дулаан / Нартай (Warm)</option>
                      <option value="Cold">Сэрүүн / Хүйтэн (Cold)</option>
                      <option value="Temperate">Дунджаар (Temperate)</option>
                      <option value="Any">Хамаагүй (Any)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">
                    Мэргэжлийн ба Карьерын Алсын Хараа (Career Goal)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.preferences?.careerGoal || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences!,
                          careerGoal: e.target.value,
                        },
                      }))
                    }
                    placeholder="Ирээдүйд ямар чиглэлээр, ямар ажил эрхлэхийг зорьж буйгаа бичээрэй..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 focus:border-amber-400 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM FLOATING SAVE BAR */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 font-mono">
            Бүх мэдээлэл Firebase Firestore серверт нууцлалтай хадгалагдана.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl transition-all border border-amber-400/30 flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              A4 PDF Хадгалах
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-white/10 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Академик Профайл Хадгалах
            </button>
          </div>
        </div>
      </form>

      {/* A4 ACADEMIC PROFILE PDF / PRINT MODAL */}
      <AcademicProfilePDFModal
        profile={formData}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}
