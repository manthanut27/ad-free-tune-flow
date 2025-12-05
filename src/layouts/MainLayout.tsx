import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import Header from "@/components/Header";

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-surface-base rounded-lg m-2 ml-0 overflow-y-auto">
          <Header />
          <Outlet />
        </main>
      </div>
      <Player />
    </div>
  );
};

export default MainLayout;
