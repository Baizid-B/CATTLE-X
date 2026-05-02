import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { usePriceIndex } from "@/hooks/useCows";

type Period = "daily" | "weekly" | "monthly";

const periods: { key: Period; label: string }[] = [
  { key: "daily", label: "দৈনিক" },
  { key: "weekly", label: "সাপ্তাহিক" },
  { key: "monthly", label: "মাসিক" },
];

const PriceIndex = () => {
  const { data: priceData } = usePriceIndex();
  const [activePeriod, setActivePeriod] = useState<Period>("weekly");

  const chartData = useMemo(() => {
    if (!priceData?.length) return [];

    if (activePeriod === "daily") {
      // Last 7 days
      const slice = priceData.slice(-7);
      return slice.map((p) => ({
        date: new Date(p.date).toLocaleDateString("bn-BD", { day: "numeric", month: "short" }),
        price: Number(p.price),
      }));
    }

    if (activePeriod === "weekly") {
      // Last 30 days, group by week (take every 7th or average)
      const slice = priceData.slice(-30);
      const weeks: { date: string; price: number }[] = [];
      for (let i = 0; i < slice.length; i += 7) {
        const chunk = slice.slice(i, i + 7);
        const avg = Math.round(chunk.reduce((s, p) => s + Number(p.price), 0) / chunk.length);
        const last = chunk[chunk.length - 1];
        weeks.push({
          date: new Date(last.date).toLocaleDateString("bn-BD", { day: "numeric", month: "short" }),
          price: avg,
        });
      }
      return weeks;
    }

    // Monthly — last 90 days, group by month
    const slice = priceData.slice(-90);
    const monthMap = new Map<string, number[]>();
    for (const p of slice) {
      const key = new Date(p.date).toLocaleDateString("bn-BD", { month: "long", year: "numeric" });
      if (!monthMap.has(key)) monthMap.set(key, []);
      monthMap.get(key)!.push(Number(p.price));
    }
    return Array.from(monthMap.entries()).map(([date, prices]) => ({
      date,
      price: Math.round(prices.reduce((s, v) => s + v, 0) / prices.length),
    }));
  }, [priceData, activePeriod]);

  const latest = priceData?.[priceData.length - 1];
  const prev = priceData?.[priceData.length - 2];
  const currentPrice = latest ? Number(latest.price) : 580;
  const changePercent = latest ? Number(latest.change_percent) : 2.1;
  const change = prev ? currentPrice - Number(prev.price) : 12;
  const isUp = change >= 0;

  const { maxPrice, minPrice, avgPrice } = useMemo(() => {
    if (!chartData.length) return { maxPrice: 0, minPrice: 0, avgPrice: 0 };
    const prices = chartData.map((d) => d.price);
    return {
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      avgPrice: Math.round(prices.reduce((s, v) => s + v, 0) / prices.length),
    };
  }, [chartData]);

  return (
    <section className="cattle-section border-t border-border">
      <div className="cattle-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              বাংলাদেশ ক্যাটল ইনডেক্স
            </p>
            <span className="cattle-badge text-[10px]">লাইভ</span>
          </div>

          <div className="flex flex-wrap items-end gap-4 mb-6">
            <h2 className="text-5xl md:text-7xl font-bold tabular-nums">
              ৳{currentPrice}
            </h2>
            <div className="pb-2">
              <span className="text-sm text-muted-foreground">/কেজি</span>
            </div>
            <div className={`flex items-center gap-1 pb-2 ${isUp ? "cattle-price-up" : "cattle-price-down"}`}>
              {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              <span className="text-sm font-medium">
                {isUp ? "+" : ""}{change} ({changePercent}%)
              </span>
            </div>
          </div>

          {/* Min / Max / Avg stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 border border-border rounded-none p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <ArrowUp size={14} />
                <span className="text-[10px] tracking-[0.2em] uppercase">সর্বোচ্চ</span>
              </div>
              <p className="text-xl md:text-2xl font-bold tabular-nums">৳{maxPrice}</p>
              <p className="text-[10px] text-muted-foreground">/কেজি</p>
            </div>
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <span className="text-[10px] tracking-[0.2em] uppercase">গড়</span>
              </div>
              <p className="text-xl md:text-2xl font-bold tabular-nums">৳{avgPrice}</p>
              <p className="text-[10px] text-muted-foreground">/কেজি</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <ArrowDown size={14} />
                <span className="text-[10px] tracking-[0.2em] uppercase">সর্বনিম্ন</span>
              </div>
              <p className="text-xl md:text-2xl font-bold tabular-nums">৳{minPrice}</p>
              <p className="text-[10px] text-muted-foreground">/কেজি</p>
            </div>
          </div>

          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(0 0% 90%)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} domain={["dataMin - 20", "dataMax + 20"]} tickFormatter={(v) => `৳${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 0%)", border: "none", borderRadius: 0, color: "hsl(0 0% 100%)", fontSize: 12, padding: "8px 12px" }}
                  labelStyle={{ color: "hsl(0 0% 100%)", marginBottom: 4, fontWeight: 500 }}
                  formatter={(value: number) => [`৳${value}/কেজি`, "মূল্য"]}
                  itemStyle={{ color: "hsl(0 0% 100%)", padding: 0 }}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(0 0% 0%)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "hsl(0 0% 0%)" }} />
                {maxPrice > 0 && (
                  <ReferenceLine y={maxPrice} stroke="hsl(0 0% 70%)" strokeDasharray="4 4" label={{ value: `সর্বোচ্চ ৳${maxPrice}`, position: "right", fontSize: 10, fill: "hsl(0 0% 45%)" }} />
                )}
                {minPrice > 0 && (
                  <ReferenceLine y={minPrice} stroke="hsl(0 0% 70%)" strokeDasharray="4 4" label={{ value: `সর্বনিম্ন ৳${minPrice}`, position: "right", fontSize: 10, fill: "hsl(0 0% 45%)" }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-6 mt-6">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePeriod(p.key)}
                className={`text-xs tracking-wider uppercase pb-1 border-b-2 transition-all ${
                  activePeriod === p.key ? "border-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceIndex;
