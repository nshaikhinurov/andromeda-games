"use client";

import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  PrinterIcon,
  RefreshCwIcon,
  ShuffleIcon,
} from "lucide-react";
import { useState } from "react";
import { GenerationStats, PlacementResult } from "../lib/types";

interface ControlsBarProps {
  result: PlacementResult | null;
  stats: GenerationStats | null;
  highlightSolution: boolean;
  onToggleHighlight: () => void;
  onRegenerate: () => void;
  onShuffle: () => void;
  onExport: (format: "json" | "png") => void;
  onPrint: () => void;
  isGenerating?: boolean;
}

export default function ControlsBar({
  result,
  stats,
  highlightSolution,
  onToggleHighlight,
  onRegenerate,
  onShuffle,
  onExport,
  onPrint,
  isGenerating = false,
}: ControlsBarProps) {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <h3 className="text-lg font-semibold">Controls</h3>

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onRegenerate}
          disabled={isGenerating}
          variant="default"
          className="w-full"
        >
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Regenerate"}
        </Button>

        <Button
          onClick={onToggleHighlight}
          disabled={!result}
          variant={highlightSolution ? "default" : "outline"}
          className="w-full"
        >
          {highlightSolution ? (
            <>
              <EyeOffIcon className="mr-2 h-4 w-4" />
              Hide Solution
            </>
          ) : (
            <>
              <EyeIcon className="mr-2 h-4 w-4" />
              Show Solution
            </>
          )}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-cols-2 gap-1">
          <Button
            onClick={() => onExport("json")}
            disabled={!result}
            variant="outline"
            size="sm"
            title="Export as JSON file"
          >
            <DownloadIcon className="mr-1 h-3 w-3" />
            JSON
          </Button>

          <Button
            onClick={() => onExport("png")}
            disabled={!result}
            variant="outline"
            size="sm"
            title="Export as PNG image"
          >
            <DownloadIcon className="mr-1 h-3 w-3" />
            PNG
          </Button>
        </div>

        <Button
          onClick={onShuffle}
          disabled={!result || isGenerating}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <ShuffleIcon className="mr-1 h-4 w-4" />
          Shuffle
        </Button>

        <Button
          onClick={onPrint}
          disabled={!result}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <PrinterIcon className="mr-1 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Stats Toggle */}
      {stats && (
        <Button
          onClick={() => setShowStats(!showStats)}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          <InfoIcon className="mr-2 h-4 w-4" />
          {showStats ? "Hide" : "Show"} Statistics
        </Button>
      )}

      {/* Statistics Display */}
      {showStats && stats && (
        <div className="space-y-3 rounded-md bg-muted p-3">
          <h4 className="text-sm font-medium">Generation Statistics</h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Total Words:</span>
                <span className="font-mono">{stats.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span>Placed Words:</span>
                <span className="font-mono text-green-600">
                  {stats.placedWords}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-mono">
                  {stats.totalWords > 0
                    ? Math.round((stats.placedWords / stats.totalWords) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Overlaps:</span>
                <span className="font-mono">{stats.totalOverlaps}</span>
              </div>
              <div className="flex justify-between">
                <span>Area Used:</span>
                <span className="font-mono">{stats.boundingBoxArea}</span>
              </div>
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-mono">{stats.score}</span>
              </div>
            </div>
          </div>

          {result && (
            <div className="border-t border-border pt-2 text-xs">
              <div className="flex justify-between">
                <span>Generation Time:</span>
                <span className="font-mono">
                  {Math.round(result.generationTime)}ms
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>
          • <strong>Regenerate:</strong> Create a new layout with the same words
        </div>
        <div>
          • <strong>Shuffle:</strong> Randomize letters in empty cells
        </div>
        <div>
          • <strong>Show Solution:</strong> Highlight placed words in the grid
        </div>
        <div>
          • <strong>Export:</strong> Download as JSON file
        </div>
      </div>
    </div>
  );
}
