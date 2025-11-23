'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function SignupCTA() {
  return (
    <section className="py-12 bg-white border-t border-light-gray">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
            Ready to discover your next favorite?
          </h2>

          {/* Subheading */}
          <p className="text-base text-gray max-w-xl mx-auto">
            Create a free account to save items, get personalized recommendations, and never lose track of what you love.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Link
              href="/register"
              className="px-6 py-3 bg-[#8a94ff] text-white rounded-full font-semibold text-base hover:bg-[#6a7ae0] transition-colors shadow-md hover:shadow-lg"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white border-2 border-light-gray text-charcoal rounded-full font-semibold text-base hover:border-[#8a94ff] hover:text-[#8a94ff] transition-colors"
            >
              Log In
            </Link>
          </div>

          {/* Small Print */}
          <p className="text-sm text-gray/70 pt-2">
            No credit card required • Free forever
          </p>
        </motion.div>
      </div>
    </section>
  );
}
