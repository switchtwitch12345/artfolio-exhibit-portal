
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { artworks } from "@/utils/mockData";
import AnimatedLayout from "@/components/AnimatedLayout";
import { ArrowLeft, Calendar, Ruler, Tag } from "lucide-react";

const Artwork = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const artwork = artworks.find((art) => art.id === id);
  
  useEffect(() => {
    if (!artwork) {
      navigate("/gallery", { replace: true });
    }
  }, [artwork, navigate]);
  
  if (!artwork) {
    return null;
  }

  return (
    <AnimatedLayout>
      <div className="artwork-container">
        <div className="container">
          <Link
            to="/gallery"
            className="artwork-back-link"
          >
            <ArrowLeft size={16} className="artwork-back-icon" />
            Back to Gallery
          </Link>
          
          <div className="artwork-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="artwork-image-container"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="artwork-image"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="artwork-tag">
                {artwork.medium.split(',')[0]}
              </div>
              <h1 className="artwork-title">{artwork.title}</h1>
              <Link
                to={`/gallery?student=${artwork.student.id}`}
                className="artwork-artist-link"
              >
                {artwork.student.name}
              </Link>
              
              <p className="artwork-description">
                {artwork.description}
              </p>
              
              <div className="artwork-metadata-grid">
                <div className="artwork-metadata">
                  <div className="artwork-metadata-header">
                    <Calendar size={16} className="artwork-metadata-icon" />
                    <h3 className="artwork-metadata-title">Year</h3>
                  </div>
                  <p className="artwork-metadata-content">{artwork.year}</p>
                </div>
                
                <div className="artwork-metadata">
                  <div className="artwork-metadata-header">
                    <Ruler size={16} className="artwork-metadata-icon" />
                    <h3 className="artwork-metadata-title">Dimensions</h3>
                  </div>
                  <p className="artwork-metadata-content">{artwork.dimensions}</p>
                </div>
              </div>
              
              <div className="artwork-metadata">
                <div className="artwork-metadata-header">
                  <Tag size={16} className="artwork-metadata-icon" />
                  <h3 className="artwork-metadata-title">Medium</h3>
                </div>
                <p className="artwork-metadata-content">{artwork.medium}</p>
              </div>
              
              <div className="artwork-tags-container">
                <h3 className="artwork-tags-title">Tags</h3>
                <div className="artwork-tags">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="artwork-tag-item"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="artwork-artist-section">
                <h3 className="artwork-artist-title">
                  About the Artist
                </h3>
                <div className="artwork-artist-card">
                  <p className="artwork-artist-name">
                    {artwork.student.name}
                  </p>
                  <p className="artwork-artist-info">
                    {artwork.student.year} Year · {artwork.student.major}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Artwork;
