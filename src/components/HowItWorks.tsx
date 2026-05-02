import { motion } from "framer-motion";
import { Search, MessageSquare, Handshake } from "lucide-react";

const steps = [
  { icon: Search, title: "ব্রাউজ করুন", description: "বিস্তারিত তথ্য ও রিয়েল-টাইম মূল্যসহ যাচাইকৃত গবাদিপশু তালিকা দেখুন।" },
  { icon: MessageSquare, title: "বিক্রেতার সাথে যোগাযোগ", description: "আমাদের নিরাপদ প্ল্যাটফর্মের মাধ্যমে সরাসরি যাচাইকৃত বিক্রেতাদের সাথে যোগাযোগ করুন।" },
  { icon: Handshake, title: "চুক্তি সম্পন্ন করুন", description: "আত্মবিশ্বাসের সাথে আলোচনা, চূড়ান্তকরণ এবং লেনদেন সম্পন্ন করুন।" },
];

const HowItWorks = () => {
  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">প্রক্রিয়া</p>
          <h2 className="text-3xl md:text-4xl font-bold">কিভাবে কাজ করে</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 border border-border mb-6">
                <step.icon size={22} strokeWidth={1.5} />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">ধাপ {i + 1}</p>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
