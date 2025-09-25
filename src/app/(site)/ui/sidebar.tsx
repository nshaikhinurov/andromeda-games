import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-white hidden md:block">
      <div className="p-4">
        <h1 className="text-xl font-bold">Andromeda Games</h1>
      </div>

      <nav className="space-y-1 px-2">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg",
            true && "bg-gray-100"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>All content</span>
        </Link>
      </nav>
    </div>
  );
};
