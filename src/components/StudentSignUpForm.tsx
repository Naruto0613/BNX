import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface StudentSignUpFormProps {
  onSignUpSuccess: (userData: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    transactionReference: string;
  }) => void;
  onSwitchToLogin: () => void;
}

export default function StudentSignUpForm({ onSignUpSuccess, onSwitchToLogin }: StudentSignUpFormProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!lastName.trim() || !firstName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Бүх талбарыг бүрэн бөглөнө үү.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг хоорондоо таарахгүй байна.");
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Call server-side API to assign atomic, unique transaction reference (student_00, student_01, ...)
      const res = await fetch("/api/students/assign-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Гүйлгээний код үүсгэхэд алдаа гарлаа.");
      }

      // 3. Trigger callback to open Payment Page
      onSignUpSuccess({
        uid: user.uid,
        email: user.email || email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        transactionReference: data.transactionReference || "student_00"
      });

    } catch (err: any) {
      console.error("Signup error:", err);
      let msg = err.message || "Бүртгүүлэхэд алдаа гарлаа.";
      if (err.code === 'auth/email-already-in-use') {
        msg = "Энэ и-мэйл хаягаар аль хэдийн бүртгэгдсэн байна. Нэвтрэх хэсгийг сонгоно уу.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Зөв и-мэйл хаяг оруулна уу.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Овог & Нэр side by side */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Овог
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ж: Дорж"
              className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300 font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
            Нэр
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ж: Бат"
              className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Имэйл */}
      <div>
        <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Имэйл
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ж: bat@student.mn"
            className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300 font-sans"
          />
        </div>
      </div>

      {/* Нууц үг */}
      <div>
        <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Нууц үг
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300 font-sans"
          />
        </div>
      </div>

      {/* Нууц үг давтах */}
      <div>
        <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Нууц үг давтах
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300 font-sans"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 disabled:opacity-50 mt-3 flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        {loading ? (
          <span>Бүртгэл үүсгэж байна...</span>
        ) : (
          <>
            <span>БҮРТГҮҮЛЭХ</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-neutral-500 hover:text-black transition font-medium"
        >
          Аль хэдийн бүртгэлтэй юу? <span className="underline font-bold text-black">Нэвтрэх</span>
        </button>
      </div>

    </form>
  );
}
