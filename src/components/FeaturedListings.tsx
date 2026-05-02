import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useCows } from "@/hooks/useCows";
import { getCowImage } from "@/lib/cowImages";

const FeaturedListings = () => {
  const { data: cows } = useCows();
  const featured = cows?.filter((c) => c.featured) ?? [];

  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              বিশেষ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">প্রিমিয়াম তালিকা</h2>
          </div>
          <Link to="/marketplace" className="hidden sm:flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.slice(0, 3).map((cow, i) => (
            <motion.div key={cow.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={`/cow/${cow.id}`} className="block cattle-card group">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  <img src={getCowImage(cow.images?.[0])} alt={cow.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="cattle-badge text-[10px]">{cow.breed}</span>
                    {cow.verified && <CheckCircle size={14} className="text-muted-foreground" />}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{cow.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {cow.weight}কেজি · {cow.age} · {cow.location}
                  </p>
                  <p className="text-2xl font-bold">৳{Number(cow.price).toLocaleString("bn-BD")}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link to="/marketplace" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm tracking-wider uppercase text-muted-foreground">
          সব দেখুন <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedListings;
