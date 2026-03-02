import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";
import { TileType } from "../../game/constants";
import { findMatches, applyGravity, BoardGrid } from "../../game/boardLogic";

interface BoardProps {
  grid: BoardGrid;
  onMatch: (matches: { r: number, c: number, type: TileType }[]) => void;
  updateGrid: (newGrid: BoardGrid) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export default function Board({ grid, onMatch, updateGrid, isProcessing, setIsProcessing }: BoardProps) {
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);

  const processMatches = useCallback((currentGrid: BoardGrid) => {
    const matches = findMatches(currentGrid);
    if (matches.length > 0) {
      const matchData = matches.map(m => ({ ...m, type: currentGrid[m.r][m.c] as TileType }));
      onMatch(matchData);

      const gridAfterMatch = currentGrid.map((row, r) => 
        row.map((tile, c) => matches.some(m => m.r === r && m.c === c) ? null : tile)
      );
      
      const gridAfterGravity = applyGravity(gridAfterMatch);
      updateGrid(gridAfterGravity);
      
      // Cascade check
      setTimeout(() => processMatches(gridAfterGravity), 300);
    } else {
      setIsProcessing(false);
    }
  }, [onMatch, updateGrid, setIsProcessing]);

  const handlePress = useCallback((r: number, c: number) => {
    if (isProcessing) return;

    if (!selected) {
      setSelected({ r, c });
    } else {
      const isNeighbor = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;

      if (isNeighbor) {
        setIsProcessing(true);
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[r][c];
        newGrid[r][c] = newGrid[selected.r][selected.c];
        newGrid[selected.r][selected.c] = temp;

        const matches = findMatches(newGrid);
        if (matches.length > 0) {
          updateGrid(newGrid);
          setTimeout(() => processMatches(newGrid), 300);
        } else {
          // Revert if no match
          setIsProcessing(false);
        }
      }
      setSelected(null);
    }
  }, [grid, selected, isProcessing, setIsProcessing, updateGrid, processMatches]);

  return (
    <View style={styles.container}>
      {grid.map((row, r) => (
        <View key={`row-${r}`} style={styles.row}>
          {row.map((tile, c) => (
            <Tile
              key={`tile-${r}-${c}`}
              type={tile}
              onPress={() => handlePress(r, c)}
              isSelected={selected?.r === r && selected?.c === c}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", aspectRatio: 1, padding: 4, backgroundColor: "#111", borderRadius: 8 },
  row: { flexDirection: "row", flex: 1 },
});
