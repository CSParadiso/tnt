import { ErrorState } from "@/components/errorState";
import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useFoods } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-reanimated";

type CategoryItemScreenParams = {
  id: string;
};

export default function CategoryItemScreen() {
  const { id } = useLocalSearchParams<CategoryItemScreenParams>();
  console.log("Categoría ID: ", id);

  return (
    <>
      <Stack.Screen
        options={{ title: id.charAt(0).toUpperCase() + id.slice(1) }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <WelcomeMessage
    header="Sabores curados"
    message={
      <>
        El arte del descubrimiento{" "}
        <Text style={{ fontWeight: "bold", color: "green" }}>
          conscienzudo.
        </Text>
      </>
    }
  /> */}
        <SeccionList
          title={id.charAt(0).toUpperCase() + id.slice(1)}
          subtitle=""
          route={ROUTES.FOODS}
        />
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

  // fetchear categorias
  const { data, isError, isFetching, isLoading } = useFoods("category", title);

  const navToItem = (item: Foods) => {
    router.push(buildRoute(route, { id: item.code })); //
  };

  return (
    <View style={styles.listBlock}>
      <View style={styles.listTitleRow}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.panel}>
        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState /> : null}
        {!isLoading && !isError ? (
          <FlatList
            style={{ width: "100%" }}
            //numColumns={2}
            scrollEnabled={false}
            data={data}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              /* <Pressable onPress={() => router.push("/ejemplos/fetch/temp")}> */
              <Pressable
                style={styles.gridItem}
                onPress={() => navToItem(item)}
              >
                <FoodCard food={item}></FoodCard>
              </Pressable>
            )}
          />
        ) : null}
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
    /* alignItems: "center", */
    gap: 20,
  },
  gridItem: {
    flex: 1,
    margin: 6,
  },
  listBlock: {
    width: "100%",
    //maxWidth: 420,
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
