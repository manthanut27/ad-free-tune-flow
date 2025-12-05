import { useState } from "react";
import { Heart, Plus, Grid, List } from "lucide-react";
import { mockPlaylists, mockTracks } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";
import PlaylistCard from "@/components/PlaylistCard";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type FilterType = "all" | "playlists" | "artists";

const Library = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterType>("all");
  const { likedSongs } = usePlayer();
  const navigate = useNavigate();

  const likedSongsCount = likedSongs.size;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-subdued hover:text-foreground hover:bg-surface-highlight rounded-full transition-all">
            <Plus className="w-5 h-5" />
          </button>
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
        {(["all", "playlists", "artists"] as FilterType[]).map((f) => (
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
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-surface-highlight cursor-pointer transition-colors"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-12 h-12 rounded object-cover"
              />
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
