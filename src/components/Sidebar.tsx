import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { mockPlaylists } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Sidebar = () => {
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
            <button className="p-2 text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent rounded-full transition-all">
              <Plus className="w-5 h-5" />
            </button>
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
              <p className="text-sm text-subdued truncate">
                Playlist • 24 songs
              </p>
            </div>
          </NavLink>

          {/* User Playlists */}
          {mockPlaylists.slice(1).map((playlist) => (
            <NavLink
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors group"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {playlist.name}
                </p>
                <p className="text-sm text-subdued truncate">
                  Playlist • {playlist.createdBy}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
