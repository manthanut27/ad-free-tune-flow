import { Heart, Play, Clock } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { mockTracks, formatDuration } from "@/data/mockData";
import TrackRow from "@/components/TrackRow";

const LikedSongs = () => {
  const { likedSongs, playTrack } = usePlayer();

  const likedTracks = mockTracks.filter((track) => likedSongs.has(track.id));
  const totalDuration = likedTracks.reduce(
    (acc, track) => acc + track.duration,
    0
  );

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-700/60 to-background p-6 pb-8">
        <div className="flex items-end gap-6">
          <div className="w-56 h-56 rounded-md bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center shadow-2xl flex-shrink-0">
            <Heart className="w-20 h-20 text-foreground fill-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">Playlist</p>
            <h1 className="text-6xl font-bold text-foreground mb-6">
              Liked Songs
            </h1>
            <p className="text-subdued">
              {likedTracks.length} songs,{" "}
              <span className="text-subdued">
                about {Math.floor(totalDuration / 60)} min
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex items-center gap-6">
        <button
          onClick={handlePlayAll}
          disabled={likedTracks.length === 0}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play
            className="w-6 h-6 text-primary-foreground ml-1"
            fill="currentColor"
          />
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
        {likedTracks.length > 0 ? (
          <>
            {/* Header */}
            <div className="grid grid-cols-[16px_minmax(120px,4fr)_minmax(120px,2fr)_minmax(60px,1fr)] gap-4 px-4 py-2 border-b border-border text-subdued text-sm mb-2">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="flex justify-end">
                <Clock className="w-4 h-4" />
              </span>
            </div>

            {/* Tracks */}
            <div className="space-y-1">
              {likedTracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  playlist={likedTracks}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-subdued mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Songs you like will appear here
            </h2>
            <p className="text-subdued">
              Save songs by tapping the heart icon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
