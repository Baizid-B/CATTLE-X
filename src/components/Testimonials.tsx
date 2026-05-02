import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const Testimonials = () => {
  const { data: testimonials } = useTestimonials();
  const [current, setCurrent] = useState(0);

  const items = testimonials?.filter((t) => t.enabled) ?? [];
  const total = items.length;

  const next = useCallback(() => {
    if (total > 0) setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total > 0) setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  // Auto-slide every 5s
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  // Reset index when data changes
  useEffect(() => {
    setCurrent(0);
  }, [total]);

  if (!items.length) return null;

  const t = items[current];

  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
            প্রশংসাপত্র
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">ক্রেতাদের মতামত</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors z-10"
                aria-label="আগের"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors z-10"
                aria-label="পরের"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="p-8 md:p-12 border border-border bg-card text-center relative"
            >
              <Quote size={36} className="mx-auto mb-6 text-muted-foreground/20" />
              <div className="flex justify-center gap-0.5 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                "{t.text}"
              </p>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 transition-all ${
                    i === current ? "bg-foreground scale-125" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`স্লাইড ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
