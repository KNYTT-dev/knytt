'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, ShoppingBag, Search } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Browse thousands of products from your favorite brands all in one place.',
    number: '01',
  },
  {
    icon: Sparkles,
    title: 'Get Personalized',
    description: 'Our AI learns your style and recommends products you\'ll actually love.',
    number: '02',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Save items you love to your favorites and build your perfect collection.',
    number: '03',
  },
  {
    icon: ShoppingBag,
    title: 'Shop',
    description: 'Add items to your cart and purchase directly from the brands you trust.',
    number: '04',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-light-gray">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Here's how it works
          </h2>
          <p className="text-lg text-gray max-w-2xl mx-auto">
            Discover products you'll love in just a few simple steps
          </p>
        </div>

        {/* Vertical Zig Zag Cards */}
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8 md:gap-12`}
              >
                {/* Card Side */}
                <div className={`flex-1 w-full ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-light-gray">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#8a94ff]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-[#8a94ff]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#8a94ff] mb-2">
                          {step.number}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">
                          {step.title}
                        </h3>
                        <p className="text-base text-gray leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual/Icon Side - Alternating */}
                <div className={`flex-1 w-full ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div className="relative w-full aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8a94ff]/10 to-[#8a94ff]/5 rounded-3xl flex items-center justify-center overflow-hidden">
                      {/* Decorative gradient circles */}
                      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[#8a94ff] opacity-10 blur-2xl" />
                      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-[#8a94ff] opacity-10 blur-3xl" />
                      
                      {/* Large Icon */}
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#8a94ff] to-[#6a7ae0] flex items-center justify-center shadow-xl">
                        <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

