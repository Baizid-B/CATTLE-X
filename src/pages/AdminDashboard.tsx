import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import AIPriceSuggestion from "@/components/AIPriceSuggestion";
import { BarChart3, Plus, Trash2, Star, TrendingUp, Package, Loader2, Zap, Megaphone, ImageIcon, Pencil, Search, Users, Shield, UserCheck, CheckSquare, Square, Share2, MessageSquare } from "lucide-react";
import AnnouncementManager from "@/components/admin/AnnouncementManager";
import CowImageUpload from "@/components/admin/CowImageUpload";
import { getCowImage } from "@/lib/cowImages";
import { toast } from "sonner";
import SocialPostTemplate from "@/components/admin/SocialPostTemplate";
import TestimonialManager from "@/components/admin/TestimonialManager";
import { motion, AnimatePresence } from "framer-motion";
import { useCows, usePriceIndex, type Cow, type PriceData } from "@/hooks/useCows";
import { api } from "@/services/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

type CowFormValues = {
  title: string;
  breed: string;
  weight: string;
  age: string;
  price: string;
  location: string;
  seller_name: string;
  health: string;
  description: string;
  featured: boolean;
  verified: boolean;
};

type AdminUser = {
  id: string;
  user_id: string;
  display_name?: string | null;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  roles: string[];
};

const AdminDashboard = () => {
  const { user, isAdmin, isManager, loading } = useAuth();
  const { data: cows, isLoading: cowsLoading, deleteCow, updateCow, addCow, toggleFeatured } = useCows();
  const { data: priceData, smartPrice, smartResult: smartPriceResult, isSmartPricing, addPrice } = usePriceIndex();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"overview" | "listings" | "price" | "popups" | "users" | "social" | "testimonials">("overview");
  const [editingCow, setEditingCow] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CowFormValues>({
    title: "",
    breed: "",
    weight: "",
    age: "",
    price: "",
    location: "",
    seller_name: "",
    health: "",
    description: "",
    featured: false,
    verified: false,
  });
  const [editingImages, setEditingImages] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [priceMode, setPriceMode] = useState<"manual" | "smart">("manual");
  const [newPrice, setNewPrice] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBreed, setFilterBreed] = useState("");
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedCows, setSelectedCows] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const [form, setForm] = useState<CowFormValues>({
    title: "", breed: "", weight: "", age: "", price: "", location: "",
    seller_name: "", health: "ভালো", description: "", featured: false, verified: false,
  });

  // Fetch users from API instead of Supabase
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const users = await api.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("ইউজার লোড করতে ব্যর্থ");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && tab === "users") {
      fetchUsers();
    }
  }, [isAdmin, tab]);

  const handleAddRole = async (userId: string, role: string) => {
    try {
      await api.addUserRole(userId, role);
      toast.success(`${getRoleLabel(role)} রোল যোগ করা হয়েছে`);
      fetchUsers();
    } catch (error) {
      toast.error("রোল যোগ করতে ব্যর্থ");
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    if (role === "user") {
      toast.error("'ইউজার' রোল মুছা যায় না");
      return;
    }
    try {
      await api.removeUserRole(userId, role);
      toast.success(`${getRoleLabel(role)} রোল মুছে ফেলা হয়েছে`);
      fetchUsers();
    } catch (error) {
      toast.error("রোল মুছতে ব্যর্থ");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" size={32} />
    </div>
  );
  if (!user || (!isAdmin && !isManager)) return <Navigate to="/" replace />;

  const latestPrice = priceData?.[priceData.length - 1];

  const handleAddCow = async () => {
    if (!form.title || !form.breed || !form.weight || !form.price || !form.location || !form.seller_name) {
      toast.error("সব প্রয়োজনীয় ফিল্ড পূরণ করুন");
      return;
    }
    
    const cowData = {
      title: form.title,
      breed: form.breed,
      weight: Number(form.weight),
      age: form.age,
      price: Number(form.price),
      location: form.location,
      seller_name: form.seller_name,
      health: form.health,
      description: form.description,
      featured: form.featured,
      verified: form.verified,
      images: formImages.length > 0 ? formImages : ["/placeholder.svg"],
    };
    
    addCow(cowData, {
      onSuccess: () => {
        toast.success("গরু যোগ করা হয়েছে");
        setShowAddForm(false);
        setForm({ title: "", breed: "", weight: "", age: "", price: "", location: "", seller_name: "", health: "ভালো", description: "", featured: false, verified: false });
        setFormImages([]);
      },
      onError: () => {
        toast.error("যোগ করতে ব্যর্থ");
      }
    });
  };

  const handleDeleteCow = async (id: string) => {
    if (confirm("গরুটি মুছে ফেলতে চান?")) {
      deleteCow(id, {
        onSuccess: () => toast.success("মুছে ফেলা হয়েছে"),
        onError: () => toast.error("মুছতে ব্যর্থ")
      });
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    toggleFeatured({ id, featured: !current }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cows"] }),
      onError: () => toast.error("আপডেট ব্যর্থ")
    });
  };

  const handleStartEdit = (cow: Cow) => {
    setEditingCow(cow.id);
    setEditForm({
      title: cow.title,
      breed: cow.breed,
      weight: String(cow.weight),
      age: cow.age,
      price: String(cow.price),
      location: cow.location,
      seller_name: cow.seller_name,
      health: cow.health || "",
      description: cow.description || "",
      featured: !!cow.featured,
      verified: !!cow.verified,
    });
  };

  const handleSaveEdit = async (id: string) => {
    const updateData = {
      title: editForm.title,
      breed: editForm.breed,
      weight: Number(editForm.weight),
      age: editForm.age,
      price: Number(editForm.price),
      location: editForm.location,
      seller_name: editForm.seller_name,
      health: editForm.health,
      description: editForm.description,
      featured: editForm.featured,
      verified: editForm.verified,
    };
    
    updateCow({ id, data: updateData }, {
      onSuccess: () => {
        toast.success("তথ্য আপডেট হয়েছে");
        setEditingCow(null);
      },
      onError: () => toast.error("আপডেট ব্যর্থ")
    });
  };

  const handleSaveImages = async (id: string) => {
    updateCow({ id, data: { images: editImages } }, {
      onSuccess: () => {
        toast.success("ছবি আপডেট হয়েছে");
        setEditingImages(null);
      },
      onError: () => toast.error("ছবি আপডেট ব্যর্থ")
    });
  };

  const handleSetPrice = async () => {
    if (!newPrice) return;
    const prev = latestPrice ? Number(latestPrice.price) : 0;
    const change = prev ? ((Number(newPrice) - prev) / prev * 100) : 0;
    
    addPrice({
      price: Number(newPrice),
      change_percent: Math.round(change * 10) / 10,
      mode: "manual"
    }, {
      onSuccess: () => {
        toast.success("মূল্য আপডেট হয়েছে");
        setNewPrice("");
      },
      onError: () => toast.error("মূল্য সেট করতে ব্যর্থ")
    });
  };

  const handleSmartPriceUpdate = async () => {
    smartPrice(undefined, {
      onSuccess: () => toast.success("স্মার্ট মূল্য আপডেট হয়েছে"),
      onError: () => toast.error("স্মার্ট মূল্য আপডেট ব্যর্থ")
    });
  };

  // Bulk actions
  const filteredCows = cows?.filter(cow => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || cow.title.toLowerCase().includes(q) || cow.breed.toLowerCase().includes(q) || cow.location.toLowerCase().includes(q) || cow.seller_name.toLowerCase().includes(q);
    const matchesBreed = !filterBreed || cow.breed === filterBreed;
    return matchesSearch && matchesBreed;
  }) || [];

  const toggleSelect = (id: string) => {
    setSelectedCows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCows.size === filteredCows.length) {
      setSelectedCows(new Set());
    } else {
      setSelectedCows(new Set(filteredCows.map(c => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCows.size === 0) return;
    if (!confirm(`${selectedCows.size}টি গরু মুছে ফেলতে চান?`)) return;
    setBulkLoading(true);
    const ids = Array.from(selectedCows);
    
    for (const id of ids) {
      await deleteCow(id);
    }
    
    toast.success(`${ids.length}টি গরু মুছে ফেলা হয়েছে`);
    setSelectedCows(new Set());
    setBulkLoading(false);
    queryClient.invalidateQueries({ queryKey: ["cows"] });
  };

  const handleBulkFeatured = async (featured: boolean) => {
    if (selectedCows.size === 0) return;
    setBulkLoading(true);
    const ids = Array.from(selectedCows);
    
    for (const id of ids) {
      await toggleFeatured({ id, featured });
    }
    
    toast.success(`${ids.length}টি গরু ${featured ? "ফিচার্ড" : "আনফিচার্ড"} করা হয়েছে`);
    setSelectedCows(new Set());
    setBulkLoading(false);
    queryClient.invalidateQueries({ queryKey: ["cows"] });
  };

  const tabs: { key: typeof tab; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
    { key: "overview", label: "ওভারভিউ", icon: BarChart3 },
    { key: "listings", label: "তালিকা", icon: Package },
    { key: "price", label: "মূল্য নিয়ন্ত্রণ", icon: TrendingUp },
    { key: "testimonials", label: "প্রশংসাপত্র", icon: MessageSquare },
    { key: "popups", label: "পপ-আপ", icon: Megaphone },
    { key: "users", label: "ইউজার", icon: Users, adminOnly: true },
    { key: "social", label: "সোশ্যাল পোস্ট", icon: Share2, adminOnly: true },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  const getRoleBadge = (role: string): string => {
    switch (role) {
      case "admin": return "bg-foreground text-background";
      case "manager": return "bg-muted-foreground text-background";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case "admin": return "অ্যাডমিন";
      case "manager": return "ম্যানেজার";
      default: return "ইউজার";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="cattle-container cattle-section">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center">
                {isAdmin ? <Shield size={20} /> : <UserCheck size={20} />}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {isAdmin ? "অ্যাডমিন ড্যাশবোর্ড" : "ম্যানেজার ড্যাশবোর্ড"}
                </h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-1 border-b border-border mb-8 mt-6 overflow-x-auto">
            {visibleTabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-xs tracking-wider uppercase border-b-2 transition-all whitespace-nowrap ${
                  tab === t.key
                    ? "border-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "মোট তালিকা", value: cows?.length ?? 0, icon: Package, sub: "সক্রিয় লিস্টিং" },
                    { label: "ফিচার্ড", value: cows?.filter(c => c.featured).length ?? 0, icon: Star, sub: "হাইলাইটেড" },
                    { label: "বর্তমান মূল্য", value: `৳${latestPrice ? Number(latestPrice.price) : "—"}/কেজি`, icon: TrendingUp, sub: latestPrice ? `${Number(latestPrice.change_percent) >= 0 ? "+" : ""}${Number(latestPrice.change_percent)}%` : "" },
                  ].map((stat, i) => (
                    <motion.div key={stat.label} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                      className="group border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs tracking-wider uppercase text-muted-foreground">{stat.label}</p>
                        <div className="w-8 h-8 bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                          <stat.icon size={14} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
                    </motion.div>
                  ))}
                </div>
                <motion.div custom={3} variants={fadeIn} initial="hidden" animate="visible">
                  <AIPriceSuggestion />
                </motion.div>
              </motion.div>
            )}

            {tab === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(!showAddForm)} className="cattle-btn-primary gap-2">
                    <Plus size={16} /> নতুন গরু যোগ করুন
                  </motion.button>
                  <div className="flex-1 flex gap-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="নাম, জাত, অবস্থান দিয়ে খুঁজুন..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 p-2 border border-border bg-background text-sm focus:ring-1 focus:ring-foreground transition-shadow" />
                    </div>
                    <select value={filterBreed} onChange={(e) => setFilterBreed(e.target.value)}
                      className="p-2 border border-border bg-background text-sm min-w-[120px]">
                      <option value="">সব জাত</option>
                      {[...new Set(cows?.map(c => c.breed))].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                  {selectedCows.size > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-3 mb-4 border border-foreground bg-secondary">
                        <span className="text-sm font-medium">{selectedCows.size}টি নির্বাচিত</span>
                        <div className="flex-1" />
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleBulkFeatured(true)} disabled={bulkLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase border border-border hover:bg-foreground hover:text-background transition-colors">
                          <Star size={12} /> ফিচার্ড করুন
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleBulkFeatured(false)} disabled={bulkLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase border border-border hover:bg-foreground hover:text-background transition-colors">
                          <Star size={12} /> আনফিচার্ড
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={handleBulkDelete} disabled={bulkLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wider uppercase border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                          {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} মুছুন
                        </motion.button>
                        <button onClick={() => setSelectedCows(new Set())} className="text-xs text-muted-foreground hover:text-foreground">
                          বাতিল
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border border-border p-6 mb-8 overflow-hidden">
                      <h3 className="font-semibold mb-4">নতুন তালিকা</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {[
                          { key: "title", label: "শিরোনাম", type: "text" },
                          { key: "breed", label: "জাত", type: "text" },
                          { key: "weight", label: "ওজন (কেজি)", type: "number" },
                          { key: "age", label: "বয়স", type: "text" },
                          { key: "price", label: "মূল্য (৳)", type: "number" },
                          { key: "location", label: "অবস্থান", type: "text" },
                          { key: "seller_name", label: "বিক্রেতার নাম", type: "text" },
                          { key: "health", label: "স্বাস্থ্য", type: "text" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">{f.label}</label>
                            <input type={f.type} value={(form as any)[f.key]}
                              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                              className="w-full p-2 border border-border bg-background text-sm focus:ring-1 focus:ring-foreground transition-shadow" />
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">বিবরণ</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                          className="w-full p-2 border border-border bg-background text-sm h-20 focus:ring-1 focus:ring-foreground transition-shadow" />
                      </div>
                      <div className="mb-4">
                        <CowImageUpload images={formImages} onImagesChange={setFormImages} />
                      </div>
                      <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> ফিচার্ড
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> যাচাইকৃত
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleAddCow} className="cattle-btn-primary">সংরক্ষণ করুন</button>
                        <button onClick={() => setShowAddForm(false)} className="cattle-btn-outline">বাতিল</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Select all header */}
                <div className="flex items-center gap-3 p-3 border border-border mb-px bg-secondary/30">
                  <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {selectedCows.size === filteredCows.length && filteredCows.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                    সব নির্বাচন ({filteredCows.length})
                  </button>
                </div>

                <div className="space-y-px">
                  {filteredCows.map((cow, i) => (
                    <motion.div key={cow.id} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                      className={`border border-border hover:shadow-md transition-all duration-300 ${selectedCows.has(cow.id) ? "bg-secondary/40 border-foreground/30" : ""}`}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 flex-1">
                          <button onClick={() => toggleSelect(cow.id)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                            {selectedCows.has(cow.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>
                          <img src={getCowImage(cow.images?.[0])} alt={cow.title} className="w-14 h-14 object-cover border border-border" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{cow.title}</h3>
                              {cow.featured && <Star size={14} className="fill-foreground" />}
                              {cow.verified && <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 bg-foreground text-background">যাচাই</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">{cow.breed} · {cow.weight}কেজি · ৳{Number(cow.price).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{cow.location} · {cow.seller_name}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {[
                            { icon: Pencil, onClick: () => editingCow === cow.id ? setEditingCow(null) : handleStartEdit(cow), active: editingCow === cow.id },
                            { icon: ImageIcon, onClick: () => { if (editingImages === cow.id) { setEditingImages(null); } else { setEditingImages(cow.id); setEditImages(cow.images?.filter(img => img.startsWith("http")) || []); } }, active: editingImages === cow.id },
                            { icon: Star, onClick: () => handleToggleFeatured(cow.id, !!cow.featured), active: !!cow.featured },
                            { icon: Trash2, onClick: () => handleDeleteCow(cow.id), active: false },
                          ].map((btn, idx) => (
                            <motion.button key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={btn.onClick}
                              className={`p-2 border border-border transition-colors ${btn.active ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                              <btn.icon size={14} />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {editingCow === cow.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="p-4 border-t border-border bg-secondary/20 overflow-hidden">
                            <h4 className="font-semibold mb-3 text-sm">তথ্য সম্পাদনা</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              {[
                                { key: "title", label: "শিরোনাম", type: "text" },
                                { key: "breed", label: "জাত", type: "text" },
                                { key: "weight", label: "ওজন (কেজি)", type: "number" },
                                { key: "age", label: "বয়স", type: "text" },
                                { key: "price", label: "মূল্য (৳)", type: "number" },
                                { key: "location", label: "অবস্থান", type: "text" },
                                { key: "seller_name", label: "বিক্রেতার নাম", type: "text" },
                                { key: "health", label: "স্বাস্থ্য", type: "text" },
                              ].map((f) => (
                                <div key={f.key}>
                                  <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">{f.label}</label>
                                  <input type={f.type} value={editForm[f.key as keyof CowFormValues] || ""}
                                    onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                    className="w-full p-2 border border-border bg-background text-sm" />
                                </div>
                              ))}
                            </div>
                            <div className="mb-3">
                              <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-1">বিবরণ</label>
                              <textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full p-2 border border-border bg-background text-sm h-20" />
                            </div>
                            <div className="flex gap-4 mb-3">
                              <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} /> ফিচার্ড
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={editForm.verified} onChange={(e) => setEditForm({ ...editForm, verified: e.target.checked })} /> যাচাইকৃত
                              </label>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => handleSaveEdit(cow.id)} className="cattle-btn-primary text-sm">সংরক্ষণ করুন</button>
                              <button onClick={() => setEditingCow(null)} className="cattle-btn-outline text-sm">বাতিল</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {editingImages === cow.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="p-4 border-t border-border bg-secondary/20 overflow-hidden">
                            <CowImageUpload images={editImages} onImagesChange={setEditImages} />
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => handleSaveImages(cow.id)} className="cattle-btn-primary text-sm">ছবি সংরক্ষণ</button>
                              <button onClick={() => setEditingImages(null)} className="cattle-btn-outline text-sm">বাতিল</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "price" && (
              <motion.div key="price" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex gap-3 mb-8">
                  {[
                    { key: "manual" as const, label: "ম্যানুয়াল মোড" },
                    { key: "smart" as const, label: "স্মার্ট মোড 🔥" },
                  ].map(m => (
                    <motion.button key={m.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setPriceMode(m.key)}
                      className={`cattle-badge cursor-pointer transition-all ${priceMode === m.key ? "bg-foreground text-background" : ""}`}>
                      {m.label}
                    </motion.button>
                  ))}
                </div>

                {priceMode === "manual" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="border border-border p-6 mb-8">
                    <h3 className="font-semibold mb-4">ম্যানুয়াল মূল্য সেট করুন</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      বর্তমান মূল্য: ৳{latestPrice ? Number(latestPrice.price) : "—"}/কেজি
                    </p>
                    <div className="flex gap-3">
                      <input type="number" placeholder="নতুন মূল্য (৳/কেজি)" value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="p-2 border border-border bg-background text-sm flex-1 focus:ring-1 focus:ring-foreground transition-shadow" />
                      <button onClick={handleSetPrice} className="cattle-btn-primary">সেট করুন</button>
                    </div>
                  </motion.div>
                )}

                {priceMode === "smart" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="border border-border p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={18} />
                      <h3 className="font-semibold">স্মার্ট মোড (AI-পাওয়ার্ড)</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      সময়ভিত্তিক পরিবর্তন, এলোমেলো তারতম্য, এবং মৌসুমী প্রবণতা (ঈদ ইফেক্ট) এর উপর ভিত্তি করে স্বয়ংক্রিয় মূল্য ওঠানামা।
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
                      {[
                        { emoji: "⏰", title: "সময়ভিত্তিক", desc: "সকাল: ↑ বৃদ্ধি | বিকেল: ↓ হ্রাস" },
                        { emoji: "🎲", title: "এলোমেলো তারতম্য", desc: "±২% দৈনিক ওঠানামা" },
                        { emoji: "🕌", title: "ঈদ ইফেক্ট", desc: "ঈদের আগে ২৫-৪০% বৃদ্ধি" },
                      ].map((card, i) => (
                        <motion.div key={card.title} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                          className="p-4 border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                          <p className="text-xs text-muted-foreground mb-1">{card.emoji} {card.title}</p>
                          <p className="font-medium">{card.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSmartPriceUpdate} disabled={isSmartPricing} className="cattle-btn-primary gap-2">
                      {isSmartPricing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      {isSmartPricing ? "আপডেট হচ্ছে..." : "স্মার্ট মূল্য আপডেট করুন"}
                    </motion.button>

                    <AnimatePresence>
                      {smartPriceResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-6 p-4 border border-border bg-secondary/30">
                          <div className="flex items-end gap-4 mb-2">
                            <p className="text-3xl font-bold">৳{smartPriceResult.newPrice}/কেজি</p>
                            <p className={`text-sm ${smartPriceResult.changePercent >= 0 ? "cattle-price-up" : "cattle-price-down"}`}>
                              {smartPriceResult.changePercent >= 0 ? "+" : ""}{smartPriceResult.changePercent}%
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>সময়ভিত্তিক: {smartPriceResult.factors?.timeBasedChange && smartPriceResult.factors.timeBasedChange > 0 ? "+" : ""}{smartPriceResult.factors?.timeBasedChange}</p>
                            <p>এলোমেলো: {smartPriceResult.factors?.randomVariation && smartPriceResult.factors.randomVariation > 0 ? "+" : ""}{smartPriceResult.factors?.randomVariation}</p>
                            <p>ঈদ ইফেক্ট: {smartPriceResult.factors?.eidEffect}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                <AIPriceSuggestion />

                <h3 className="font-semibold mb-4 mt-8">মূল্য ইতিহাস</h3>
                <div className="space-y-2">
                  {priceData?.slice().reverse().slice(0, 20).map((p, i) => (
                    <motion.div key={p.id} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                      className="flex items-center justify-between p-3 border border-border hover:bg-secondary/30 transition-colors">
                      <span className="text-sm">{new Date(p.date).toLocaleDateString("bn-BD")}</span>
                      <span className="font-medium">৳{Number(p.price)}/কেজি</span>
                      <span className="text-xs cattle-badge">{p.mode || "manual"}</span>
                      <span className={`text-sm ${Number(p.change_percent) >= 0 ? "cattle-price-up" : "cattle-price-down"}`}>
                        {Number(p.change_percent) >= 0 ? "+" : ""}{Number(p.change_percent)}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "popups" && (
              <motion.div key="popups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnnouncementManager />
              </motion.div>
            )}

            {tab === "testimonials" && (
              <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TestimonialManager />
              </motion.div>
            )}

            {tab === "social" && isAdmin && (
              <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SocialPostTemplate />
              </motion.div>
            )}

            {tab === "users" && isAdmin && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Users size={20} />
                  <h2 className="text-xl font-bold">সকল ইউজার ও রোল</h2>
                  <span className="text-xs tracking-wider uppercase px-2 py-0.5 bg-foreground text-background">
                    {allUsers.length} জন
                  </span>
                </div>

                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-muted-foreground" size={24} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allUsers.map((u, i) => (
                      <motion.div key={u.id} custom={i} variants={fadeIn} initial="hidden" animate="visible"
                        className="border border-border p-4 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="w-10 h-10 object-cover border border-border" />
                            ) : (
                              <div className="w-10 h-10 bg-secondary flex items-center justify-center text-sm font-bold">
                                {(u.display_name || u.email || "?")[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{u.display_name || "নাম নেই"}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                              <p className="text-[10px] text-muted-foreground">
                                যোগদান: {new Date(u.created_at).toLocaleDateString("bn-BD")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5 flex-wrap justify-end">
                              {u.roles.map((role: string) => (
                                <span key={role} className={`text-[10px] tracking-wider uppercase px-2 py-0.5 inline-flex items-center gap-1 ${getRoleBadge(role)}`}>
                                  {getRoleLabel(role)}
                                  {role !== "user" && (
                                    <button onClick={() => handleRemoveRole(u.user_id, role)}
                                      className="hover:opacity-70 ml-0.5" title="রোল মুছুন">×</button>
                                  )}
                                </span>
                              ))}
                            </div>
                            <div className="relative">
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAddRole(u.user_id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                                className="text-xs p-1.5 border border-border bg-background cursor-pointer"
                              >
                                <option value="" disabled>+ রোল</option>
                                {["admin", "manager"].filter(r => !u.roles.includes(r)).map(r => (
                                  <option key={r} value={r}>{getRoleLabel(r)}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {allUsers.length === 0 && !usersLoading && (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        কোনো ইউজার পাওয়া যায়নি
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;





