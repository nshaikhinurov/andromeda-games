"use client";

import React from "react";
import { motion } from "motion/react";

export const LevelCompleted = ({ accuracy }: { accuracy: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Уровень завершён! Точность: {Math.floor(accuracy * 100)}%
    </motion.div>
  );
};
