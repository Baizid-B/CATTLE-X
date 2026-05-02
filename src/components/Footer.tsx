import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="cattle-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight">
              CATTLE<span className="font-light">X</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত গবাদিপশু মার্কেটপ্লেস। সহজে গরু কিনুন, বিক্রি করুন এবং বাজারদর দেখুন।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "হোম" },
                { to: "/marketplace", label: "মার্কেটপ্লেস" },
                { to: "/contact", label: "যোগাযোগ" },
                { to: "/login", label: "লগইন" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4">সেবাসমূহ</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>গরু ক্রয়-বিক্রয়</li>
              <li>লাইভ মার্কেট প্রাইস</li>
              <li>AI মূল্য পরামর্শ</li>
              <li>বিক্রেতা যাচাই</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4">যোগাযোগ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="shrink-0" /> বগুড়া, বাংলাদেশ
              </li>
              <li>
                <a href="tel:+8801304867302" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone size={14} className="shrink-0" /> ০১৩০৪৮৬৭৩০২
                </a>
              </li>
              <li>
                <a href="mailto:mdbaizidbostami196@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={14} className="shrink-0" /> mdbaizidbostami196@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/qr/CE3STEG5DN35B1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="cattle-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © ২০২৬ Cattle X। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">গোপনীয়তা নীতি</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">শর্তাবলী</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
