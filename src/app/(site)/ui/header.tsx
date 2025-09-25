import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4 gap-6">
      <div className="max-w-96 grow">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search games..." className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200"></div>
      </div>
    </header>
  );
};
