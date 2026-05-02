import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  {
    icon: Mail,
    label: "ইমেইল",
    value: "mdbaizidbostami196@gmail.com",
    href: "mailto:mdbaizidbostami196@gmail.com",
  },
  {
    icon: Phone,
    label: "ফোন",
    value: "০১৩০৪৮৬৭৩০২",
    href: "tel:+8801304867302",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "০১৩০৪৮৬৭৩০২",
    href: "https://wa.me/qr/CE3STEG5DN35B1",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="cattle-container cattle-section">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              যোগাযোগ
            </p>
            <h1 className="text-3xl md:text-5xl font-bold">আমাদের সাথে যোগাযোগ করুন</h1>
            <p className="text-muted-foreground mt-4 max-w-lg">
              গরু কেনা-বেচা বিষয়ে যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.label === "WhatsApp" ? "_blank" : undefined}
                rel={info.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="block p-8 border border-border hover:border-foreground/20 transition-colors group"
              >
                <info.icon size={24} className="text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">{info.label}</p>
                <p className="font-semibold text-lg break-all">{info.value}</p>
              </motion.a>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-border p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">সরাসরি WhatsApp-এ মেসেজ করুন</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              দ্রুত উত্তর পেতে আমাদের WhatsApp-এ সরাসরি মেসেজ পাঠান।
            </p>
            <a
              href="https://wa.me/qr/CE3STEG5DN35B1"
              target="_blank"
              rel="noopener noreferrer"
              className="cattle-btn-primary inline-flex gap-2 px-8 py-3"
            >
              <MessageCircle size={18} /> WhatsApp-এ মেসেজ করুন
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
