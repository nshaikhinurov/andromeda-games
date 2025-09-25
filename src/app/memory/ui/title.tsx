import { Caveat } from "next/font/google";
import Image from "next/image";

const caveat = Caveat({
  subsets: ["latin"],
});

export const Title = ({ showSubtitle }: { showSubtitle: boolean }) => {
  return (
    <div className="text-center  grid gap-2">
      <h1
        className={`text-4xl sm:text-5xl lg:text-6xl ${caveat.className} select-none  flex items-center justify-center  dark:text-white`}
      >
        <Image
          src={"/memory-logo.svg"}
          alt="Memory Game"
          width={198.08}
          height={64.45}
          unoptimized
        />
      </h1>

      {showSubtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-balance">
          Тренируйте память, находя пары карт. Запоминайте позиции и набирайте
          очки!
        </p>
      )}
    </div>
  );
};
