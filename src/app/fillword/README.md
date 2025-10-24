# Word Search (Fillword) Generator

A sophisticated web application for generating custom word search puzzles with advanced placement algorithms.

## Features

### Core Functionality

- **Custom Word Lists**: Enter your own words or choose from themed presets (Programming, Animals, Colors)
- **Flexible Grid Sizes**: Support for grids from 5x5 to 30x30
- **8-Direction Placement**: Choose from any combination of North, Northeast, East, Southeast, South, Southwest, West, Northwest
- **Smart Algorithm**: Advanced placement algorithm with overlap detection and scoring
- **Interactive Grid**: Click to navigate, hover for word highlighting
- **Solution Toggle**: Show/hide word placements with color coding

### Advanced Options

- **Word Overlaps**: Allow words to share cells when letters match
- **Placement Requirements**: Option to require all words be placed
- **Time Limits**: Configurable algorithm timeout (500ms - 5000ms)
- **Multiple Attempts**: Automatic retry with randomization for better results

### Export & Sharing

- **JSON Export**: Complete puzzle data with metadata
- **PNG Export**: Visual grid export (canvas-based)
- **Print-Friendly**: Optimized print layouts
- **Local Storage**: Automatic save/restore of settings and puzzles

### User Experience

- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Real-time Stats**: Generation time, success rate, overlap counts
- **Visual Feedback**: Loading states, error messages, helpful tips

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Algorithm**: Client-side placement with greedy + backtracking approach

## Project Structure

```
src/app/fillword/
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils.ts                 # Utility functions and direction vectors
│   ├── candidate-generator.ts   # Word placement candidate generation
│   ├── word-placer.ts          # Main placement algorithm
│   ├── export-utils.ts         # Export functionality
│   └── tests/
│       └── word-search.test.ts # Unit tests
├── ui/
│   ├── word-input-panel.tsx    # Word input and settings
│   ├── grid-canvas.tsx         # Interactive grid display
│   ├── word-list.tsx           # Word status and highlighting
│   └── controls-bar.tsx        # Action buttons and stats
└── page.tsx                    # Main application page
```

## Algorithm Details

### Placement Strategy

1. **Preprocessing**: Words are normalized (uppercase, filtered) and sorted by length
2. **Candidate Generation**: All valid positions for each word are calculated
3. **Greedy Placement**: Words are placed using best-first search with overlap scoring
4. **Multiple Attempts**: Algorithm runs 3 times with different randomization
5. **Scoring**: Prioritizes word count, then overlaps, then compactness

### Performance

- **Time Complexity**: O(Words × GridCells × Directions) for candidate generation
- **Space Complexity**: O(Words × Candidates) for candidate storage
- **Optimization**: Configurable time limits prevent browser blocking
- **Scalability**: Handles 20+ words in 15x15 grids within 2 seconds

## Usage Examples

### Basic Word Search

1. Enter words (one per line or comma-separated)
2. Set grid size (e.g., 15×15)
3. Choose directions (e.g., East, South, Southeast)
4. Click "Generate Word Search"

### Advanced Configuration

- Enable "Allow word overlaps" for denser puzzles
- Increase time limit for complex word lists
- Use "Require all words" for guaranteed complete placement
- Try different direction combinations for variety

### Export Options

- **JSON**: Complete puzzle data for sharing or backup
- **PNG**: Image file for printing or embedding
- **Print**: Browser-optimized print layout

## Development

### Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open browser to http://localhost:3000/fillword
```

### Testing

```bash
# Run unit tests (if Jest is configured)
pnpm test

# Or run inline tests
# Tests are included in word-search.test.ts
```

### Building

```bash
# Build for production
pnpm run build

# Start production server
pnpm start
```

## Technical Highlights

### Advanced Algorithm Features

- **Overlap Detection**: Smart letter matching for shared positions
- **Backtracking**: Limited backtracking for better word placement
- **Scoring System**: Multi-criteria optimization (placement count, overlaps, compactness)
- **Time Management**: Graceful degradation with time limits

### UI/UX Innovations

- **Real-time Highlighting**: Hover over words to highlight grid positions
- **Visual Feedback**: Color-coded word placement status
- **Responsive Grid**: Auto-scaling grid cells for optimal viewing
- **Accessibility**: Full keyboard navigation and ARIA support

### Performance Optimizations

- **Candidate Caching**: Pre-computed placement candidates
- **Efficient Data Structures**: Optimized grid representations
- **Memory Management**: Minimal allocations during placement
- **Progressive Enhancement**: Works without JavaScript for basic features

## Future Enhancements

### Algorithm Improvements

- **Simulated Annealing**: Better global optimization
- **Constraint Satisfaction**: More sophisticated placement rules
- **Word Frequency**: Bias toward common letter patterns
- **Theme-Based Placement**: Semantic word grouping

### UI/UX Features

- **Interactive Solving**: Player mode with word finding
- **Hint System**: Progressive hint revelation
- **Difficulty Levels**: Automated difficulty assessment
- **Social Sharing**: Direct puzzle sharing links

### Technical Upgrades

- **Web Workers**: Background algorithm processing
- **Server-Side Generation**: Heavy computation offloading
- **Vector Graphics**: SVG-based grid rendering
- **Progressive Web App**: Offline functionality

## License

This project is part of the Andromeda Games collection. See the main repository for license details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Submit a pull request with detailed description

## Acknowledgments

- Algorithm inspired by research in constraint satisfaction problems
- UI design follows modern accessibility guidelines
- Performance optimizations based on web application best practices
