import { Play, Pause } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Track } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface RecentlyPlayedCardProps {
  track: Track;
  playlist?: Track[];
}

const RecentlyPlayedCard = ({ track, playlist }: RecentlyPlayedCardProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, playlist);
    }
  };

  return (
    <div
      className="group flex items-center gap-4 bg-surface-highlight/50 hover:bg-surface-highlight rounded-md overflow-hidden cursor-pointer transition-colors"
      onClick={handlePlay}
    >
      <img
        src={track.coverUrl}
        alt={track.title}
        className="w-20 h-20 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={cn(
            "font-bold truncate",
            isCurrentTrack ? "text-primary" : "text-foreground"
          )}
        >
          {track.title}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
        className={cn(
          "w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4 shadow-lg transition-all",
          "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
          isCurrentlyPlaying && "opacity-100 translate-y-0"
        )}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
        )}
      </button>
    </div>
  );
};

export default RecentlyPlayedCard;
