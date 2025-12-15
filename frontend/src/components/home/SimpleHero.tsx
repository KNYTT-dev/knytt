'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import Link from 'next/link';

export function SimpleHero() {
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8a94ff]/5 via-white to-ivory">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8a94ff]/10 rounded-full border border-[#8a94ff]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#8a94ff]" />
            <span className="text-sm text-charcoal font-medium">
              AI-Powered Apparel Discovery
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-charcoal">
            One feed. Every brand.
            <br />
            <span className="text-[#8a94ff]">Your vibe.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray max-w-2xl mx-auto leading-relaxed">
            Discover apparel you'll love from thousands of brands, all in one place.
            Powered by AI that learns your unique style.
          </p>

          {/* Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-light-gray">
              <h3 className="font-semibold text-charcoal mb-2">All Your Brands</h3>
              <p className="text-sm text-gray">
                One unified feed from thousands of brands
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-light-gray">
              <h3 className="font-semibold text-charcoal mb-2">AI-Powered</h3>
              <p className="text-sm text-gray">
                Personalized recommendations that learn your style
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-light-gray">
              <h3 className="font-semibold text-charcoal mb-2">Your Style</h3>
              <p className="text-sm text-gray">
                Save favorites and build your perfect collection
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#8a94ff] text-white rounded-full font-semibold text-lg hover:bg-[#6a7ae0] transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Get Started Free
            </Link>
            <button
              onClick={scrollToHowItWorks}
              className="group px-8 py-4 bg-white border-2 border-light-gray text-charcoal rounded-full font-semibold text-lg hover:border-[#8a94ff] hover:text-[#8a94ff] transition-all inline-flex items-center gap-2"
            >
              Learn How It Works
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

