import React, { useState, useEffect } from "react";
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  User as UserIcon,
  Briefcase,
  FileText,
  Home,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Compass,
  Server,
  Lock,
  Mail,
  Grid,
  AlertCircle
} from "lucide-react";

// Logo
const bnxLogo = "/src/assets/images/bnx_logo_1781872849436.jpg";

// Types
import { UserProfile, University, Scholarship, ApplicationTrack, Essay } from "./types";

// Firebase
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
  deleteDoc,
  orderBy,
  where
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";

import { initialUniversities } from "./data/universities";
import { initialScholarships } from "./data/scholarships";

import ProfileForm from "./components/ProfileForm";
import UniversityFinder from "./components/UniversityFinder";
import ScholarshipFinder from "./components/ScholarshipFinder";
import ApplicationTracker from "./components/ApplicationTracker";
import EssayHelper from "./components/EssayHelper";
import CountryExplorer from "./components/CountryExplorer";
import BnxLogo from "./components/BnxLogo";
const cleanUndefined = (obj: any): any => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter(v => v !== undefined);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, cleanUndefined(v)])
        .filter(([_, v]) => v !== undefined)
    );
  }
  return obj;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tracks, setTracks] = useState<ApplicationTrack[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [customUniversities, setCustomUniversities] = useState<University[]>([]);
  const [customScholarships, setCustomScholarships] = useState<Scholarship[]>([]);

  // Auth Layout state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isForgotPasswordSent, setIsForgotPasswordSent] = useState(false);

  // App Navigation & layouts
  const [activeTab, setActiveTab] = useState<'passport' | 'unis' | 'scholarships' | 'tracker' | 'essays' | 'countries'>('passport');
  const [loadingApp, setLoadingApp] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Computed lists (Static + Custom db entries)
  const allUniversities = [...initialUniversities, ...customUniversities];
  const allScholarships = [...initialScholarships, ...customScholarships];

  // 1. AUTHENTICATION LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoadingApp(false);
      }
    });
    return () => unsub();
  }, []);

  // 2. USER DATA AND SNAPSHOT SYNC WITH CURRENT USER
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setTracks([]);
      setEssays([]);
      setLoadingApp(false);
      return;
    }

    setLoadingApp(true);
    const unsubscribes: (() => void)[] = [];

    // A) Sync custom universities (admin additions)
    try {
      const qUnis = collection(db, "custom_universities");
      const unsubUnis = onSnapshot(qUnis, (snapshot) => {
        const list: University[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as University);
        });
        setCustomUniversities(list);
      }, (err) => console.error("Unis sync err:", err));
      unsubscribes.push(unsubUnis);
    } catch (e) {
      console.error(e);
    }

    // B) Sync custom scholarships (admin additions)
    try {
      const qSchols = collection(db, "custom_scholarships");
      const unsubSchols = onSnapshot(qSchols, (snapshot) => {
        const list: Scholarship[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Scholarship);
        });
        setCustomScholarships(list);
      }, (err) => console.error("Schols sync err:", err));
      unsubscribes.push(unsubSchols);
    } catch (e) {
      console.error(e);
    }

    // C) Sync application tracks for current user
    try {
      const qTracks = query(collection(db, "tracks"), where("userId", "==", currentUser.uid));
      const unsubTracks = onSnapshot(qTracks, (snapshot) => {
        const list: ApplicationTrack[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ApplicationTrack);
        });
        setTracks(list);
      }, (err) => console.error("Tracks sync err:", err));
      unsubscribes.push(unsubTracks);
    } catch (e) {
      console.error(e);
    }

    // D) Sync essays for current user
    try {
      const qEssays = query(collection(db, "essays"), where("userId", "==", currentUser.uid));
      const unsubEssays = onSnapshot(qEssays, (snapshot) => {
        const list: Essay[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Essay);
        });
        setEssays(list);
      }, (err) => console.error("Essays sync err:", err));
      unsubscribes.push(unsubEssays);
    } catch (e) {
      console.error(e);
    }

    // E) Sync user profile (and initialize if empty)
    try {
      const profileRef = doc(db, "profiles", currentUser.uid);
      const unsubProfile = onSnapshot(profileRef, async (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
          setLoadingApp(false);
        } else {
          // If profile doesn't exist yet, build and write the default
          const isDemo = currentUser.email === "student@demo.mn" || currentUser.email === "admin@demo.mn";
          const defaultProfile: UserProfile = {
            uid: currentUser.uid,
            name: isDemo ? (currentUser.email === "admin@demo.mn" ? "Админ Хэрэглэгч" : "Батын Анандын") : (currentUser.email ? currentUser.email.split("@")[0] : "Монгол Оюутан"),
            age: isDemo ? 18 : undefined,
            country: "Mongolia",
            school: isDemo ? "Шинэ Монгол Ахлах Сургууль" : "",
            gpa: isDemo ? 3.92 : undefined,
            classRank: isDemo ? "Top 5%" : "",
            ieltsScore: isDemo ? 7.5 : undefined,
            satScore: isDemo ? 1490 : undefined,
            careerInterests: "IT",
            awards: isDemo ? "1st Place National Hackathon Mongolia, Merit Scholarship" : "",
            olympiads: isDemo ? "Bronze Medal in National Informatics Olympiad" : "",
            volunteerActivities: isDemo ? "Organized local community cleanups, tutor at orphanage" : "",
            leadershipExperience: isDemo ? "Founder of school Tech Club, Basketball assistant captain" : "",
            programmingSkills: isDemo ? "Python, Javascript, C++ Competitive programming" : "",
            languageSkills: isDemo ? "Mongolian (Native), English (Fluent), Japanese (TOPIK N5)" : ""
          };
          try {
            await setDoc(profileRef, cleanUndefined(defaultProfile));
          } catch (writeErr) {
            console.error("Failed to auto-create profile:", writeErr);
          }
          setUserProfile(defaultProfile);
          setLoadingApp(false);
        }
      }, (err) => {
        console.error("Profile sync err:", err);
        setLoadingApp(false);
      });
      unsubscribes.push(unsubProfile);
    } catch (profileErr) {
      console.error(profileErr);
      setLoadingApp(false);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [currentUser]);

  // 3. AUTH ACTIONS
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, authEmail, authPassword);
        } catch (loginErr: any) {
          // If demo accounts don't exist yet in Firebase, auto-create them
          if (
            (authEmail === "student@demo.mn" || authEmail === "admin@demo.mn") &&
            authPassword === "password123" &&
            (loginErr.code === "auth/user-not-found" || loginErr.code === "auth/invalid-credential" || loginErr.code === "auth/invalid-login-credentials")
          ) {
            await createUserWithEmailAndPassword(auth, authEmail, authPassword);
          } else {
            throw loginErr;
          }
        }
      } else if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else if (authMode === 'forgot') {
        await sendPasswordResetEmail(auth, authEmail);
        setIsForgotPasswordSent(true);
      }
    } catch (err: any) {
      setAuthError(err.message || "И-мэйл эсвэл нууц үг буруу байна.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message || "Google-ээр нэвтрэх үйлдэл амжилтгүй.");
    }
  };

  const triggerQuickDemo = async (isAdmin: boolean) => {
    setAuthError("");
    setAuthLoading(true);
    const email = isAdmin ? "admin@demo.mn" : "student@demo.mn";
    const password = "password123";
    try {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (loginErr: any) {
        if (loginErr.code === "auth/user-not-found" || loginErr.code === "auth/invalid-credential" || loginErr.code === "auth/invalid-login-credentials") {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw loginErr;
        }
      }
    } catch (err: any) {
      setAuthError(`Регистр хийхэд алдаа гарлаа: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setTracks([]);
      setEssays([]);
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  // 4. DATABASE TRANSACTIONS
  const handleSaveProfile = async (updated: UserProfile) => {
    if (!currentUser) return;
    setSavingData(true);
    try {
      const profileRef = doc(db, "profiles", currentUser.uid);
      const data = cleanUndefined({ ...updated, updatedAt: new Date().toISOString() });
      await setDoc(profileRef, data);
      setUserProfile(updated);
    } catch (err: any) {
      console.error("Profile save error:", err);
    } finally {
      setSavingData(false);
    }
  };

  const handleSaveTrack = async (payload: ApplicationTrack) => {
    if (!currentUser) return;
    setSavingData(true);
    try {
      const trackRef = doc(db, "tracks", payload.id);
      const cleanPayload = cleanUndefined({ ...payload, userId: currentUser.uid });
      await setDoc(trackRef, cleanPayload);
    } catch (err: any) {
      console.error("Track save error:", err);
    } finally {
      setSavingData(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!currentUser) return;
    setSavingData(true);
    try {
      const trackRef = doc(db, "tracks", trackId);
      await deleteDoc(trackRef);
    } catch (err: any) {
      console.error("Track delete error:", err);
    } finally {
      setSavingData(false);
    }
  };

  const handleSaveEssay = async (payload: Essay) => {
    if (!currentUser) return;
    setSavingData(true);
    try {
      const essayRef = doc(db, "essays", payload.id);
      const cleanPayload = cleanUndefined({ ...payload, userId: currentUser.uid });
      await setDoc(essayRef, cleanPayload);
    } catch (err: any) {
      console.error("Essay save error:", err);
    } finally {
      setSavingData(false);
    }
  };

  const handleDeleteEssay = async (essayId: string) => {
    if (!currentUser) return;
    setSavingData(true);
    try {
      const essayRef = doc(db, "essays", essayId);
      await deleteDoc(essayRef);
    } catch (err: any) {
      console.error("Essay delete error:", err);
    } finally {
      setSavingData(false);
    }
  };

  // Track school from Directory directly handler
  const handleAutoTrackUniversity = async (uni: University) => {
    const existing = tracks.find(t => t.universityId === uni.id);
    if (existing) {
      alert("Энэ сургууль хөтөч хэсэгт аль хэдийн нэмэгдсэн байна.");
      setActiveTab('tracker');
      return;
    }

    const payload: ApplicationTrack = {
      id: `track_${Date.now()}`,
      userId: currentUser?.uid || "mock",
      universityId: uni.id,
      universityName: uni.name,
      status: 'In Progress',
      submittedDocuments: [],
      appliedScholarships: uni.scholarships ? uni.scholarships.split("(")[0].trim() : "",
      deadline: uni.deadline || "",
      notes: "Каталогоос шууд нэмэгдсэн сонирхогч сургууль.",
      updatedAt: new Date().toISOString()
    };

    try {
      await handleSaveTrack(payload);
      alert(`${uni.name} сургууль таны Хөтөч (Tracker) рүү амжилттай нэмэгдлээ! Checking details.`);
      setActiveTab('tracker');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const countAcademicProgressPercentage = () => {
    if (!userProfile) return 0;
    let filled = 0;
    const fields: (keyof UserProfile)[] = ['name', 'age', 'country', 'school', 'gpa', 'careerInterests', 'ieltsScore', 'programmingSkills', 'awards', 'olympiads'];
    fields.forEach(f => {
      if (userProfile[f] !== undefined && userProfile[f] !== "") filled++;
    });
    return (filled / fields.length) * 100;
  };

  // 5. RENDERS LOADING STATE
  if (loadingApp && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white font-sans">
        <Sparkles className="animate-spin w-8 h-8 text-neutral-450 mb-3" />
        <h2 className="text-sm font-semibold tracking-wider font-mono">Шуурхай ачааллаж байна...</h2>
        <p className="text-xs text-neutral-500 mt-1">Хувийн академик паспорт, элсэлтийн сангуудыг холбож байна.</p>
      </div>
    );
  }

  // 6. SHOW LOG IN OR INTRO FLOW PAGE IF NOT REGISTERED
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden font-sans select-none antialiased">
        
        {/* Main Content Splitted Grid */}
        <main className="max-w-[1440px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10 items-stretch min-h-screen">
          
          {/* Decorative Left Column based on requested layout with Wave SVG */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden h-full min-h-[680px] bg-neutral-50/50 border-r border-neutral-200">
            {/* SVG Overlapping Waves Graphic - exactly like the reference sketch */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-start scale-110 select-none">
              <svg className="w-full h-full object-cover" viewBox="0 0 600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background base */}
                <rect width="600" height="900" fill="#ffffff" />
                
                {/* Wave 1: Soft warm-white background wave offset */}
                <path d="M 0 0 C 250 50, 420 280, 320 900 L 0 900 Z" fill="#fcfcfd" />
                
                {/* Stripe Pattern configuration for the detailed band */}
                <defs>
                  <pattern id="diag-stripes-black" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#1c1c1e" strokeWidth="3" />
                  </pattern>
                  <filter id="wave-shadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="-2" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Wave 2: Thick dark outer band */}
                <path d="M -20 50 C 320 90, 480 380, 240 920" stroke="#0c0c0e" strokeWidth="150" strokeLinecap="round" filter="url(#wave-shadow)" />
                
                {/* Wave 3: Elegant white fine outline spacer */}
                <path d="M -20 50 C 320 90, 480 380, 240 920" stroke="#ffffff" strokeWidth="25" strokeLinecap="round" />
                
                {/* Wave 4: Stripe patterned custom wave band exactly like image */}
                <path d="M -20 180 C 250 260, 380 480, 180 920" stroke="url(#diag-stripes-black)" strokeWidth="110" strokeLinecap="round" />
                
                {/* Wave 5: Clean pure dark solid curve */}
                <path d="M -20 320 C 190 350, 290 580, 120 920" stroke="#1c1c1e" strokeWidth="90" strokeLinecap="round" filter="url(#wave-shadow)" />
                
                {/* Wave 6: Lowest accent white line with dash-gaps */}
                <path d="M -20 460 C 120 490, 210 680, 60 920" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeDasharray="3 4" />

                {/* Micro spray particles cascading over the wave crest edge */}
                <circle cx="340" cy="190" r="3.5" fill="#0c0c0e" />
                <circle cx="400" cy="210" r="2" fill="#000000" opacity="0.6" />
                <circle cx="370" cy="240" r="4.5" fill="#1c1c1e" />
                <circle cx="330" cy="290" r="2.5" fill="#0c0c0e" opacity="0.8" />
                <circle cx="410" cy="280" r="4" fill="#000000" opacity="0.4" />
                <circle cx="380" cy="340" r="3" fill="#0c0c0e" />
                <circle cx="430" cy="310" r="5" fill="#1c1c1e" />
                <circle cx="390" cy="390" r="2" fill="#0c0c0e" opacity="0.7" />
                <circle cx="440" cy="420" r="4" fill="#0c0c0e" />
                <circle cx="395" cy="460" r="3.5" fill="#1c1c1e" />
                <circle cx="420" cy="490" r="2" fill="#000000" opacity="0.5" />
                <circle cx="450" cy="530" r="4.5" fill="#0c0c0e" />
                <circle cx="410" cy="570" r="2.5" fill="#0c0c0e" opacity="0.8" />
                <circle cx="460" cy="610" r="4" fill="#1c1c1e" />
                <circle cx="430" cy="650" r="3" fill="#0c0c0e" />
                <circle cx="480" cy="690" r="5" fill="#000000" opacity="0.9" />
                <circle cx="445" cy="740" r="3.5" fill="#1c1c1e" />
                <circle cx="490" cy="780" r="2" fill="#0c0c0e" />
                <circle cx="465" cy="830" r="4" fill="#0c0c0e" />
                <circle cx="500" cy="860" r="2.5" fill="#1c1c1e" opacity="0.6" />
              </svg>
            </div>
            
            {/* Visual Text brand header built above waves */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2">
                <div className="bg-[#050507] px-2.5 py-1.5 rounded-xl flex items-center justify-center">
                  <BnxLogo className="h-5" />
                </div>
                <span className="font-extrabold text-[#0c0c0e] tracking-widest text-[11px] font-mono">NAVIGATOR</span>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl text-neutral-800 space-y-1 mt-auto shadow-md">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">Зөвлөх систем</span>
                <p className="text-[11px] leading-relaxed font-semibold text-neutral-900">
                  Монгол оюутан залууст зориулсан дэлхийн шилдэг сургууль, тэтгэлэг олох хиймэл оюуны ухаалаг системд тавтай морилно уу.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Right Column: Content and Split Login Controls */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between p-8 md:p-12 relative bg-white">
            
            {/* Horizontal Navigation Menu precisely mimicking image */}
            <header className="flex items-center justify-between border-b border-neutral-100 pb-5">
              <div className="lg:hidden flex items-center gap-2">
                <div className="bg-[#050507] px-2 py-1 rounded-lg flex items-center justify-center">
                  <BnxLogo className="h-4" />
                </div>
                <span className="font-extrabold text-[#0c0c0e] tracking-widest text-[11px] font-mono">NAVIGATOR</span>
              </div>
              <div className="hidden lg:flex items-center gap-7 text-[10px] font-bold text-neutral-450 uppercase tracking-widest font-mono">
                <span className="hover:text-black cursor-pointer transition">ABOUT</span>
                <span className="hover:text-black cursor-pointer transition">DIRECTORY</span>
                <span className="hover:text-black cursor-pointer transition">PROMO</span>
                <span className="hover:text-black cursor-pointer transition">SEARCH</span>
                <span className="text-neutral-300 font-normal">|</span>
                <span className="text-neutral-500">VERSION 3.5</span>
              </div>
            </header>

            {/* Split Content Body area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center py-8">
              
              {/* Left detail area with Follow, Giant statement */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* Follow Socials list from image reference */}
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">
                  <span>FOLLOW</span>
                  <span className="text-neutral-300">—</span>
                  <div className="flex items-center gap-3 text-neutral-800">
                    <span className="hover:text-black hover:underline cursor-pointer">FB</span>
                    <span className="hover:text-black hover:underline cursor-pointer">TW</span>
                    <span className="hover:text-black hover:underline cursor-pointer">IG</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl xl:text-[40px] font-black text-black tracking-tight leading-[1.1] font-sans">
                  Grow your <br />
                  potential!
                </h1>

                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed max-w-md">
                  Дэлхийн топ сургуулийн элсэлтийн шалгуур, тэтгэлэг магадлалыг Google Gemini хиймэл оюуны тусламжтай тооцож, академик паспортоо үүсгээрэй.
                </p>

                {/* Image matching black button 'LEARN MORE' */}
                <div className="pt-2">
                  <a 
                    href="#learn-more"
                    className="inline-block border-2 border-black hover:bg-neutral-50 text-black px-6 py-2.5 rounded-full text-xs font-bold font-mono tracking-widest uppercase transition-all duration-150 active:scale-95"
                  >
                    LEARN MORE
                  </a>
                </div>

                {/* Quick Demo Playground Access inside bottom */}
                <div className="pt-2">
                  <div className="bg-neutral-50 border border-neutral-200/60 rounded-2.5xl p-5 space-y-3.5">
                    <span className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-widest block font-mono">Түргэн туршилт / Sandbox Sandbox Access</span>
                    <p className="text-[10px] text-neutral-500 leading-relaxed">Нуут үггүйгээр шууд систем рүү нэвтэрч систем ажиллагааг турших:</p>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => triggerQuickDemo(false)}
                        id="btn-fast-log-student"
                        className="bg-black hover:bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 focus:outline-none w-full"
                      >
                        <UserIcon className="w-4 h-4" />
                        Оюутан (Туршилт)
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right detail area with embedded high-contrast Auth form */}
              <div className="xl:col-span-5 bg-white border border-neutral-200 shadow-xl rounded-3xl p-6 relative">
                
                {/* Form header triggers */}
                {authMode !== 'forgot' && (
                  <div className="flex border-b border-neutral-100 text-xs mb-5 pb-2.5 gap-4 justify-between">
                    <button
                      id="btn-switch-login"
                      onClick={() => { setAuthMode('login'); setAuthError(""); }}
                      className={`pb-1 font-bold tracking-wider uppercase transition ${
                        authMode === 'login' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'
                      }`}
                    >
                      Нэвтрэх
                    </button>
                    <button
                      id="btn-switch-signup"
                      onClick={() => { setAuthMode('signup'); setAuthError(""); }}
                      className={`pb-1 font-bold tracking-wider uppercase transition ${
                        authMode === 'signup' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'
                      }`}
                    >
                      Бүртгүүлэх
                    </button>
                  </div>
                )}

                {authMode === 'forgot' && (
                  <div className="mb-4">
                    <button
                      onClick={() => { setAuthMode('login'); setAuthError(""); setIsForgotPasswordSent(false); }}
                      className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 focus:outline-none mb-3 font-semibold"
                    >
                      &larr; Буцах
                    </button>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider">Нууц үг сэргээх</h3>
                  </div>
                )}

                {/* Status feedbacks inside auth box */}
                {authError && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-[11px] leading-relaxed animate-shake">
                    {authError}
                  </div>
                )}

                {isForgotPasswordSent && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-[11px] leading-relaxed">
                    Баталгаажуулах холбоос таны мэйл хаяг руу илгээгдлээ.
                  </div>
                )}

                {/* Actual inputs */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">И-мэйл хаяг</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        id="auth-input-email"
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. anand@study.mn"
                        className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300"
                      />
                    </div>
                  </div>

                  {authMode !== 'forgot' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Нууц үг</label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            id="btn-switch-forgot"
                            onClick={() => setAuthMode('forgot')}
                            className="text-[9px] text-neutral-400 hover:text-black transition font-semibold"
                          >
                            Мартсан уу?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                        <input
                          id="auth-input-password"
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    id="btn-auth-submit"
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center cursor-pointer"
                  >
                    {authLoading ? "Холбогдож байна..." : authMode === 'login' ? "НЭВТРЭХ" : authMode === 'signup' ? "БҮРТГҮҮЛЭХ" : "ИЛГЭЭХ"}
                  </button>
                </form>

                {/* Fast social authorization element */}
                <div className="mt-4 pt-4 border-t border-neutral-100 text-center space-y-3">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Эсвэл холбогдох</span>
                  <button
                    onClick={handleGoogleSignIn}
                    id="btn-log-google"
                    className="w-full border border-neutral-200 hover:bg-neutral-50 py-2 rounded-xl text-[11px] text-neutral-800 font-bold transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.6-6.887 4.6-4.33 0-7.86-3.59-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.136C18.347 1.144 15.547 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.79 0-.79-.08-1.4-.26-1.925H12.24z"
                      />
                    </svg>
                    Google-ээр орох
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom mini status disclaimer */}
            <footer className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between text-[10px] text-neutral-400 font-medium space-y-2 md:space-y-0">
              <p>© 2026 BNX Platform Mongolian Admissions Hub.</p>
              <p>Powered by Gemini Cloud Services.</p>
            </footer>

          </div>

        </main>
      </div>
    );
  }

  // 7. RENDER FULL WORKSPACE PORTAL (AUTHENTICATED)
  return (
    <div className="min-h-screen bg-[#050507] text-[#eeeef2] flex flex-col md:flex-row font-sans selection:bg-white/10 antialiased">
      
      {/* MOBILE HEADER RESPONSIVE VIEWS */}
      <div className="md:hidden bg-[#09090b]/95 border-b border-white/5 backdrop-blur-md px-5 py-4.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BnxLogo className="h-4.5" />
          <span className="font-extrabold text-white tracking-widest text-xs font-mono">NAVIGATOR</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-white p-1 rounded focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN SELECTION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0e] border-b border-white/5 p-5 space-y-3.5 absolute top-[60px] left-0 right-0 z-40 animate-slide-down shadow-2xl">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => { setActiveTab('passport'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'passport' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <UserIcon className="w-4 h-4" /> Хувийн паспорт
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveTab('unis'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'unis' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <GraduationCap className="w-4 h-4" /> Их сургуулиудын сан
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveTab('scholarships'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'scholarships' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <BookOpen className="w-4 h-4" /> Тэтгэлгийн радар
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveTab('tracker'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'tracker' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4" /> Аппликейшн хөтөч
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveTab('essays'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'essays' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <FileText className="w-4 h-4" /> AI Эссэ туслах
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveTab('countries'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${activeTab === 'countries' ? 'bg-white text-black font-extrabold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Home className="w-4 h-4" /> Хилийн чанадыг судлах
              </button>
            </li>

          </ul>

          <div className="pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span>{currentUser.email}</span>
            <button
              onClick={handleSignOut}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 text-rose-400 hover:bg-white/5 text-[10px] uppercase font-bold flex items-center gap-1 focus:outline-none"
            >
              <LogOut className="w-3.5 h-3.5" /> Гарах
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR VIEW */}
      <nav className="hidden md:flex flex-col justify-between w-64 bg-[#09090b] border-r border-white/5 py-8 px-5 shrink-0 select-none">
        <div className="space-y-8">
          
          {/* Logo badge */}
          <div className="flex items-center gap-2.5 px-1">
            <BnxLogo className="h-6" />
            <div className="min-w-0">
              <span className="font-extrabold text-white tracking-widest text-xs font-mono block">NAVIGATOR</span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold mt-0.5">Монгол Платформ</span>
            </div>
          </div>

          {/* Navigation link triggers list */}
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>
              <button
                id="sidebar-nav-passport"
                onClick={() => setActiveTab('passport')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'passport' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span>Хувийн Паспорт / CV</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-unis"
                onClick={() => setActiveTab('unis')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'unis' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Их Сургуулиуд / Directory</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-scholarships"
                onClick={() => setActiveTab('scholarships')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'scholarships' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Тэтгэлэгийн Сан / Radar</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-tracker"
                onClick={() => setActiveTab('tracker')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'tracker' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Аппликейшн Хөтөч / Hub</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-essays"
                onClick={() => setActiveTab('essays')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'essays' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>AI Эссэ Туслах / Essay AI</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-countries"
                onClick={() => setActiveTab('countries')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                  activeTab === 'countries' ? 'bg-white text-black' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Амьдрах Улсууд / Guides</span>
              </button>
            </li>


          </ul>
        </div>

        {/* Logged in User footer status indicator */}
        <div className="pt-4 border-t border-white/5 space-y-3.5 text-xs">
          <div className="p-3 bg-[#0d0d11] border border-white/5 rounded-xl space-y-1">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">Акаунт статус</span>
            <span className="text-white font-semibold block truncate leading-none">{currentUser.email}</span>
            {userProfile && (
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1.5 border-t border-white/5">
                <span>Профайл бэлтгэл:</span>
                <span className="font-bold text-white font-mono">{Math.floor(countAcademicProgressPercentage())}%</span>
              </div>
            )}
          </div>
          <button
            id="btn-nav-logout"
            onClick={handleSignOut}
            className="w-full bg-[#13131a] hover:bg-white/5 text-rose-400 border border-white/10 p-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Системээс Гарах</span>
          </button>
        </div>
      </nav>

      {/* PRIMARY VIEWS CONTENT WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Academic Profile Tab */}
        {activeTab === 'passport' && userProfile && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-neutral-800 text-neutral-300 px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">сурлагын түүх</span>
                <span className="text-xs text-neutral-505">• Хиймэл оюуны зөвлөмжүүд авахын тулд профайлаа бүрэн бөглөнө үү</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Оюутны Академик Паспорт</h1>
            </div>

            {/* Profile compliance badge */}
            <div className="p-4 bg-neutral-900/20 border border-neutral-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-white">Паспорт бөглөлтийн хэмжээ / Passport Completion Rate</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Оноо, олимпиад, шагнал бүрэн бөглөх тусам AI тооцоолол болон эссэний зөвлөгөө илүү нарийвчлалтай гарна.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <div className="flex-1 sm:w-40 bg-neutral-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-neutral-300 h-full transition-all duration-300"
                    style={{ width: `${countAcademicProgressPercentage()}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white font-mono">{Math.floor(countAcademicProgressPercentage())}%</span>
              </div>
            </div>

            <ProfileForm
              profile={userProfile}
              onSave={handleSaveProfile}
              isLoading={savingData}
            />
          </div>
        )}

        {/* Universities Tab */}
        {activeTab === 'unis' && userProfile && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Их сургуулиудын шалгуур / University Matcher</h1>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1">Бакалавр, Магистрын хөтөлбөр, санхүүгийн жилийн зардал болон элсэлтийн босгуудыг харьцуулах ухаалаг хайлт.</p>
            </div>
            <UniversityFinder
              universities={allUniversities}
              profile={userProfile}
              onTrackUniversity={handleAutoTrackUniversity}
            />
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && userProfile && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Санхүүжилт, Сэтгэлэгүүд / Scholarships Hub</h1>
              <p className="text-xs text-neutral-500 mt-1">Монгол оюутанд зориулсан шилдэг тэтгэлгүүдийн хамрах хүрээ, бэлтгэл заавар.</p>
            </div>
            <ScholarshipFinder
              scholarships={allScholarships}
              profile={userProfile}
            />
          </div>
        )}

        {/* Tracker Pipeline Hub Tab */}
        {activeTab === 'tracker' && userProfile && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Аппликейшны Хяналтын Самбар / Application Tracker</h1>
              <p className="text-xs text-neutral-505 mt-1">Сонгосон их сургуулиудын бүрдүүлэх материал, эцсийн хугацаа болон визний явцыг хянах.</p>
            </div>
            <ApplicationTracker
              tracks={tracks}
              universities={allUniversities}
              onSaveTrack={handleSaveTrack}
              onDeleteTrack={handleDeleteTrack}
              isLoading={savingData}
            />
          </div>
        )}

        {/* AI Essays Assistant Tab */}
        {activeTab === 'essays' && userProfile && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Хувийн Тодорхойлолт Хянах / AI Essay Assistant</h1>
              <p className="text-xs text-neutral-500 mt-1">AI-ийн тусламжтай дүрмийн алдаа засах, IELTS загварын нарийвчилсан шүүмж, зөвлөгөө болон оноо тооцоолох.</p>
            </div>
            <EssayHelper
              essays={essays}
              onSaveEssay={handleSaveEssay}
              onDeleteEssay={handleDeleteEssay}
              isLoading={savingData}
            />
          </div>
        )}

        {/* Countries Guide Guides Tab */}
        {activeTab === 'countries' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Оюутанд Зохистой Улсуудын Мэдээлэл / Country Directory</h1>
              <p className="text-xs text-neutral-500 mt-1 font-sans">10 өөр улсад амьдрах нийт өртөг, виз авах явц болон хууль ёсоор цагийн ажил хийх журам.</p>
            </div>
            <CountryExplorer />
          </div>
        )}

      </main>

    </div>
  );
}
