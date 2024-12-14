"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

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

      <motion.button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStart}
      >
        Начать игру
      </motion.button>
    </div>
  );
}
