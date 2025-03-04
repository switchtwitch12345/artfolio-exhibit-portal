
import React from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/utils/mockData";
import { motion } from "framer-motion";

interface ArtCardProps {
  artwork: Artwork;
  index: number;
}

const ArtCard = ({ artwork, index }: ArtCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.6, 
          ease: [0.23, 1, 0.32, 1],
          delay: index * 0.1
        }
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="art-card group h-full"
    >
      <Link to={`/artwork/${artwork.id}`} className="block h-full">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-medium bg-gallery-50 text-gallery-700 rounded-full px-3 py-1">
              {artwork.medium.split(',')[0]}
            </div>
            <div className="text-xs text-gallery-500">{artwork.year}</div>
          </div>
          <h3 className="text-lg font-medium text-gallery-900 mb-1">
            {artwork.title}
          </h3>
          <p className="text-sm text-gallery-600 mb-3">
            {artwork.student.name}
          </p>
          <p className="text-sm text-gallery-500 line-clamp-2">
            {artwork.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArtCard;
