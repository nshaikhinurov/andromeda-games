import Image from "next/image";

export const Title = ({ showSubtitle }: { showSubtitle: boolean }) => {
  return (
    <div className="grid gap-2 text-center">
      <h1
        className={`flex items-center justify-center select-none dark:text-white`}
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
        <p className="mx-auto max-w-lg text-balance text-gray-600 dark:text-gray-400">
          Тренируйте память, находя пары карт. Запоминайте позиции и набирайте
          очки!
        </p>
      )}
    </div>
  );
};
