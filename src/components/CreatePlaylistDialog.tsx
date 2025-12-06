import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/context/AuthContext";

interface CreatePlaylistDialogProps {
  trigger?: React.ReactNode;
}

const CreatePlaylistDialog = ({ trigger }: CreatePlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createPlaylist } = usePlaylists();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    const playlist = await createPlaylist(name.trim(), description.trim());
    setIsCreating(false);

    if (playlist) {
      setName("");
      setDescription("");
      setOpen(false);
      navigate(`/playlist/${playlist.id}`);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <button className="p-2 text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent rounded-full transition-all">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Sign in required</DialogTitle>
            <DialogDescription className="text-subdued">
              Please sign in to create playlists.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/auth");
            }}
            className="w-full"
          >
            Sign in
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="p-2 text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent rounded-full transition-all">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Playlist</DialogTitle>
          <DialogDescription className="text-subdued">
            Give your playlist a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist"
              className="bg-surface-highlight border-border text-foreground"
              maxLength={100}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              className="bg-surface-highlight border-border text-foreground resize-none"
              rows={3}
              maxLength={300}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;
