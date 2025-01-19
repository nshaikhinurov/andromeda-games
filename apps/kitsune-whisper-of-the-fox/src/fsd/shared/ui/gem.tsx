import Image from "next/image";
import gem from "public/kitsune/gem.svg";

export const Gem = ({
  className,
  width = 10,
}: {
  className?: string;
  width?: number | `${number}`;
}) => {
  return (
    <Image
      unoptimized
      alt="gem"
      src={gem}
      width={width}
      className={`pointer-events-none z-10 ${className}`}
    />
  );
};
