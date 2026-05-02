import cow1 from "@/assets/cow-1.jpg";
import cow2 from "@/assets/cow-2.jpg";
import cow3 from "@/assets/cow-3.jpg";
import cow4 from "@/assets/cow-4.jpg";
import cow5 from "@/assets/cow-5.jpg";
import cow6 from "@/assets/cow-6.jpg";

const cowImageMap: Record<string, string> = {
  "/cow-1": cow1,
  "/cow-2": cow2,
  "/cow-3": cow3,
  "/cow-4": cow4,
  "/cow-5": cow5,
  "/cow-6": cow6,
};

export function getCowImage(dbImage: string | null | undefined): string {
  if (!dbImage) return cow1;
  if (cowImageMap[dbImage]) return cowImageMap[dbImage];
  if (dbImage.startsWith("http")) return dbImage;
  if (dbImage.startsWith("/placeholder")) return cow1;
  return cow1;
}
