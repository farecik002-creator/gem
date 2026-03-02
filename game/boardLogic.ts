import { BOARD_SIZE, TILE_TYPES, TileType } from "./constants";

export type BoardGrid = (TileType | null)[][];

export const generateRandomBoard = (): TileType[][] => {
  const board: TileType[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: TileType[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Avoid starting with matches
      let type: TileType;
      do {
        type = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
      } while (
        (r >= 2 && board[r - 1][c] === type && board[r - 2][c] === type) ||
        (c >= 2 && row[c - 1] === type && row[c - 2] === type)
      );
      row.push(type);
    }
    board.push(row);
  }
  return board;
};

export const findMatches = (grid: BoardGrid): { r: number, c: number }[] => {
  const matches = new Set<string>();

  // Horizontal
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const type = grid[r][c];
      if (type && type === grid[r][c + 1] && type === grid[r][c + 2]) {
        matches.add(`${r},${c}`);
        matches.add(`${r},${c + 1}`);
        matches.add(`${r},${c + 2}`);
      }
    }
  }

  // Vertical
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const type = grid[r][c];
      if (type && type === grid[r + 1][c] && type === grid[r + 2][c]) {
        matches.add(`${r},${c}`);
        matches.add(`${r + 1},${c}`);
        matches.add(`${r + 2},${c}`);
      }
    }
  }

  return Array.from(matches).map(s => {
    const [r, c] = s.split(',').map(Number);
    return { r, c };
  });
};

export const applyGravity = (grid: BoardGrid): BoardGrid => {
  const newGrid = grid.map(row => [...row]);
  for (let c = 0; c < BOARD_SIZE; c++) {
    let emptyRow = BOARD_SIZE - 1;
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) {
        newGrid[emptyRow][c] = newGrid[r][c];
        if (emptyRow !== r) newGrid[r][c] = null;
        emptyRow--;
      }
    }
    for (let r = emptyRow; r >= 0; r--) {
      newGrid[r][c] = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
    }
  }
  return newGrid;
};
