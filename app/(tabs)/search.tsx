import { useRouter } from "expo-router";
import { Button, Linking, StyleSheet, Text, View } from "react-native";

export default function SearchScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Búsqueda</Text>
      <Text style={styles.description}>
        Aquí se podrá buscar alimentos con el código de barras.
      </Text>
      <Button 
        title="Mientras tanto" 
       onPress={() => Linking.openURL("https://paradisoft.com.ar")}/>
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
