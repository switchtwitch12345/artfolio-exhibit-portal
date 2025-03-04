
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
      <section className="container px-6 mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-xs font-medium bg-gallery-100 text-gallery-700 rounded-full px-3 py-1 inline-block mb-3">
            Browse
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-6">Student Gallery</h1>
          <p className="text-gallery-700 max-w-3xl mb-8">
            Explore the diverse collection of artwork created by our talented students. 
            Filter by student name to discover individual artistic journeys.
          </p>
        </motion.div>

        <div className="mb-8">
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
            className="text-center py-20"
          >
            <Layers size={48} className="mx-auto mb-4 text-gallery-300" />
            <h3 className="text-xl font-medium text-gallery-800 mb-2">No artworks found</h3>
            <p className="text-gallery-600">
              Try selecting a different student or clear your filter
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredArtworks.map((artwork, index) => (
              <ArtCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>
        )}
      </section>
    </AnimatedLayout>
  );
};

export default Gallery;
