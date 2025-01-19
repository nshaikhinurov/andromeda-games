"use client";

import { motion, MotionConfig } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "~/fsd/shared/ui/button";

export function HomePage() {
  const router = useRouter();

  return (
    <div className="text-center p-4">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Добро пожаловать в Andromeda Games!
      </motion.h1>

      <motion.p
        className="text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Тренируй память, скорость реакции и гибкость ума, играя с цветами и
        цифрами.
      </motion.p>

      <div className="grid gap-4 grid-rows-2 w-1/2 mx-auto">
        <MotionConfig transition={{ duration: 0.75, delay: 1 }}>
          <Button
            preset="blue"
            onClick={() => router.push("/n-back-game")}
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            N Back
          </Button>
          <Button
            preset="red"
            onClick={() => router.push("/kitsune-whisper-of-the-fox")}
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            Kitsune: Whisper of the Fox
          </Button>
        </MotionConfig>
      </div>
    </div>
  );
}
