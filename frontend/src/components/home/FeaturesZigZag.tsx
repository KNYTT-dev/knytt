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

// Discover Mockup Component
function DiscoverMockup() {
  const categories = ["Women", "Men", "Accessories", "Home"];
  const products = [
    {
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&q=80",
      brand: "Zara",
      name: "Leather Jacket",
      price: "$199"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&q=80",
      brand: "Nike",
      name: "Running Shoes",
      price: "$129"
    },
    {
      image: "https://images.unsplash.com/photo-1584670747114-a45c5c49fc8c?w=300&h=400&fit=crop&q=80",
      brand: "Rebecca Minkoff",
      name: "Crossbody Bag",
      price: "$158"
    },
    {
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=400&fit=crop&q=80",
      brand: "H&M",
      name: "Wool Sweater",
      price: "$49"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&q=80",
      brand: "Adidas",
      name: "Sneakers",
      price: "$95"
    },
    {
      image: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=300&h=400&fit=crop&q=80",
      brand: "West Elm",
      name: "Throw Blanket",
      price: "$59"
    }
  ];

  return (
    <div className="w-full max-w-md">
      <div className="transform rotate-[1deg]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Header with Search */}
          <div className="bg-gradient-to-r from-[#8a94ff]/5 to-[#6a7ae0]/5 px-4 py-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-[#111111] mb-2">Discover</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search brands & products..."
                className="w-full px-3 py-1.5 text-[10px] bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#8a94ff]/30"
                readOnly
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  className={`px-3 py-1 text-[10px] font-medium rounded-full whitespace-nowrap ${
                    idx === 0
                      ? 'bg-[#8a94ff] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100"
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/discover-${idx}/300/400`;
                      }}
                    />
                  </div>
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

          {/* Fade overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

// Collections Mockup Component
function CollectionsMockup() {
  const collections = [
    {
      name: "Summer Essentials",
      count: 12,
      images: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop&q=80"
      ]
    },
    {
      name: "Work Wardrobe",
      count: 8,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=80"
      ]
    },
    {
      name: "Wishlist",
      count: 24,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=200&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop&q=80"
      ]
    }
  ];

  return (
    <div className="w-full max-w-md">
      <div className="transform rotate-[-1deg]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8a94ff]/5 to-[#6a7ae0]/5 px-4 py-3 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-[#111111]">My Collections</h4>
            <p className="text-[10px] text-[#717171] mt-0.5">
              {collections.reduce((sum, c) => sum + c.count, 0)} items saved
            </p>
          </div>

          {/* Collections */}
          <div className="p-4 space-y-3">
            {collections.map((collection, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-[#8a94ff]/30 transition-colors p-3"
              >
                <div className="flex items-center gap-3">
                  {/* Image Stack */}
                  <div className="flex -space-x-2">
                    {collection.images.slice(0, 3).map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                        style={{ zIndex: 3 - imgIdx }}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://picsum.photos/seed/collection-${idx}-${imgIdx}/200/200`;
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Collection Info */}
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-[#111111]">
                      {collection.name}
                    </h5>
                    <div className="flex items-center gap-1 mt-1">
                      <Heart className="w-3 h-3 text-[#8a94ff] fill-[#8a94ff]" />
                      <span className="text-[10px] text-[#717171]">
                        {collection.count} items
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fade overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
                  ) : index === 1 ? (
                    <DiscoverMockup />
                  ) : (
                    <CollectionsMockup />
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
