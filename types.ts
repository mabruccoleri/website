export interface AlbumStats {
  totalListened: number;
  averageRating: number;
  topGenre: string;
  recentAlbum: string;
  recentRating: number;
}

export interface CyclingStats {
  year: number;
  miles: number;
  co2SavedKg: number;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Adventure {
  id: string;
  name: string;
  type: 'past' | 'future';
  coordinates: { x: number; y: number }; // Percentage from top-left (0-100)
  description: string;
  photoUrl?: string;
}

export interface CyclingRoute {
  id: string;
  name: string;
  path: { x: number; y: number }[]; // Array of coordinates for the polyline
  stats: string;
  color?: string;
}