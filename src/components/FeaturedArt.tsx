
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
      className="relative h-[85vh] overflow-hidden"
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
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-black/10 z-10" />
            <img
              src={featured[currentIndex].imageUrl}
              alt={featured[currentIndex].title}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 z-20 flex items-end">
              <div className="container mx-auto px-6 pb-20 md:pb-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="glassmorphism p-8 max-w-xl rounded-2xl"
                >
                  <div className="bg-black/80 text-white text-xs font-medium rounded-full px-3 py-1 inline-block mb-3">
                    Featured Work
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-black">
                    {featured[currentIndex].title}
                  </h2>
                  <p className="text-sm font-medium text-gallery-700 mb-4">
                    By {featured[currentIndex].student.name} · {featured[currentIndex].year}
                  </p>
                  <p className="text-gallery-800 mb-6 line-clamp-3">
                    {featured[currentIndex].description}
                  </p>
                  <Link 
                    to={`/artwork/${featured[currentIndex].id}`}
                    className="btn-primary inline-flex items-center"
                  >
                    View Artwork 
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-8 right-8 z-30 flex gap-2">
        <button
          onClick={handlePrev}
          className="glassmorphism w-12 h-12 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          className="glassmorphism w-12 h-12 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
          aria-label="Next"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      
      <div className="absolute bottom-8 left-8 z-30 flex gap-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-black" 
                : "bg-black/30 hover:bg-black/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArt;
