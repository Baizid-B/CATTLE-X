import { useState, useRef, useEffect } from "react";
import { useCows } from "@/hooks/useCows";
import { getCowImage } from "@/lib/cowImages";
import { Download, Share2, Search, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import { toast } from "sonner";

const WEBSITE_URL = "https://example.com";

const CONTACT_INFO = {
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "+880 1XXX-XXXXXX",
  address: "ঢাকা, বাংলাদেশ",
};

const TEMPLATES = [
  { id: "classic", label: "ক্লাসিক", bg: "#000000", text: "#FFFFFF", accent: "#FFFFFF" },
  { id: "elegant", label: "এলিগ্যান্ট", bg: "#1a1a1a", text: "#f5f5f5", accent: "#d4af37" },
  { id: "clean", label: "ক্লিন", bg: "#ffffff", text: "#000000", accent: "#333333" },
];

const SocialPostTemplate = () => {
  const { data: cows } = useCows();
  const [selectedCow, setSelectedCow] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cow = cows?.find((c) => c.id === selectedCow);
  const template = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const filteredCows = cows?.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.title.toLowerCase().includes(q) || c.breed.toLowerCase().includes(q);
  });

  const generatePost = async () => {
    if (!cow) return;
    setGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = template.bg;
    ctx.fillRect(0, 0, W, H);

    // Load cow image
    const img = new Image();
    img.crossOrigin = "anonymous";
    const imgSrc = getCowImage(cow.images?.[0]);

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = imgSrc;
    });

    // Draw cow image (top portion)
    const imgH = 620;
    if (img.complete && img.naturalWidth > 0) {
      const aspect = img.naturalWidth / img.naturalHeight;
      let drawW = W;
      let drawH = W / aspect;
      if (drawH < imgH) {
        drawH = imgH;
        drawW = imgH * aspect;
      }
      const offsetX = (W - drawW) / 2;
      const offsetY = (imgH - drawH) / 2;
      ctx.save();
      ctx.rect(0, 0, W, imgH);
      ctx.clip();
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    } else {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, W, imgH);
      ctx.fillStyle = "#666";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ছবি পাওয়া যায়নি", W / 2, imgH / 2);
    }

    // Gradient overlay at bottom of image
    const grad = ctx.createLinearGradient(0, imgH - 120, 0, imgH);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, template.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, imgH - 120, W, 120);

    // (brand bar and price badge removed per user request)

    // Content area
    let y = imgH + 20;
    ctx.textAlign = "left";

    // Title
    ctx.fillStyle = template.text;
    ctx.font = "bold 42px Inter, sans-serif";
    ctx.fillText(cow.title, 40, y + 10);
    y += 56;

    // Accent line
    ctx.fillStyle = template.accent === "#FFFFFF" ? "#FFF" : template.accent;
    ctx.fillRect(40, y, 60, 3);
    y += 24;

    // Info grid
    const infoItems = [
      { label: "জাত", value: cow.breed },
      { label: "ওজন", value: `${cow.weight} কেজি` },
      { label: "বয়স", value: cow.age },
      { label: "অবস্থান", value: cow.location },
      { label: "স্বাস্থ্য", value: cow.health || "ভালো" },
      { label: "বিক্রেতা", value: cow.seller_name },
    ];

    ctx.font = "600 18px Inter, sans-serif";
    const colW = (W - 80) / 2;
    infoItems.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 40 + col * colW;
      const iy = y + row * 54;

      ctx.fillStyle = template.text + "66";
      ctx.font = "500 16px Inter, sans-serif";
      ctx.fillText(item.label, x, iy);

      ctx.fillStyle = template.text;
      ctx.font = "600 22px Inter, sans-serif";
      ctx.fillText(item.value, x, iy + 26);
    });

    y += Math.ceil(infoItems.length / 2) * 54 + 16;

    // Description (if exists, truncated)
    if (cow.description) {
      ctx.fillStyle = template.text + "AA";
      ctx.font = "400 18px Inter, sans-serif";
      const desc = cow.description.length > 120 ? cow.description.slice(0, 117) + "..." : cow.description;
      const words = desc.split(" ");
      let line = "";
      let lineY = y;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > W - 80 && line) {
          ctx.fillText(line.trim(), 40, lineY);
          line = word + " ";
          lineY += 26;
        } else {
          line = test;
        }
      }
      if (line.trim()) ctx.fillText(line.trim(), 40, lineY);
      y = lineY + 32;
    }

    // Separator
    ctx.fillStyle = template.text + "22";
    ctx.fillRect(40, y, W - 80, 1);
    y += 20;

    // Bottom section: QR + Contact
    const qrUrl = `${WEBSITE_URL}/cow/${cow.id}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: template.id === "clean" ? "#000000" : "#FFFFFF",
        light: "#00000000",
      },
    });

    const qrImg = new Image();
    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.src = qrDataUrl;
    });

    // QR code
    ctx.drawImage(qrImg, W - 180, y, 140, 140);

    // Contact info
    ctx.fillStyle = template.text;
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("যোগাযোগ", 40, y + 10);

    ctx.font = "400 16px Inter, sans-serif";
    ctx.fillStyle = template.text + "CC";
    ctx.fillText(`📞 ${CONTACT_INFO.phone}`, 40, y + 38);
    ctx.fillText(`💬 WhatsApp: ${CONTACT_INFO.whatsapp}`, 40, y + 64);
    ctx.fillText(`📍 ${CONTACT_INFO.address}`, 40, y + 90);

    ctx.font = "400 13px Inter, sans-serif";
    ctx.fillStyle = template.text + "66";
    ctx.fillText("QR কোড স্ক্যান করুন →", W - 180, y + 158);

    // Footer
    ctx.fillStyle = template.text + "22";
    ctx.fillRect(40, H - 40, W - 80, 1);
    ctx.fillStyle = template.text + "55";
    ctx.font = "400 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(WEBSITE_URL, W / 2, H - 14);

    // Generate preview
    setPreviewUrl(canvas.toDataURL("image/png"));
    setGenerating(false);
    toast.success("পোস্ট তৈরি হয়েছে!");
  };

  const handleDownload = () => {
    if (!previewUrl || !cow) return;
    const link = document.createElement("a");
    link.download = `cattlex-${cow.title.replace(/\s+/g, "-")}.png`;
    link.href = previewUrl;
    link.click();
    toast.success("ডাউনলোড শুরু হয়েছে");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Share2 size={20} />
        <h2 className="text-xl font-bold">সোশ্যাল মিডিয়া পোস্ট</h2>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">
        গরু নির্বাচন করুন, টেমপ্লেট বেছে নিন, এবং পোস্ট ডাউনলোড করে Facebook/সোশ্যাল মিডিয়ায় পোস্ট করুন।
      </p>

      {/* Step 1: Select cow */}
      <div className="border border-border p-5">
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">১. গরু নির্বাচন করুন</h3>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="নাম বা জাত দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 p-2 border border-border bg-background text-sm focus:ring-1 focus:ring-foreground transition-shadow"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto">
          {filteredCows?.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCow(c.id)}
              className={`text-left border p-2 transition-all ${
                selectedCow === c.id
                  ? "border-foreground bg-secondary/50 shadow-md"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <img
                src={getCowImage(c.images?.[0])}
                alt={c.title}
                className="w-full h-20 object-cover mb-1.5"
              />
              <p className="text-xs font-medium truncate">{c.title}</p>
              <p className="text-[10px] text-muted-foreground">
                ৳{Number(c.price).toLocaleString()} · {c.breed}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 2: Choose template */}
      <div className="border border-border p-5">
        <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">২. টেমপ্লেট নির্বাচন</h3>
        <div className="flex gap-3">
          {TEMPLATES.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border transition-all ${
                selectedTemplate === t.id
                  ? "border-foreground font-semibold shadow-md"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div
                className="w-5 h-5 border border-border"
                style={{ background: t.bg }}
              />
              <span className="text-xs tracking-wider uppercase">{t.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 3: Generate */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePost}
          disabled={!selectedCow || generating}
          className="cattle-btn-primary gap-2 disabled:opacity-40"
        >
          <Eye size={16} />
          {generating ? "তৈরি হচ্ছে..." : "প্রিভিউ তৈরি করুন"}
        </motion.button>
        {previewUrl && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="cattle-btn-outline gap-2"
          >
            <Download size={16} /> ডাউনলোড করুন
          </motion.button>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border border-border p-4"
          >
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-3">প্রিভিউ</h3>
            <img
              src={previewUrl}
              alt="Social post preview"
              className="w-full max-w-[400px] mx-auto border border-border shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialPostTemplate;
