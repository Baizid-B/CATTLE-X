import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ role অনুযায়ী redirect
  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "manager") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setErrorMsg(decodeURIComponent(err));
  }, [searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "signup" && !name) { setErrorMsg("নাম দিন"); return; }
    if (!email || !password) { setErrorMsg("ইমেইল ও পাসওয়ার্ড দিন"); return; }

    setSubmitting(true);

    const result =
      mode === "login"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(name, email, password);

    if (result.error) {
      setErrorMsg(result.error);
      setSubmitting(false);
    }
    // ✅ navigate নেই — উপরের useEffect user watch করে নিজেই redirect করবে
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-background">
        <MotionConfig>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto w-full"
          >
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              CATTLE<span className="font-light">X</span>
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-12">
              বাংলাদেশ ক্যাটল ইনডেক্স
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {mode === "login" ? "সাইন ইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}
            </h2>
            <p className="text-muted-foreground mb-10">
              গবাদিপশু ব্যবসায় আপনাকে স্বাগতম
            </p>

            {errorMsg && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {mode === "signup" && (
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">
                    নাম
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full p-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">
                  ইমেইল
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full p-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-medium text-sm tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting
                  ? "অপেক্ষা করুন..."
                  : mode === "login"
                  ? "সাইন ইন করুন"
                  : "অ্যাকাউন্ট তৈরি করুন"}
              </button>
            </form>

            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrorMsg(null); setName(""); }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              {mode === "login"
                ? "অ্যাকাউন্ট নেই? তৈরি করুন"
                : "অ্যাকাউন্ট আছে? সাইন ইন করুন"}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">অথবা</span>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium tracking-wide"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              গুগল দিয়ে সাইন ইন করুন
            </button>

            <p className="text-xs text-muted-foreground text-center mt-8">
              সাইন ইন করার মাধ্যমে আপনি আমাদের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হচ্ছেন।
            </p>
          </motion.div>
        </MotionConfig>
      </div>

      {/* Right panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={heroFarm} alt="Bangladesh cattle farm" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h3 className="text-3xl font-bold mb-2">বাংলাদেশের সেরা গরুর হাট</h3>
          <p className="text-white/70 text-sm">AI-পাওয়ার্ড লাইভ মূল্য বুদ্ধিমত্তা প্ল্যাটফর্ম</p>
        </div>
      </div>
    </div>
  );
};

export default Login;