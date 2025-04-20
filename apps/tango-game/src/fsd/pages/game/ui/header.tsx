import Image from "next/image";
import React from "react";

export const GameTitle = () => {
  return (
    <>
      <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
        <Image src="/favicon.svg" alt="Tango Game" width={32} height={32} />
        Tango Game
      </h1>
      <p className="text-center">
        Use your reasoning skills to harmonize the grid.
      </p>
    </>
  );
};
