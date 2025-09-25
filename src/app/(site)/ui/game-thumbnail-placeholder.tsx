import Image from "next/image";

export const GameThumbnailPlaceholder = () => {
  return (
    <Image
      src="/placeholder.svg"
      alt={"Game Thumbnail Placeholder"}
      width={400}
      height={300}
      className="h-full w-full object-cover transition-transform group-hover:scale-105"
    />
  );
};
