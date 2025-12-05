import { useParams } from "react-router-dom";
import { Play, Clock, MoreHorizontal, Heart } from "lucide-react";
import { mockPlaylists } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";
import TrackRow from "@/components/TrackRow";

const PlaylistView = () => {
  const { id } = useParams();
  const { playTrack } = usePlayer();

  const playlist = mockPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-subdued">Playlist not found</p>
      </div>
    );
  }

  const totalDuration = playlist.tracks.reduce(
    (acc, track) => acc + track.duration,
    0
  );

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  // Generate gradient color based on playlist id
  const gradientColors = [
    "from-emerald-700/60",
    "from-rose-700/60",
    "from-violet-700/60",
    "from-amber-700/60",
    "from-cyan-700/60",
    "from-pink-700/60",
  ];
  const gradientColor = gradientColors[parseInt(playlist.id) % gradientColors.length];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className={`bg-gradient-to-b ${gradientColor} to-surface-base -mt-[72px] pt-[72px] p-6 pb-8`}>
        <div className="flex items-end gap-6">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-56 h-56 rounded-md object-cover shadow-2xl flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">Playlist</p>
            <h1 className="text-5xl font-bold text-foreground mb-6 line-clamp-2">
              {playlist.name}
            </h1>
            <p className="text-subdued mb-2">{playlist.description}</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold text-foreground">
                {playlist.createdBy}
              </span>
              <span className="text-subdued">•</span>
              <span className="text-subdued">
                {playlist.tracks.length} songs,
              </span>
              <span className="text-subdued">
                about {Math.floor(totalDuration / 60)} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex items-center gap-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Play
            className="w-6 h-6 text-primary-foreground ml-1"
            fill="currentColor"
          />
        </button>
        <button className="p-2 text-subdued hover:text-foreground transition-colors">
          <Heart className="w-8 h-8" />
        </button>
        <button className="p-2 text-subdued hover:text-foreground transition-colors">
          <MoreHorizontal className="w-8 h-8" />
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
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
          {playlist.tracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              playlist={playlist.tracks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
