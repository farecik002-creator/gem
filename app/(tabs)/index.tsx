import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { getApiUrl } from "@/lib/query-client";

// Safe easing functions that work on all platforms (web + native)
const easeOut = (t: number) => t * (2 - t);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const NUM_PARTICLES = 22;

// ─── Splash Screen ────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 60, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, easing: easeOut, useNativeDriver: true }),
        Animated.spring(titleScale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      ]),
      Animated.timing(progressAnim, { toValue: 1, duration: 1800, easing: easeInOut, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, easing: easeOut, useNativeDriver: true }).start(onDone);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] });

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#050010", "#0a0020", "#050015", "#000005"]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient orb top */}
      <Animated.View style={[styles.ambientOrb, styles.orbTop, { opacity: glowOpacity }]} />
      {/* Ambient orb bottom */}
      <Animated.View style={[styles.ambientOrb, styles.orbBottom, { opacity: glowOpacity }]} />

      <Animated.View style={[styles.splashContent, { transform: [{ scale: scaleAnim }] }]}>
        {/* Title */}
        <Animated.View style={{ opacity: titleOpacity, transform: [{ scale: titleScale }] }}>
          <Animated.Text style={styles.splashSubtitle}>FANTASY MATCH</Animated.Text>
          <Animated.Text style={styles.splashTitle}>MYSTIC</Animated.Text>
          <Animated.Text style={styles.splashTitleAccent}>MATCH</Animated.Text>
          <Animated.Text style={styles.splashTagline}>Battle · Evolve · Conquer</Animated.Text>
        </Animated.View>

        {/* Loading bar */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingFill, { width: progressWidth }]}>
              <LinearGradient
                colors={["#7c3aed", "#a855f7", "#d946ef", "#f59e0b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            {/* shimmer */}
            <View style={styles.loadingShimmer} />
          </View>
          <Animated.Text style={styles.loadingLabel}>Entering the Mystic Realm...</Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Particle ─────────────────────────────────────────────────────
interface ParticleProps {
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

function Particle({ x, y, delay, duration, size, color }: ParticleProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, easing: easeInOut, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration, easing: easeInOut, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] });
  const opacity = anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.85, 0.75, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1.3, 0.6] });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          opacity,
          transform: [{ translateY }, { scale }],
          shadowColor: color,
          shadowOpacity: 0.9,
          shadowRadius: size * 1.5,
          shadowOffset: { width: 0, height: 0 },
          pointerEvents: "none" as const,
        },
      ]}
    />
  );
}

// ─── Particle Layer ────────────────────────────────────────────────
const PARTICLE_COLORS = [
  "#a855f7", "#d946ef", "#7c3aed", "#c026d3",
  "#fbbf24", "#f59e0b", "#6366f1", "#8b5cf6",
  "#22d3ee", "#10b981", "#f87171",
];

function ParticleLayer() {
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      delay: Math.random() * 4000,
      duration: 3000 + Math.random() * 4000,
      size: 2 + Math.random() * 4,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }))
  ).current;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
}

// ─── Glow Edge Border ─────────────────────────────────────────────
function GlowEdge() {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, easing: easeInOut, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2500, easing: easeInOut, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const edgeOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.75] });

  return (
    <>
      {/* Top glow */}
      <Animated.View style={[styles.glowEdgeTop, { opacity: edgeOpacity, pointerEvents: "none" }]} />
      {/* Bottom glow */}
      <Animated.View style={[styles.glowEdgeBottom, { opacity: edgeOpacity, pointerEvents: "none" }]} />
      {/* Left glow */}
      <Animated.View style={[styles.glowEdgeLeft, { opacity: edgeOpacity, pointerEvents: "none" }]} />
      {/* Right glow */}
      <Animated.View style={[styles.glowEdgeRight, { opacity: edgeOpacity, pointerEvents: "none" }]} />
    </>
  );
}

// ─── Character Container (Right Side — Empty, Z-index Ready) ──────
function CharacterContainer() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: easeInOut, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: easeInOut, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Animated.View
      style={[
        styles.characterContainer,
        { transform: [{ translateY }], pointerEvents: "none" },
      ]}
    >
      {/* Empty — ready for animated PNG sprite / Lottie / Spine2D character */}
    </Animated.View>
  );
}

// ─── Main Game Screen ─────────────────────────────────────────────
export default function GameScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [gameReady, setGameReady] = useState(false);
  const webviewFade = useRef(new Animated.Value(0)).current;
  const boardFloat = useRef(new Animated.Value(0)).current;

  const gameUrl = `${getApiUrl()}game.html`;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(boardFloat, { toValue: 1, duration: 4000, easing: easeInOut, useNativeDriver: true }),
        Animated.timing(boardFloat, { toValue: 0, duration: 4000, easing: easeInOut, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleWebViewLoad = useCallback(() => {
    setGameReady(true);
    Animated.timing(webviewFade, { toValue: 1, duration: 800, easing: easeOut, useNativeDriver: true }).start();
  }, []);

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
  }, []);

  const boardTranslateY = boardFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={styles.root}>
      {/* ── Dark fantasy animated background ── */}
      <LinearGradient
        colors={["#03000f", "#0a0025", "#050018", "#000008"]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Secondary gradient pulse overlay */}
      <LinearGradient
        colors={["transparent", "rgba(120,20,180,0.08)", "transparent"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />

      {/* ── Soft particle effects ── */}
      <ParticleLayer />

      {/* ── Game container with board floating animation ── */}
      <Animated.View
        style={[
          styles.gameContainer,
          {
            paddingTop: Platform.OS === "web" ? 67 : 0,
            paddingBottom: Platform.OS === "web" ? 34 : 0,
            transform: [{ translateY: boardTranslateY }],
          },
        ]}
      >
        {/* ── Glow container around game ── */}
        <View style={styles.glowContainer}>
          {/* Outer glow */}
          <View style={styles.outerGlow} />

          {/* WebView loading the game */}
          <Animated.View style={[styles.webviewWrapper, { opacity: webviewFade }]}>
            <WebView
              source={{ uri: gameUrl }}
              style={styles.webview}
              onLoad={handleWebViewLoad}
              onError={(e) => console.warn("WebView error:", e.nativeEvent)}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              allowsBackForwardNavigationGestures={false}
              overScrollMode="never"
              bounces={false}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderToHardwareTextureAndroid
              androidHardwareAccelerationDisabled={false}
              cacheEnabled
              originWhitelist={["*"]}
              mixedContentMode="always"
              allowFileAccess
              allowUniversalAccessFromFileURLs
              androidLayerType="hardware"
            />
          </Animated.View>

          {/* ── Character container (right side, transparent, z-index ready) ── */}
          <CharacterContainer />

          {/* ── Soft neon glow edges ── */}
          <GlowEdge />
        </View>
      </Animated.View>

      {/* ── Premium splash screen ── */}
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#03000f",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gameContainer: {
    flex: 1,
    zIndex: 2,
  },
  glowContainer: {
    flex: 1,
    position: "relative",
    // Glassmorphism-style outer border
    borderRadius: Platform.OS === "web" ? 12 : 0,
    overflow: Platform.OS === "web" ? "hidden" : "visible",
    margin: Platform.OS === "web" ? 12 : 0,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  outerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Platform.OS === "web" ? 12 : 0,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.25)",
    zIndex: 10,
    pointerEvents: "none",
  } as any,
  webviewWrapper: {
    flex: 1,
    zIndex: 2,
    backgroundColor: "#050015",
  },
  webview: {
    flex: 1,
    backgroundColor: "#050015",
  },
  // Character container — right side, transparent, empty, z-index ready
  characterContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "35%",
    zIndex: 50,
    backgroundColor: "transparent",
    // Layering support for future sprite animation
  } as any,
  // Particles
  particle: {
    position: "absolute",
    elevation: 3,
  },
  // Glow edges
  glowEdgeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 20,
    borderRadius: 4,
    backgroundColor: "transparent",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 1.5,
    borderTopColor: "rgba(168,85,247,0.5)",
  } as any,
  glowEdgeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 20,
    borderRadius: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(168,85,247,0.4)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  } as any,
  glowEdgeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    zIndex: 20,
    borderLeftWidth: 1.5,
    borderLeftColor: "rgba(124,58,237,0.4)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  } as any,
  glowEdgeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    zIndex: 20,
    borderRightWidth: 1.5,
    borderRightColor: "rgba(168,85,247,0.3)",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  } as any,
  // Splash screen
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ambientOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    pointerEvents: "none",
  } as any,
  orbTop: {
    top: -80,
    left: "50%",
    marginLeft: -150,
    backgroundColor: "rgba(124,58,237,0.18)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 0,
  },
  orbBottom: {
    bottom: -80,
    left: "50%",
    marginLeft: -150,
    backgroundColor: "rgba(217,70,239,0.12)",
    shadowColor: "#d946ef",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 0,
  },
  splashContent: {
    alignItems: "center",
    gap: 48,
    paddingHorizontal: 32,
  },
  splashSubtitle: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 10,
    letterSpacing: 6,
    color: "rgba(168,85,247,0.8)",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  splashTitle: {
    fontSize: 58,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 8,
    textShadowColor: "rgba(168,85,247,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
    lineHeight: 60,
  },
  splashTitleAccent: {
    fontSize: 58,
    fontWeight: "900",
    color: "#f59e0b",
    textAlign: "center",
    letterSpacing: 8,
    textShadowColor: "rgba(245,158,11,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    lineHeight: 60,
  },
  splashTagline: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 3,
    textAlign: "center",
    marginTop: 8,
    textTransform: "uppercase",
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  loadingTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
  },
  loadingFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
  },
  loadingLabel: {
    fontSize: 11,
    color: "rgba(168,85,247,0.7)",
    letterSpacing: 1,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
