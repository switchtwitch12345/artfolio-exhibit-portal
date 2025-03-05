
import React, { useState } from "react";
import { motion } from "framer-motion";
import { artworks, students } from "@/utils/mockData";
import ArtCard from "@/components/ArtCard";
import Filter from "@/components/Filter";
import AnimatedLayout from "@/components/AnimatedLayout";
import { Layers } from "lucide-react";

const Gallery = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filteredArtworks = selectedStudent
    ? artworks.filter((artwork) => artwork.student.id === selectedStudent)
    : artworks;

  return (
    <AnimatedLayout>
      <section className="gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="gallery-header"
          >
            <div className="gallery-tag">
              Browse
            </div>
            <h1 className="gallery-title">Student Gallery</h1>
            <p className="gallery-description">
              Explore the diverse collection of artwork created by our talented students. 
              Filter by student name to discover individual artistic journeys.
            </p>
          </motion.div>

          <div className="gallery-filter-container">
            <Filter 
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
            />
          </div>

          {filteredArtworks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gallery-empty"
            >
              <Layers size={48} className="gallery-empty-icon" />
              <h3 className="gallery-empty-title">No artworks found</h3>
              <p className="gallery-empty-text">
                Try selecting a different student or clear your filter
              </p>
            </motion.div>
          ) : (
            <div className="gallery-grid">
              {filteredArtworks.map((artwork, index) => (
                <ArtCard key={artwork.id} artwork={artwork} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </AnimatedLayout>
  );
};

export default Gallery;
