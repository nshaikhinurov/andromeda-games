"use client";

import clsx from "clsx";
import { HTMLMotionProps, motion } from "motion/react";

type ButtonProps = HTMLMotionProps<"button"> & {
  preset: "green" | "blue" | "red";
};

export const Button = ({ preset, className, ...rest }: ButtonProps) => {
  return (
    <motion.button
      className={clsx(
        "text-white py-2 px-4 rounded-md",
        {
          "bg-green-500 hover:bg-green-600": preset === "green",
          "bg-blue-500 hover:bg-blue-600": preset === "blue",
          "bg-red-500 hover:bg-red-600": preset === "red",
        },
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...rest}
    />
  );
};
