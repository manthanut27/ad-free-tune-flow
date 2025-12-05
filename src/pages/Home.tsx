import { mockPlaylists, recentlyPlayed } from "@/data/mockData";
import PlaylistCard from "@/components/PlaylistCard";
import RecentlyPlayedCard from "@/components/RecentlyPlayedCard";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 pb-8 animate-fade-in">
      {/* Hero Section with Gradient */}
      <div className="gradient-hero -m-6 -mt-[72px] pt-[72px] mb-0 p-6 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {getGreeting()}{user ? `, ${user.user_metadata?.display_name || user.email?.split("@")[0]}` : ""}
        </h1>

        {/* Recently Played Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {recentlyPlayed.map((track) => (
            <RecentlyPlayedCard
              key={track.id}
              track={track}
              playlist={recentlyPlayed}
            />
          ))}
        </div>
      </div>

      {/* Made For You */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Made For You</h2>
          <button className="text-sm font-bold text-subdued hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {mockPlaylists.slice(0, 6).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* Popular Playlists */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Popular Playlists
          </h2>
          <button className="text-sm font-bold text-subdued hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {mockPlaylists.slice(2).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Recently Added</h2>
          <button className="text-sm font-bold text-subdued hover:underline">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {mockPlaylists.slice(1, 5).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
