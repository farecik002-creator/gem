export const TILE_TYPES = ["red", "green", "blue", "yellow", "purple"] as const;
export type TileType = (typeof TILE_TYPES)[number];
export const BOARD_SIZE = 8;
