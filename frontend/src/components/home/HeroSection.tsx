"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-light-gray to-pinterest-red/10 py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E60023' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-light-gray">
            <Sparkles className="w-4 h-4 text-pinterest-red" />
            <span className="text-sm text-charcoal font-medium">
              AI-Powered Product Discovery
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-charcoal">Discover Your</span>
            <span className="block text-pinterest-red">
              Perfect Style
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray max-w-2xl mx-auto">
            Explore thousands of curated products tailored to your unique taste.
            Let our AI help you find exactly what you're looking for.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray group-focus-within:text-pinterest-red transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-16 pr-6 py-5 text-lg text-charcoal bg-white border-2 border-light-gray rounded-full focus:outline-none focus:ring-4 focus:ring-pinterest-red/20 focus:border-pinterest-red shadow-xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-pinterest-red hover:bg-dark-red text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray">Popular:</span>
            {["Dresses", "Shoes", "Accessories", "Home Decor", "Jewelry"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-light-gray hover:border-pinterest-red rounded-full text-charcoal hover:text-pinterest-red transition-colors active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
