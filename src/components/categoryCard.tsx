import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function hashString(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function stringToGradient(str: string): [string, string] {
  const hash = hashString(str);
  // Generar dos hues similares
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40) % 360;

  // Mantener la saturacion e iluminacion fijas para estabilidad colorica
  const colors: [string, string] = [
    `hsl(${hue1}, 95%, 40%)`,
    `hsl(${hue2}, 90%, 20%)`,
  ];

  return colors;
}

type CategoryCardProps = {
  title: string;
};

export default function CategoryCard({ title }: CategoryCardProps) {
  const colors = stringToGradient(title);

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <Ionicons
        name="fast-food-outline"
        size={20}
        color="white"
        style={styles.icon}
      />

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: 18,
    padding: 12,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    alignSelf: "flex-end",
  },
});
