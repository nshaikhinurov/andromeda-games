"use client";

import { motion, transform } from "motion/react";
import React, { useEffect, useState } from "react";

const lerp = (start: number, end: number, t: number) => {
  return transform(t, [0, 1], [start, end]);
};

type CircleParams = {
  id: string;
  positions: { x: number; y: number }[];
  motionTimes: number[];
  opacities: number[];
  sizes: number[];
  scales: number[];
};

const BokehCircle = () => {
  const [circleParams, setSircleParams] = useState<CircleParams | undefined>();

  useEffect(() => {
    const positions = Array.from(
      { length: Math.round(lerp(3, 10, Math.random())) },
      () => ({
        x: lerp(0, window.innerWidth, Math.random()),
        y: lerp(0, window.innerHeight, Math.random()),
      })
    );
    const opacities = positions.map(() => lerp(0.01, 0.05, Math.random()));
    const sizes = positions.map(() => lerp(90, 150, Math.random()));

    // Close the circle
    positions.push(positions[0]);
    opacities.push(opacities[0]);
    sizes.push(sizes[0]);

    const distances = positions.map((position, index, positions) => {
      const prevPosition =
        positions[(positions.length + index - 1) % positions.length];

      return Math.sqrt(
        Math.pow(prevPosition.x - position.x, 2) +
          Math.pow(prevPosition.y - position.y, 2)
      );
    });

    const cumulativeDistances = distances.map((distance, index, distances) =>
      distances.slice(0, index + 1).reduce((acc, curr) => acc + curr, 0)
    );
    const totalDistance = cumulativeDistances[cumulativeDistances.length - 1];

    const motionTimes = cumulativeDistances.map(
      (distance) => distance / totalDistance
    );

    const scales = sizes.map((size) => size / sizes[0]);

    const circleParams = {
      id: self.crypto.randomUUID(),
      positions,
      motionTimes,
      opacities,
      sizes,
      scales,
    };

    setSircleParams(circleParams);
  }, []);

  return (
    circleParams && (
      <motion.div
        initial={{
          x: circleParams.positions[0].x,
          y: circleParams.positions[0].y,
          opacity: circleParams.opacities[0],
          scale: circleParams.scales[0],
        }}
        animate={{
          x: circleParams.positions.map((position) => position.x),
          y: circleParams.positions.map((position) => position.y),
          opacity: circleParams.opacities,
          scale: circleParams.scales,
        }}
        transition={{
          times: circleParams.motionTimes,
          duration: 60,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="absolute rounded-full bg-slate-950 blur-[2px]"
        style={{
          width: circleParams.sizes[0],
          height: circleParams.sizes[0],
        }}
      />
    )
  );
};

export const BokehBackground: React.FC = () => {
  const [circles] = useState(
    Array.from({ length: 10 }, (_, index) => <BokehCircle key={index} />)
  );

  return <div className="fixed inset-0 overflow-hidden">{circles}</div>;
};
