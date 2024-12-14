"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "~/shared/ui/button";

export function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/game");
  };

  return (
    <div className="text-center p-4">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Добро пожаловать в n-back!
      </motion.h1>

      <motion.p
        className="text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Тренируй память, играя с цветами и цифрами.
      </motion.p>

      <Button preset="blue" onClick={handleStart}>
        Начать игру
      </Button>
    </div>
  );
}
