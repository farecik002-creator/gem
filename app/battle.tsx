import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import Board from "../components/Battle/Board";
import HpBar from "../components/Battle/HpBar";
import { generateRandomBoard, BoardGrid } from "../game/boardLogic";
import { TileType } from "../game/constants";

export default function BattleScreen() {
  const [grid, setGrid] = useState<BoardGrid>([]);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [mana, setMana] = useState(0);
  const [shield, setShield] = useState(0);
  const [skillCharge, setSkillCharge] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    setGrid(generateRandomBoard());
  }, []);

  const handleMatch = useCallback((matches: { r: number, c: number, type: TileType }[]) => {
    matches.forEach(match => {
      switch (match.type) {
        case "red":
          setEnemyHp(prev => Math.max(0, prev - 2));
          break;
        case "green":
          setPlayerHp(prev => Math.min(100, prev + 1));
          break;
        case "yellow":
          setShield(prev => prev + 1);
          break;
        case "purple":
          setSkillCharge(prev => Math.min(100, prev + 5));
          break;
        case "blue":
          setMana(prev => Math.min(100, prev + 5));
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (enemyHp <= 0) setVictory(true);
  }, [enemyHp]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enemy</Text>
        <HpBar current={enemyHp} max={100} color="#FF4444" />
      </View>

      <View style={styles.boardContainer}>
        {grid.length > 0 && (
          <Board 
            grid={grid} 
            onMatch={handleMatch} 
            updateGrid={setGrid}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>🛡️ {shield}</Text>
          <Text style={styles.statText}>💧 {mana}</Text>
          <Text style={styles.statText}>⚡ {skillCharge}%</Text>
        </View>
        <Text style={styles.title}>Player</Text>
        <HpBar current={playerHp} max={100} color="#44FF44" />
      </View>

      <Modal visible={victory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.victoryText}>VICTORY!</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setEnemyHp(100);
                setPlayerHp(100);
                setVictory(false);
                setGrid(generateRandomBoard());
              }}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: { padding: 16 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  boardContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: { padding: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  statText: { color: "#AAA", fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#222", padding: 32, borderRadius: 16, alignItems: "center" },
  victoryText: { color: "#FFD700", fontSize: 32, fontWeight: "bold", marginBottom: 24 },
  resetButton: { backgroundColor: "#444", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
