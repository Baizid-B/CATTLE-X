import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isManager, signOut } = useAuth();

  const links = [
    { to: "/", label: "হোম" },
    { to: "/marketplace", label: "মার্কেটপ্লেস" },
    { to: "/contact", label: "যোগাযোগ" },
  ];

  if (isAdmin || isManager) {
    links.push({ to: "/admin", label: isAdmin ? "অ্যাডমিন" : "ম্যানেজার" });
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true }); // ✅ history replace করবে
      setOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="cattle-container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold tracking-tight">
          CATTLE<span className="font-light">X</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wider uppercase transition-opacity ${
                isActive(link.to) ? "opacity-100 font-medium" : "opacity-50 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && <Shield size={16} className="text-muted-foreground" />}
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button onClick={handleLogout} className="cattle-btn-outline text-xs py-2 px-4 gap-1">
                <LogOut size={14} /> লগআউট
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="cattle-btn-primary text-xs py-2 px-6 gap-2">
              <LogIn size={14} /> লগইন
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="cattle-container py-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm tracking-wider uppercase">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={handleLogout} className="cattle-btn-outline text-xs py-2 px-4 w-fit gap-1">
                  <LogOut size={14} /> লগআউট
                </button>
              ) : (
                <button onClick={() => { navigate("/login"); setOpen(false); }} className="cattle-btn-primary text-xs py-2 px-6 w-fit gap-2">
                  <LogIn size={14} /> লগইন
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
