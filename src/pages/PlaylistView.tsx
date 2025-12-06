import { useParams, useNavigate } from "react-router-dom";
import { Play, Clock, MoreHorizontal, Trash2, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylistContext } from "@/context/PlaylistContext";
import TrackRow from "@/components/TrackRow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const { getPlaylist, deletePlaylist, removeTrackFromPlaylist } = usePlaylistContext();

  const playlist = getPlaylist(id || "");

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Music className="w-16 h-16 text-subdued mb-4" />
        <p className="text-subdued text-lg">Playlist not found</p>
        <p className="text-subdued text-sm mt-2">
          This playlist may have been deleted or you don't have access to it.
        </p>
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

  const handleDelete = async () => {
    const success = await deletePlaylist(playlist.id);
    if (success) {
      navigate("/library");
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    await removeTrackFromPlaylist(playlist.id, trackId);
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
  const gradientColor = gradientColors[playlist.id.charCodeAt(0) % gradientColors.length];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className={`bg-gradient-to-b ${gradientColor} to-surface-base -mt-[72px] pt-[72px] p-6 pb-8`}>
        <div className="flex items-end gap-6">
          {playlist.cover_url ? (
            <img
              src={playlist.cover_url}
              alt={playlist.name}
              className="w-56 h-56 rounded-md object-cover shadow-2xl flex-shrink-0"
            />
          ) : (
            <div className="w-56 h-56 rounded-md bg-surface-highlight flex items-center justify-center shadow-2xl flex-shrink-0">
              <Music className="w-20 h-20 text-subdued" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">Playlist</p>
            <h1 className="text-5xl font-bold text-foreground mb-6 line-clamp-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-subdued mb-2">{playlist.description}</p>
            )}
            <div className="flex items-center gap-1 text-sm">
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
          disabled={playlist.tracks.length === 0}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play
            className="w-6 h-6 text-primary-foreground ml-1"
            fill="currentColor"
          />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-subdued hover:text-foreground transition-colors">
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-surface-elevated border-border">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete playlist
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-surface-elevated border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    Delete playlist?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-subdued">
                    This will permanently delete "{playlist.name}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-surface-highlight text-foreground border-border hover:bg-surface-elevated">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-subdued mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Let's find something for your playlist
            </h3>
            <p className="text-subdued">
              Search for songs to add to this playlist.
            </p>
          </div>
        ) : (
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
              {playlist.tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  playlist={playlist.tracks}
                  playlistId={playlist.id}
                  onRemove={() => handleRemoveTrack(track.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
