
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter as FilterIcon, X, ChevronDown } from "lucide-react";

interface Student {
  id: string;
  name: string;
}

interface FilterProps {
  students: Student[];
  selectedStudent: string | null;
  onSelectStudent: (studentId: string | null) => void;
}

const Filter = ({ students, selectedStudent, onSelectStudent }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSelectedStudentName = () => {
    if (!selectedStudent) return "All Students";
    const student = students.find((s) => s.id === selectedStudent);
    return student ? student.name : "All Students";
  };

  return (
    <div ref={ref} className="filter-container">
      <div className="filter-wrapper">
        <div className="filter-flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="filter-button"
          >
            <div className="filter-button-content">
              <FilterIcon size={16} className="filter-icon" />
              <span className="filter-text">{getSelectedStudentName()}</span>
            </div>
            <ChevronDown
              size={16}
              className={`filter-chevron ${isOpen ? 'open' : ''}`}
            />
          </button>
        </div>
        
        {selectedStudent && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="filter-clear-button"
            onClick={() => onSelectStudent(null)}
          >
            <X size={14} className="filter-clear-icon" />
            Clear
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="filter-dropdown"
          >
            <button
              className={`filter-option ${selectedStudent === null ? 'active' : ''}`}
              onClick={() => {
                onSelectStudent(null);
                setIsOpen(false);
              }}
            >
              All Students
            </button>
            {students.map((student) => (
              <button
                key={student.id}
                className={`filter-option ${selectedStudent === student.id ? 'active' : ''}`}
                onClick={() => {
                  onSelectStudent(student.id);
                  setIsOpen(false);
                }}
              >
                {student.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;
