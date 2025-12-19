'use client';

import { motion } from 'framer-motion';
import { Sparkles, ScanFace, Share2, Heart } from 'lucide-react';

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

// Personalized Feed Mockup Component
function FeedMockup() {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop&q=80",
      brand: "Everlane",
      name: "Relaxed Linen Blazer",
      price: "$128",
      liked: false
    },
    {
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&q=80",
      brand: "COS",
      name: "Minimal Cotton Tee",
      price: "$45",
      liked: true
    },
    {
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop&q=80",
      brand: "Arket",
      name: "Wide Leg Trousers",
      price: "$89",
      liked: false
    },
    {
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&q=80",
      brand: "Madewell",
      name: "Denim Jacket",
      price: "$138",
      liked: false
    },
    {
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop&q=80",
      brand: "Everlane",
      name: "Cashmere Sweater",
      price: "$110",
      liked: false
    },
    {
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=400&fit=crop&q=80",
      brand: "COS",
      name: "Wool Coat",
      price: "$295",
      liked: false
    }
  ];

  return (
    <div className="w-full max-w-md">
      {/* Container with subtle tilt */}
      <div className="transform rotate-[-2deg]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8a94ff]/5 to-[#6a7ae0]/5 px-4 py-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-[#111111]">For You</h4>
            <p className="text-[10px] text-[#717171] mt-0.5">
              Based on your style: minimal, neutral tones
            </p>
          </div>

          {/* Product Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#8a94ff]/30 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/${idx}/300/400`;
                      }}
                    />
                    {/* Heart icon for liked product */}
                    {product.liked && (
                      <div
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                        aria-label="Saved to favorites"
                      >
                        <Heart className="w-4 h-4 text-[#8a94ff] fill-[#8a94ff]" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-2">
                    <p className="text-[9px] text-[#717171] uppercase tracking-wide font-medium">
                      {product.brand}
                    </p>
                    <p className="text-xs text-[#111111] font-medium mt-0.5 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#111111] font-semibold mt-1">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fade overlay at bottom suggesting more content */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

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
                  {index === 0 ? (
                    <FeedMockup />
                  ) : (
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
                  )}
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
