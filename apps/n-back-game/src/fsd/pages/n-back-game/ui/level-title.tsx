"use client";

import React from "react";
import { motion } from "motion/react";

export const LevelTitle = ({ level }: { level: number }) => {
  return (
    <motion.h2
      className="text-4xl font-bold "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      N{level}
    </motion.h2>
  );
};
