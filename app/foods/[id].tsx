import { useFavorito } from "@/hooks/useFavorite";
import { useFoodById } from "@/hooks/useFoods";
import { useAuth } from "@/context/AuthProvider";
import { NutriComponent } from "@/models/foods";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type FichaScreenParams = {
  id: string;
};
export default function FoodScreen() {
  const { id } = useLocalSearchParams<FichaScreenParams>();
  console.log("Food ID: ", id);

  // fetchear categorias
  const { data, isError, isFetching, isLoading } = useFoodById(id);
  /* console.log(data); */

  // Preguntar a Leo el workaround para ver la comida cuando viene desde la pantalla de favoritos y no está cacheada, o por que no peticviona

  /* TODO: buscar los colores del nutriscore y machear con estos */
  const nutriscoreColor: Record<string, string> = {
    a: "#037c3e",
    b: "#81b62e",
    c: "#f7c302",
    d: "#e67c01",
    e: "#de3c0f",
  };

  const ecoscoreColor: Record<string, string> = {
    "a+": "#1E8F4E",
    a: "#037c3e",
    b: "#81b62e",
    c: "#f7c302",
    d: "#e67c01",
    e: "#de3c0f",
  };

  const nutri = data?.nutriscore_grade?.toLowerCase();
  const eco = data?.ecoscore_grade?.toLowerCase();
  const nova = data?.nova_group;
  const nutriscore_data = data?.nutriscore_data?.components;
  const nutriscore_data_per = data?.nutrition_data_per;
  const ingredients = data?.ingredients_text_es;

  //console.log(JSON.stringify(data?.ingredients_text_es, null, 2));

  // Se separa el hook de los métodos accesores
  const { isFavorito, toggleFavorito } = useFavorito(data);
  const { user } = useAuth();

  function handleFavoritePress() {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    toggleFavorito();
  }

  // Vista
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerTitle: data?.product_name,
        }}
      />
      <View style={styles.hero}>
        <Image
          style={styles.image}
          source={data?.image_front_small_url}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={500}
        />

        <Pressable onPress={handleFavoritePress} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorito ? "heart" : "heart-outline"}
            size={28}
            color="#1B8D43"
          />
        </Pressable>
      </View>
      <View style={styles.productCard}>
        <Text style={styles.brand}>{data?.brands?.toUpperCase()}</Text>

        <Text style={styles.title}>{data?.product_name}</Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>NUTRI{"\n"}SCORE</Text>

            <View
              style={[
                styles.scoreBadge,
                {
                  backgroundColor: nutriscoreColor[nutri ?? "a"],
                },
              ]}
            >
              <Text style={styles.scoreLetter}>{nutri?.toUpperCase()}</Text>
            </View>
          </View>

          {/* <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>NOVA{"\n"}GROUP</Text>

            <View style={[styles.scoreBadge, { backgroundColor: "#FFC928" }]}>
              <Text style={styles.scoreLetter}>{nova}</Text>
            </View>
          </View> */}

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>ECO{"\n"}SCORE</Text>

            <View
              style={[
                styles.scoreBadge,
                {
                  backgroundColor: ecoscoreColor[eco ?? "a"],
                },
              ]}
            >
              <Text style={styles.scoreLetter}>{eco?.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {nutriscore_data?.negative.map((item) => (
            <NutriDataHorizontal key={item.id} item={item} />
          ))}

          {nutriscore_data?.positive.map((item) => (
            <NutriDataHorizontal key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="restaurant-menu" size={24} color="#1B8D43" />

          <Text style={styles.sectionTitle}>Ingredientes</Text>
        </View>

        <Text style={styles.ingredients}>
          {ingredients ?? "Sin ingredientes"}
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Valores nutricionales ({nutriscore_data_per})
        </Text>

        {!nutriscore_data ? (
          <Text style={styles.ingredients}>Sin información nutricional</Text>
        ) : (
          <>
            {nutriscore_data?.negative?.map((item) => (
              <NutriDataVertical key={item.id} item={item} />
            ))}

            {nutriscore_data?.positive?.map((item) => (
              <NutriDataVertical key={item.id} item={item} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

type NutriDataProps = {
  item: NutriComponent;
};

function NutriDataHorizontal({ item }: NutriDataProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipTitle}>{item.id.toUpperCase()}</Text>

      <Text style={styles.chipValue}>
        {item.value}
        {item.unit}
      </Text>
    </View>
  );
}

function NutriDataVertical({ item }: NutriDataProps) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableLabel}>
        {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
      </Text>

      <Text style={styles.tableValue}>
        {item.value}
        {item.unit}
      </Text>
    </View>
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
  nutriBox: {
    //height: 60,
    //width: 40,
    backgroundColor: "#feffff",
    //marginLeft: 20,
    borderRadius: 20,
    padding: 10,
  },
  ingredientBox: {
    //height: 60,
    //width: 40,
    backgroundColor: "#ffffff",
    //marginLeft: 20,
    borderRadius: 20,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  favorite: {
    //zIndex: 10,
    marginTop: -70,
    marginRight: 25,
    alignSelf: "flex-end",
    backgroundColor: "#f7f5f0",
    borderRadius: 100,
    padding: 10,
  },
  nutriBoxValue: {
    height: 30,
    fontSize: 20,
    textAlign: "center",
    borderRadius: 10,
    width: 30,
    marginTop: 10,
    alignSelf: "center",
    //width: 40,
  },
  horizontalScroll: {
    height: 120,
  },
  horizontalContent: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
  },
  image: {
    width: "70%",
    height: "100%",
  },
  listBlock: {
    width: "100%",
    //maxWidth: 420,
    gap: 12,
  },
  text: {
    fontSize: 30,
  },
  screen: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  hero: {
    height: 340,
    backgroundColor: "#FF775F",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },

  productCard: {
    marginTop: -45,
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 24,
    elevation: 6,
  },

  brand: {
    fontSize: 13,
    color: "#1B8D43",
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#222",
    marginTop: 8,
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  scoreCard: {
    width: 92,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
  },

  scoreLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },

  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  scoreLetter: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  chipsContainer: {
    paddingTop: 25,
    gap: 12,
  },

  chip: {
    backgroundColor: "#DDF2D7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 90,
  },

  chipTitle: {
    fontSize: 12,
    color: "#5E5E5E",
  },

  chipValue: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },

  favoriteButton: {
    position: "absolute",
    right: 25,
    bottom: -28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 10,
  },

  sectionCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  ingredients: {
    fontSize: 16,
    lineHeight: 28,
    color: "#444",
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  tableLabel: {
    fontSize: 16,
    color: "#444",
  },

  tableValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
