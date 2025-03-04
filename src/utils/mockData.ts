
export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  student: {
    id: string;
    name: string;
    year: string;
    major: string;
  };
  medium: string;
  dimensions: string;
  year: number;
  tags: string[];
}

export const students = [
  { id: "1", name: "Emma Thompson", year: "Senior", major: "Fine Arts" },
  { id: "2", name: "Miguel Rodriguez", year: "Junior", major: "Digital Media" },
  { id: "3", name: "Aisha Johnson", year: "Sophomore", major: "Illustration" },
  { id: "4", name: "David Chen", year: "Senior", major: "Photography" },
  { id: "5", name: "Sophia Patel", year: "Freshman", major: "Sculpture" },
  { id: "6", name: "Jackson Lee", year: "Junior", major: "Mixed Media" },
];

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Urban Solitude",
    description: "A mixed-media exploration of isolation in crowded urban spaces. The piece contrasts hard architectural lines with soft human elements.",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    student: students[0],
    medium: "Mixed Media on Canvas",
    dimensions: "30\" × 48\"",
    year: 2023,
    tags: ["urban", "contemporary", "mixed-media"]
  },
  {
    id: "2",
    title: "Digital Fragmentation",
    description: "A digital artwork exploring the boundaries between virtual reality and human perception, featuring algorithmic patterns that evoke neural networks.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    student: students[1],
    medium: "Digital Art, Print on Metal",
    dimensions: "24\" × 36\"",
    year: 2023,
    tags: ["digital", "abstract", "technology"]
  },
  {
    id: "3",
    title: "Emotion in Motion",
    description: "An illustration capturing the fluid dynamics of human emotions through color and movement. Each stroke represents a different emotional state.",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80",
    student: students[2],
    medium: "Watercolor and Ink",
    dimensions: "18\" × 24\"",
    year: 2022,
    tags: ["illustration", "watercolor", "expressive"]
  },
  {
    id: "4",
    title: "Momentary Light",
    description: "A photographic series exploring the interplay of natural light with architectural spaces, capturing ephemeral moments of illumination.",
    imageUrl: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80",
    student: students[3],
    medium: "Digital Photography, Archival Print",
    dimensions: "20\" × 30\" (Series of 5)",
    year: 2023,
    tags: ["photography", "light", "architecture"]
  },
  {
    id: "5",
    title: "Form and Void",
    description: "A sculptural exploration of negative space and its importance in defining form. Created using sustainable materials and traditional techniques.",
    imageUrl: "https://images.unsplash.com/photo-1576773122198-6798a585ab2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1635&q=80",
    student: students[4],
    medium: "Reclaimed Wood and Steel",
    dimensions: "36\" × 24\" × 24\"",
    year: 2023,
    tags: ["sculpture", "3D", "sustainable"]
  },
  {
    id: "6",
    title: "Ancestral Memories",
    description: "A mixed media piece exploring cultural heritage and family history through layers of collage, paint, and traditional textile techniques.",
    imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80",
    student: students[5],
    medium: "Mixed Media Collage",
    dimensions: "40\" × 60\"",
    year: 2022,
    tags: ["mixed-media", "cultural", "textile"]
  },
  {
    id: "7",
    title: "Chromatic Harmony",
    description: "An exploration of color theory and emotional resonance through abstract geometric forms arranged in harmonious patterns.",
    imageUrl: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    student: students[0],
    medium: "Acrylic on Canvas",
    dimensions: "36\" × 36\"",
    year: 2022,
    tags: ["abstract", "geometric", "color-theory"]
  },
  {
    id: "8",
    title: "Virtual Landscapes",
    description: "A series of digital landscapes exploring the intersection of natural formations and algorithmic generation, creating otherworldly scenes.",
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2046&q=80",
    student: students[1],
    medium: "Digital 3D Rendering, Archival Print",
    dimensions: "24\" × 36\" (Series of 3)",
    year: 2023,
    tags: ["digital", "landscape", "3D"]
  },
];
