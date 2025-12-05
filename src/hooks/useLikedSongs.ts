import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch liked songs from database
  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user) {
        setLikedSongs(new Set());
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("liked_songs")
          .select("track_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const trackIds = new Set(data?.map((item) => item.track_id) || []);
        setLikedSongs(trackIds);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user]);

  const toggleLike = useCallback(
    async (trackId: string) => {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save your liked songs.",
          variant: "destructive",
        });
        return;
      }

      const isCurrentlyLiked = likedSongs.has(trackId);

      // Optimistic update
      setLikedSongs((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(trackId);
        } else {
          newSet.add(trackId);
        }
        return newSet;
      });

      try {
        if (isCurrentlyLiked) {
          const { error } = await supabase
            .from("liked_songs")
            .delete()
            .eq("user_id", user.id)
            .eq("track_id", trackId);

          if (error) throw error;
        } else {
          const { error } = await supabase.from("liked_songs").insert({
            user_id: user.id,
            track_id: trackId,
          });

          if (error) throw error;
        }
      } catch (error) {
        // Revert optimistic update on error
        setLikedSongs((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(trackId);
          } else {
            newSet.delete(trackId);
          }
          return newSet;
        });
        console.error("Error toggling like:", error);
        toast({
          title: "Error",
          description: "Failed to update liked songs. Please try again.",
          variant: "destructive",
        });
      }
    },
    [user, likedSongs, toast]
  );

  const isLiked = useCallback(
    (trackId: string) => {
      return likedSongs.has(trackId);
    },
    [likedSongs]
  );

  return {
    likedSongs,
    isLoading,
    toggleLike,
    isLiked,
  };
};
