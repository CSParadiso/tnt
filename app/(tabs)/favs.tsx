import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function FavoritosScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.description}>
        Este es el segundo tab para mostrar una navegacion basica con tabs.
      </Text>

      <Button title="SITEMAP" onPress={() => router.push("/_sitemap")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#eff6ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#1e3a8a",
  },
});
