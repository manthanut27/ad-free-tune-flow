import { Home, Search, Library, Heart, Music } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { useAuth } from "@/context/AuthContext";
import CreatePlaylistDialog from "./CreatePlaylistDialog";
import { Skeleton } from "@/components/ui/skeleton";

const Sidebar = () => {
  const { playlists, loading } = usePlaylistContext();
  const { user } = useAuth();

  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col gap-2 p-2 h-full">
      {/* Main Navigation */}
      <nav className="bg-sidebar rounded-lg p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className="flex items-center gap-4 px-3 py-2 rounded-md text-sidebar-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              <Home className="w-6 h-6" />
              <span className="font-medium">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className="flex items-center gap-4 px-3 py-2 rounded-md text-sidebar-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              <Search className="w-6 h-6" />
              <span className="font-medium">Search</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Library Section */}
      <div className="bg-sidebar rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <NavLink
              to="/library"
              className="flex items-center gap-3 text-sidebar-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              <Library className="w-6 h-6" />
              <span className="font-medium">Your Library</span>
            </NavLink>
            <CreatePlaylistDialog />
          </div>
        </div>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {/* Liked Songs */}
          <NavLink
            to="/library/liked"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors group"
          >
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-foreground fill-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">Liked Songs</p>
              <p className="text-sm text-subdued truncate">Playlist</p>
            </div>
          </NavLink>

          {/* User Playlists from Database */}
          {loading ? (
            <div className="space-y-2 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-12 h-12 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            playlists.map((playlist) => (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors group"
              >
                {playlist.cover_url ? (
                  <img
                    src={playlist.cover_url}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-surface-highlight flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-subdued" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {playlist.name}
                  </p>
                  <p className="text-sm text-subdued truncate">
                    Playlist • {playlist.tracks.length} songs
                  </p>
                </div>
              </NavLink>
            ))
          )}

          {!loading && !user && (
            <div className="p-4 text-center">
              <p className="text-sm text-subdued">
                Sign in to create playlists
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
