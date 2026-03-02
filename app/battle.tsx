import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Board from "../components/Battle/Board";
import HpBar from "../components/Battle/HpBar";
import { generateRandomBoard } from "../game/boardLogic";
import { TileType } from "../game/constants";

export default function BattleScreen() {
  const [grid, setGrid] = useState<TileType[][]>([]);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);

  useEffect(() => {
    setGrid(generateRandomBoard());
  }, []);

  const handleTilePress = (r: number, c: number) => {
    // Basic interaction placeholder
    console.log(`Pressed tile at ${r}, ${c}`);
  };

  const handleHeal = () => {
    setPlayerHp(prev => Math.min(100, prev + 10));
  };

  const handleSkill = () => {
    setEnemyHp(prev => Math.max(0, prev - 15));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enemy</Text>
        <HpBar current={enemyHp} max={100} color="#FF4444" />
      </View>

      <View style={styles.boardContainer}>
        {grid.length > 0 && <Board grid={grid} onTilePress={handleTilePress} />}
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}>Player</Text>
        <HpBar current={playerHp} max={100} color="#44FF44" />
        
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.healButton]} onPress={handleHeal}>
            <Text style={styles.buttonText}>Heal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.skillButton]} onPress={handleSkill}>
            <Text style={styles.buttonText}>Skill</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  boardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 0.48,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  healButton: {
    backgroundColor: "#2E7D32",
  },
  skillButton: {
    backgroundColor: "#1565C0",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
