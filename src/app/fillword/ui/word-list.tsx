"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { PlacedWord, WordItem } from "../lib/types";
import { DIRECTION_LABELS } from "../lib/utils";

interface WordListProps {
  words: WordItem[];
  placedWords: PlacedWord[];
  unplacedWords: WordItem[];
  onWordHover?: (wordId: string | null) => void;
  onWordClick?: (wordId: string) => void;
  highlightedWordId?: string | null;
}

export default function WordList({
  words,
  placedWords,
  unplacedWords,
  onWordHover,
  onWordClick,
  highlightedWordId,
}: WordListProps) {
  const placedWordIds = new Set(placedWords.map((pw) => pw.wordId));
  const unplacedWordIds = new Set(unplacedWords.map((w) => w.id));

  const getWordStatus = (word: WordItem): "placed" | "unplaced" | "unknown" => {
    if (placedWordIds.has(word.id)) return "placed";
    if (unplacedWordIds.has(word.id)) return "unplaced";
    return "unknown";
  };

  const getStatusIcon = (status: "placed" | "unplaced" | "unknown") => {
    switch (status) {
      case "placed":
        return <CheckIcon className="h-4 w-4 text-green-600" />;
      case "unplaced":
        return <XIcon className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: "placed" | "unplaced" | "unknown") => {
    switch (status) {
      case "placed":
        return "text-green-700 bg-green-50 border-green-200";
      case "unplaced":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  if (words.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 text-lg font-semibold">Word List</h3>
        <div className="py-8 text-center text-gray-500">
          No words to display
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Word List</h3>
        <div className="text-sm text-gray-600">
          {placedWords.length} of {words.length} placed
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded border border-green-200 bg-green-50 p-2 text-center">
          <div className="font-medium text-green-700">{placedWords.length}</div>
          <div className="text-green-600">Placed</div>
        </div>
        <div className="rounded border border-red-200 bg-red-50 p-2 text-center">
          <div className="font-medium text-red-700">{unplacedWords.length}</div>
          <div className="text-red-600">Unplaced</div>
        </div>
        <div className="rounded border border-blue-200 bg-blue-50 p-2 text-center">
          <div className="font-medium text-blue-700">{words.length}</div>
          <div className="text-blue-600">Total</div>
        </div>
      </div>

      {/* Word List */}
      <div className="max-h-96 space-y-1 overflow-y-auto p-1">
        {words.map((word) => {
          const status = getWordStatus(word);
          const isHighlighted = highlightedWordId === word.id;

          return (
            <Button
              key={word.id}
              variant="ghost"
              className={`h-auto w-full justify-start p-2 ${getStatusColor(status)} ${isHighlighted ? "ring-2 ring-blue-500" : ""} hover:bg-opacity-80`}
              onMouseEnter={() => onWordHover?.(word.id)}
              onMouseLeave={() => onWordHover?.(null)}
              onClick={() => onWordClick?.(word.id)}
            >
              <div className="flex w-full items-center justify-center space-x-3">
                <div className="flex-shrink-0">{getStatusIcon(status)}</div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">{word.text}</span>
                    {status === "placed" && (
                      <div className="mt-1 text-xs opacity-75">
                        {(() => {
                          const placedWord = placedWords.find(
                            (pw) => pw.wordId === word.id,
                          );
                          if (placedWord) {
                            return `${placedWord.start.x},${placedWord.start.y} ${DIRECTION_LABELS[placedWord.direction]}`;
                          }
                          return "";
                        })()}
                      </div>
                    )}
                    <span className="ml-2 text-xs opacity-75">
                      {word.length}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Additional Info */}
      {unplacedWords.length > 0 && (
        <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-3">
          <div className="mb-1 text-xs font-medium text-yellow-800">
            Unplaced Words
          </div>
          <div className="text-xs text-yellow-700">
            {unplacedWords.length} word(s) could not be placed. Try:
          </div>
          <ul className="mt-1 list-inside list-disc text-xs text-yellow-700">
            <li>Increasing grid size</li>
            <li>Allowing more directions</li>
            <li>Enabling word overlaps</li>
            <li>Removing longer words</li>
          </ul>
        </div>
      )}
    </div>
  );
}
