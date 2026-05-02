import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cows as mockCows, priceHistory } from "@/data/mockData";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 cattle-container cattle-section">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">অ্যাডমিন</p>
          <h1 className="text-3xl md:text-4xl font-bold">ড্যাশবোর্ড</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-6 border border-border bg-card">
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">মোট গরু</p>
            <p className="text-3xl font-bold">{mockCows.length}</p>
          </div>
          <div className="p-6 border border-border bg-card">
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">ফিচার্ড</p>
            <p className="text-3xl font-bold">{mockCows.filter((c) => c.featured).length}</p>
          </div>
          <div className="p-6 border border-border bg-card">
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">যাচাইকৃত</p>
            <p className="text-3xl font-bold">{mockCows.filter((c) => c.verified).length}</p>
          </div>
        </div>

        <div className="p-6 border border-border bg-card">
          <h2 className="font-semibold mb-4">তালিকা</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 text-muted-foreground font-normal">নাম</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-normal">জাত</th>
                  <th className="pb-2 pr-4 text-muted-foreground font-normal">মূল্য</th>
                  <th className="pb-2 text-muted-foreground font-normal">অবস্থান</th>
                </tr>
              </thead>
              <tbody>
                {mockCows.map((cow) => (
                  <tr key={cow.id} className="border-b border-border/50">
                    <td className="py-3 pr-4">{cow.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{cow.breed}</td>
                    <td className="py-3 pr-4">৳{cow.price.toLocaleString("bn-BD")}</td>
                    <td className="py-3 text-muted-foreground">{cow.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
