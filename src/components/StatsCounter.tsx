import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 5000, suffix: "+", label: "গরু বিক্রি হয়েছে" },
  { value: 1200, suffix: "+", label: "যাচাইকৃত বিক্রেতা" },
  { value: 64, suffix: "", label: "জেলায় সেবা" },
  { value: 98, suffix: "%", label: "সন্তুষ্ট ক্রেতা" },
];

const AnimatedNumber = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString("bn-BD")}{suffix}
    </span>
  );
};

const StatsCounter = () => {
  const [inView, setInView] = useState(false);

  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="cattle-container py-16">
        <motion.div
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-5xl font-bold mb-2">
                {inView ? <AnimatedNumber target={stat.value} suffix={stat.suffix} /> : "০"}
              </p>
              <p className="text-xs md:text-sm tracking-wider uppercase opacity-60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
