import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface DatabaseTrack {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number;
  cover_url: string | null;
  audio_url: string;
  created_at: string;
  updated_at: string;
}

export const useTracks = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<DatabaseTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTracks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const uploadTrack = async (
    audioFile: File,
    coverFile: File | null,
    metadata: { title: string; artist: string; album?: string }
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload tracks",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);

    try {
      // Upload audio file
      const audioFileName = `${user.id}/${Date.now()}-${audioFile.name}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from("song")
        .upload(audioFileName, audioFile);

      if (audioError) throw audioError;

      const { data: audioUrlData } = supabase.storage
        .from("song")
        .getPublicUrl(audioData.path);

      // Upload cover if provided
      let coverUrl: string | null = null;
      if (coverFile) {
        const coverFileName = `${user.id}/${Date.now()}-${coverFile.name}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from("album-covers")
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        const { data: coverUrlData } = supabase.storage
          .from("album-covers")
          .getPublicUrl(coverData.path);

        coverUrl = coverUrlData.publicUrl;
      }

      // Get audio duration
      const duration = await getAudioDuration(audioFile);

      // Insert track record
      const { data: trackData, error: trackError } = await supabase
        .from("tracks")
        .insert({
          user_id: user.id,
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album || null,
          duration: Math.round(duration),
          cover_url: coverUrl,
          audio_url: audioUrlData.publicUrl,
        })
        .select()
        .single();

      if (trackError) throw trackError;

      setTracks((prev) => [trackData, ...prev]);

      toast({
        title: "Track uploaded",
        description: `"${metadata.title}" has been uploaded successfully`,
      });

      return trackData;
    } catch (error) {
      console.error("Error uploading track:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload track. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addTrackFromUrl = async (
    audioUrl: string,
    coverFile: File | null,
    metadata: { title: string; artist: string; album?: string },
    storageMode: "stream" | "download"
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add tracks",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);

    try {
      let finalAudioUrl = audioUrl;

      // If download mode, fetch the audio and upload to storage
      if (storageMode === "download") {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch audio from URL");
        }
        
        const blob = await response.blob();
        const contentType = response.headers.get("content-type") || "audio/mpeg";
        const extension = contentType.includes("wav") ? "wav" : 
                         contentType.includes("ogg") ? "ogg" : 
                         contentType.includes("m4a") || contentType.includes("mp4") ? "m4a" : "mp3";
        
        const fileName = `${user.id}/${Date.now()}-${metadata.title.replace(/[^a-zA-Z0-9]/g, "_")}.${extension}`;
        
        const { data: audioData, error: audioError } = await supabase.storage
          .from("song")
          .upload(fileName, blob, { contentType });

        if (audioError) throw audioError;

        const { data: audioUrlData } = supabase.storage
          .from("song")
          .getPublicUrl(audioData.path);

        finalAudioUrl = audioUrlData.publicUrl;
      }

      // Upload cover if provided
      let coverUrl: string | null = null;
      if (coverFile) {
        const coverFileName = `${user.id}/${Date.now()}-${coverFile.name}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from("album-covers")
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        const { data: coverUrlData } = supabase.storage
          .from("album-covers")
          .getPublicUrl(coverData.path);

        coverUrl = coverUrlData.publicUrl;
      }

      // Get audio duration from URL
      const duration = await getAudioDurationFromUrl(audioUrl);

      // Insert track record
      const { data: trackData, error: trackError } = await supabase
        .from("tracks")
        .insert({
          user_id: user.id,
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album || null,
          duration: Math.round(duration),
          cover_url: coverUrl,
          audio_url: finalAudioUrl,
        })
        .select()
        .single();

      if (trackError) throw trackError;

      setTracks((prev) => [trackData, ...prev]);

      toast({
        title: "Track added",
        description: `"${metadata.title}" has been added successfully`,
      });

      return trackData;
    } catch (error) {
      console.error("Error adding track from URL:", error);
      toast({
        title: "Failed to add track",
        description: error instanceof Error ? error.message : "Please check the URL and try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteTrack = async (trackId: string) => {
    if (!user) return false;

    try {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return false;

      // Delete from database
      const { error } = await supabase
        .from("tracks")
        .delete()
        .eq("id", trackId);

      if (error) throw error;

      setTracks((prev) => prev.filter((t) => t.id !== trackId));

      toast({
        title: "Track deleted",
        description: "The track has been removed",
      });

      return true;
    } catch (error) {
      console.error("Error deleting track:", error);
      toast({
        title: "Error",
        description: "Failed to delete track",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tracks,
    loading,
    uploading,
    uploadTrack,
    addTrackFromUrl,
    deleteTrack,
    refetch: fetchTracks,
  };
};

// Helper function to get audio duration from File
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      resolve(0);
    });
    audio.src = URL.createObjectURL(file);
  });
};

// Helper function to get audio duration from URL
const getAudioDurationFromUrl = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      resolve(0);
    });
    audio.crossOrigin = "anonymous";
    audio.src = url;
  });
};
