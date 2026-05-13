import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const { signInWithGoogleToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const token = params.get("access_token");

    if (!token) {
      navigate("/login?error=Google+লগইন+ব্যর্থ+হয়েছে", { replace: true });
      return;
    }

    signInWithGoogleToken(token).then((res) => {
      if (!res.error) {
        const role = res.user?.role;

        if (role === "admin" || role === "manager") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        navigate(`/login?error=${encodeURIComponent(res.error)}`, { replace: true });
      }
    });
  }, [signInWithGoogleToken, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Loader2 size={32} className="animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        গুগল লগইন ভেরিফাই হচ্ছে, দয়া করে অপেক্ষা করুন...
      </p>
    </div>
  );
};

export default AuthCallback;