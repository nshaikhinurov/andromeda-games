import Image from "next/image";
import chaos from "public/kitsune/chaos.svg";
import dark from "public/kitsune/dark.svg";
import energy from "public/kitsune/energy.svg";
import red from "public/kitsune/red.svg";
import sakura from "public/kitsune/sakura.svg";
import white from "public/kitsune/white.svg";
import { Tile } from "~/fsd/pages/model/types";

const images: Record<Tile["type"], React.ComponentProps<typeof Image>["src"]> =
  {
    white,
    red,
    dark,
    sakura,
    energy,
    chaos,
  };

export const Mask = ({ type }: { type: Tile["type"] }) => {
  return (
    <Image
      unoptimized
      alt={type}
      src={images[type]}
      fill
      className="pointer-events-none"
    />
  );
};
