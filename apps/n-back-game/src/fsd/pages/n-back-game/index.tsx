"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/button";
import { generateSequence, Stimulus } from "./model";
import { LevelCompleted } from "./ui/level-completed";
import { LevelTitle } from "./ui/level-title";
import { StimulusComponent } from "./ui/stimulus";

export function NBackGamePage() {
  const [nLevel, setNLevel] = useState(1);
  const [sequence, setSequence] = useState<Stimulus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(nLevel);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const currentStimulus = sequence.at(currentIndex);
  const stimulusToMatchWith = sequence.at(currentIndex - nLevel);

  const handleAnswer = (matchGuess: boolean) => {
    if (!currentStimulus || !stimulusToMatchWith) {
      return;
    }

    const doesStimulusMatch =
      currentStimulus.number === stimulusToMatchWith.number;
    const isCorrectAnswer = matchGuess === doesStimulusMatch;

    setAnswers((prev) => [...prev, isCorrectAnswer]);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    setSequence(generateSequence(10));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  }, []);

  return (
    <div className="p-40 flex flex-col justify-between items-center gap-10 h-screen">
      <LevelTitle level={nLevel} />

      {currentIndex !== sequence.length ? (
        <>
          <AnimatePresence mode="wait">
            {currentStimulus && stimulusToMatchWith && (
              <StimulusComponent
                key={stimulusToMatchWith.id}
                stimulus={currentStimulus}
              />
            )}
          </AnimatePresence>

          <div className="grid gap-4 grid-cols-2">
            <Button
              className="w-full"
              preset="red"
              onClick={() => handleAnswer(false)}
            >
              Не совпадает
            </Button>
            <Button
              className="w-full"
              preset="green"
              onClick={() => handleAnswer(true)}
            >
              Совпадает
            </Button>
          </div>
        </>
      ) : (
        <LevelCompleted
          accuracy={answers.filter(Boolean).length / answers.length}
        />
      )}
    </div>
  );
}
