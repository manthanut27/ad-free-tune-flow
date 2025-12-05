import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { mockTracks, mockArtists, mockPlaylists } from "@/data/mockData";
import TrackRow from "@/components/TrackRow";
import PlaylistCard from "@/components/PlaylistCard";

const categoryColors = [
  "from-rose-500 to-rose-700",
  "from-emerald-500 to-emerald-700",
  "from-violet-500 to-violet-700",
  "from-orange-500 to-orange-700",
  "from-cyan-500 to-cyan-700",
  "from-pink-500 to-pink-700",
  "from-blue-500 to-blue-700",
  "from-yellow-500 to-yellow-700",
];

const categories = [
  "Podcasts",
  "Live Events",
  "Made For You",
  "New Releases",
  "Pop",
  "Hip-Hop",
  "Rock",
  "Latin",
  "Dance/Electronic",
  "Indie",
  "Mood",
  "Discover",
];

const Search = () => {
  const [query, setQuery] = useState("");

  const filteredTracks = query
    ? mockTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()) ||
          track.album.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredPlaylists = query
    ? mockPlaylists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(query.toLowerCase()) ||
          playlist.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = filteredTracks.length > 0 || filteredPlaylists.length > 0;

  return (
    <div className="p-6 animate-fade-in">
      {/* Search Input */}
      <div className="relative max-w-md mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-foreground text-background rounded-full text-sm font-medium placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-foreground"
        />
      </div>

      {query ? (
        /* Search Results */
        <div className="animate-fade-in">
          {hasResults ? (
            <>
              {/* Tracks */}
              {filteredTracks.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Songs
                  </h2>
                  <div className="space-y-1">
                    {filteredTracks.map((track, index) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={index}
                        playlist={filteredTracks}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Playlists */}
              {filteredPlaylists.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Playlists
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredPlaylists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-bold text-foreground mb-2">
                No results found for "{query}"
              </p>
              <p className="text-subdued">
                Please make sure your words are spelled correctly, or use fewer
                or different keywords.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Browse Categories */
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Browse all
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div
                key={category}
                className={`aspect-square rounded-lg p-4 cursor-pointer bg-gradient-to-br ${
                  categoryColors[index % categoryColors.length]
                } hover:scale-105 transition-transform overflow-hidden relative`}
              >
                <h3 className="text-xl font-bold text-foreground">{category}</h3>
                <div className="absolute bottom-0 right-0 w-24 h-24 transform rotate-25 translate-x-4 translate-y-4">
                  <div className="w-full h-full bg-foreground/10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
