export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdBy: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  monthlyListeners: number;
}

// Mock tracks
export const mockTracks: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 243,
    coverUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Electric Feel",
    artist: "MGMT",
    album: "Oracular Spectacular",
    duration: 229,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    album: "AM",
    duration: 272,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    duration: 326,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    title: "Take On Me",
    artist: "a-ha",
    album: "Hunting High and Low",
    duration: 225,
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: "6",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
  },
  {
    id: "7",
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: 230,
    coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
  },
  {
    id: "8",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
];

// Mock playlists
export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Liked Songs",
    description: "Your favorite tracks",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(0, 4),
    createdBy: "You",
  },
  {
    id: "2",
    name: "Chill Vibes",
    description: "Relaxing beats to unwind",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(2, 6),
    createdBy: "Spotify",
  },
  {
    id: "3",
    name: "Workout Mix",
    description: "High energy tracks for your workout",
    coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(4, 8),
    createdBy: "Spotify",
  },
  {
    id: "4",
    name: "Late Night Drive",
    description: "Perfect for night cruising",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(0, 5),
    createdBy: "You",
  },
  {
    id: "5",
    name: "Throwback Hits",
    description: "Classic songs from the past",
    coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(3, 8),
    createdBy: "Spotify",
  },
  {
    id: "6",
    name: "Focus Flow",
    description: "Music for deep concentration",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    tracks: mockTracks.slice(1, 6),
    createdBy: "Spotify",
  },
];

// Mock artists
export const mockArtists: Artist[] = [
  {
    id: "1",
    name: "The Weeknd",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    monthlyListeners: 85000000,
  },
  {
    id: "2",
    name: "Dua Lipa",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    monthlyListeners: 62000000,
  },
  {
    id: "3",
    name: "Arctic Monkeys",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    monthlyListeners: 45000000,
  },
  {
    id: "4",
    name: "M83",
    imageUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop",
    monthlyListeners: 12000000,
  },
];

// Recently played
export const recentlyPlayed = mockTracks.slice(0, 6);

// Format duration helper
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
