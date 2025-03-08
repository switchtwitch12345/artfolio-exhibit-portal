
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedLayout from "@/components/AnimatedLayout";
import { ArrowRight } from "lucide-react";
import "../styles/about.css";

const About = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollPosition - viewportHeight;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight + viewportHeight;
        
        // Calculate how far into the section we've scrolled (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1, 
          (scrollPosition - sectionTop) / (sectionBottom - sectionTop)
        ));

        // Apply scale effect similar to Apple's website
        if (section.classList.contains('zoom-section')) {
          // Start slightly zoomed out and zoom in as we scroll
          const scale = 0.95 + (scrollProgress * 0.1);
          const opacity = 0.7 + (scrollProgress * 0.3);
          section.style.transform = `scale(${scale})`;
          section.style.opacity = `${opacity}`;
        }

        // Parallax text effect
        const textElements = section.querySelectorAll('.parallax-text');
        textElements.forEach((el) => {
          const element = el as HTMLElement;
          const speed = parseFloat(element.dataset.speed || "0.1");
          const yOffset = (scrollProgress - 0.5) * speed * 100;
          element.style.transform = `translateY(${yOffset}px)`;
        });
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set positions
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatedLayout>
      <div className="about-container" ref={scrollContainerRef}>
        <section 
          className="about-hero"
          ref={(el) => sectionsRef.current[0] = el}
        >
          <div className="about-hero-content glassmorphism">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="about-title parallax-text"
              data-speed="0.2"
            >
              About ArtFolio
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="about-subtitle parallax-text"
              data-speed="0.1"
            >
              Empowering student artists to showcase their creative journey
            </motion.p>
          </div>
        </section>

        <section 
          className="about-mission zoom-section"
          ref={(el) => sectionsRef.current[1] = el}
        >
          <div className="container">
            <div className="mission-content glassmorphism">
              <h2 className="mission-title parallax-text" data-speed="0.15">Our Mission</h2>
              <p className="mission-text parallax-text" data-speed="0.1">
                ArtFolio was created with a simple yet powerful mission: to provide student artists with a dedicated platform to showcase their work, connect with peers, and document their artistic evolution. We believe in the transformative power of art education and the importance of giving emerging artists the recognition they deserve.
              </p>
            </div>
          </div>
        </section>

        <section 
          className="about-features zoom-section"
          ref={(el) => sectionsRef.current[2] = el}
        >
          <div className="container">
            <div className="features-grid">
              <div className="feature-card glassmorphism">
                <h3 className="feature-title parallax-text" data-speed="0.12">Digital Showcase</h3>
                <p className="feature-text parallax-text" data-speed="0.08">
                  Upload and organize your artwork in a professional online gallery that highlights your unique style and artistic development.
                </p>
              </div>
              <div className="feature-card glassmorphism">
                <h3 className="feature-title parallax-text" data-speed="0.12">Community Connection</h3>
                <p className="feature-text parallax-text" data-speed="0.08">
                  Connect with fellow student artists, share inspiration, and participate in a supportive community of creators.
                </p>
              </div>
              <div className="feature-card glassmorphism">
                <h3 className="feature-title parallax-text" data-speed="0.12">Learning Resources</h3>
                <p className="feature-text parallax-text" data-speed="0.08">
                  Access tutorials, workshops, and educational content designed to help you grow as an artist and refine your techniques.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section 
          className="about-join zoom-section"
          ref={(el) => sectionsRef.current[3] = el}
        >
          <div className="container">
            <div className="join-content glassmorphism">
              <h2 className="join-title parallax-text" data-speed="0.15">Join Our Community</h2>
              <p className="join-text parallax-text" data-speed="0.1">
                Ready to showcase your art to the world? Create an account today and become part of our growing community of student artists.
              </p>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="/auth"
                className="join-button parallax-text"
                data-speed="0.05"
              >
                Sign Up Now
                <ArrowRight size={16} className="ml-2" />
              </motion.a>
            </div>
          </div>
        </section>
      </div>
    </AnimatedLayout>
  );
};

export default About;
