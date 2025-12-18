import { useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import { Upload, Music, Image, X, Link, Download, Radio } from "lucide-react";
import { useTracks } from "@/hooks/useTracks";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UploadTrackDialogProps {
  trigger?: React.ReactNode;
}

const UploadTrackDialog = ({ trigger }: UploadTrackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [audioUrl, setAudioUrl] = useState("");
  const [storageMode, setStorageMode] = useState<"stream" | "download">("stream");
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadTrack, addTrackFromUrl, uploading } = useTracks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setAlbum("");
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setAudioUrl("");
    setStorageMode("stream");
    setActiveTab("upload");
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Auto-fill title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAudioUrl(url);
    // Auto-fill title from URL filename if empty
    if (!title && url) {
      try {
        const urlObj = new URL(url);
        const filename = urlObj.pathname.split("/").pop();
        if (filename) {
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
          setTitle(decodeURIComponent(nameWithoutExt));
        }
      } catch {
        // Invalid URL, ignore
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "upload") {
      if (!audioFile || !title.trim() || !artist.trim()) return;

      const track = await uploadTrack(audioFile, coverFile, {
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim() || undefined,
      });

      if (track) {
        resetForm();
        setOpen(false);
      }
    } else {
      if (!audioUrl.trim() || !title.trim() || !artist.trim()) return;

      const track = await addTrackFromUrl(
        audioUrl.trim(),
        coverFile,
        {
          title: title.trim(),
          artist: artist.trim(),
          album: album.trim() || undefined,
        },
        storageMode
      );

      if (track) {
        resetForm();
        setOpen(false);
      }
    }
  };

  const isFormValid = activeTab === "upload" 
    ? audioFile && title.trim() && artist.trim()
    : audioUrl.trim() && title.trim() && artist.trim();

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Sign in required</DialogTitle>
            <DialogDescription className="text-subdued">
              Please sign in to upload tracks.
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
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-surface-elevated border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Track</DialogTitle>
          <DialogDescription className="text-subdued">
            Upload a file or add from URL.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "url")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <Link className="w-4 h-4" />
                Add URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              {/* Audio File Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">Audio File *</Label>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                />
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/50 transition-colors"
                >
                  {audioFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Music className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground truncate max-w-[200px]">
                          {audioFile.name}
                        </p>
                        <p className="text-sm text-subdued">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Music className="w-10 h-10 text-subdued mx-auto mb-2" />
                      <p className="text-foreground font-medium">Click to select audio file</p>
                      <p className="text-sm text-subdued">MP3, WAV, M4A, etc.</p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              {/* Audio URL Input */}
              <div className="space-y-2">
                <Label className="text-foreground">Audio URL *</Label>
                <Input
                  value={audioUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/audio.mp3"
                  className="bg-surface-highlight border-border text-foreground"
                  type="url"
                />
                <p className="text-xs text-subdued">
                  Paste a direct link to an MP3, WAV, or other audio file
                </p>
              </div>

              {/* Storage Mode Selection */}
              <div className="space-y-3">
                <Label className="text-foreground">Storage Mode</Label>
                <RadioGroup
                  value={storageMode}
                  onValueChange={(v) => setStorageMode(v as "stream" | "download")}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-surface-highlight/50 transition-colors">
                    <RadioGroupItem value="stream" id="stream" />
                    <Label htmlFor="stream" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Radio className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Stream directly</p>
                        <p className="text-xs text-subdued">Play from the original URL (no storage used)</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-surface-highlight/50 transition-colors">
                    <RadioGroupItem value="download" id="download" />
                    <Label htmlFor="download" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Download className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Download to storage</p>
                        <p className="text-xs text-subdued">Save a copy to your library (more reliable)</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Album Cover (optional)</Label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
            <div className="flex gap-3">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-surface-highlight/50 transition-colors"
                >
                  <Image className="w-6 h-6 text-subdued" />
                  <span className="text-xs text-subdued mt-1">Add cover</span>
                </div>
              )}
              <div className="flex-1 text-sm text-subdued">
                <p>Square image recommended</p>
                <p>JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Track title"
                className="bg-surface-highlight border-border text-foreground"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-foreground">Artist *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
                className="bg-surface-highlight border-border text-foreground"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album" className="text-foreground">Album (optional)</Label>
              <Input
                id="album"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Album name"
                className="bg-surface-highlight border-border text-foreground"
                maxLength={100}
              />
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <p className="text-sm text-subdued">
                {activeTab === "url" && storageMode === "download" 
                  ? "Downloading and saving..." 
                  : "Uploading..."}
              </p>
              <Progress value={undefined} className="h-2" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={uploading}
              className="text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || uploading}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {uploading 
                ? (activeTab === "url" && storageMode === "download" ? "Saving..." : "Uploading...") 
                : (activeTab === "url" ? "Add Track" : "Upload")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTrackDialog;
