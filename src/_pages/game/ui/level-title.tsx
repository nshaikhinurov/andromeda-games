"use client";

import React from "react";
import { motion } from "motion/react";

export const LevelTitle = ({ level }: { level: number }) => {
  return (
    <motion.div
      className="text-4xl font-bold mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Уровень n = {level}
    </motion.div>
  );
};
