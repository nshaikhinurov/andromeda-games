"use client";

import { Item, ItemGroup } from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp, Scale } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { hashTo4Digits } from "./model";

const description =
  "Я — Глас Тота, хранитель знаков и чисел. Скажи слово, и я измерю его силу. Истина проявится лишь тому, кто ищет её чистым сердцем.";

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [code, setCode] = useState("XXXX");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (!value) {
      setCode("XXXX");
    }
  };

  const handleClick = async () => {
    if (!inputValue) {
      setCode("XXXX");
      return;
    }

    const code = await hashTo4Digits(inputValue.trim().toLowerCase(), []);
    setCode(code);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-orange-100 p-6">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <button className="absolute top-6 right-6 text-amber-700 transition-colors hover:text-amber-900">
            <CircleHelp size={32} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[clamp(200px,100vw-48px,600px)]"
          collisionPadding={24}
        >
          <Item className="text-pretty">
            <p className="w-full text-center text-base">
              Я — Глас Тота, хранитель знаков и чисел.
            </p>
            <p className="w-full text-center text-base">
              Назови слово, и я измерю его силу.
            </p>
            <p className="w-full text-center text-base">
              Истина проявится лишь тому, кто ищет её чистым сердцем.
            </p>
          </Item>
        </PopoverContent>
      </Popover>

      <div className="flex max-h-full w-full max-w-sm flex-col items-center gap-6">
        <Image
          alt="Thoth"
          src="/thoth.png"
          width={554}
          height={770}
          className="aspect-554/770 w-auto object-contain object-bottom"
        />

        <input
          type="text"
          className="h-15 w-full rounded-lg border-2 border-amber-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
          placeholder="Введите слово..."
          value={inputValue}
          onChange={handleInputChange}
        />

        <button
          className="flex h-15 items-center gap-4 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-colors duration-200 hover:bg-amber-700 hover:shadow-lg"
          onClick={handleClick}
        >
          <Scale /> Взвесить слово
        </button>

        <ItemGroup className="flex-row gap-2 text-gray-700">
          {(code || "XXXX").split("").map((digit, index) => (
            <DigitItem key={index} digit={digit} />
          ))}
        </ItemGroup>
      </div>
    </div>
  );
}

const DigitItem = ({ digit }: { digit: string }) => {
  return (
    <Item
      variant="outline"
      className="flex h-16 w-12 items-center justify-center border-2 border-amber-300 text-2xl font-bold text-amber-600"
    >
      {digit}
    </Item>
  );
};
