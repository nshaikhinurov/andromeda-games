// Export utilities for the Word Search app

import { GenerationStats, PlacementResult } from "./types";

/**
 * Export puzzle data as JSON
 */
export function exportAsJSON(
  result: PlacementResult,
  stats: GenerationStats | null,
  options?: any,
): void {
  const dataToExport = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0",
      generator: "Andromeda Games Fillword",
    },
    puzzle: {
      grid: result.grid,
      placedWords: result.placedWords,
      unplacedWords: result.unplacedWords,
      stats: stats,
    },
    options: options,
  };

  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fillword-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export puzzle as PNG using canvas
 */
export function exportAsPNG(
  gridElement: HTMLElement,
  filename?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Get grid dimensions and styling
      const rect = gridElement.getBoundingClientRect();
      canvas.width = rect.width * 2; // High DPI
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);

      // Set background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw grid manually by reading the DOM
      const cells = gridElement.querySelectorAll(
        '[role="gridcell"], .grid-cell',
      );
      const gridStyle = window.getComputedStyle(gridElement);
      const columns = parseInt(
        gridStyle.gridTemplateColumns?.split(" ").length.toString() || "1",
      );

      cells.forEach((cell, index) => {
        const cellElement = cell as HTMLElement;
        const cellRect = cellElement.getBoundingClientRect();
        const gridRect = gridElement.getBoundingClientRect();

        const x = cellRect.left - gridRect.left;
        const y = cellRect.top - gridRect.top;
        const width = cellRect.width;
        const height = cellRect.height;

        // Draw cell background
        const computedStyle = window.getComputedStyle(cellElement);
        ctx.fillStyle = computedStyle.backgroundColor || "#ffffff";
        ctx.fillRect(x, y, width, height);

        // Draw cell border
        ctx.strokeStyle = computedStyle.borderColor || "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw text
        const text = cellElement.textContent || "";
        if (text) {
          ctx.fillStyle = computedStyle.color || "#000000";
          ctx.font = `bold ${Math.min(width * 0.6, 16)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, x + width / 2, y + height / 2);
        }
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || `fillword-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate print-friendly HTML for the puzzle
 */
export function generatePrintHTML(
  result: PlacementResult,
  words: any[],
  showSolution: boolean = false,
): string {
  const gridHTML = result.grid.cells
    .map((cell, index) => {
      const row = Math.floor(index / result.grid.width);
      const col = index % result.grid.width;
      const isNewRow = col === 0;

      return `${isNewRow ? "<tr>" : ""}<td class="cell">${cell.char}</td>${col === result.grid.width - 1 ? "</tr>" : ""}`;
    })
    .join("");

  const wordsHTML = result.placedWords
    .map((pw, i) => {
      const word = words.find((w) => w.id === pw.wordId);
      const position = showSolution
        ? ` (${pw.start.x + 1},${pw.start.y + 1} ${pw.direction})`
        : "";
      return `<li>${word?.text || "Unknown"}${position}</li>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Word Search Puzzle</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; margin-bottom: 30px; }
          .grid-container { text-align: center; margin: 30px 0; }
          table { border-collapse: collapse; margin: 0 auto; }
          .cell { 
            width: 30px; height: 30px; 
            border: 2px solid #333; 
            text-align: center; 
            vertical-align: middle;
            font-weight: bold; 
            font-size: 18px;
            background: white;
          }
          .word-list { margin-top: 40px; }
          .word-list h2 { margin-bottom: 15px; }
          .word-list ul { list-style-type: none; padding: 0; columns: 2; column-gap: 40px; }
          .word-list li { margin: 8px 0; font-size: 16px; break-inside: avoid; }
          .stats { margin-top: 30px; font-size: 14px; color: #666; }
          @media print { 
            body { margin: 0; padding: 15px; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Word Search Puzzle</h1>
        <div class="grid-container">
          <table>
            ${gridHTML}
          </table>
        </div>
        <div class="word-list">
          <h2>Find these words:</h2>
          <ul>
            ${wordsHTML}
          </ul>
        </div>
        <div class="stats">
          <p>Generated: ${new Date().toLocaleDateString()} | 
          Grid: ${result.grid.width}×${result.grid.height} | 
          Words: ${result.placedWords.length}/${result.placedWords.length + result.unplacedWords.length}</p>
        </div>
      </body>
    </html>
  `;
}
