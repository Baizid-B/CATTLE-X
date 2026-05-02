import { Link } from "react-router-dom";
import { CheckCircle, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { getCowImage } from "@/lib/cowImages";

interface CowCardProps {
  cow: {
    id: string;
    title: string;
    breed: string;
    weight: number;
    age: string;
    price: number;
    location: string;
    images: string[] | null;
    verified: boolean | null;
  };
}

const CowCard = ({ cow }: CowCardProps) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="cattle-card group relative">
      <Link to={`/cow/${cow.id}`} className="block">
        <div className="aspect-[4/3] bg-secondary overflow-hidden">
          <img src={getCowImage(cow.images?.[0])} alt={cow.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="cattle-badge text-[10px]">{cow.breed}</span>
            {cow.verified && <CheckCircle size={14} className="text-muted-foreground" />}
          </div>
          <h3 className="font-semibold mb-1">{cow.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {cow.weight}কেজি · {cow.age} · {cow.location}
          </p>
          <p className="text-xl font-bold mb-3">৳{Number(cow.price).toLocaleString("bn-BD")}</p>
          <a
            href="https://wa.me/qr/CE3STEG5DN35B1"
            target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 border border-border hover:bg-secondary transition-colors"
          >
            <MessageCircle size={13} /> WhatsApp-এ যোগাযোগ
          </a>
        </div>
      </Link>
      {user && (
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(cow.id); }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border transition-colors hover:bg-background"
        >
          <Heart size={16} className={isFavorite(cow.id) ? "fill-foreground" : ""} />
        </button>
      )}
    </div>
  );
};

export default CowCard;
