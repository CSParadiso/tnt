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

type TagsItemScreenParams = {
  id: string;
};

export default function TagsItemScreen() {
  const { id } = useLocalSearchParams<TagsItemScreenParams>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const title = rawId.charAt(0).toUpperCase() + rawId.slice(1);

  // No fetch here — SeccionList handles it internally

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView contentContainerStyle={styles.container}>
        <SeccionList
          title={title}
          rawId={rawId} // pass rawId so SeccionList can fetch
          subtitle=""
          route={ROUTES.FOODS}
        />
      </ScrollView>
    </>
  );
}

type SectionListProps = {
  title: string;
  rawId: string; // added
  subtitle: string;
  route: AppRoute;
};

const SeccionList = ({ title, rawId, subtitle, route }: SectionListProps) => {
  const router = useRouter();

  const { data, isError, isLoading } = useFoods("tag", rawId); // fetch here

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
        {isError ? <ErrorState /> : null}
        {!isLoading && !isError ? (
          <FlatList
            style={{ width: "100%" }}
            scrollEnabled={false}
            data={data}
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
