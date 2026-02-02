# AGENTS.md - Agent Guidelines for project-greeny-game

This document provides guidelines for AI agents working on the project-greeny-game codebase.

## Project Overview

project-greeny-game is a simple HTML5 Canvas-based Snake game implemented in vanilla JavaScript with smooth animations and win condition at score 10.

## Build/Lint/Test Commands

### Linting

ESLint is configured with browser and ES2021 globals.

#### Run Linting on All Files

```bash
npx eslint *.js
```

#### Run Linting on Specific File

```bash
npx eslint script.js
```

#### Auto-fix Linting Issues

```bash
npx eslint script.js --fix
```

## Code Style Guidelines

### Language and Syntax

- Use ES6+ features (const/let, arrow functions, template literals, destructuring)
- Prefer `const` for immutable variables, `let` for mutable ones
- Avoid `var` entirely
- Use semicolons consistently
- Prefer arrow functions for callbacks

### Naming Conventions

- **Variables/Functions**: camelCase (`gameState`, `drawSnake`, `handleInput`)
- **Constants**: UPPER_SNAKE_CASE (`GRID_SIZE`, `MOVE_INTERVAL`)
- **HTML IDs**: camelCase (`gameCanvas`, `gameOverOverlay`)
- **CSS Classes**: kebab-case (`game-overlay`, `continue-button`)
- **Boolean variables**: `is`, `has`, `can` prefixes (`isGameOver`, `hasCollided`)
- **Event handlers**: `handle` or `on` prefixes (`handleKeyPress`, `onGameOver`)

### Code Structure

- Keep functions small and focused (single responsibility)
- Use descriptive variable names
- Avoid global variables; encapsulate state
- Group related code with blank lines
- Use early returns to reduce nesting
- Limit function parameters to 3-4; use objects for complex cases

### Imports and Dependencies

- Vanilla JavaScript only (no external dependencies)
- Avoid adding libraries unless absolutely necessary
- Use npm for any new dependencies
- Document dependencies in package.json

### Formatting

- 4 spaces indentation (no tabs)
- Max line length: 100 characters
- Consistent spacing around operators
- Blank lines between logical sections
- Align similar code blocks

### Comments and Documentation

- Use JSDoc for all functions with parameter types and descriptions
- Add inline comments for complex logic
- Avoid obvious comments
- Use TODO comments for future improvements

Example JSDoc:

```javascript
/**
 * Generates random food position avoiding snake collision
 * @param {Array<Object>} snake - Snake segments with x,y coordinates
 * @param {number} gridSize - Game grid size
 * @returns {Object} Food position with x,y coordinates
 */
function getRandomFood(snake, gridSize) {
  // Implementation
}
```

### Types and Type Checking

- Use JSDoc type annotations for clarity
- Validate inputs at function boundaries
- Use meaningful defaults for optional parameters
- Document object shapes and array contents

### Error Handling

- Use try-catch for Canvas operations and DOM manipulation
- Validate DOM element existence before access
- Handle edge cases (undefined/null values, empty arrays)
- Log errors with descriptive messages
- Fail gracefully with user feedback

Example:

```javascript
try {
  ctx.fillRect(x, y, width, height);
} catch (error) {
  console.error("Canvas drawing error:", error);
  // Fallback rendering
}
```

### Event Handling

- Use addEventListener for all DOM events
- Remove listeners when components destroy
- Prevent default behavior for game controls
- Debounce rapid events (key presses)

### Canvas and Graphics

- Clear canvas before each draw cycle
- Use save()/restore() for transformations
- Minimize canvas API calls for optimization
- Handle canvas context loss
- Use efficient shapes (rectangles over complex paths)

## File Structure

```
/Users/isaac/development/project-greeny-game/
├── index.html          # Main HTML with canvas and embedded styles
├── script.js           # Complete game logic and rendering
├── package.json        # Dependencies and scripts
├── eslint.config.js    # ESLint configuration
└── AGENTS.md           # This file
```

## Development Workflow

1. Edit files directly
2. Run linting: `npx eslint *.js`

## Contributing Guidelines

- Follow established code style
- Add JSDoc documentation
- Test thoroughly before commits
- Update this AGENTS.md for new conventions
