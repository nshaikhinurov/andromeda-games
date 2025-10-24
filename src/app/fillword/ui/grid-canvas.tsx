"use client";

import { useCallback, useMemo, useState } from "react";
import { Grid, PlacedWord, Point } from "../lib/types";
import { indexToPoint } from "../lib/utils";

interface GridCanvasProps {
  grid: Grid | null;
  placedWords: PlacedWord[];
  highlightSolution: boolean;
  interactiveMode?: boolean;
  onCellClick?: (point: Point) => void;
  selectedCells?: Set<string>;
  highlightedWordId?: string | null;
}

// Colors for highlighting different words
const WORD_COLORS = [
  "bg-red-200 border-red-400",
  "bg-blue-200 border-blue-400",
  "bg-green-200 border-green-400",
  "bg-yellow-200 border-yellow-400",
  "bg-purple-200 border-purple-400",
  "bg-pink-200 border-pink-400",
  "bg-indigo-200 border-indigo-400",
  "bg-orange-200 border-orange-400",
  "bg-teal-200 border-teal-400",
  "bg-cyan-200 border-cyan-400",
];

export default function GridCanvas({
  grid,
  placedWords,
  highlightSolution,
  interactiveMode = false,
  onCellClick,
  selectedCells = new Set(),
  highlightedWordId = null,
}: GridCanvasProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Use either the explicitly highlighted word or the hovered word
  const activeHighlightedWord = highlightedWordId || hoveredWord;

  // Create a map of positions to word IDs for highlighting
  const positionToWords = useMemo(() => {
    const map = new Map<string, string[]>();

    for (const placedWord of placedWords) {
      for (const position of placedWord.positions) {
        const key = `${position.x},${position.y}`;
        const existing = map.get(key) || [];
        existing.push(placedWord.wordId);
        map.set(key, existing);
      }
    }

    return map;
  }, [placedWords]);

  // Get the color class for a cell
  const getCellColorClass = useCallback(
    (point: Point): string => {
      const key = `${point.x},${point.y}`;
      const cellWordIds = positionToWords.get(key) || [];

      if (!highlightSolution && !activeHighlightedWord) {
        if (selectedCells.has(key)) {
          return "bg-blue-100 border-blue-300";
        }
        return "bg-white border-gray-300 hover:bg-gray-50";
      }

      // If highlighting a specific word, only highlight that word
      if (activeHighlightedWord) {
        if (cellWordIds.includes(activeHighlightedWord)) {
          const wordIndex = placedWords.findIndex(
            (pw) => pw.wordId === activeHighlightedWord,
          );
          return WORD_COLORS[wordIndex % WORD_COLORS.length];
        }
        return "bg-white border-gray-300";
      }

      // Highlight solution mode
      if (highlightSolution && cellWordIds.length > 0) {
        // Use the color of the first word for simplicity
        const firstWordId = cellWordIds[0];
        const wordIndex = placedWords.findIndex(
          (pw) => pw.wordId === firstWordId,
        );
        return WORD_COLORS[wordIndex % WORD_COLORS.length];
      }

      if (selectedCells.has(key)) {
        return "bg-blue-100 border-blue-300";
      }

      return "bg-white border-gray-300 hover:bg-gray-50";
    },
    [
      highlightSolution,
      activeHighlightedWord,
      positionToWords,
      placedWords,
      selectedCells,
    ],
  );

  const handleCellClick = useCallback(
    (point: Point) => {
      if (interactiveMode && onCellClick) {
        onCellClick(point);
      }
    },
    [interactiveMode, onCellClick],
  );

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent, point: Point) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCellClick(point);
      }
    },
    [handleCellClick],
  );

  if (!grid) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium">No Grid Generated</div>
          <div className="text-sm">
            Click "Generate Word Search" to create a puzzle
          </div>
        </div>
      </div>
    );
  }

  const cellSize = Math.min(400 / Math.max(grid.width, grid.height), 40);
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${grid.height}, ${cellSize}px)`,
    gap: "1px",
    width: "fit-content",
    margin: "0 auto",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div
          style={gridStyle}
          className="rounded-lg border-2 border-gray-400 bg-gray-100 p-2"
        >
          {grid.cells.map((cell, index) => {
            const point = indexToPoint(index, grid.width);
            const key = `${point.x},${point.y}`;
            const cellWordIds = positionToWords.get(key) || [];
            const colorClass = getCellColorClass(point);

            return (
              <div
                key={index}
                className={` ${colorClass} flex items-center justify-center border-2 text-sm font-bold transition-colors select-none ${interactiveMode ? "cursor-pointer" : ""} ${cellWordIds.length > 0 ? "ring-1 ring-gray-400" : ""} `}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  fontSize: `${Math.max(cellSize * 0.4, 10)}px`,
                }}
                onClick={() => handleCellClick(point)}
                onKeyDown={(e) => handleCellKeyDown(e, point)}
                tabIndex={interactiveMode ? 0 : -1}
                role={interactiveMode ? "button" : "gridcell"}
                aria-label={`Row ${point.y + 1}, Column ${point.x + 1}, Letter ${cell.char}`}
                title={
                  highlightSolution && cellWordIds.length > 0
                    ? `Part of: ${cellWordIds
                        .map((id) => {
                          const word = placedWords.find(
                            (pw) => pw.wordId === id,
                          );
                          return word
                            ? `Word ${placedWords.indexOf(word) + 1}`
                            : "Unknown";
                        })
                        .join(", ")}`
                    : `${cell.char} (${point.x}, ${point.y})`
                }
              >
                {cell.char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid info */}
      <div className="text-center text-sm text-gray-600">
        Grid size: {grid.width} × {grid.height} | Placed words:{" "}
        {placedWords.length} | Total cells: {grid.cells.length}
      </div>
    </div>
  );
}
