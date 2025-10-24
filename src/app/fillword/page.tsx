"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  exportAsJSON,
  exportAsPNG,
  generatePrintHTML,
} from "./lib/export-utils";
import {
  GenerationStats,
  PlacementOptions,
  PlacementResult,
  WordItem,
} from "./lib/types";
import { fillEmptyGridCells } from "./lib/utils";
import {
  generateStats,
  placeWordsWithMultipleAttempts,
} from "./lib/word-placer";
import ControlsBar from "./ui/controls-bar";
import GridCanvas from "./ui/grid-canvas";
import WordInputPanel from "./ui/word-input-panel";
import WordList from "./ui/word-list";

export default function FillwordPage() {
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [highlightSolution, setHighlightSolution] = useState(false);
  const [highlightedWordId, setHighlightedWordId] = useState<string | null>(
    null,
  );
  const [lastGenerationParams, setLastGenerationParams] = useState<{
    words: WordItem[];
    width: number;
    height: number;
    options: PlacementOptions;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("fillword-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.result) {
          setResult(parsed.result);
          setStats(generateStats(parsed.result));
        }
        if (parsed.lastParams) {
          setLastGenerationParams(parsed.lastParams);
        }
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  // Save state to localStorage whenever result changes
  useEffect(() => {
    if (result && lastGenerationParams) {
      const stateToSave = {
        result,
        lastParams: lastGenerationParams,
      };
      localStorage.setItem("fillword-state", JSON.stringify(stateToSave));
    }
  }, [result, lastGenerationParams]);

  const handleGenerate = useCallback(
    async (
      words: WordItem[],
      width: number,
      height: number,
      options: PlacementOptions,
    ) => {
      setIsGenerating(true);
      setHighlightSolution(false);
      setHighlightedWordId(null);

      try {
        // Small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 100));

        const newResult = placeWordsWithMultipleAttempts(
          words,
          width,
          height,
          options,
          100,
        );
        const newStats = generateStats(newResult);

        setResult(newResult);
        setStats(newStats);
        setLastGenerationParams({ words, width, height, options });
      } catch (error) {
        console.error("Generation failed:", error);
        alert("Failed to generate word search. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  const handleRegenerate = useCallback(() => {
    if (lastGenerationParams) {
      const { words, width, height, options } = lastGenerationParams;
      handleGenerate(words, width, height, options);
    }
  }, [lastGenerationParams, handleGenerate]);

  const handleToggleHighlight = useCallback(() => {
    setHighlightSolution((prev) => !prev);
  }, []);

  const handleShuffle = useCallback(() => {
    if (result) {
      const newGrid = { ...result.grid };
      newGrid.cells = [...result.grid.cells];

      // Only shuffle empty cells (those not part of placed words)
      for (let i = 0; i < newGrid.cells.length; i++) {
        if (newGrid.cells[i].placedWordIds.length === 0) {
          newGrid.cells[i] = { ...newGrid.cells[i], char: "" };
        }
      }

      fillEmptyGridCells(newGrid);

      const newResult = { ...result, grid: newGrid };
      setResult(newResult);
    }
  }, [result]);

  const handleExport = useCallback(
    async (format: "json" | "png") => {
      if (!result) return;

      try {
        if (format === "json") {
          exportAsJSON(result, stats, lastGenerationParams?.options);
        } else if (format === "png") {
          if (gridRef.current) {
            await exportAsPNG(gridRef.current);
          } else {
            alert("Grid not found for PNG export");
          }
        }
      } catch (error) {
        console.error("Export failed:", error);
        alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
      }
    },
    [result, stats, lastGenerationParams],
  );

  const handlePrint = useCallback(() => {
    if (!result || !lastGenerationParams) return;

    try {
      const printHTML = generatePrintHTML(
        result,
        lastGenerationParams.words,
        false,
      );

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to use the print feature");
        return;
      }

      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Print failed:", error);
      alert("Failed to generate print version. Please try again.");
    }
  }, [result, lastGenerationParams]);

  const allWords = lastGenerationParams?.words || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Word Search Generator
          </h1>
          <p className="text-muted-foreground">
            Create custom word search puzzles with advanced placement algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Panel - Input & Controls */}
          <div className="space-y-6">
            <WordInputPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            <ControlsBar
              result={result}
              stats={stats}
              highlightSolution={highlightSolution}
              onToggleHighlight={handleToggleHighlight}
              onRegenerate={handleRegenerate}
              onShuffle={handleShuffle}
              onExport={handleExport}
              onPrint={handlePrint}
              isGenerating={isGenerating}
            />
          </div>

          {/* Center Panel - Grid */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-4 text-center text-lg font-semibold">
                Puzzle Grid
              </h3>
              <div ref={gridRef}>
                <GridCanvas
                  grid={result?.grid || null}
                  placedWords={result?.placedWords || []}
                  highlightSolution={highlightSolution}
                  highlightedWordId={highlightedWordId}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Word List */}
          <div>
            <WordList
              words={allWords}
              placedWords={result?.placedWords || []}
              unplacedWords={result?.unplacedWords || []}
              onWordHover={setHighlightedWordId}
              highlightedWordId={highlightedWordId}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS • Powered by
            advanced word placement algorithms
          </p>
        </footer>
      </div>
    </div>
  );
}
