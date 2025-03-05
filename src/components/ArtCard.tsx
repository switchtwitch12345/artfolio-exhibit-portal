
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
      className="art-card"
    >
      <Link to={`/artwork/${artwork.id}`} className="art-card-link">
        <div className="art-card-image-container">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="art-card-image"
            loading="lazy"
          />
        </div>
        <div className="art-card-content">
          <div className="art-card-tag-container">
            <div className="art-card-medium">
              {artwork.medium.split(',')[0]}
            </div>
            <div className="art-card-year">{artwork.year}</div>
          </div>
          <h3 className="art-card-title">
            {artwork.title}
          </h3>
          <p className="art-card-artist">
            {artwork.student.name}
          </p>
          <p className="art-card-description">
            {artwork.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArtCard;
