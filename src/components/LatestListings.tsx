import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import CowCard from "@/components/CowCard";
import { useCows } from "@/hooks/useCows";

const LatestListings = () => {
  const { data: cows } = useCows();

  const latest = [...(cows || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  if (!latest.length) return null;

  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2 flex items-center gap-2">
              <Clock size={12} /> সর্বশেষ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">নতুন তালিকা</h2>
          </div>
          <Link
            to="/marketplace"
            className="hidden sm:flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((cow, i) => (
            <motion.div
              key={cow.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <CowCard cow={cow} />
            </motion.div>
          ))}
        </div>

        <Link
          to="/marketplace"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm tracking-wider uppercase text-muted-foreground"
        >
          সব দেখুন <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default LatestListings;
