"use client";

import { motion } from "motion/react";
import { Stimulus } from "../model";

export const StimulusComponent = ({ stimulus }: { stimulus: Stimulus }) => {
  return (
    <motion.div
      className="flex items-center justify-center mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-32 h-32 rounded-md bg-slate-800`}>
        <p className="text-4xl text-white flex items-center justify-center h-full">
          {stimulus.number}
        </p>
      </div>
    </motion.div>
  );
};
