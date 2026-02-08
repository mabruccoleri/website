
import { AlbumStats } from './types';

const PROJECT_NAME = 'marcus-bruccoleri';
const API_URL = `https://1001albumsgenerator.com/api/v1/projects/${PROJECT_NAME}`;

interface HistoryItem {
  album: {
    artist: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    spotifyId?: string;
  };
  rating?: number;
  review?: string;
  generatedAt: string;
}

export const getMusicStats = async (): Promise<AlbumStats | null> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch music stats: ${response.statusText}`);
    }

    const data = await response.json();
    const history: HistoryItem[] = data.history || [];

    if (history.length === 0) return null;

    // Filter only rated albums for rating stats, but use all for count?
    // Usually 1001 generator counts generated albums.
    // But let's use rated ones for average.
    const ratedAlbums = history.filter(item => item.rating !== undefined && item.rating > 0);
    
    // Calculate Stats
    const totalListened = history.length;
    
    const totalRating = ratedAlbums.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const averageRating = ratedAlbums.length > 0 ? parseFloat((totalRating / ratedAlbums.length).toFixed(1)) : 0;

    // Top Genre
    const genreCounts: Record<string, number> = {};
    history.forEach(item => {
        item.album.genres?.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });
    
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Eclectic';

    // Recent Album (Last in the list)
    const recent = history[history.length - 1];
    const recentAlbum = recent.album.name;
    const recentArtist = recent.album.artist;
    const recentRating = recent.rating || 0;
    const recentAlbumCover = recent.album.images?.[1]?.url || recent.album.images?.[0]?.url; // Prefer medium size if available

    // Top Rated Albums (5 stars, most recent first)
    const topAlbums = ratedAlbums
        .filter(item => item.rating === 5)
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
        .slice(0, 3)
        .map(item => ({
            name: item.album.name,
            artist: item.album.artist,
            coverUrl: item.album.images?.[1]?.url || item.album.images?.[0]?.url || '',
            spotifyId: item.album.spotifyId,
            rating: item.rating || 5
        }));

    return {
        totalListened,
        averageRating,
        topGenre: topGenre.charAt(0).toUpperCase() + topGenre.slice(1), // Capitalize
        recentAlbum,
        recentArtist,
        recentRating,
        recentAlbumCover,
        topAlbums
    };

  } catch (error) {
    console.error("Error fetching music data:", error);
    return null;
  }
};
