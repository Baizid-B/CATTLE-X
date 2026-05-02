import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const breeds = [
  { name: "শাহিওয়াল", emoji: "🐂", desc: "উচ্চ দুধ উৎপাদনকারী" },
  { name: "ব্রাহমান", emoji: "🐃", desc: "বড় আকৃতি ও শক্তিশালী" },
  { name: "ফ্রিজিয়ান ক্রস", emoji: "🐄", desc: "দুধ ও মাংস উভয়ের জন্য" },
  { name: "রেড সিন্ধি", emoji: "🐂", desc: "গরম আবহাওয়ায় উপযুক্ত" },
  { name: "দেশি", emoji: "🐄", desc: "স্থানীয় জাত, সহজলভ্য" },
  { name: "জার্সি ক্রস", emoji: "🐮", desc: "দুধ উৎপাদনে দক্ষ" },
];

const BrowseByBreed = () => {
  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
            ক্যাটাগরি
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">জাত অনুযায়ী খুঁজুন</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {breeds.map((breed, i) => (
            <motion.div
              key={breed.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/marketplace?breed=${encodeURIComponent(breed.name)}`}
                className="block p-5 border border-border hover:border-foreground/30 transition-all group text-center"
              >
                <span className="text-3xl block mb-3">{breed.emoji}</span>
                <h3 className="font-semibold text-sm mb-1">{breed.name}</h3>
                <p className="text-xs text-muted-foreground">{breed.desc}</p>
                <ArrowRight size={14} className="mx-auto mt-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByBreed;
