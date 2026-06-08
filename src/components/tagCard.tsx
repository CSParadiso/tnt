import React from "react";
import { StyleSheet, Text, View } from "react-native";

const defaultColors: [string, string] = ["#4f12fe", "#0098fe"];

type TagCardProps = {
  title: string;
  colors?: [string, string];
};

export default function TagCard({ title }: TagCardProps) {
  return (
    <View style={styles.tagCard}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagCard: {
    backgroundColor: "#6DC794",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  title: {
    /* color: "gray", */
    fontSize: 16,
    fontWeight: "600",
  },
});
