import { ErrorState } from "@/components/errorState";
import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useInfiniteFoods } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import "react-native-reanimated";

type CategoriesItemScreenParams = {
  id: string;
};

export default function CategoriesItemScreen() {
  const { id } = useLocalSearchParams<CategoriesItemScreenParams>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const title = rawId.charAt(0).toUpperCase() + rawId.slice(1);

  return (
    <>
      <Stack.Screen options={{ title }} />
      <SeccionList
        rawId={rawId} // pass rawId so SeccionList can fetch
        route={ROUTES.FOODS}
      />
    </>
  );
}

type SeccionListProps = {
  rawId: string; // added
  route: AppRoute;
};

function SeccionList({ rawId, route }: SeccionListProps) {
  const Categories = useInfiniteFoods("category", rawId); // fetch here

  const totalResults = Categories.data?.pages[0]?.count ?? 0;

  const categoryFoods =
    Categories.data?.pages.flatMap((page) => page.products) ?? [];

  console.debug("Categorías", categoryFoods.length);
  const isLoading = Categories.isLoading;

  const isError = Categories.isError;

  const foods = Array.from(
    new Map([...categoryFoods].map((food) => [food.code, food])).values(),
  );

  const navToItem = (item: Foods) => {
    router.push(buildRoute(route, { id: item.code }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <Text style={styles.resultsText}>{totalResults} resultados</Text>
      }
      data={foods}
      keyExtractor={(item) => item.code}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable style={styles.gridItem} onPress={() => navToItem(item)}>
          <FoodCard food={item} />
        </Pressable>
      )}
      onEndReached={() => {
        if (Categories.hasNextPage && !Categories.isFetchingNextPage) {
          Categories.fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}

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
  resultsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
    marginTop: 12,
  },
});
