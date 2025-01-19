"use client";

import { motion } from "motion/react";
import { Stimulus } from "../model";

export const StimulusComponent = ({ stimulus }: { stimulus: Stimulus }) => {
  return (
    <motion.div
      className="relative w-32 h-32 "
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {/* <motion.div
        className="w-full h-full absolute bg-slate-700 rounded-full opacity-10"
        animate={{
          scale: [1.75, 1.9, 1.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          delay: 0.5,
        }}
      />
      <motion.div
        className="w-full h-full absolute bg-slate-700 rounded-full opacity-10"
        animate={{
          scale: [1.3, 1.5, 1.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      /> */}
      <div
        className={`relative w-full h-full rounded-full bg-slate-700 text-7xl text-white flex items-center justify-center `}
      >
        {stimulus.number}
      </div>
    </motion.div>
  );
};
