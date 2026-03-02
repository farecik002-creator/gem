import React from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";
import { TileType } from "../../game/constants";

interface BoardProps {
  grid: TileType[][];
  onTilePress: (r: number, c: number) => void;
}

export default function Board({ grid, onTilePress }: BoardProps) {
  return (
    <View style={styles.container}>
      {grid.map((row, r) => (
        <View key={`row-${r}`} style={styles.row}>
          {row.map((tile, c) => (
            <Tile
              key={`tile-${r}-${c}`}
              type={tile}
              onPress={() => onTilePress(r, c)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    padding: 4,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
});
