import { motion } from "framer-motion";
import { Shield, CheckCircle, BarChart3 } from "lucide-react";

const items = [
  { icon: CheckCircle, title: "যাচাইকৃত বিক্রেতা", description: "প্রতিটি বিক্রেতা আমাদের যাচাই প্রক্রিয়ার মধ্য দিয়ে যান যাতে সত্যতা ও নির্ভরযোগ্যতা নিশ্চিত হয়।" },
  { icon: Shield, title: "গুণমান নিশ্চয়তা", description: "আমাদের প্ল্যাটফর্মে তালিকাভুক্ত প্রতিটি পশুর স্বাস্থ্য সনদ ও মান পরীক্ষা।" },
  { icon: BarChart3, title: "বাজার বুদ্ধিমত্তা", description: "রিয়েল-টাইম মূল্য তথ্য ও বাজার প্রবণতা যা আপনাকে সঠিক সিদ্ধান্ত নিতে সাহায্য করবে।" },
];

const TrustSection = () => {
  return (
    <section className="cattle-section border-t border-border bg-secondary">
      <div className="cattle-container">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">বিশ্বাস</p>
          <h2 className="text-3xl md:text-4xl font-bold">কেন Cattle X</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="p-8 bg-background border border-border">
              <item.icon size={24} strokeWidth={1.5} className="mb-6" />
              <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
