import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserMenu from "@/components/UserMenu";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface-base/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <UserMenu />
    </header>
  );
};

export default Header;
