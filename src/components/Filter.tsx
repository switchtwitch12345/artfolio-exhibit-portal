
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter as FilterIcon, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div ref={ref} className="relative">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="glassmorphism w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-gallery-800 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <FilterIcon size={16} className="mr-2 text-gallery-500" />
              <span className="text-sm font-medium">{getSelectedStudentName()}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "text-gallery-500 transition-transform duration-300",
                isOpen ? "transform rotate-180" : ""
              )}
            />
          </button>
        </div>
        
        {selectedStudent && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center bg-black text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-black/80 transition-colors duration-300"
            onClick={() => onSelectStudent(null)}
          >
            <X size={14} className="mr-1" />
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
            className="absolute z-10 w-full mt-2 glassmorphism rounded-xl border border-gallery-100 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              <button
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors duration-200",
                  selectedStudent === null
                    ? "bg-gallery-100 text-gallery-900 font-medium"
                    : "text-gallery-700 hover:bg-gallery-50"
                )}
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
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors duration-200",
                    selectedStudent === student.id
                      ? "bg-gallery-100 text-gallery-900 font-medium"
                      : "text-gallery-700 hover:bg-gallery-50"
                  )}
                  onClick={() => {
                    onSelectStudent(student.id);
                    setIsOpen(false);
                  }}
                >
                  {student.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;
