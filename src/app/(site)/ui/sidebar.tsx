import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="hidden w-64 border-r bg-white md:block">
      <div className="flex items-center justify-center gap-2 p-4">
        <Image
          src="/andromeda-games-logo.svg"
          alt="Andromeda Games Logo"
          width={40}
          height={40}
          className="w-14"
        />
        <h1 className="text-xl font-bold">Andromeda Games</h1>
      </div>

      <nav className="space-y-1 px-2">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700",
            true && "bg-gray-100",
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>All content</span>
        </Link>
      </nav>
    </div>
  );
};
