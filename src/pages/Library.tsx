import { useState } from "react";
import { Heart, Grid, List, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "grid" | "list";
type FilterType = "all" | "playlists";

const Library = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterType>("all");
  const { likedSongs } = usePlayer();
  const { user } = useAuth();
  const { playlists, loading } = usePlaylistContext();
  const navigate = useNavigate();

  const likedSongsCount = likedSongs.size;

  if (!user) {
    return (
      <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Library</h1>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-subdued" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Create your first playlist
          </h2>
          <p className="text-subdued mb-6 max-w-md">
            Sign in to save your favorite songs and create playlists that sync across all your devices.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-6 text-base"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
        <div className="flex items-center gap-2">
          <CreatePlaylistDialog
            trigger={
              <button className="p-2 text-subdued hover:text-foreground hover:bg-surface-highlight rounded-full transition-all">
                <Music className="w-5 h-5" />
              </button>
            }
          />
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-full transition-all",
              viewMode === "list"
                ? "text-foreground bg-surface-highlight"
                : "text-subdued hover:text-foreground"
            )}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-full transition-all",
              viewMode === "grid"
                ? "text-foreground bg-surface-highlight"
                : "text-subdued hover:text-foreground"
            )}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "playlists"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f
                ? "bg-foreground text-background"
                : "bg-surface-highlight text-foreground hover:bg-surface-elevated"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Liked Songs */}
      <div
        onClick={() => navigate("/library/liked")}
        className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-800/40 to-transparent rounded-lg mb-6 cursor-pointer hover:bg-indigo-800/50 transition-colors"
      >
        <div className="w-16 h-16 rounded-md bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center flex-shrink-0">
          <Heart className="w-7 h-7 text-foreground fill-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Liked Songs</h3>
          <p className="text-sm text-subdued">{likedSongsCount} songs</p>
        </div>
      </div>

      {/* Playlists */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-subdued mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Create your first playlist
          </h3>
          <p className="text-subdued mb-6">
            Organize your favorite songs into playlists.
          </p>
          <CreatePlaylistDialog
            trigger={
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                Create Playlist
              </Button>
            }
          />
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="group p-4 rounded-md bg-surface-highlight hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              {playlist.cover_url ? (
                <img
                  src={playlist.cover_url}
                  alt={playlist.name}
                  className="aspect-square rounded-md object-cover shadow-lg mb-4"
                />
              ) : (
                <div className="aspect-square rounded-md bg-surface-base flex items-center justify-center shadow-lg mb-4">
                  <Music className="w-12 h-12 text-subdued" />
                </div>
              )}
              <p className="font-medium text-foreground truncate">
                {playlist.name}
              </p>
              <p className="text-sm text-subdued truncate">
                {playlist.tracks.length} songs
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-surface-highlight cursor-pointer transition-colors"
            >
              {playlist.cover_url ? (
                <img
                  src={playlist.cover_url}
                  alt={playlist.name}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-surface-highlight flex items-center justify-center">
                  <Music className="w-5 h-5 text-subdued" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {playlist.name}
                </p>
                <p className="text-sm text-subdued truncate">
                  Playlist • {playlist.tracks.length} songs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
