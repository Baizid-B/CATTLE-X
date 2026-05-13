import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Pages & Components
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import CowDetails from "./pages/CowDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard"; // ✅ যোগ করুন
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthCallback from "./Auth/AuthCallback";
import AnnouncementPopup from "./components/AnnouncementPopup";
import Loading from "../src/components/ui/Loading";

const queryClient = new QueryClient();

// --- মেইন রাউট সেটআপ ---
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <>
      <AnnouncementPopup />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/cow/:id" element={<CowDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} /> {/* ✅ ম্যানেজার রাউট */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// --- মূল অ্যাপ স্ট্রাকচার ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;