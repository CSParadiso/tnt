import { useFavorito } from "@/hooks/useFavorite";
import { useFoodById } from "@/hooks/useFoods";
import { NutriComponent } from "@/models/foods";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
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

  // Vista
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: data?.product_name,
        }}
      />
      <Image
        style={styles.image}
        source={data?.image_front_small_url}
        placeholder={{ blurhash }}
        //contentFit="contain"
        transition={500}
      />
      <Pressable onPressIn={toggleFavorito}>
        <Ionicons
          name={isFavorito ? "heart" : "heart-outline"}
          size={40}
          color="green"
          style={styles.favorite}
        />
      </Pressable>
      <View
        style={{
          backgroundColor: "#f7f5f0",
          borderRadius: 40,
          zIndex: 3,
          marginTop: -40,
          //width: 350,
          marginLeft: 20,
          marginRight: 20,
          elevation: 1,
        }}
      >
        <View style={{ padding: 12 }}>
          <Text style={{ fontSize: 20, color: "green", paddingTop: 12 }}>
            {data?.brands}
          </Text>
          <Text style={{ fontSize: 35, fontWeight: 600 }}>
            {data?.product_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            //backgroundColor: "red",
          }}
        >
          <View style={styles.nutriBox}>
            <Text>Nutri-{"\n"}score</Text>
            <Text
              style={[
                styles.nutriBoxValue,
                { backgroundColor: nutriscoreColor[nutri?.toString()] },
              ]}
            >
              {nutri?.toUpperCase()}
            </Text>
          </View>
          {/* <View style={styles.nutriBox}>
            <Text>Nova-{"\n"}group</Text>
            <Text style={styles.nutriBoxValue}>{nova}</Text>
          </View> */}
          <View style={styles.nutriBox}>
            <Text>Eco-{"\n"}score</Text>
            <Text
              style={[
                styles.nutriBoxValue,
                {
                  backgroundColor: ecoscoreColor[eco?.toString()] ?? "#aaa",
                },
              ]}
            >
              {eco}
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalContent}
        >
          {nutriscore_data?.negative.map((item) => (
            <NutriDataHorizontal key={item.id} item={item} />
          ))}
          {nutriscore_data?.positive.map((item) => (
            <NutriDataHorizontal key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.ingredientBox}>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
          }}
        >
          <MaterialIcons
            name="restaurant-menu"
            size={24}
            color="green"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 25 }}>Ingredientes</Text>
        </View>
        <Text style={{ fontSize: 15, marginTop: 10, marginBottom: 10 }}>
          {ingredients ? ingredients : "Sin ingredientres"}
        </Text>
        {/* <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f6ecec",
            padding: 10,
          }}
        >
          <MaterialCommunityIcons
            name="alert"
            size={24}
            color="red"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text
              style={{
                color: "#bc0303",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Información de alergias
            </Text>
            <Text style={{ color: "#bc0303" }}>
              Falta identificar el campo alergias
            </Text>
          </View>
        </View> */}
      </View>

      <View style={{ marginLeft: 20, marginRight: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 500,
            marginBlock: 10,
          }}
        >
          Valores nutricionales (por {nutriscore_data_per})
        </Text>
        {nutriscore_data?.negative.map((item) => (
          <NutriDataVertical key={item.id} item={item} />
        ))}
        {nutriscore_data?.positive.map((item) => (
          <NutriDataVertical key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

type NutriDataProps = {
  item: NutriComponent;
};

function NutriDataHorizontal({ item }: NutriDataProps) {
  return (
    <View
      style={{
        backgroundColor: "#c6e9be",
        alignItems: "center",
        borderRadius: 10,
        //paddingBlock: 5,
        padding: 5,
      }}
    >
      <Text>{item.id}</Text>
      <Text>
        {item.value}
        {item.unit}
      </Text>
    </View>
  );
}

function NutriDataVertical({ item }: NutriDataProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBlock: 5,
      }}
    >
      <Text>{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</Text>
      <Text>
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
    //width: "100%",
    height: 200,
    backgroundColor: "yellow",
  },
  listBlock: {
    width: "100%",
    //maxWidth: 420,
    gap: 12,
  },
  text: {
    fontSize: 30,
  },
});
