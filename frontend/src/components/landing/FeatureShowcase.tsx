'use client';

import { motion } from 'framer-motion';
import { Sparkles, Grid3x3, Heart } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Discovery',
    description: 'Smart recommendations tailored to your unique style and preferences',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Grid3x3,
    title: 'Every Brand, One Place',
    description: 'Browse thousands of curated products from all your favorite brands',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Heart,
    title: 'Your Personal Vibe',
    description: 'Build collections and save items that match your aesthetic',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function FeatureShowcase() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Value Prop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] mb-6">
            One feed. Every brand.
            <br />
            <span className="text-[#8a94ff]">Your vibe.</span>
          </h2>
          <p className="text-xl text-[#717171] max-w-2xl mx-auto">
            Discover products you'll love with AI-powered recommendations that understand your unique style.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#717171] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#8a94ff] to-[#6a7ae0] rounded-3xl p-8 sm:p-12 text-white text-center"
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to discover your style?
          </h3>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users finding products they love with personalized recommendations.
          </p>
          <button
            onClick={() => {
              const modal = document.querySelector('[data-signup-modal]');
              if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="bg-white text-[#8a94ff] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
