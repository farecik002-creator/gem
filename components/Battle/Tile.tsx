import React, { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { TileType } from "../../game/constants";

interface TileProps {
  type: TileType | null;
  onPress: () => void;
  isSelected?: boolean;
}

const Tile = memo(({ type, onPress, isSelected }: TileProps) => {
  const getTileColor = (tileType: TileType | null) => {
    if (!tileType) return "transparent";
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
      activeOpacity={0.7}
      style={[
        styles.tile, 
        { backgroundColor: getTileColor(type) },
        isSelected && styles.selected
      ]}
      onPress={onPress}
      disabled={!type}
    />
  );
});

const styles = StyleSheet.create({
  tile: {
    width: "12.5%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 4,
  },
  selected: {
    borderColor: "#FFF",
    borderWidth: 3,
  }
});

export default Tile;
