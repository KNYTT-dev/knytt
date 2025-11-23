'use client';

import { motion } from 'framer-motion';
import { Sparkles, ScanFace, Share2 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI That Gets Your Style',
    description: "Knytt learns your vibe and finds products you'll actually love from all your favorite brands.",
    gradient: 'from-[#8a94ff] to-[#6a7ae0]',
    bgColor: 'bg-gradient-to-br from-[#8a94ff]/10 to-[#6a7ae0]/5',
  },
  {
    icon: ScanFace,
    title: 'Discover Everything',
    description: 'Browse thousands of products from every brand you love, all in one unified feed.',
    gradient: 'from-[#8a94ff] to-[#6a7ae0]',
    bgColor: 'bg-gradient-to-br from-[#8a94ff]/10 to-[#6a7ae0]/5',
  },
  {
    icon: Share2,
    title: 'Save & Organize',
    description: 'Save your favorites, build collections, and never lose track of what you love.',
    gradient: 'from-[#8a94ff] to-[#6a7ae0]',
    bgColor: 'bg-gradient-to-br from-[#8a94ff]/10 to-[#6a7ae0]/5',
  },
];

export function FeaturesZigZag() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-12 lg:gap-16`}
              >
                {/* Visual/Icon Side */}
                <div className="flex-1 flex justify-center">
                  <div
                    className={`relative w-full max-w-md aspect-square rounded-3xl ${feature.bgColor} flex items-center justify-center overflow-hidden shadow-2xl`}
                  >
                    {/* Decorative gradient circles */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`}
                    />
                    <div
                      className={`absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl`}
                    />
                    <div
                      className={`absolute bottom-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl`}
                    />

                    {/* Icon */}
                    <div
                      className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl`}
                    >
                      <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg md:text-xl text-[#717171] leading-relaxed max-w-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
