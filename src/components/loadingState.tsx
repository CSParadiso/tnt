import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingState() {
  return (
    <View style={styles.centeredState}>
      <ActivityIndicator size="large" color="#7c2d12" />
      <Text style={styles.stateText}>Buscando alimentos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 16,
    color: "#9a3412",
  },
});
