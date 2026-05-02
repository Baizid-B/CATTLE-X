import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, ShoppingBag } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

const HeroSection = () => {

  return (
    <>
      {/* Hero with background image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroFarm}
          alt="বাংলাদেশের গরুর খামার"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        
        {/* Animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        <div className="cattle-container relative z-10 py-20">
          <div className="max-w-4xl md:w-[800px] text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/70">
                  লাইভ মার্কেটপ্লেস
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6 text-white"
            >
              বাংলাদেশের সেরা গরুর হাট
              
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base md:text-lg text-white/60 max-w-lg mb-10 leading-relaxed"
            >
              সহজে গরু কিনুন, বিক্রি করুন এবং লাইভ বাজারদর দেখুন।
              <br />
              বিশ্বস্ত প্ল্যাটফর্ম, সেরা দাম।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                to="/marketplace"
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] gap-2"
              >
                গরু কিনুন
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                যোগাযোগ করুন
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Feature cards below hero */}
      <section className="cattle-container -mt-16 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {[
            { icon: TrendingUp, title: "লাইভ মার্কেট প্রাইস", desc: "রিয়েল-টাইম গরুর বাজারদর দেখুন" },
            { icon: Shield, title: "বিশ্বস্ত প্ল্যাটফর্ম", desc: "যাচাইকৃত বিক্রেতা ও গুণগত মান" },
            { icon: ShoppingBag, title: "সহজ কেনাবেচা", desc: "ঘরে বসেই গরু কিনুন ও বিক্রি করুন" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="group p-8 bg-card flex items-start gap-5 hover:bg-secondary/50 transition-all duration-500"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-border shrink-0 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1.5 text-sm tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
