import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import AgeFilterSection from "@/components/AgeFilterSection";
import BottomCards from "@/components/BottomCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategorySection />
      <AgeFilterSection />
      <BottomCards />
    </div>
  );
};

export default Index;
