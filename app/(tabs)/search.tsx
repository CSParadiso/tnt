import BarcodeScannerButton from "@/components/barcodeScannerButton";
import { ErrorState } from "@/components/errorState";
import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useFoodById, useInfiniteFoods } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function InputFilter() {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  // Verificar si es un número de código de barras válido (8, 12, 13 o 14 dígitos)
  // Nos evita utilizar los otros endpoints en un cuircuit breaker
  // Limpia esoacios en codigo de barras
  const search = debouncedText.trim();

  const isBarcode = /^\d{8,14}$/.test(search);

  const {
    data: barcodeFood,
    isLoading: barcodeLoading,
    isError: barcodeError,
  } = useFoodById(isBarcode ? debouncedText : null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(text);

      if (text.trim().length <= 1 || /^\d{8,14}$/.test(text.trim())) {
        setTotalResults(0);
      }
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

      {!isBarcode && totalResults > 0 && (
        <Text style={styles.resultsText}>
          {totalResults} resultados para "{debouncedText}"
        </Text>
      )}

      {debouncedText.trim().length > 1 &&
        (isBarcode ? (
          barcodeLoading ? (
            <LoadingState />
          ) : barcodeError ? (
            <ErrorState />
          ) : barcodeFood ? (
            <Pressable
              style={styles.gridItem}
              onPress={() =>
                router.push(buildRoute(ROUTES.FOODS, { id: barcodeFood.code }))
              }
            >
              <FoodCard food={barcodeFood} />
            </Pressable>
          ) : (
            <Text style={styles.resultsText}>Producto no encontrado</Text>
          )
        ) : (
          <SearchResults
            search={debouncedText}
            route={ROUTES.FOODS}
            onResultsChange={setTotalResults}
          />
        ))}
    </View>
  );
}

type SearchResultsProps = {
  search: string;
  route: AppRoute;
  onResultsChange: (count: number) => void;
};

function SearchResults({ search, route, onResultsChange }: SearchResultsProps) {
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

  useEffect(() => {
    const total =
      (categories.data?.pages[0]?.count ?? 0) +
      (brands.data?.pages[0]?.count ?? 0) +
      (tags.data?.pages[0]?.count ?? 0);

    onResultsChange(total);
  }, [categories.data, brands.data, tags.data]);

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
  resultsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
