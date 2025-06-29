import React, { useEffect } from "react";
import { FaRegClock } from "react-icons/fa6";
import { useGameDuration, useShouldDisplayTimer } from "~/fsd/app/stores";
import { formatElapsedTime } from "~/fsd/shared/lib/utils";

export const Timer = () => {
  const shouldDisplayTimer = useShouldDisplayTimer();
  const gameDuration = useGameDuration();
  const [displayTime, setDisplayTime] = React.useState(gameDuration);
  const timerString = formatElapsedTime(displayTime);

  useEffect(() => {
    // Update display time every 500ms for smooth timer display
    const interval = setInterval(() => {
      setDisplayTime(gameDuration);
    }, 500);

    return () => clearInterval(interval);
  }, [gameDuration]);

  return (
    shouldDisplayTimer && (
      <div className="flex items-center justify-center gap-1">
        <FaRegClock />
        <span>{timerString}</span>
      </div>
    )
  );
};
