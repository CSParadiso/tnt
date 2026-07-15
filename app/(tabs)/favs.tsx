import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useAuth } from "@/context/AuthProvider";
import { useFavoritos } from "@/hooks/useFavorites";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-reanimated";

export default function FavsItemScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Favoritos" }} />
        <View style={styles.centered}>
          <LoadingState />
        </View>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: "Favoritos" }} />
        <View style={styles.centered}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.promptTitle}>Inicia sesion para ver tus favoritos</Text>
          <Text style={styles.promptSubtitle}>
            Guarda tus productos favoritos y sincronizalos entre dispositivos.
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Iniciar sesion</Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/signup" asChild>
            <Pressable style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Crear cuenta</Text>
            </Pressable>
          </Link>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Favoritos" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <SeccionList title={"Favoritos"} subtitle="" route={ROUTES.FOODS} />
      </ScrollView>
    </>
  );
}

type SectionListProps = {
  title: string;
  subtitle: string;
  route: AppRoute;
};

const SeccionList = ({ title, subtitle, route }: SectionListProps) => {
  const router = useRouter();
  const { favoritos, isLoading, eliminar } = useFavoritos();

  const navToItem = (item: Foods) => {
    router.push(buildRoute(route, { id: item.code }));
  };

  return (
    <View style={styles.listBlock}>
      <View style={styles.listTitleRow}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.panel}>
        {isLoading ? <LoadingState /> : null}
        {!isLoading && (
          <FlatList
            style={{ width: "100%" }}
            scrollEnabled={false}
            data={favoritos}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.gridItem}
                onPress={() => navToItem(item)}
              >
                <FoodCard food={item} />
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  promptTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  promptSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#1B8D43",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#1B8D43",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  signupButtonText: {
    color: "#1B8D43",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  gridItem: {
    flex: 1,
    margin: 6,
  },
  listBlock: {
    width: "100%",
    gap: 12,
  },
  panel: {
    flex: 1,
  },
  listContent: {
    gap: 10,
  },
  listTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 8,
    rowGap: 4,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  listSubtitle: {
    fontSize: 16,
    fontWeight: "200",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemText: {
    fontSize: 16,
  },
  welcome: {
    alignItems: "flex-start",
  },
  welcomeHeader: {
    textTransform: "uppercase",
    textAlign: "left",
    color: "green",
  },
  welcomeMessage: {
    fontSize: 28,
    fontWeight: 600,
  },
});
