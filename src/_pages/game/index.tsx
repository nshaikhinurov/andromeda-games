"use client";

import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/button";
import { generateSequence, Stimulus } from "./model";
import { LevelTitle } from "./ui/level-title";
import { StimulusComponent } from "./ui/stimulus";
import { AnimatePresence, motion } from "motion/react";
import { LevelCompleted } from "./ui/level-completed";

export default function GamePage() {
  const [nLevel, setNLevel] = useState(1);
  const [sequence, setSequence] = useState<Stimulus[]>(() =>
    generateSequence(10)
  );
  const [currentIndex, setCurrentIndex] = useState(nLevel);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const currentStimulus = sequence[currentIndex];
  const stimulusToMatchWith = sequence[currentIndex - nLevel];

  const handleAnswer = (matchGuess: boolean) => {
    const doesStimulusMatch =
      currentStimulus.number === stimulusToMatchWith.number;
    const isCorrectAnswer = matchGuess === doesStimulusMatch;

    setAnswers((prev) => [...prev, isCorrectAnswer]);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  }, []);

  return (
    <div className="text-center p-4">
      <LevelTitle level={nLevel} />

      {currentIndex !== sequence.length ? (
        <>
          <AnimatePresence mode="wait">
            <StimulusComponent
              key={stimulusToMatchWith.id}
              stimulus={currentStimulus}
            />
          </AnimatePresence>

          <div className="flex gap-4 justify-center">
            <Button preset="green" onClick={() => handleAnswer(true)}>
              Совпадает
            </Button>
            <Button preset="red" onClick={() => handleAnswer(false)}>
              Не совпадает
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
