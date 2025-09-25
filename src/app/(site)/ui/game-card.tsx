import Link from "next/link";
import { ComingSoonRibbon } from "./coming-soon-ribbon";
import { GameThumbnailPlaceholder } from "./game-thumbnail-placeholder";

export function GameCard({
  href = "#",
  title,
  description,
  thumbnail,
}: {
  title: string;
  description: string;
  thumbnail?: React.ReactNode;
  href?: string;
}) {
  const isComingSoon = !href || href === "#";

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg border bg-white  hover:shadow-md transition-shadow"
    >
      {isComingSoon && <ComingSoonRibbon />}

      <div className="aspect-[4/3] overflow-hidden flex items-center justify-center text-gray-800 ">
        {thumbnail || <GameThumbnailPlaceholder />}
      </div>

      <div className="p-4 border-t">
        <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 group-hover:underline transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
