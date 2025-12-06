import { Play, Pause, Heart } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Track, formatDuration } from "@/data/mockData";
import { cn } from "@/lib/utils";
import AddToPlaylistMenu from "./AddToPlaylistMenu";

interface TrackRowProps {
  track: Track;
  index: number;
  playlist?: Track[];
  showAlbum?: boolean;
  playlistId?: string;
  onRemove?: () => void;
}

const TrackRow = ({ track, index, playlist, showAlbum = true, playlistId, onRemove }: TrackRowProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, toggleLike, isLiked } =
    usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, playlist);
    }
  };

  return (
    <div
      className={cn(
        "group grid items-center gap-4 px-4 py-2 rounded-md hover:bg-surface-highlight transition-colors",
        showAlbum
          ? "grid-cols-[16px_minmax(120px,4fr)_minmax(120px,2fr)_minmax(60px,1fr)]"
          : "grid-cols-[16px_minmax(120px,6fr)_minmax(60px,1fr)]"
      )}
      onDoubleClick={handlePlayClick}
    >
      {/* Index / Play Button */}
      <div className="w-4 text-center">
        <span
          className={cn(
            "text-sm tabular-nums group-hover:hidden",
            isCurrentTrack ? "text-primary" : "text-subdued"
          )}
        >
          {isCurrentlyPlaying ? (
            <div className="flex items-end justify-center gap-[2px] h-4">
              <span className="w-[3px] h-2 bg-primary animate-pulse" />
              <span className="w-[3px] h-3 bg-primary animate-pulse delay-75" />
              <span className="w-[3px] h-2 bg-primary animate-pulse delay-150" />
            </div>
          ) : (
            index + 1
          )}
        </span>
        <button
          onClick={handlePlayClick}
          className="hidden group-hover:block text-foreground"
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium truncate",
              isCurrentTrack ? "text-primary" : "text-foreground"
            )}
          >
            {track.title}
          </p>
          <p className="text-sm text-subdued truncate hover:underline cursor-pointer">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <p className="text-sm text-subdued truncate hover:underline cursor-pointer">
          {track.album}
        </p>
      )}

      {/* Actions & Duration */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => toggleLike(track.id)}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isLiked(track.id) ? "text-primary opacity-100" : "text-subdued hover:text-foreground"
          )}
        >
          <Heart
            className={cn("w-4 h-4", isLiked(track.id) && "fill-primary")}
          />
        </button>
        <span className="text-sm text-subdued tabular-nums">
          {formatDuration(track.duration)}
        </span>
        <AddToPlaylistMenu trackId={track.id} />
      </div>
    </div>
  );
};

export default TrackRow;
