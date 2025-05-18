import React, { useEffect } from "react";
import { FaRegClock } from "react-icons/fa6";
import {
  useGameFinishedAt,
  useGameStartedAt,
  useShouldDisplayTimer,
} from "~/fsd/app/store";
import { formatElapsedTime } from "~/fsd/shared/lib/utils";

export const Timer = () => {
  const gameStartedAt = useGameStartedAt();
  const gameFinishedAt = useGameFinishedAt();
  const shouldDisplayTimer = useShouldDisplayTimer();
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const timerString = formatElapsedTime(elapsedTime);

  useEffect(() => {
    if (gameFinishedAt) {
      setElapsedTime(gameFinishedAt - gameStartedAt);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - gameStartedAt);
    }, 500);

    return () => clearInterval(interval);
  }, [gameStartedAt, gameFinishedAt]);

  return (
    shouldDisplayTimer && (
      <div className="flex items-center justify-center gap-1">
        <FaRegClock />
        <span>{timerString}</span>
      </div>
    )
  );
};
