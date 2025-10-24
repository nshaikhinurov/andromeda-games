"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState } from "react";
import { Direction, PlacementOptions, WordItem } from "../lib/types";
import { ALL_DIRECTIONS, DIRECTION_LABELS, parseWordList } from "../lib/utils";

interface WordInputPanelProps {
  onGenerate: (
    words: WordItem[],
    width: number,
    height: number,
    options: PlacementOptions,
  ) => void;
  isGenerating?: boolean;
}

const SAMPLE_WORDS = `JAVASCRIPT
TYPESCRIPT
REACT
NEXTJS
TAILWIND
COMPONENT
ALGORITHM
FUNCTION
VARIABLE
CONSTANT
ARRAY
OBJECT
STRING
BOOLEAN
NUMBER`;

const SAMPLE_THEMES = {
  programming: SAMPLE_WORDS,
  animals: `ELEPHANT
GIRAFFE
TIGER
LION
ZEBRA
MONKEY
RABBIT
HORSE
DOLPHIN
WHALE
EAGLE
FALCON
SNAKE
LIZARD
TURTLE`,
  colors: `RED
BLUE
GREEN
YELLOW
ORANGE
PURPLE
PINK
BROWN
BLACK
WHITE
GRAY
CYAN
MAGENTA
VIOLET
INDIGO`,
};

export default function WordInputPanel({
  onGenerate,
  isGenerating = false,
}: WordInputPanelProps) {
  const [wordInput, setWordInput] = useState(SAMPLE_WORDS);
  const [gridWidth, setGridWidth] = useState(15);
  const [gridHeight, setGridHeight] = useState(15);
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [requireAllWords, setRequireAllWords] = useState(false);
  const [selectedDirections, setSelectedDirections] = useState<Set<Direction>>(
    new Set(["E", "S", "SE"]),
  );
  const [timeLimitMs, setTimeLimitMs] = useState(2000);

  const handleDirectionToggle = useCallback((direction: Direction) => {
    setSelectedDirections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(direction)) {
        newSet.delete(direction);
      } else {
        newSet.add(direction);
      }
      return newSet;
    });
  }, []);

  const handleGenerate = useCallback(() => {
    const words = parseWordList(wordInput);
    if (words.length === 0) {
      alert("Please enter at least one word");
      return;
    }

    if (selectedDirections.size === 0) {
      alert("Please select at least one direction");
      return;
    }

    const options: PlacementOptions = {
      allowOverlap,
      requireAllWords,
      directions: Array.from(selectedDirections),
      timeLimitMs,
    };

    onGenerate(words, gridWidth, gridHeight, options);
  }, [
    wordInput,
    gridWidth,
    gridHeight,
    allowOverlap,
    requireAllWords,
    selectedDirections,
    timeLimitMs,
    onGenerate,
  ]);

  const loadSampleWords = useCallback((theme: keyof typeof SAMPLE_THEMES) => {
    setWordInput(SAMPLE_THEMES[theme]);
  }, []);

  return (
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Word Search Generator</h2>

        {/* Word Input */}
        <div className="space-y-2">
          <label htmlFor="words" className="text-sm font-medium">
            Words (one per line or comma-separated)
          </label>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="programming">Programming</TabsTrigger>
              <TabsTrigger value="animals">Animals</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <textarea
                id="words"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                className="h-32 w-full resize-none rounded-md border p-3 font-mono text-sm"
                placeholder="Enter words here..."
              />
            </TabsContent>
            <TabsContent value="programming">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => loadSampleWords("programming")}
                  className="w-full"
                >
                  Load Programming Words
                </Button>
                <div className="text-xs text-muted-foreground">
                  JavaScript, TypeScript, React, Next.js, and more programming
                  terms
                </div>
              </div>
            </TabsContent>
            <TabsContent value="animals">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => loadSampleWords("animals")}
                  className="w-full"
                >
                  Load Animal Words
                </Button>
                <div className="text-xs text-muted-foreground">
                  Various animals from around the world
                </div>
              </div>
            </TabsContent>
            <TabsContent value="colors">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => loadSampleWords("colors")}
                  className="w-full"
                >
                  Load Color Words
                </Button>
                <div className="text-xs text-muted-foreground">
                  Common color names and variants
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Grid Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="text-sm font-medium">
            Grid Width
          </label>
          <input
            id="width"
            type="number"
            min="5"
            max="30"
            value={gridWidth}
            onChange={(e) => setGridWidth(parseInt(e.target.value) || 15)}
            className="w-full rounded-md border p-2"
          />
        </div>
        <div>
          <label htmlFor="height" className="text-sm font-medium">
            Grid Height
          </label>
          <input
            id="height"
            type="number"
            min="5"
            max="30"
            value={gridHeight}
            onChange={(e) => setGridHeight(parseInt(e.target.value) || 15)}
            className="w-full rounded-md border p-2"
          />
        </div>
      </div>

      {/* Directions */}
      <div>
        <label className="mb-3 block text-sm font-medium">
          Allowed Directions
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ALL_DIRECTIONS.map((direction) => (
            <Button
              key={direction}
              variant={
                selectedDirections.has(direction) ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleDirectionToggle(direction)}
              className="text-xs"
            >
              {DIRECTION_LABELS[direction]}
            </Button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Options</label>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowOverlap"
            checked={allowOverlap}
            onChange={(e) => setAllowOverlap(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="allowOverlap" className="text-sm">
            Allow word overlaps (when letters match)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requireAllWords"
            checked={requireAllWords}
            onChange={(e) => setRequireAllWords(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="requireAllWords" className="text-sm">
            Require all words to be placed
          </label>
        </div>

        <div>
          <label htmlFor="timeLimit" className="text-sm font-medium">
            Time limit (ms): {timeLimitMs}
          </label>
          <input
            id="timeLimit"
            type="range"
            min="500"
            max="15000"
            step="100"
            value={timeLimitMs}
            onChange={(e) => setTimeLimitMs(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Generating..." : "Generate Word Search"}
      </Button>
    </div>
  );
}
