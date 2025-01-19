import { motion } from "motion/react";
import { useEffect } from "react";
import { useGameStore } from "../model/game-store";
import { useShallow } from "zustand/shallow";

export const TimerBar = () => {
  const { timerProgress, setTimerProgress, timerSpeed } = useGameStore(
    useShallow((state) => ({
      timerProgress: state.timerProgress,
      setTimerProgress: state.setTimerProgress,
      timerSpeed: state.timerSpeed,
    }))
  );

  useEffect(() => {
    let start: number;

    const updateTimer = (timestamp: number) => {
      if (start === undefined) {
        start = timestamp;
      }

      const elapsedSeconds = (timestamp - start) / 1000;

      // Уменьшаем прогресс с учётом скорости
      setTimerProgress(timerProgress - (elapsedSeconds * timerSpeed) / 600); // Таймер рассчитан на 1 минуту

      if (timerProgress > 0) {
        requestAnimationFrame(updateTimer);
      }
    };

    const handle = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(handle);
  }, [timerSpeed, setTimerProgress, timerProgress]);

  return (
    <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: timerProgress }}
        transition={{ ease: "linear" }}
        style={{ originX: 0 }}
      />
    </div>
  );
};
