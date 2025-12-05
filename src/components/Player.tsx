import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Maximize2,
  ListMusic,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatDuration } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
  } = usePlayer();

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;

  return (
    <footer className="h-[90px] bg-player border-t border-border px-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate text-sm hover:underline cursor-pointer">
                {currentTrack.title}
              </p>
              <p className="text-xs text-subdued truncate hover:underline cursor-pointer">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={cn(
                "p-2 transition-colors",
                isLiked(currentTrack.id)
                  ? "text-primary"
                  : "text-subdued hover:text-foreground"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isLiked(currentTrack.id) && "fill-primary"
                )}
              />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-surface-elevated" />
            <div>
              <p className="text-sm text-subdued">No track playing</p>
            </div>
          </div>
        )}
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={cn(
              "p-2 transition-colors",
              isShuffle ? "text-primary" : "text-subdued hover:text-foreground"
            )}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={prevTrack}
            className="p-2 text-subdued hover:text-foreground transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-background" />
            ) : (
              <Play className="w-4 h-4 text-background ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 text-subdued hover:text-foreground transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={toggleRepeat}
            className={cn(
              "p-2 transition-colors relative",
              repeatMode !== "off"
                ? "text-primary"
                : "text-subdued hover:text-foreground"
            )}
          >
            <RepeatIcon className="w-4 h-4" />
            {repeatMode === "one" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-subdued w-10 text-right">
            {formatDuration(currentTime)}
          </span>
          <Slider
            value={[currentTrack ? (currentTime / currentTrack.duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={([value]) => {
              if (currentTrack) {
                seekTo((value / 100) * currentTrack.duration);
              }
            }}
            className="flex-1 cursor-pointer"
          />
          <span className="text-xs text-subdued w-10">
            {currentTrack ? formatDuration(currentTrack.duration) : "0:00"}
          </span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        <button className="p-2 text-subdued hover:text-foreground transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="p-2 text-subdued hover:text-foreground transition-colors"
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="w-24 cursor-pointer"
          />
        </div>
        <button className="p-2 text-subdued hover:text-foreground transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

export default Player;
