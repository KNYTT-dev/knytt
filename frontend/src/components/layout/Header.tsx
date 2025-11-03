"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, User, LogOut, Settings, History, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/queries/auth";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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
            {isAuthenticated && (
              <Link
                href="/feed"
                className="text-evergreen hover:text-sage transition-colors font-medium flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                For You
              </Link>
            )}
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
            <Link
              href="/favorites"
              className="p-2 hover:bg-blush rounded-full transition-colors group relative"
            >
              <Heart className="w-5 h-5 text-evergreen group-hover:text-terracotta transition-colors" />
            </Link>

            {/* Cart */}
            <button className="p-2 hover:bg-blush rounded-full transition-colors group relative">
              <ShoppingBag className="w-5 h-5 text-evergreen group-hover:text-terracotta transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-blush rounded-full transition-colors"
                >
                  <User className="w-5 h-5 text-evergreen" />
                  <span className="hidden sm:block text-sm text-evergreen font-medium">
                    {user.email.split('@')[0]}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-sage/20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-sage/10">
                      <p className="text-sm font-medium text-evergreen">
                        {user.email}
                      </p>
                      <p className="text-xs text-sage">
                        {user.total_interactions} interactions
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        router.push('/favorites');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blush/50 transition-colors text-left"
                    >
                      <Heart className="w-4 h-4 text-terracotta" />
                      <span className="text-sm text-evergreen">Favorites</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/history');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blush/50 transition-colors text-left"
                    >
                      <History className="w-4 h-4 text-sage" />
                      <span className="text-sm text-evergreen">History</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blush/50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-sage" />
                      <span className="text-sm text-evergreen">Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blush/50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-sage" />
                      <span className="text-sm text-evergreen">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-evergreen hover:text-sage transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
