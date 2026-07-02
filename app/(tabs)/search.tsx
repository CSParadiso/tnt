import BarcodeScannerButton from "@/components/components/barcodeScannerButton";
import { ErrorState } from "@/components/errorState";
import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useInfiniteFoods } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

export default function InputFilter() {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(text);
    }, 400);

    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Buscarm comidas"
          returnKeyType="search"
          style={styles.searchInput}
        />
        <BarcodeScannerButton />
      </View>

      {debouncedText.trim().length > 1 ? (
        <SearchResults search={debouncedText} route={ROUTES.FOODS} />
      ) : null}
    </View>
  );
}

type SearchResultsProps = {
  search: string;
  route: AppRoute;
};

function SearchResults({ search, route }: SearchResultsProps) {
  const categories = useInfiniteFoods("category", search);
  const brands = useInfiniteFoods("brand", search);
  const tags = useInfiniteFoods("tag", search);

  const categoryFoods =
    categories.data?.pages.flatMap((page) => page.products) ?? [];

  const brandFoods = brands.data?.pages.flatMap((page) => page.products) ?? [];

  const tagFoods = tags.data?.pages.flatMap((page) => page.products) ?? [];

  console.debug(
    "Categorias",
    categoryFoods.length,
    "Marcas",
    brandFoods.length,
    "Etiquetas",
    tagFoods.length,
  );
  const isLoading = categories.isLoading || brands.isLoading || tags.isLoading;

  const isError = categories.isError || brands.isError || tags.isError;

  const foods = Array.from(
    new Map(
      [...categoryFoods, ...brandFoods, ...tagFoods].map((food) => [
        food.code,
        food,
      ]),
    ).values(),
  );

  console.debug(foods.length);

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
      data={foods}
      keyExtractor={(item) => item.code}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable style={styles.gridItem} onPress={() => navToItem(item)}>
          <FoodCard food={item} />
        </Pressable>
      )}
      onEndReached={() => {
        if (categories.hasNextPage && !categories.isFetchingNextPage) {
          categories.fetchNextPage();
        }

        if (brands.hasNextPage && !brands.isFetchingNextPage) {
          brands.fetchNextPage();
        }

        if (tags.hasNextPage && !tags.isFetchingNextPage) {
          tags.fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  listContent: {
    gap: 10,
    paddingBottom: 24,
  },
  gridItem: {
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
