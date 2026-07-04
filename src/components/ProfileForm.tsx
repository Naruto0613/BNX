import React, { useState } from "react";
import { UserProfile } from "../types";
import { Award, BookOpen, GraduationCap, Laptop, Sparkles, User, Briefcase } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileForm({ profile, onSave, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    uid: profile.uid || "",
    name: profile.name || "",
    age: profile.age || undefined,
    country: profile.country || "",
    school: profile.school || "",
    gpa: profile.gpa || undefined,
    classRank: profile.classRank || "",
    ieltsScore: profile.ieltsScore || undefined,
    toeflScore: profile.toeflScore || undefined,
    satScore: profile.satScore || undefined,
    actScore: profile.actScore || undefined,
    apCourses: profile.apCourses || "",
    ibCourses: profile.ibCourses || "",
    awards: profile.awards || "",
    olympiads: profile.olympiads || "",
    competitions: profile.competitions || "",
    volunteerActivities: profile.volunteerActivities || "",
    leadershipExperience: profile.leadershipExperience || "",
    extracurricularActivities: profile.extracurricularActivities || "",
    programmingSkills: profile.programmingSkills || "",
    languageSkills: profile.languageSkills || "",
    careerInterests: profile.careerInterests || "Engineering"
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? undefined : (name === 'gpa' || name === 'age' || name === 'ieltsScore' || name === 'toeflScore' || name === 'satScore' || name === 'actScore' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await onSave(formData);
      setMessage({ type: 'success', text: 'Амжилттай хадгалагдлаа! Сурлагын паспорт шинэчлэгдлээ.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Хадгалахад алдаа гарлаа. Профайлыг шинэчилж чадсангүй.' });
    }
  };

  return (
    <form id="profile-builder-form" onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Status Feedback */}
      {message && (
        <div id="form-feedback" className={`p-4 rounded-xl border text-sm font-medium transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* SECTION 1: Personal Info */}
      <div id="section-personal-info" className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <User className="w-40 h-40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-neutral-400" />
          Хувийн Мэдээлэл
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Бүтэн Нэр *</label>
            <input
              id="profile-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Anand Battushig"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Нас</label>
            <input
              id="profile-age"
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              placeholder="e.g. 17"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Одоо байгаа улс</label>
            <input
              id="profile-country"
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              placeholder="e.g. Mongolia"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Сургууль / Ахлах сургууль</label>
            <input
              id="profile-school"
              type="text"
              name="school"
              value={formData.school || ""}
              onChange={handleChange}
              placeholder="e.g. Shine Mongol School"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Academic Scores */}
      <div id="section-academic-scores" className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <GraduationCap className="w-40 h-40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-neutral-400" />
          Сурлагын үзүүлэлт
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">GPA (1.0 - 4.0 scale)</label>
            <input
              id="profile-gpa"
              type="number"
              step="0.01"
              max="4.0"
              name="gpa"
              value={formData.gpa || ""}
              onChange={handleChange}
              placeholder="e.g. 3.85"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Ангийн эрэмбэ</label>
            <input
              id="profile-rank"
              type="text"
              name="classRank"
              value={formData.classRank || ""}
              onChange={handleChange}
              placeholder="e.g. Top 5% / Rank 3 of 120"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Чиглэл, сонирхол</label>
            <select
              id="profile-field"
              name="careerInterests"
              value={formData.careerInterests || "Engineering"}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            >
              <option value="Engineering">Engineering (Инженер)</option>
              <option value="IT">IT & Computer Science (Мэдээллийн Технологи)</option>
              <option value="Business">Business & Economics (Бизнес, Эдийн засаг)</option>
              <option value="Medicine">Medicine & Biological Sciences (Анагаах ухаан)</option>
              <option value="Arts">Arts & Design (Урлаг, Загвар)</option>
              <option value="Science">Natural Sciences (Байгалийн ухаан)</option>
              <option value="Other">Other (Бусад)</option>
            </select>
          </div>
        </div>

        {/* English & Tests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/60">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">IELTS Score</label>
            <input
              id="profile-ielts"
              type="number"
              step="0.5"
              min="0"
              max="9"
              name="ieltsScore"
              value={formData.ieltsScore || ""}
              onChange={handleChange}
              placeholder="e.g. 7.5"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">TOEFL Score</label>
            <input
              id="profile-toefl"
              type="number"
              min="0"
              max="120"
              name="toeflScore"
              value={formData.toeflScore || ""}
              onChange={handleChange}
              placeholder="e.g. 104"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">SAT Score</label>
            <input
              id="profile-sat"
              type="number"
              min="400"
              max="1600"
              name="satScore"
              value={formData.satScore || ""}
              onChange={handleChange}
              placeholder="e.g. 1480"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">ACT Score</label>
            <input
              id="profile-act"
              type="number"
              min="1"
              max="36"
              name="actScore"
              value={formData.actScore || ""}
              onChange={handleChange}
              placeholder="e.g. 33"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Rigor Courses AP / IB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">AP Courses (Advanced Placement)</label>
            <input
              id="profile-ap"
              type="text"
              name="apCourses"
              value={formData.apCourses || ""}
              onChange={handleChange}
              placeholder="e.g. AP Calculus BC (5), AP Physics C (4)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">IB Courses (International Baccalaureate)</label>
            <input
              id="profile-ib"
              type="text"
              name="ibCourses"
              value={formData.ibCourses || ""}
              onChange={handleChange}
              placeholder="e.g. Math HL (7), Physics SL (6)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
        </div>
      </div>

      {// SECTION 3: Honors, Awards, Olympiads / Тэмцээн Олимпиад
      }
      <div id="section-honors" className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <Award className="w-40 h-40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-neutral-400" />
          Шагнал, Олимпиад
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Улсын/Олон улсын Олимпиадууд</label>
            <input
              id="profile-olympiads"
              type="text"
              name="olympiads"
              value={formData.olympiads || ""}
              onChange={handleChange}
              placeholder="e.g. Silver Medal in National Chemistry Olympiad Mongolia, Honorable Mention in Asia-Pacific Informatics Olympiad"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Тэмцээн уралдаан, шагнал, батламж</label>
            <textarea
              id="profile-awards"
              name="awards"
              rows={2}
              value={formData.awards || ""}
              onChange={handleChange}
              placeholder="e.g. 1st place in National Hackathon Mongolia 2025, Best Orator Award in Shine Mongol MUN"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600 resize-none"
            />
          </div>
        </div>
      </div>

      {// SECTION 4: Extracurricular and Leadership / Нийгмийн идэвх
      }
      <div id="section-activities" className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <BookOpen className="w-40 h-40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neutral-400" />
          Сургуулиас гадуурх үйл ажиллагаа ба Сайн дурын ажил
        </h3>
        <div className="space-y-4 col-span-2">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Манлайлал болон Сайн дурын ажил</label>
            <input
              id="profile-leadership"
              type="text"
              name="leadershipExperience"
              value={formData.leadershipExperience || ""}
              onChange={handleChange}
              placeholder="e.g. Student Council President, Organized charity campaign for local orphanage raising 5M MNT"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Сайн дурын ажлууд</label>
              <input
                id="profile-volunteer"
                type="text"
                name="volunteerActivities"
                value={formData.volunteerActivities || ""}
                onChange={handleChange}
                placeholder="e.g. Rotary Club Volunteer, Red Cross Mongolia member"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Хобби, урлаг спортын клубууд</label>
              <input
                id="profile-extracs"
                type="text"
                name="extracurricularActivities"
                value={formData.extracurricularActivities || ""}
                onChange={handleChange}
                placeholder="e.g. Varsity Basketball Captain, School Choir Tenor lead, Model United Nations"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Technical and Languages */}
      <div id="section-skills" className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
          <Laptop className="w-40 h-40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-neutral-400" />
          Ур чадвар болон Гадаад хэл
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Програмчлал, код бичих чадвар</label>
            <input
              id="profile-programming"
              type="text"
              name="programmingSkills"
              value={formData.programmingSkills || ""}
              onChange={handleChange}
              placeholder="e.g. Python (Data Science), JavaScript, C++, Competitive Programming basics"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Эзэмшсэн Гадаад хэл</label>
            <input
              id="profile-languages"
              type="text"
              name="languageSkills"
              value={formData.languageSkills || ""}
              onChange={handleChange}
              placeholder="e.g. Mongolian (Native), English (Fluent), Korean (Basic TOPIK II)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pt-4">
        <button
          id="btn-save-profile"
          type="submit"
          disabled={isLoading}
          className="bg-white text-black hover:bg-neutral-200 text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          <Sparkles className="w-4 h-4" />
          Академик CV хадгалах
        </button>
      </div>
    </form>
  );
}
