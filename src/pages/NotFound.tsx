import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import cowImage from "../assets/404/404 Image.jpg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <img
        src={cowImage}
        alt="404 Page"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="text-center border px-16 py-10 rounded z-10 bg-white/30 backdrop-blur-sm">
        <h1 className="mb-4 text-2xl">উফ! ভুল মাঠে চলে এসেছে না আপনি</h1>
        <p className="mb-4 text-[1.35rem] font-bold">খুঁজে পাচ্ছেন না যাওয়ার রাস্তা</p>
        <p className="mb-4 text-xl font-bold">চলুন সঠিক রাস্তায় ফিরে যাই</p>

        <a href="/" className="underline">
          এই রাস্তায় ক্লিক করুন 
        </a>

      </div>
    </div>
  );
};

export default NotFound;