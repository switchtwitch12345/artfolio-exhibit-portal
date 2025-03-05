
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/utils/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FeaturedArtProps {
  artworks: Artwork[];
}

const FeaturedArt = ({ artworks }: FeaturedArtProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featured = artworks.slice(0, 4);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Determine slide direction
  const [direction, setDirection] = useState(1);
  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };
  
  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  return (
    <div 
      className="featured-art"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="featured-slide"
        >
          <div className="featured-overlay" />
          <img
            src={featured[currentIndex].imageUrl}
            alt={featured[currentIndex].title}
            className="featured-image"
          />
          <div className="featured-content-wrapper">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="featured-content"
              >
                <div className="featured-label">
                  Featured Work
                </div>
                <h2 className="featured-title">
                  {featured[currentIndex].title}
                </h2>
                <p className="featured-artist">
                  By {featured[currentIndex].student.name} · {featured[currentIndex].year}
                </p>
                <p className="featured-description">
                  {featured[currentIndex].description}
                </p>
                <Link 
                  to={`/artwork/${featured[currentIndex].id}`}
                  className="btn-primary featured-button"
                >
                  View Artwork 
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="featured-controls">
        <button
          onClick={handlePrev}
          className="featured-control-button"
          aria-label="Previous"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          className="featured-control-button"
          aria-label="Next"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      
      <div className="featured-dots">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`featured-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArt;
