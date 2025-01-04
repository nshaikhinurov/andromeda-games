import pickRandom from "../../shared/utils/pick-random";
import { COLORS, NUMBERS } from "./consts";

export type Stimulus = {
  id: number;
  number: (typeof NUMBERS)[number];
  color: (typeof COLORS)[number];
};

const generateStimulus = (index: number): Stimulus => {
  return {
    id: index,
    color: COLORS[0],
    number: pickRandom(NUMBERS),
  };
};

export const generateSequence = (n: number): Stimulus[] => {
  return Array.from({ length: n }, (v, i) => generateStimulus(i));
};
