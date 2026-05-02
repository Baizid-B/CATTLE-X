import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CowCard from "@/components/CowCard";
import { useCows } from "@/hooks/useCows";
import { SlidersHorizontal, X, Search } from "lucide-react";

const breeds = ["সব", "শাহিওয়াল", "রেড সিন্ধি", "ফ্রিজিয়ান ক্রস", "ব্রাহমান", "দেশি", "জার্সি ক্রস"];
const locationsList = ["সব", "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "সিলেট", "খুলনা", "ময়মনসিংহ", "বগুড়া"];
const sortOptions = [
  { value: "newest", label: "নতুন আগে" },
  { value: "price-low", label: "কম দাম আগে" },
  { value: "price-high", label: "বেশি দাম আগে" },
  { value: "weight-high", label: "বেশি ওজন আগে" },
];

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const { data: cows, isLoading } = useCows();

  const initialBreed = searchParams.get("breed") || "সব";
  const initialSearch = searchParams.get("search") || "";

  const [breed, setBreed] = useState(initialBreed);
  const [location, setLocation] = useState("সব");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [showFilters, setShowFilters] = useState(!!searchParams.get("breed"));
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    if (!cows) return [];
    let result = cows.filter((cow) => {
      if (breed !== "সব" && cow.breed !== breed) return false;
      if (location !== "সব" && cow.location !== location) return false;
      if (Number(cow.price) > maxPrice) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          cow.title.toLowerCase().includes(q) ||
          cow.breed.toLowerCase().includes(q) ||
          cow.location.toLowerCase().includes(q) ||
          cow.seller_name.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "weight-high":
        result.sort((a, b) => b.weight - a.weight);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [cows, breed, location, maxPrice, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="cattle-container cattle-section">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">ব্রাউজ</p>
              <h1 className="text-3xl md:text-5xl font-bold">মার্কেটপ্লেস</h1>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground">
              {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />} ফিল্টার
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, জাত বা অবস্থান দিয়ে খুঁজুন..."
              className="w-full pl-12 pr-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
            />
          </div>

          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-12 p-6 border border-border overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">জাত</label>
                  <select value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full p-2 border border-border bg-background text-sm">
                    {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">অবস্থান</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border border-border bg-background text-sm">
                    {locationsList.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">সর্বোচ্চ মূল্য: ৳{maxPrice.toLocaleString("bn-BD")}</label>
                  <input type="range" min={0} max={500000} step={10000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-foreground" />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">
              {filtered.length}টি তালিকা
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-border bg-background text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">লোড হচ্ছে...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((cow, i) => (
                <motion.div key={cow.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <CowCard cow={cow} />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20"><p className="text-muted-foreground">আপনার ফিল্টারের সাথে কোনো তালিকা মেলেনি।</p></div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
