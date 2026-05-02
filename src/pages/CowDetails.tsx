import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, MapPin, Heart, MessageCircle, Share2, Weight, Calendar, Stethoscope, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CowCard from "@/components/CowCard";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { getCowImage } from "@/lib/cowImages";
import { toast } from "sonner";
import { cows as mockCows } from "@/data/mockData";

const CowDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);

  const cow = mockCows.find((c) => c.id === id);
  const relatedCows = cow ? mockCows.filter((c) => c.breed === cow.breed && c.id !== cow.id).slice(0, 3) : [];

  const handleShare = async () => {
    const url = window.location.href;
    const text = `"${cow?.title}" - ৳${Number(cow?.price).toLocaleString("bn-BD")} | Cattle X`;
    if (navigator.share) {
      await navigator.share({ title: cow?.title, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("লিংক কপি হয়েছে!");
    }
  };

  const images = (cow as any)?.images?.length ? (cow as any).images : [null];

  if (!cow) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center cattle-container">
          <h1 className="text-2xl font-bold mb-4">তালিকা পাওয়া যায়নি</h1>
          <Link to="/marketplace" className="cattle-btn-outline">মার্কেটপ্লেসে ফিরুন</Link>
        </div>
      </div>
    );
  }

  const details = [
    { icon: Weight, label: "ওজন", value: `${cow.weight} কেজি` },
    { icon: Calendar, label: "বয়স", value: cow.age },
    { icon: Stethoscope, label: "স্বাস্থ্য", value: cow.health },
    { icon: MapPin, label: "অবস্থান", value: cow.location },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="cattle-container cattle-section">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={16} /> মার্কেটপ্লেসে ফিরুন
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-secondary border border-border overflow-hidden relative group">
                <img src={getCowImage(images[activeImage])} alt={cow.title} className="w-full h-full object-cover" width={800} height={600} />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_: unknown, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? "bg-foreground w-6" : "bg-foreground/40"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img: string | null, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 border overflow-hidden transition-all ${i === activeImage ? "border-foreground" : "border-border opacity-60 hover:opacity-100"}`}
                    >
                      <img src={getCowImage(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="cattle-badge text-[10px]">{cow.breed}</span>
                {cow.verified && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle size={12} /> যাচাইকৃত
                  </span>
                )}
                {cow.featured && (
                  <span className="cattle-badge text-[10px] bg-primary text-primary-foreground border-primary">প্রিমিয়াম</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">{cow.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <MapPin size={14} /> {cow.location}
              </div>

              <p className="text-4xl font-bold mb-2">৳{Number(cow.price).toLocaleString("bn-BD")}</p>
              <p className="text-xs text-muted-foreground mb-8">
                ৳{Math.round(Number(cow.price) / cow.weight).toLocaleString("bn-BD")}/কেজি
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {details.map((d) => (
                  <div key={d.label} className="p-4 border border-border bg-secondary/50">
                    <div className="flex items-center gap-2 mb-1">
                      <d.icon size={14} className="text-muted-foreground" />
                      <p className="text-xs tracking-wider uppercase text-muted-foreground">{d.label}</p>
                    </div>
                    <p className="text-sm font-semibold">{d.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border border-border mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground mb-0.5">বিক্রেতা</p>
                  <p className="font-semibold">{cow.seller}</p>
                  <p className="text-xs text-muted-foreground">{cow.location}</p>
                </div>
                {cow.verified && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground border border-border px-2 py-1">
                    <CheckCircle size={12} /> যাচাইকৃত
                  </span>
                )}
              </div>

              {cow.description && (
                <div className="mb-8">
                  <h3 className="text-xs tracking-wider uppercase text-muted-foreground mb-2">বিবরণ</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cow.description}</p>
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href="https://wa.me/qr/CE3STEG5DN35B1"
                  target="_blank" rel="noopener noreferrer"
                  className="cattle-btn-primary flex-1 gap-2"
                >
                  <MessageCircle size={18} /> WhatsApp-এ যোগাযোগ
                </a>
                <button onClick={handleShare} className="cattle-btn-outline px-4" title="শেয়ার করুন">
                  <Share2 size={18} />
                </button>
                {user && (
                  <button onClick={() => toggleFavorite(cow.id)} className="cattle-btn-outline px-4">
                    <Heart size={18} className={isFavorite(cow.id) ? "fill-foreground" : ""} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {relatedCows && relatedCows.length > 0 && (
            <div className="mt-20">
              <div className="mb-8">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">সম্পর্কিত</p>
                <h2 className="text-2xl md:text-3xl font-bold">একই জাতের আরও গরু</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCows.map((rc) => (
                  <CowCard key={rc.id} cow={rc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CowDetails;
