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
  AlertCircle,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

// Types
import {
  UserProfile,
  University,
  Scholarship,
  ApplicationTrack,
  Essay,
} from "./types";

// Firebase
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
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
  where,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";

// Static reference data
import { initialUniversities } from "./data/universities";
import { initialScholarships } from "./data/scholarships";

// Components
import ProfileForm from "./components/ProfileForm";
import UniversityFinder from "./components/UniversityFinder";
import ScholarshipFinder from "./components/ScholarshipFinder";
import ApplicationTracker from "./components/ApplicationTracker";
import EssayHelper from "./components/EssayHelper";
import CountryExplorer from "./components/CountryExplorer";
import BnxLogo from "./components/BnxLogo";
import StudentSignUpForm from "./components/StudentSignUpForm";
import BnxAdminPanel from "./components/BnxAdminPanel";

// Helper to recursively remove undefined values from objects before sending to Firestore
const cleanUndefined = (obj: any): any => {
  if (obj === undefined) return undefined;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter((v) => v !== undefined);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, cleanUndefined(v)])
        .filter(([_, v]) => v !== undefined),
    );
  }
  return obj;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tracks, setTracks] = useState<ApplicationTrack[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [customUniversities, setCustomUniversities] = useState<University[]>(
    [],
  );
  const [customScholarships, setCustomScholarships] = useState<Scholarship[]>(
    [],
  );

  // Auth Layout state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
    "login",
  );
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isForgotPasswordSent, setIsForgotPasswordSent] = useState(false);

  // App Navigation & layouts
  const [activeTab, setActiveTab] = useState<
    | "cv"
    | "unis"
    | "scholarships"
    | "tracker"
    | "essays"
    | "countries"
    | "admin"
  >("cv");
  const [loadingApp, setLoadingApp] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminUser =
    userProfile?.role === "admin" ||
    currentUser?.email?.toLowerCase() === "naranbadrakh1013@gmail.com";
  const hasAccess = true;

  // Effective profile ensuring tabs and buttons NEVER disappear or fail to render
  const effectiveProfile: UserProfile = userProfile || {
    uid: currentUser?.uid || "guest_student",
    name:
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "Оюутан",
    email: currentUser?.email || "student@bnx.mn",
    role:
      currentUser?.email?.toLowerCase() === "naranbadrakh1013@gmail.com"
        ? "admin"
        : "student",
    transactionReference: "BNX-DEMO",
    paymentStatus: "paid",
    accessStatus: "active",
    country: "Монгол",
    school: "1-р сургууль",
    gpa: 3.85,
    ieltsScore: 7.5,
    careerInterests: "Компьютерийн ухаан (CS & IT)",
    preferredCountries: ["АНУ", "Канад", "Герман", "Солонгос"],
  };

  const handleEnterAsGuest = (role: "student" | "admin" = "student") => {
    const isAdm = role === "admin";
    const guestUser: any = {
      uid: isAdm ? "admin_demo_uid" : "student_demo_uid",
      email: isAdm ? "naranbadrakh1013@gmail.com" : "student_demo@bnx.mn",
      displayName: isAdm ? "Админ (Demo)" : "Оюутан (Demo)",
    };
    setCurrentUser(guestUser);
    setUserProfile({
      uid: guestUser.uid,
      name: guestUser.displayName,
      email: guestUser.email,
      role: isAdm ? "admin" : "student",
      transactionReference: isAdm ? "BNX-ADMIN" : "BNX-DEMO",
      paymentStatus: "paid",
      accessStatus: "active",
      country: "Монгол",
      school: "1-р сургууль",
      gpa: 3.85,
      ieltsScore: 7.5,
      satScore: 1420,
      careerInterests: "Компьютерийн ухаан (CS & IT)",
      preferredCountries: ["АНУ", "Канад", "Герман", "Солонгос"],
      bioSummary:
        "Дэлхийн шилдэг их сургуулиудад тэтгэлэгтэй суралцах зорилготой.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setLoadingApp(false);
  };

  const handleRefreshProfile = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/students/assign-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email || "",
        }),
      });
      const resData = await res.json();
      if (resData && resData.profile) {
        setUserProfile(resData.profile as UserProfile);
      }
    } catch (err) {
      console.error("Refresh profile error:", err);
    }
  };

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

    // Eager profile fetch via server API to ensure instant, reliable loading
    fetch("/api/students/assign-reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email || "",
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.profile) {
          setUserProfile(resData.profile as UserProfile);
        }
      })
      .catch((err) => console.error("Eager profile fetch error:", err))
      .finally(() => setLoadingApp(false));

    const unsubscribes: (() => void)[] = [];

    // A) Sync custom universities (admin additions)
    try {
      const qUnis = collection(db, "custom_universities");
      const unsubUnis = onSnapshot(
        qUnis,
        (snapshot) => {
          const list: University[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as University);
          });
          setCustomUniversities(list);
        },
        (err) => console.warn("Unis sync note:", err.message),
      );
      unsubscribes.push(unsubUnis);
    } catch (e) {
      console.error(e);
    }

    // B) Sync custom scholarships (admin additions)
    try {
      const qSchols = collection(db, "custom_scholarships");
      const unsubSchols = onSnapshot(
        qSchols,
        (snapshot) => {
          const list: Scholarship[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Scholarship);
          });
          setCustomScholarships(list);
        },
        (err) => console.warn("Schols sync note:", err.message),
      );
      unsubscribes.push(unsubSchols);
    } catch (e) {
      console.error(e);
    }

    // C) Sync application tracks for current user
    try {
      const qTracks = query(
        collection(db, "tracks"),
        where("userId", "==", currentUser.uid),
      );
      const unsubTracks = onSnapshot(
        qTracks,
        (snapshot) => {
          const list: ApplicationTrack[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as ApplicationTrack);
          });
          setTracks(list);
        },
        (err) => console.warn("Tracks sync note:", err.message),
      );
      unsubscribes.push(unsubTracks);
    } catch (e) {
      console.error(e);
    }

    // D) Sync essays for current user
    try {
      const qEssays = query(
        collection(db, "essays"),
        where("userId", "==", currentUser.uid),
      );
      const unsubEssays = onSnapshot(
        qEssays,
        (snapshot) => {
          const list: Essay[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Essay);
          });
          setEssays(list);
        },
        (err) => console.warn("Essays sync note:", err.message),
      );
      unsubscribes.push(unsubEssays);
    } catch (e) {
      console.error(e);
    }

    // E) Sync user profile in real-time with automatic self-initialization
    try {
      const profileRef = doc(db, "profiles", currentUser.uid);
      const unsubProfile = onSnapshot(
        profileRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            const pData = docSnap.data() as UserProfile;
            setUserProfile(pData);
          } else if (
            currentUser.uid !== "admin_demo_uid" &&
            currentUser.uid !== "student_demo_uid"
          ) {
            const isAdm =
              currentUser.email?.toLowerCase() === "naranbadrakh1013@gmail.com";
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name:
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "Оюутан",
              email: currentUser.email || "",
              role: isAdm ? "admin" : "student",
              transactionReference: `BNX-${Math.floor(1000 + Math.random() * 9000)}`,
              paymentStatus: "paid",
              accessStatus: "active",
              country: "Монгол",
              school: "Сургууль",
              gpa: 3.8,
              ieltsScore: 7.0,
              careerInterests: "Компьютерийн ухаан (CS & IT)",
              preferredCountries: ["АНУ", "Канад", "Герман", "Солонгос"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setUserProfile(newProfile);
            try {
              await setDoc(profileRef, newProfile, { merge: true });
            } catch (e) {
              console.warn("Init profile Firestore note:", e);
            }
          }
        },
        (err) => {
          console.warn("Profile sync note:", err.message);
        },
      );
      unsubscribes.push(unsubProfile);
    } catch (profileErr) {
      console.error(profileErr);
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
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else if (authMode === "forgot") {
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
      if (
        err.code === "auth/unauthorized-domain" ||
        (err.message && err.message.includes("unauthorized-domain"))
      ) {
        setAuthError(
          "Таны энэхүү домэйн Firebase-ийн Authorized Domains жагсаалтад бүртгэгдээгүй байна. Та доорх 'Шууд турших (Зочны эрхээр орох)' товч дээр даран шууд орж туршиж болно.",
        );
      } else {
        setAuthError(err.message || "Google-ээр нэвтрэх үйлдэл амжилтгүй.");
      }
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
      const data = cleanUndefined({
        ...updated,
        updatedAt: new Date().toISOString(),
      });
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
      const cleanPayload = cleanUndefined({
        ...payload,
        userId: currentUser.uid,
      });
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
      const cleanPayload = cleanUndefined({
        ...payload,
        userId: currentUser.uid,
      });
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
    const existing = tracks.find((t) => t.universityId === uni.id);
    if (existing) {
      alert("Энэ сургууль хөтөч хэсэгт аль хэдийн нэмэгдсэн байна.");
      setActiveTab("tracker");
      return;
    }

    const payload: ApplicationTrack = {
      id: `track_${Date.now()}`,
      userId: currentUser?.uid || "mock",
      universityId: uni.id,
      universityName: uni.name,
      status: "In Progress",
      submittedDocuments: [],
      appliedScholarships: uni.scholarships
        ? uni.scholarships.split("(")[0].trim()
        : "",
      deadline: uni.deadline || "",
      notes: "Каталогоос шууд нэмэгдсэн сонирхогч сургууль.",
      updatedAt: new Date().toISOString(),
    };

    try {
      await handleSaveTrack(payload);
      alert(
        `${uni.name} сургууль таны Хөтөч (Tracker) рүү амжилттай нэмэгдлээ!`,
      );
      setActiveTab("tracker");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const countAcademicProgressPercentage = () => {
    const prof = effectiveProfile;
    if (!prof) return 0;
    let filled = 0;
    const fields: (keyof UserProfile)[] = [
      "name",
      "age",
      "country",
      "school",
      "gpa",
      "careerInterests",
      "ieltsScore",
      "programmingSkills",
      "awards",
      "olympiads",
    ];
    fields.forEach((f) => {
      if (prof[f] !== undefined && prof[f] !== "") filled++;
    });
    return (filled / fields.length) * 100;
  };

  // 5. RENDERS LOADING STATE
  if (loadingApp && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white font-sans">
        <Sparkles className="animate-spin w-8 h-8 text-neutral-450 mb-3" />
        <h2 className="text-sm font-semibold tracking-wider font-mono">
          Ачааллаж байна...
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Хувийн CV болон элсэлтийн мэдээллийн санг холбож байна.
        </p>
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
            {/* SVG Overlapping Waves Graphic */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-start scale-110 select-none">
              <svg
                className="w-full h-full object-cover"
                viewBox="0 0 600 900"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="600" height="900" fill="#ffffff" />
                <path
                  d="M 0 0 C 250 50, 420 280, 320 900 L 0 900 Z"
                  fill="#fcfcfd"
                />
                <defs>
                  <pattern
                    id="diag-stripes-black"
                    width="12"
                    height="12"
                    patternTransform="rotate(45 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="12"
                      stroke="#1c1c1e"
                      strokeWidth="3"
                    />
                  </pattern>
                  <filter
                    id="wave-shadow"
                    x="-10%"
                    y="-10%"
                    width="130%"
                    height="130%"
                  >
                    <feDropShadow
                      dx="-2"
                      dy="6"
                      stdDeviation="10"
                      floodColor="#000000"
                      floodOpacity="0.12"
                    />
                  </filter>
                </defs>

                <path
                  d="M -20 50 C 320 90, 480 380, 240 920"
                  stroke="#0c0c0e"
                  strokeWidth="150"
                  strokeLinecap="round"
                  filter="url(#wave-shadow)"
                />
                <path
                  d="M -20 50 C 320 90, 480 380, 240 920"
                  stroke="#ffffff"
                  strokeWidth="25"
                  strokeLinecap="round"
                />
                <path
                  d="M -20 180 C 250 260, 380 480, 180 920"
                  stroke="url(#diag-stripes-black)"
                  strokeWidth="110"
                  strokeLinecap="round"
                />
                <path
                  d="M -20 320 C 190 350, 290 580, 120 920"
                  stroke="#1c1c1e"
                  strokeWidth="90"
                  strokeLinecap="round"
                  filter="url(#wave-shadow)"
                />
                <path
                  d="M -20 460 C 120 490, 210 680, 60 920"
                  stroke="#ffffff"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="3 4"
                />
              </svg>
            </div>

            {/* Visual Text brand header built above waves */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2">
                <div className="bg-[#050507] px-2.5 py-1.5 rounded-xl flex items-center justify-center">
                  <BnxLogo className="h-5" />
                </div>
                <span className="font-extrabold text-[#0c0c0e] tracking-widest text-[11px] font-mono">
                  НАВИГАТОР
                </span>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-neutral-200/80 p-5 rounded-2xl text-neutral-800 space-y-1 mt-auto shadow-md">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">
                  Зөвлөх систем
                </span>
                <p className="text-[11px] leading-relaxed font-semibold text-neutral-900">
                  Монгол оюутан залууст зориулсан дэлхийн шилдэг сургууль,
                  тэтгэлэг олох хиймэл оюуны ухаалаг системд тавтай морилно уу.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Right Column: Content and Split Login Controls */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between p-8 md:p-12 relative bg-white">
            {/* Horizontal Navigation Menu */}
            <header className="flex items-center justify-between border-b border-neutral-100 pb-5">
              <div className="lg:hidden flex items-center gap-2">
                <div className="bg-[#050507] px-2 py-1 rounded-lg flex items-center justify-center">
                  <BnxLogo className="h-4" />
                </div>
                <span className="font-extrabold text-[#0c0c0e] tracking-widest text-[11px] font-mono">
                  НАВИГАТОР
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-7 text-[10px] font-bold text-neutral-450 uppercase tracking-widest font-mono">
                <span className="hover:text-black cursor-pointer transition">
                  СУРГУУЛИУД
                </span>
                <span className="hover:text-black cursor-pointer transition">
                  ТЭТГЭЛЭГ
                </span>
                <span className="hover:text-black cursor-pointer transition">
                  ХУВИЙН CV
                </span>
                <span className="hover:text-black cursor-pointer transition">
                  МЭДЭЭЛЭЛ
                </span>
              </div>
            </header>

            {/* Split Content Body area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center py-8">
              {/* Left detail area */}
              <div className="xl:col-span-7 space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">
                  <span>СОШИАЛ</span>
                  <span className="text-neutral-300">—</span>
                  <div className="flex items-center gap-3 text-neutral-800">
                    <span className="hover:text-black hover:underline cursor-pointer">
                      Фэйсбүүк
                    </span>
                    <span className="hover:text-black hover:underline cursor-pointer">
                      Инстаграм
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl xl:text-[40px] font-black text-black tracking-tight leading-[1.1] font-sans">
                  Ирээдүйн боломжоо нээж,
                  <br />
                  дэлхийн түвшинд суралц!
                </h1>

                <p className="text-neutral-500 text-xs md:text-sm leading-relaxed max-w-md">
                  Дэлхийн топ сургуулийн элсэлтийн шалгуур, тэтгэлэг магадлалыг
                  Google Gemini хиймэл оюуны тусламжтай тооцож, хувийн академик
                  CV-гээ үүсгээрэй.
                </p>

                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-3.5 space-y-1.5 hover:border-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-bold text-black block">
                        Gemini AI Тооцоолол
                      </span>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Сургуульд тэнцэх ба тэтгэлэг авах магадлалын шинжилгээ
                      </p>
                    </div>

                    <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-3.5 space-y-1.5 hover:border-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-[11px] font-bold text-black block">
                        Их Сургуулиудын Сан
                      </span>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        100+ сургуулийн элсэлтийн босго, сургалтын төлбөр
                      </p>
                    </div>

                    <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-3.5 space-y-1.5 hover:border-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-sky-400" />
                      </div>
                      <span className="text-[11px] font-bold text-black block">
                        Академик CV
                      </span>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Олон улсын стандартад нийцсэн CV экспорт хийх
                      </p>
                    </div>

                    <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-3.5 space-y-1.5 hover:border-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="text-[11px] font-bold text-black block">
                        Аппликейшн Хөтөч
                      </span>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Бүрдүүлэх материал, эцсийн хугацаа болон визний явц
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right detail area with embedded high-contrast Auth form */}
              <div className="xl:col-span-5 bg-white border border-neutral-200 shadow-xl rounded-3xl p-6 relative">
                {authMode !== "forgot" && (
                  <div className="flex border-b border-neutral-100 text-xs mb-5 pb-2.5 gap-4 justify-between">
                    <button
                      id="btn-switch-login"
                      onClick={() => {
                        setAuthMode("login");
                        setAuthError("");
                      }}
                      className={`pb-1 font-bold tracking-wider uppercase transition cursor-pointer ${
                        authMode === "login"
                          ? "text-black border-b-2 border-black"
                          : "text-neutral-400 hover:text-black"
                      }`}
                    >
                      Нэвтрэх
                    </button>
                    <button
                      id="btn-switch-signup"
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthError("");
                      }}
                      className={`pb-1 font-bold tracking-wider uppercase transition cursor-pointer ${
                        authMode === "signup"
                          ? "text-black border-b-2 border-black"
                          : "text-neutral-400 hover:text-black"
                      }`}
                    >
                      Бүртгүүлэх
                    </button>
                  </div>
                )}

                {authMode === "forgot" && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthError("");
                        setIsForgotPasswordSent(false);
                      }}
                      className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 focus:outline-none mb-3 font-semibold"
                    >
                      &larr; Буцах
                    </button>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                      Нууц үг сэргээх
                    </h3>
                  </div>
                )}

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

                {authMode === "signup" ? (
                  <StudentSignUpForm
                    onSignUpSuccess={(userData) => {
                      if (userData) {
                        setUserProfile(userData as UserProfile);
                      }
                    }}
                    onSwitchToLogin={() => setAuthMode("login")}
                  />
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                        И-мэйл хаяг
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                        <input
                          id="auth-input-email"
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="Ж: anand@study.mn"
                          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder:text-neutral-300"
                        />
                      </div>
                    </div>

                    {authMode !== "forgot" && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                            Нууц үг
                          </label>
                          {authMode === "login" && (
                            <button
                              type="button"
                              id="btn-switch-forgot"
                              onClick={() => setAuthMode("forgot")}
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
                      className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center cursor-pointer font-mono"
                    >
                      {authLoading
                        ? "Холбогдож байна..."
                        : authMode === "login"
                          ? "НЭВТРЭХ"
                          : "ИЛГЭЭХ"}
                    </button>
                  </form>
                )}

                <div className="mt-4 pt-4 border-t border-neutral-100 text-center space-y-2.5">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">
                    Эсвэл холбогдох
                  </span>
                  <button
                    onClick={handleGoogleSignIn}
                    id="btn-log-google"
                    className="w-full border border-neutral-200 hover:bg-neutral-50 py-2.5 rounded-xl text-[11px] text-neutral-800 font-bold transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.6-6.887 4.6-4.33 0-7.86-3.59-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.136C18.347 1.144 15.547 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.79 0-.79-.08-1.4-.26-1.925H12.24z"
                      />
                    </svg>
                    Google-ээр орох
                  </button>

                  <div className="pt-2 border-t border-neutral-100 space-y-1.5">
                    <button
                      id="btn-guest-explore"
                      type="button"
                      onClick={() => handleEnterAsGuest("student")}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Шууд турших (Зочны эрхээр үзэх)</span>
                    </button>
                    <button
                      id="btn-admin-demo-explore"
                      type="button"
                      onClick={() => handleEnterAsGuest("admin")}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Админ хяналтын самбар турших</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <footer className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between text-[10px] text-neutral-400 font-medium space-y-2 md:space-y-0">
              <p>© 2026 BNX Монгол Оюутны Элсэлтийн Платформ.</p>
              <p>Gemini AI Ухаалаг Систем.</p>
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
      <div className="md:hidden bg-[#09090b]/95 border-b border-white/10 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <BnxLogo className="h-5 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-extrabold text-white tracking-widest text-xs font-mono shrink-0">
              НАВИГАТОР
            </span>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full truncate">
              {activeTab === "cv"
                ? "Профайл"
                : activeTab === "unis"
                  ? "Сургуулиуд"
                  : activeTab === "scholarships"
                    ? "Тэтгэлэг"
                    : activeTab === "tracker"
                      ? "Хөтөч"
                      : activeTab === "essays"
                        ? "AI Эссэ"
                        : "Улсууд"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all focus:outline-none flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span className="text-[11px] font-bold text-neutral-200">
            {mobileMenuOpen ? "Хаах" : "Цэс"}
          </span>
          {mobileMenuOpen ? (
            <X className="w-4 h-4 text-amber-400" />
          ) : (
            <Menu className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* MOBILE HORIZONTAL QUICK TAB SCROLL BAR */}
      <div className="md:hidden bg-[#0a0a0d]/95 border-b border-white/5 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar z-[90] sticky top-[49px]">
        <button
          onClick={() => {
            setActiveTab("cv");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "cv"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Профайл</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("unis");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "unis"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Сургуулиуд</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("scholarships");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "scholarships"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Тэтгэлэг</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("tracker");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "tracker"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Хөтөч</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("essays");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "essays"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>AI Эссэ</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("countries");
            setMobileMenuOpen(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
            activeTab === "countries"
              ? "bg-white text-black shadow-md"
              : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Улсууд</span>
        </button>

        {isAdminUser && (
          <button
            onClick={() => {
              setActiveTab("admin");
              setMobileMenuOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === "admin"
                ? "bg-amber-400 text-black shadow-md font-extrabold"
                : "bg-amber-400/10 text-amber-400 hover:text-white border border-amber-400/20"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Админ Панел</span>
          </button>
        )}
      </div>

      {/* MOBILE DROPDOWN SELECTION DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[49px] bottom-0 z-[120] bg-[#09090b]/98 backdrop-blur-2xl p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-fade-in border-t border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                Үндсэн Навигаци
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                Монгол Платформ
              </span>
            </div>

            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("cv");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "cv"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserIcon
                      className={`w-4 h-4 ${activeTab === "cv" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>Академик Профайл (CV)</span>
                  </div>
                  {activeTab === "cv" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("unis");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "unis"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap
                      className={`w-4 h-4 ${activeTab === "unis" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>Их Сургуулиудын Сан</span>
                  </div>
                  {activeTab === "unis" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("scholarships");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "scholarships"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen
                      className={`w-4 h-4 ${activeTab === "scholarships" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>Тэтгэлгийн Радар</span>
                  </div>
                  {activeTab === "scholarships" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("tracker");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "tracker"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase
                      className={`w-4 h-4 ${activeTab === "tracker" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>Аппликейшн Хөтөч</span>
                  </div>
                  {activeTab === "tracker" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("essays");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "essays"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText
                      className={`w-4 h-4 ${activeTab === "essays" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>AI Эссэ Туслах</span>
                  </div>
                  {activeTab === "essays" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveTab("countries");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === "countries"
                      ? "bg-white text-black shadow-lg font-black"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white bg-neutral-900/50 border border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home
                      className={`w-4 h-4 ${activeTab === "countries" ? "text-black" : "text-neutral-400"}`}
                    />
                    <span>Суралцах Улсууд</span>
                  </div>
                  {activeTab === "countries" && (
                    <span className="text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                      Идэвхтэй
                    </span>
                  )}
                </button>
              </li>

              {isAdminUser && (
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      activeTab === "admin"
                        ? "bg-amber-400 text-black shadow-lg font-black"
                        : "text-amber-400 hover:bg-white/5 hover:text-white bg-amber-500/10 border border-amber-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>BNX Админ Панел</span>
                    </div>
                    {activeTab === "admin" && (
                      <span className="text-[10px] uppercase bg-black text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                        Идэвхтэй
                      </span>
                    )}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <div className="min-w-0 pr-2">
              <span className="text-[9px] text-neutral-500 font-mono block uppercase">
                Нэвтэрсэн Хэрэглэгч
              </span>
              <span className="truncate font-mono font-bold text-white block text-xs">
                {currentUser.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs uppercase font-bold flex items-center gap-1.5 shrink-0 focus:outline-none transition-all active:scale-95 shadow-sm"
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
              <span className="font-extrabold text-white tracking-widest text-xs font-mono block">
                НАВИГАТОР
              </span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold mt-0.5">
                Монгол Платформ
              </span>
            </div>
          </div>

          {/* Navigation link triggers list */}
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>
              <button
                id="sidebar-nav-cv"
                onClick={() => setActiveTab("cv")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === "cv"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span>Академик Профайл</span>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-unis"
                onClick={() => setActiveTab("unis")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "unis"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Их Сургуулиудын Сан</span>
                </div>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-scholarships"
                onClick={() => setActiveTab("scholarships")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "scholarships"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Тэтгэлэгийн Радар</span>
                </div>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-tracker"
                onClick={() => setActiveTab("tracker")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "tracker"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Аппликейшн Хөтөч</span>
                </div>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-essays"
                onClick={() => setActiveTab("essays")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "essays"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>AI Эссэ Туслах</span>
                </div>
              </button>
            </li>

            <li>
              <button
                id="sidebar-nav-countries"
                onClick={() => setActiveTab("countries")}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "countries"
                    ? "bg-white text-black"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Суралцах Улсууд</span>
                </div>
              </button>
            </li>

            {isAdminUser && (
              <li>
                <button
                  id="sidebar-nav-admin"
                  onClick={() => setActiveTab("admin")}
                  className={`w-full text-left px-3.5 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-amber-400 text-black font-extrabold shadow-lg"
                      : "text-amber-400 hover:bg-amber-400/10"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>BNX Админ Панел</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Logged in User footer status indicator */}
        <div className="pt-4 border-t border-white/5 space-y-3.5 text-xs">
          <div className="p-3 bg-[#0d0d11] border border-white/5 rounded-xl space-y-1">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block font-mono">
              {currentUser.uid.includes("demo")
                ? "Туршилтын Горим"
                : "Бүртгэлтэй Хэрэглэгч"}
            </span>
            <span className="text-white font-semibold block truncate leading-none">
              {currentUser.email}
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold block pt-0.5">
              Код: {effectiveProfile.transactionReference || "BNX-DEMO"}
            </span>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1.5 border-t border-white/5">
              <span>CV Бөглөлт:</span>
              <span className="font-bold text-white font-mono">
                {Math.floor(countAcademicProgressPercentage())}%
              </span>
            </div>
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
      <main className="flex-1 p-3.5 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto space-y-6">
        {/* BNX Admin Panel Tab */}
        {activeTab === "admin" && isAdminUser && currentUser && (
          <BnxAdminPanel
            adminUid={currentUser.uid}
            adminEmail={currentUser.email || ""}
          />
        )}

        {/* Academic Profile & CV Tab */}
        {activeTab === "cv" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-neutral-800 text-neutral-300 px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Академик Профайл
                </span>
                <span className="text-xs text-neutral-500">
                  • AI зөвлөмж болон CV бэлтгэлд мэдээллээ бүрэн бөглөнө үү
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Оюутны Хувийн CV Бэлтгэгч
              </h1>
            </div>

            {/* Profile compliance badge */}
            <div className="p-4 bg-neutral-900/20 border border-neutral-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-white">
                  CV Бөглөлтийн Хувь
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Оноо, олимпиад, шагнал болон холбоо барих мэдээллээ гүйцэт
                  бөглөх тусам AI тооцоолол болон CV экспорт илүү чанартай
                  гарна.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <div className="flex-1 sm:w-40 bg-neutral-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-neutral-300 h-full transition-all duration-300"
                    style={{ width: `${countAcademicProgressPercentage()}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white font-mono">
                  {Math.floor(countAcademicProgressPercentage())}%
                </span>
              </div>
            </div>

            <ProfileForm
              profile={effectiveProfile}
              onSave={handleSaveProfile}
              isLoading={savingData}
            />
          </div>
        )}

        {/* Universities Tab */}
        {activeTab === "unis" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Их Сургуулиудын Шалгуур ба Тохирох Хайлт
              </h1>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                Бакалавр, Магистрын хөтөлбөр, санхүүгийн жилийн зардал болон
                элсэлтийн босгуудыг харьцуулах ухаалаг хайлт.
              </p>
            </div>
            <UniversityFinder
              universities={allUniversities}
              profile={effectiveProfile}
              onTrackUniversity={handleAutoTrackUniversity}
            />
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === "scholarships" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Санхүүжилт ба Тэтгэлгүүдийн Сан
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Монгол оюутанд зориулсан шилдэг тэтгэлгүүдийн хамрах хүрээ,
                бэлтгэл заавар.
              </p>
            </div>
            <ScholarshipFinder
              scholarships={allScholarships}
              profile={effectiveProfile}
            />
          </div>
        )}

        {/* Tracker Pipeline Hub Tab */}
        {activeTab === "tracker" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Аппликейшны Хяналтын Самбар
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Сонгосон их сургуулиудын бүрдүүлэх материал, эцсийн хугацаа
                болон визний явцыг хянах.
              </p>
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
        {activeTab === "essays" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Хувийн Тодорхойлолт Эссэ Хянагч (AI)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                AI-ийн тусламжтай дүрмийн алдаа засах, IELTS загварын
                нарийвчилсан шүүмж, зөвлөгөө болон оноо тооцоолох.
              </p>
            </div>
            <EssayHelper
              essays={essays}
              onSaveEssay={handleSaveEssay}
              onDeleteEssay={handleDeleteEssay}
              isLoading={savingData}
              uid={currentUser?.uid}
              email={currentUser?.email || ""}
            />
          </div>
        )}

        {/* Countries Guide Guides Tab */}
        {activeTab === "countries" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Суралцах ба Амьдрах Улсуудын Мэдээлэл
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-sans">
                10 өөр улсад амьдрах нийт өртөг, виз авах явц болон хууль ёсоор
                цагийн ажил хийх журам.
              </p>
            </div>
            <CountryExplorer />
          </div>
        )}
      </main>
    </div>
  );
}
