import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, TrendingUp } from "lucide-react";
import { usePriceIndex } from "@/hooks/useCows";

const AIPriceSuggestion = () => {
  const [weight, setWeight] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [suggestion, setSuggestion] = useState<null | { min: number; max: number; avg: number }>(null);
  const [loading, setLoading] = useState(false);
  const { data: priceIndex } = usePriceIndex();

  const latestPrice = priceIndex && priceIndex.length > 0 ? priceIndex[priceIndex.length - 1].price : 580;

  const handleSuggest = async () => {
    if (!weight || !breed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const w = Number(weight);
    const base = latestPrice * w;
    const breedMultiplier: Record<string, number> = {
      "Shahiwal": 1.15,
      "Red Sindhi": 1.05,
      "Friesian Cross": 1.25,
      "Brahman": 1.1,
      "Deshi": 0.95,
      "Jersey Cross": 1.08,
    };
    const mult = breedMultiplier[breed] || 1;
    const avg = Math.round(base * mult);
    setSuggestion({ min: Math.round(avg * 0.9), max: Math.round(avg * 1.1), avg });
    setLoading(false);
  };

  return (
    <div className="p-6 border border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} />
        <h3 className="font-semibold">AI মূল্য পরামর্শ</h3>
      </div>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">ওজন (কেজি)</Label>
          <Input type="number" placeholder="যেমন: 300" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">জাত</Label>
          <Select onValueChange={setBreed}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="জাত নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {["Shahiwal", "Red Sindhi", "Friesian Cross", "Brahman", "Deshi", "Jersey Cross"].map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">বয়স</Label>
          <Input placeholder="যেমন: ৩ বছর" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1" />
        </div>
        <Button onClick={handleSuggest} disabled={loading || !weight || !breed} className="w-full gap-2">
          <TrendingUp size={16} />
          {loading ? "বিশ্লেষণ করছে..." : "মূল্য পরামর্শ নিন"}
        </Button>
        {suggestion && (
          <div className="mt-4 p-4 bg-secondary border border-border text-sm">
            <p className="text-xs text-muted-foreground mb-2">প্রস্তাবিত মূল্য পরিসর</p>
            <p className="text-xl font-bold">৳{suggestion.avg.toLocaleString("bn-BD")}</p>
            <p className="text-xs text-muted-foreground">৳{suggestion.min.toLocaleString("bn-BD")} — ৳{suggestion.max.toLocaleString("bn-BD")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPriceSuggestion;
