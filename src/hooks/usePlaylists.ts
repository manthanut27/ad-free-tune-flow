import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Track, mockTracks } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export interface DatabasePlaylist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistWithTracks extends DatabasePlaylist {
  tracks: Track[];
}

export const usePlaylists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = useCallback(async () => {
    if (!user) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    try {
      const { data: playlistsData, error: playlistsError } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (playlistsError) throw playlistsError;

      // Fetch tracks for each playlist
      const playlistsWithTracks: PlaylistWithTracks[] = await Promise.all(
        (playlistsData || []).map(async (playlist) => {
          const { data: tracksData, error: tracksError } = await supabase
            .from("playlist_tracks")
            .select("track_id, position")
            .eq("playlist_id", playlist.id)
            .order("position", { ascending: true });

          if (tracksError) {
            console.error("Error fetching playlist tracks:", tracksError);
            return { ...playlist, tracks: [] };
          }

          // Map track_ids to mock tracks (in a real app, you'd fetch from a tracks table)
          const tracks = (tracksData || [])
            .map((pt) => mockTracks.find((t) => t.id === pt.track_id))
            .filter((t): t is Track => t !== undefined);

          return { ...playlist, tracks };
        })
      );

      setPlaylists(playlistsWithTracks);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createPlaylist = async (name: string, description?: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create playlists",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("playlists")
        .insert({
          name,
          description: description || null,
          user_id: user.id,
          is_public: false,
        })
        .select()
        .single();

      if (error) throw error;

      const newPlaylist: PlaylistWithTracks = { ...data, tracks: [] };
      setPlaylists((prev) => [newPlaylist, ...prev]);
      
      toast({
        title: "Playlist created",
        description: `"${name}" has been created`,
      });

      return newPlaylist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
      return null;
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("playlists")
        .delete()
        .eq("id", playlistId);

      if (error) throw error;

      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      
      toast({
        title: "Playlist deleted",
        description: "The playlist has been removed",
      });

      return true;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
      return false;
    }
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add tracks to playlists",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get current max position
      const { data: existingTracks } = await supabase
        .from("playlist_tracks")
        .select("position")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = existingTracks && existingTracks.length > 0 
        ? existingTracks[0].position + 1 
        : 0;

      const { error } = await supabase
        .from("playlist_tracks")
        .insert({
          playlist_id: playlistId,
          track_id: trackId,
          position: nextPosition,
        });

      if (error) throw error;

      // Update local state
      const track = mockTracks.find((t) => t.id === trackId);
      if (track) {
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: [...p.tracks, track] }
              : p
          )
        );
      }

      toast({
        title: "Track added",
        description: "Track has been added to the playlist",
      });

      return true;
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      toast({
        title: "Error",
        description: "Failed to add track to playlist",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("playlist_tracks")
        .delete()
        .eq("playlist_id", playlistId)
        .eq("track_id", trackId);

      if (error) throw error;

      // Update local state
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId
            ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
            : p
        )
      );

      toast({
        title: "Track removed",
        description: "Track has been removed from the playlist",
      });

      return true;
    } catch (error) {
      console.error("Error removing track from playlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove track from playlist",
        variant: "destructive",
      });
      return false;
    }
  };

  const getPlaylist = useCallback(
    (playlistId: string) => {
      return playlists.find((p) => p.id === playlistId);
    },
    [playlists]
  );

  return {
    playlists,
    loading,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getPlaylist,
    refetch: fetchPlaylists,
  };
};
