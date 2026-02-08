export interface AlbumStats {
  totalListened: number;
  averageRating: number;
  topGenre: string;
  recentAlbum: string;
  recentArtist: string;
  recentRating: number;
  recentAlbumCover?: string;
  topAlbums: {
    name: string;
    artist: string;
    coverUrl: string;
    spotifyId?: string;
    rating: number;
  }[];
}

export interface CyclingStats {
  year: number;
  miles: number;
  co2SavedKg: number;
}

export interface AdvancedCyclingStats {
  totalMiles: number;
  totalCo2: number;
  totalRides: number;
  maxDistance: number; // miles
  maxSpeed: number; // mph
  maxElevation: number; // ft
  countriesVisited: string[];
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

export interface ActivityData {
  id: string | number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  type: string;
  start_date: string;
  timezone?: string;
  total_elevation_gain: number;
  elev_high?: number;
  max_speed?: number; // m/s
  location_country?: string;
  source?: string;
}