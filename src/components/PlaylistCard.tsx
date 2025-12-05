import { Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Playlist } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const { playTrack } = usePlayer();
  const navigate = useNavigate();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="group p-4 bg-card hover:bg-card-hover rounded-lg transition-all duration-300 cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl play-button-hover hover:scale-105 transition-all"
        >
          <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
        </button>
      </div>
      <h3 className="font-bold text-foreground truncate mb-1">
        {playlist.name}
      </h3>
      <p className="text-sm text-subdued line-clamp-2">{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
