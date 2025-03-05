
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
      
      <section className="index-section">
        <div className="container">
          <div className="index-header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="index-tag">
                Discover
              </div>
              <h2 className="index-title">
                Recent Student Artwork
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/gallery"
                className="index-view-all"
              >
                View All Gallery
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="index-grid">
            {recentArtworks.map((artwork, index) => (
              <ArtCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="index-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="index-cta-content"
          >
            <div className="index-cta-tag">
              Join Us
            </div>
            <h2 className="index-cta-title">
              Showcase Your Artistic Journey
            </h2>
            <p className="index-cta-description">
              Create an account to upload your artwork and become part of our growing community of student artists.
            </p>
            <Link
              to="/auth"
              className="btn-primary"
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
