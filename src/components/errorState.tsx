import { StyleSheet, Text, View } from "react-native";

export function ErrorState() {
  return (
    <View style={styles.centeredState}>
      <Text style={styles.errorText}>La query falló al traer categorías.</Text>
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
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b91c1c",
    textAlign: "center",
  },
});
