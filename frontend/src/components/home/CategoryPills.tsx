"use client";

import Link from "next/link";
import {
  Shirt,
  Watch,
  Home,
  Footprints,
  Gem,
  Palette,
  ShoppingBag,
  Sparkles
} from "lucide-react";

const categories = [
  { name: "All", icon: Sparkles, href: "/search", color: "from-sage to-evergreen" },
  { name: "Fashion", icon: Shirt, href: "/search?category=fashion", color: "from-terracotta to-sage" },
  { name: "Footwear", icon: Footprints, href: "/search?category=footwear", color: "from-evergreen to-blush" },
  { name: "Accessories", icon: Watch, href: "/search?category=accessories", color: "from-sage to-terracotta" },
  { name: "Jewelry", icon: Gem, href: "/search?category=jewelry", color: "from-terracotta to-evergreen" },
  { name: "Home", icon: Home, href: "/search?category=home", color: "from-blush to-sage" },
  { name: "Art", icon: Palette, href: "/search?category=art", color: "from-sage to-ivory" },
  { name: "Bags", icon: ShoppingBag, href: "/search?category=bags", color: "from-evergreen to-sage" },
];

export function CategoryPills() {
  return (
    <section className="py-8 bg-white border-b border-blush">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
          <span className="text-sm font-medium text-evergreen whitespace-nowrap hidden md:block">
            Browse by:
          </span>
          <div className="flex gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ivory to-blush hover:from-blush hover:to-sage/20 rounded-full border border-blush hover:border-sage transition-all whitespace-nowrap"
                >
                  <div className={`p-1.5 bg-gradient-to-br ${category.color} rounded-full`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-evergreen group-hover:text-sage transition-colors">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
