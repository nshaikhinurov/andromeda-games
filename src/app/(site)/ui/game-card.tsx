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
      className="group relative overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
    >
      {isComingSoon && <ComingSoonRibbon />}

      <div className="flex aspect-4/3 items-center justify-center overflow-hidden text-gray-800">
        {thumbnail || <GameThumbnailPlaceholder />}
      </div>

      <div className="border-t p-4">
        <h3 className="font-medium text-gray-900 transition-colors group-hover:text-indigo-600 group-hover:underline">
          {title}
        </h3>

        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
