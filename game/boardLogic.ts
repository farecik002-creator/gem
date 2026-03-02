import { BOARD_SIZE, TILE_TYPES, TileType } from "./constants";

export const generateRandomBoard = (): TileType[][] => {
  const board: TileType[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: TileType[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      const randomIndex = Math.floor(Math.random() * TILE_TYPES.length);
      row.push(TILE_TYPES[randomIndex]);
    }
    board.push(row);
  }
  return board;
};
