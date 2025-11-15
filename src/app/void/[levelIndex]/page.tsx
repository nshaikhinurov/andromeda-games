"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VirtualKeyboard } from "../ui/virtual-keyboard";
import { Level, levels } from "./levels";

export default function Page() {
  const router = useRouter();
  const { levelIndex } = useParams();

  const [value, setValue] = useState("");
  const [currentLevel, setCurrentLevel] = useState<Level>(() => {
    const index = Number(levelIndex);
    return levels.find((level) => level.index === index) || levels[0];
  });
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (isNaN(Number(levelIndex))) {
      router.replace("/void");
      return;
    }

    if (Number(levelIndex) < 1 || Number(levelIndex) > levels.length) {
      router.replace("/void/1");
      return;
    }

    // Проверка на читерство: пользователь не может перейти на уровень выше, чем решил + 1
    const solvedLevel = localStorage.getItem("lvl_solved");
    const maxAllowedLevel = solvedLevel ? Number(solvedLevel) + 1 : 1;

    if (Number(levelIndex) > maxAllowedLevel) {
      router.replace(`/void/${maxAllowedLevel}`);
      return;
    }

    setValid(true);
  }, [levelIndex, router]);

  if (!valid) {
    return null;
  }

  const handleSolve = () => {
    if (currentLevel.answerSet.includes(value.toLowerCase())) {
      // Сохраняем прогресс в localStorage
      localStorage.setItem("lvl_solved", String(currentLevel.index));

      const nextLevel = levels[currentLevel.index];

      if (nextLevel) {
        setCurrentLevel(nextLevel);
        setValue("");
        router.push(`/void/${nextLevel.index}`);
        return;
      }

      if (currentLevel.index === levels.length) {
        router.push("/void/solved");
        return;
      }
    }

    setValue("");
  };

  // const handleMoveNext = () => {
  //   const nextLevel = levels[currentLevel.index];

  //   if (nextLevel) {
  //     setCurrentLevel(nextLevel);
  //     setValue("");
  //     router.push(`/void/${nextLevel.index}`);
  //   }
  // };

  // const handleMovePrev = () => {
  //   const prevLevel = levels[currentLevel.index - 2];

  //   if (prevLevel) {
  //     setCurrentLevel(prevLevel);
  //     setValue("");
  //     router.push(`/void/${prevLevel.index}`);
  //   }
  // };

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (!e.shiftKey) return;

  //     if (e.key === "ArrowRight") {
  //       e.preventDefault();
  //       handleMoveNext();
  //     } else if (e.key === "ArrowLeft") {
  //       e.preventDefault();
  //       handleMovePrev();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [currentLevel]);

  const handleKeyPress = (key: string) => {
    if (key === "Backspace") {
      setValue((prev) => prev.slice(0, -1));
      return;
    }

    setValue((prev) => prev + key);
  };

  return (
    <div className="flex w-full max-w-150 grow flex-col items-center justify-center">
      <div className="p-4 text-center text-sm text-muted-foreground">
        lvl_{currentLevel.index}
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-end">
        <div className="flex flex-col items-center justify-end space-y-4 text-center wrap-anywhere">
          {currentLevel.question}
        </div>

        <div className="flex basis-[60%] flex-col items-center gap-4 p-4">
          <Input
            value={value}
            readOnly
            className={cn(
              "pointer-events-none w-full max-w-sm rounded-none border-0 border-b text-center text-xl! dark:bg-transparent",
            )}
          />

          <VirtualKeyboard onKeyPress={handleKeyPress} />

          <div className="grid w-full max-w-md grid-cols-2 gap-2">
            <Link href="/void">
              <Button variant="ghost" asChild>
                <div className="w-full">void</div>
              </Button>
            </Link>
            <Button variant="default" onClick={handleSolve}>
              solve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
