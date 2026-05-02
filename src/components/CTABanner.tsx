import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-primary-foreground p-12 md:p-16 text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-4">
            আজই শুরু করুন
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            আপনার গরু বিক্রি করতে চান?
          </h2>
          <p className="text-sm md:text-base opacity-70 max-w-lg mx-auto mb-10">
            হাজার হাজার ক্রেতা আপনার গরুর খোঁজ করছে। আজই Cattle X-এ আপনার তালিকা যোগ করুন এবং সেরা দামে বিক্রি করুন।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-foreground text-primary font-medium text-sm tracking-wider uppercase transition-all hover:opacity-90"
            >
              এখনই শুরু করুন <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/qr/CE3STEG5DN35B1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-primary-foreground/40 text-primary-foreground font-medium text-sm tracking-wider uppercase transition-all hover:bg-primary-foreground/10"
            >
              <Phone size={16} /> যোগাযোগ করুন
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
