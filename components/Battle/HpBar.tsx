import React from "react";
import { View, StyleSheet } from "react-native";

interface HpBarProps {
  current: number;
  max: number;
  color: string;
}

export default function HpBar({ current, max, color }: HpBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.fill,
          { width: `${percentage}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 12,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 6,
    overflow: "hidden",
    marginVertical: 4,
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
});
