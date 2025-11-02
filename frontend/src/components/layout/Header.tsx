"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-sage/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sage to-evergreen rounded-full flex items-center justify-center">
              <span className="text-ivory font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-evergreen group-hover:text-sage transition-colors">
              Knytt
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-evergreen hover:text-sage transition-colors font-medium"
            >
              Discover
            </Link>
            <Link
              href="/search"
              className="text-evergreen hover:text-sage transition-colors font-medium"
            >
              Search
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-blush rounded-full focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
              />
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <Link
              href="/search"
              className="lg:hidden p-2 hover:bg-blush rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-evergreen" />
            </Link>

            {/* Favorites */}
            <button className="p-2 hover:bg-blush rounded-full transition-colors group relative">
              <Heart className="w-5 h-5 text-evergreen group-hover:text-terracotta transition-colors" />
            </button>

            {/* Cart */}
            <button className="p-2 hover:bg-blush rounded-full transition-colors group relative">
              <ShoppingBag className="w-5 h-5 text-evergreen group-hover:text-terracotta transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* User Profile */}
            <button className="p-2 hover:bg-blush rounded-full transition-colors">
              <User className="w-5 h-5 text-evergreen" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
