
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { artworks } from "@/utils/mockData";
import FeaturedArt from "@/components/FeaturedArt";
import ArtCard from "@/components/ArtCard";
import AnimatedLayout from "@/components/AnimatedLayout";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const recentArtworks = artworks.slice(0, 3);

  return (
    <AnimatedLayout>
      <FeaturedArt artworks={artworks} />
      
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-xs font-medium bg-gallery-100 text-gallery-700 rounded-full px-3 py-1 inline-block mb-3">
                  Discover
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-balance">
                  Recent Student Artwork
                </h2>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/gallery"
                className="mt-4 md:mt-0 inline-flex items-center font-medium text-sm text-gallery-900 hover:text-gallery-600 transition-colors duration-300"
              >
                View All Gallery
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentArtworks.map((artwork, index) => (
              <ArtCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gallery-50">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="text-xs font-medium bg-gallery-200 text-gallery-700 rounded-full px-3 py-1 inline-block mb-3">
              Join Us
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
              Showcase Your Artistic Journey
            </h2>
            <p className="text-gallery-700 text-lg mb-8 text-balance">
              Create an account to upload your artwork and become part of our growing community of student artists.
            </p>
            <Link
              to="/auth"
              className="btn-primary inline-flex items-center"
            >
              Sign Up Now
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </AnimatedLayout>
  );
};

export default Index;
