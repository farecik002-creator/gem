import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { TileType } from "../../game/constants";

interface TileProps {
  type: TileType;
  onPress: () => void;
}

export default function Tile({ type, onPress }: TileProps) {
  const getTileColor = (tileType: TileType) => {
    switch (tileType) {
      case "red": return "#FF4444";
      case "green": return "#44FF44";
      case "blue": return "#4444FF";
      case "yellow": return "#FFFF44";
      case "purple": return "#AA44FF";
      default: return "#888";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: getTileColor(type) }]}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    width: "12.5%", // 100 / 8
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 4,
  },
});
