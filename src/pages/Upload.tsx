import { Music, Trash2, Play, Pause, Upload } from "lucide-react";
import { useTracks, DatabaseTrack } from "@/hooks/useTracks";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, Track } from "@/data/mockData";
import UploadTrackDialog from "@/components/UploadTrackDialog";
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
import { cn } from "@/lib/utils";

// Convert database track to player track format
const toPlayerTrack = (dbTrack: DatabaseTrack): Track => ({
  id: dbTrack.id,
  title: dbTrack.title,
  artist: dbTrack.artist,
  album: dbTrack.album || "Unknown Album",
  duration: dbTrack.duration,
  coverUrl: dbTrack.cover_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  audioUrl: dbTrack.audio_url,
});

const UploadPage = () => {
  const { tracks, loading, deleteTrack } = useTracks();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Music</h1>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-subdued" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Upload your music
          </h2>
          <p className="text-subdued mb-6 max-w-md">
            Sign in to upload your own tracks and build your personal music library.
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

  const userTracks = tracks.filter((t) => t.user_id === user.id);
  const playerTracks = userTracks.map(toPlayerTrack);

  const handlePlay = (track: DatabaseTrack) => {
    const playerTrack = toPlayerTrack(track);
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(playerTrack, playerTracks);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Music</h1>
          <p className="text-subdued mt-1">
            {userTracks.length} {userTracks.length === 1 ? "track" : "tracks"} uploaded
          </p>
        </div>
        <UploadTrackDialog
          trigger={
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4" />
              Upload Track
            </Button>
          }
        />
      </div>

      {/* Tracks List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      ) : userTracks.length === 0 ? (
        <div className="text-center py-16">
          <Music className="w-20 h-20 text-subdued mx-auto mb-6" />
          <h3 className="text-xl font-bold text-foreground mb-3">
            No tracks uploaded yet
          </h3>
          <p className="text-subdued mb-6 max-w-md mx-auto">
            Upload your first track to start building your personal music library.
          </p>
          <UploadTrackDialog
            trigger={
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Your First Track
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          {userTracks.map((track) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrentTrack && isPlaying;

            return (
              <div
                key={track.id}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-lg hover:bg-surface-highlight transition-colors",
                  isCurrentTrack && "bg-surface-highlight"
                )}
              >
                {/* Cover & Play Button */}
                <div className="relative">
                  {track.cover_url ? (
                    <img
                      src={track.cover_url}
                      alt={track.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-surface-base flex items-center justify-center">
                      <Music className="w-6 h-6 text-subdued" />
                    </div>
                  )}
                  <button
                    onClick={() => handlePlay(track)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-8 h-8 text-white" fill="white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    )}
                  </button>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    isCurrentTrack ? "text-primary" : "text-foreground"
                  )}>
                    {track.title}
                  </p>
                  <p className="text-sm text-subdued truncate">
                    {track.artist}
                    {track.album && ` • ${track.album}`}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-sm text-subdued tabular-nums">
                  {formatDuration(track.duration)}
                </span>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-2 text-subdued hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-surface-elevated border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        Delete track?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-subdued">
                        This will permanently delete "{track.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-surface-highlight text-foreground border-border hover:bg-surface-elevated">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteTrack(track.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
