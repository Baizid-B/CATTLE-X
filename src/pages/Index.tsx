import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
// StatsCounter removed
import BrowseByBreed from "@/components/BrowseByBreed";
import PriceIndex from "@/components/PriceIndex";
import FeaturedListings from "@/components/FeaturedListings";
import LatestListings from "@/components/LatestListings";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import TrustSection from "@/components/TrustSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <BrowseByBreed />
      <PriceIndex />
      <FeaturedListings />
      <LatestListings />
      <HowItWorks />
      <Testimonials />
      <TrustSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
