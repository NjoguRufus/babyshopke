import { useState } from "react";
import { Star, Heart } from "lucide-react";
import productTeddy from "@/assets/product-teddy.png";
import productPhone from "@/assets/product-phone.png";
import productOnesie from "@/assets/product-onesie.png";
import productStacking from "@/assets/product-stacking.png";

const ageTabs = ["0–3 mo", "3–6 mo", "6–12 mo", "12–18 mo", "2–4 yr"];

const products = [
  { name: "Cozy Teddy Bear", price: 1900, rating: 5, image: productTeddy },
  { name: "Musical Phone Toy", price: 1500, rating: 4.5, image: productPhone },
  { name: "Cute Baby Onesie", price: 900, rating: 5, image: productOnesie },
  { name: "Interactive Stacking Cups", price: 1200, rating: 4.5, image: productStacking },
];

const AgeFilterSection = () => {
  const [activeTab, setActiveTab] = useState(3);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-foreground mb-6">
        ✨ Top Picks for{" "}
        <span className="text-primary">12–18 Months</span>
        {" "}✨
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {ageTabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              i === activeTab
                ? "bg-primary text-primary-foreground shadow-glow-primary"
                : "bg-card text-foreground border border-border hover:border-primary/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.name}
            className="bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-200 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative p-4 bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-card/80 hover:bg-card shadow-soft transition-colors">
                <Heart className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-foreground text-sm leading-tight">{product.name}</h3>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : i < product.rating
                        ? "text-amber-400 fill-amber-400/50"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="font-extrabold text-foreground">
                KSH {product.price.toLocaleString()}
              </p>
              <button className="w-full py-2 rounded-full bg-accent text-accent-foreground text-sm font-bold hover:brightness-105 hover:shadow-glow-accent transition-all duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AgeFilterSection;
