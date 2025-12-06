import React, { createContext, useContext, useState, useCallback } from "react";
import { Track, mockTracks } from "@/data/mockData";
import { useLikedSongs } from "@/hooks/useLikedSongs";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentTime: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  likedSongs: Set<string>;
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>(mockTracks);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  // Use the database-backed liked songs hook
  const { likedSongs, toggleLike, isLiked } = useLikedSongs();

  const playTrack = useCallback((track: Track, playlist?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    if (playlist) {
      setQueue(playlist);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentTrack && queue.length > 0) {
      setCurrentTrack(queue[0]);
    }
    setIsPlaying((prev) => !prev);
  }, [currentTrack, queue]);

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    let nextIndex: number;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    setCurrentTrack(queue[nextIndex]);
    setCurrentTime(0);
  }, [currentTrack, queue, isShuffle]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;

    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;

    setCurrentTrack(queue[prevIndex]);
    setCurrentTime(0);
  }, [currentTrack, queue, currentTime]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  // Simulate time progression only for tracks without audioUrl
  React.useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    
    // Skip simulation if track has real audio URL
    if (currentTrack.audioUrl) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          if (repeatMode === "one") {
            return 0;
          }
          nextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, repeatMode, nextTrack]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentTime,
        volume,
        isShuffle,
        repeatMode,
        likedSongs,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
