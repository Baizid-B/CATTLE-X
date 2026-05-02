import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {
    toast.info("লগইন ফিচার শীঘ্রই আসছে!");
  };

  const handleGoogleLogin = () => {
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectURI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    
    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    
    // অথরাইজেশন ইউআরএল তৈরি
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token&scope=${scope}&include_granted_scopes=true`;

    // সরাসরি গুগলের পেজে পাঠিয়ে দিবে
    window.location.assign(googleAuthUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 cattle-container pb-20">
        <div className="max-w-md mx-auto">
          {/* page headin */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              {isSignUp ? "নতুন অ্যাকাউন্ট" : "লগইন"}
            </p>
            <h1 className="text-3xl font-bold">{isSignUp ? "নিবন্ধন করুন" : "স্বাগতম"}</h1>
          </div>

          <div className="border border-border p-8 space-y-4">


            <div>
              <Label className="text-xs tracking-wider uppercase">ইমেইল</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs tracking-wider uppercase">পাসওয়ার্ড</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full cattle-btn-primary">
              {isSignUp ? "নিবন্ধন করুন" : "লগইন করুন"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "নতুন ব্যবহারকারী?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="underline hover:text-foreground">
                {isSignUp ? "লগইন করুন" : "নিবন্ধন করুন"}
              </button>
            </p>

            <div className="w-full flex justify-center p-4 ">
                <div onClick={handleGoogleLogin} className="border p-4 rounded-full cursor-pointer"><FcGoogle /></div>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-foreground">হোমপেজে ফিরুন</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
