
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
      <div className="container px-6 mx-auto py-12">
        <Link
          to="/gallery"
          className="inline-flex items-center text-sm font-medium text-gallery-700 hover:text-gallery-900 transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Gallery
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-square w-full glassmorphism p-4 rounded-2xl overflow-hidden"
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-xs font-medium bg-gallery-100 text-gallery-700 rounded-full px-3 py-1 inline-block mb-3">
              {artwork.medium.split(',')[0]}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{artwork.title}</h1>
            <Link
              to={`/gallery?student=${artwork.student.id}`}
              className="inline-block text-lg font-medium text-gallery-900 hover:text-gallery-700 transition-colors duration-300 mb-6"
            >
              {artwork.student.name}
            </Link>
            
            <p className="text-gallery-700 mb-8 leading-relaxed">
              {artwork.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glassmorphism p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="mr-2 text-gallery-500" />
                  <h3 className="text-sm font-medium text-gallery-900">Year</h3>
                </div>
                <p className="text-gallery-700">{artwork.year}</p>
              </div>
              
              <div className="glassmorphism p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Ruler size={16} className="mr-2 text-gallery-500" />
                  <h3 className="text-sm font-medium text-gallery-900">Dimensions</h3>
                </div>
                <p className="text-gallery-700">{artwork.dimensions}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <Tag size={16} className="mr-2 text-gallery-500" />
                <h3 className="text-sm font-medium text-gallery-900">Medium</h3>
              </div>
              <p className="text-gallery-700">{artwork.medium}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gallery-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gallery-100 text-gallery-700 px-3 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gallery-100">
              <h3 className="text-lg font-medium text-gallery-900 mb-3">
                About the Artist
              </h3>
              <div className="glassmorphism p-4 rounded-xl">
                <p className="text-gallery-700 mb-2">
                  <span className="font-medium">{artwork.student.name}</span>
                </p>
                <p className="text-gallery-500 text-sm">
                  {artwork.student.year} Year · {artwork.student.major}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Artwork;
