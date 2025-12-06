import { useState } from "react";
import { Plus, ListMusic, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

interface AddToPlaylistMenuProps {
  trackId: string;
  trigger?: React.ReactNode;
}

const AddToPlaylistMenu = ({ trackId, trigger }: AddToPlaylistMenuProps) => {
  const { playlists, addTrackToPlaylist } = usePlaylists();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const handleAddToPlaylist = async (playlistId: string) => {
    setAddingTo(playlistId);
    await addTrackToPlaylist(playlistId, trackId);
    setAddingTo(null);
  };

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <button className="p-1 text-subdued hover:text-foreground transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-surface-elevated border-border min-w-[200px]">
          <DropdownMenuLabel className="text-subdued">
            Sign in to add to playlist
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={() => navigate("/auth")}
            className="text-foreground cursor-pointer"
          >
            Sign in
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <button className="p-1 text-subdued hover:text-foreground transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-surface-elevated border-border min-w-[220px]">
        <DropdownMenuLabel className="text-subdued">
          Add to playlist
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <CreatePlaylistDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-foreground cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create new playlist
            </DropdownMenuItem>
          }
        />

        {playlists.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            {playlists.map((playlist) => {
              const isInPlaylist = playlist.tracks.some((t) => t.id === trackId);
              return (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={() => !isInPlaylist && handleAddToPlaylist(playlist.id)}
                  disabled={addingTo === playlist.id || isInPlaylist}
                  className="text-foreground cursor-pointer"
                >
                  <ListMusic className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate flex-1">{playlist.name}</span>
                  {isInPlaylist && (
                    <Check className="w-4 h-4 ml-2 text-primary flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToPlaylistMenu;
