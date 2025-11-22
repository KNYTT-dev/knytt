'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function SignupCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#8a94ff] to-[#6a7ae0] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Icon Grid */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Want to save your favorites?
          </h2>

          {/* Subheading */}
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Create a free account to save items, get personalized recommendations, and never lose track of what you love.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto my-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Heart className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Save Favorites</h3>
              <p className="text-white/80 text-sm">
                Build collections of products you love
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Sparkles className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">AI Recommendations</h3>
              <p className="text-white/80 text-sm">
                Get personalized suggestions based on your taste
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <ShoppingBag className="w-8 h-8 text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Shopping Cart</h3>
              <p className="text-white/80 text-sm">
                Keep track of items you want to purchase
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-[#8a94ff] rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-colors hover:scale-105 active:scale-95"
            >
              Log In
            </Link>
          </div>

          {/* Small Print */}
          <p className="text-white/70 text-sm">
            No credit card required • Free forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}
