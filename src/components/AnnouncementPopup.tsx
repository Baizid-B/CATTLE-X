import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveAnnouncement } from "@/hooks/useAnnouncements";

const AnnouncementPopup = () => {
  const location = useLocation();
  const { data: announcement } = useActiveAnnouncement(location.pathname);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!announcement || dismissed) return;

    if (announcement.show_once_per_session) {
      const key = `announcement_seen_${announcement.id}`;
      if (sessionStorage.getItem(key)) return;
    }

    const timer = setTimeout(() => setVisible(true), (announcement.delay_seconds || 0) * 1000);
    return () => clearTimeout(timer);
  }, [announcement, dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    if (announcement?.show_once_per_session) {
      sessionStorage.setItem(`announcement_seen_${announcement.id}`, "1");
    }
  };

  if (!announcement) return null;

  const hasImage = !!announcement.image_url;
  const imageUrl = announcement.image_url;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-lg w-full shadow-2xl overflow-hidden"
            style={{ backgroundColor: announcement.bg_color, color: announcement.text_color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-foreground/20 backdrop-blur-sm opacity-80 hover:opacity-100 transition-opacity"
              style={{ color: announcement.text_color }}
            >
              <X size={18} />
            </button>

            {hasImage && (
              <div className="w-full aspect-[16/9] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-3">{announcement.title}</h2>
              <p className="text-sm leading-relaxed opacity-90">{announcement.message}</p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 text-sm font-medium tracking-wider uppercase border transition-all hover:opacity-80"
                style={{ borderColor: announcement.text_color, color: announcement.text_color }}
              >
                বন্ধ করুন
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementPopup;
