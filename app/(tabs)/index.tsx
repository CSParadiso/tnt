import BrandCard from "@/components/brandCard";
import CategoryCard from "@/components/categoryCard";
import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import TagCard from "@/components/tagCard";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { categorias } from "@/models/categorias";
import { etiquetas } from "@/models/etiquetas";
import { marcas } from "@/models/marcas";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-reanimated";

export default function IndexScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WelcomeMessage
        header="Sabores curados"
        message={
          <>
            El arte del descubrimiento{" "}
            <Text style={{ fontWeight: "bold", color: "green" }}>
              conscienzudo.
            </Text>
          </>
        }
      />
      <SeccionList
        title="Categorias"
        //subtitle="Ver librería"
        subtitle="Ver librería"
        items={categorias}
        route={ROUTES.CATEGORIES}
        variant="categories"
      />
      <SeccionList
        title="Etiquetas"
        subtitle=""
        items={etiquetas}
        route={ROUTES.TAGS}
        variant="tags"
      />
      <SeccionList
        title="Marcas"
        subtitle="Exploradas a través de la lente de la calidad."
        items={marcas}
        route={ROUTES.BRANDS}
        variant="brands"
      />
    </ScrollView>
  );
}

type WelcomeMessageProps = {
  header: string;
  message: ReactNode; // para poder hacer el enfatizado del "concienzudo"
};

const WelcomeMessage = ({ header, message }: WelcomeMessageProps) => {
  return (
    <View style={styles.welcome}>
      <Text style={styles.welcomeHeader}>{header}</Text>
      <Text style={styles.welcomeMessage}>{message}</Text>
    </View>
  );
};

type ListItem = {
  id: string;
  nombre: string;
};

type SectionListProps = {
  title: string;
  subtitle: string;
  items: ListItem[];
  route: AppRoute;
  variant?: "categories" | "tags" | "brands";
};

const SeccionList = ({
  title,
  subtitle,
  items,
  route,
  variant,
}: SectionListProps) => {
  const router = useRouter();

  const categoriesQuery = useCategories();
  const tagsQuery = useTags();
  const brandsQuery = useBrands();

  const isLoading =
    (variant === "categories" && categoriesQuery.isFetching) ||
    (variant === "tags" && tagsQuery.isFetching) ||
    (variant === "brands" && brandsQuery.isFetching);

  const isError =
    (variant === "categories" && categoriesQuery.isError) ||
    (variant === "tags" && tagsQuery.isError) ||
    (variant === "brands" && brandsQuery.isError);

  const navToListItem = (item: ListItem) => {
    router.push(buildRoute(route, { id: item }));
  };

  const renderItem = ({ item }: any) => {
    switch (variant) {
      case "categories":
        return <CategoryCard title={item} />;

      case "tags":
        return <TagCard title={item} />;

      case "brands":
        return <BrandCard item={item} />;
      //return <BrandCard item=item title={item.nombre} />;

      default:
        return <CategoryCard title={item.nombre} />;
    }
  };

  return (
    <View style={styles.listBlock}>
      <View style={styles.listTitleRow}>
        <Text style={styles.listTitle}>{title}</Text>
        {variant === "categories" ? (
          //<TouchableOpacity onPress={() => router.push("/categories")}>
          <Text style={styles.listSubtitle}>{subtitle}</Text>
        ) : (
          //</TouchableOpacity>
          <Text style={styles.listSubtitle}>{subtitle}</Text>
        )}
        {/* <Text style={styles.listSubtitle}>{subtitle}</Text> */}
      </View>

      {variant === "tags" ? (
        <View style={styles.tagsContainer}>
          {tagsQuery.data?.map((item) => (
            <Pressable key={item} onPress={() => navToListItem(item)}>
              {renderItem({ item })}
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.panel}>
          {isLoading ? <LoadingState /> : null}
          {isError ? <ErrorState /> : null}
          {!isLoading && !isError ? (
            <FlatList
              style={{ width: "100%" }}
              numColumns={2}
              scrollEnabled={false}
              data={
                variant === "brands" ? brandsQuery.data : categoriesQuery.data
              } // Esto se debe arreglar
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                /* <Pressable onPress={() => router.push("/ejemplos/fetch/temp")}> */
                <Pressable
                  style={styles.gridItem}
                  onPress={() => navToListItem(item)}
                >
                  {renderItem({ item })}
                </Pressable>
              )}
            />
          ) : null}
        </View>
      )}
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
  listContent: {
    gap: 10,
  },
  panel: {
    flex: 1,
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
