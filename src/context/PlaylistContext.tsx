import React, { createContext, useContext, ReactNode } from "react";
import { usePlaylists, PlaylistWithTracks } from "@/hooks/usePlaylists";
import { Track } from "@/data/mockData";

interface PlaylistContextType {
  playlists: PlaylistWithTracks[];
  loading: boolean;
  createPlaylist: (name: string, description?: string) => Promise<PlaylistWithTracks | null>;
  deletePlaylist: (playlistId: string) => Promise<boolean>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
  getPlaylist: (playlistId: string) => PlaylistWithTracks | undefined;
  refetch: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const playlistData = usePlaylists();

  return (
    <PlaylistContext.Provider value={playlistData}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylistContext must be used within a PlaylistProvider");
  }
  return context;
};
