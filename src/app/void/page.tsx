"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const voidGameDescription =
  "An online puzzle game where you fill the void with meaning. No instructions, no images, no sound, only keyboard.";

export default function HomePage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/void/1");
  };

  return (
    <>
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">void</h1>
        <p className="max-w-lg text-lg text-pretty">{voidGameDescription}</p>
      </div>

      <Button variant="default" className="w-55" onClick={handleClick}>
        enter
      </Button>
    </>
  );
}
